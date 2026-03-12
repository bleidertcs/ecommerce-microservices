import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { RedisService } from '../../common/services/redis.service';
import { AddItemDto } from './dtos/add-item.dto';
import { UpdateItemDto } from './dtos/update-item.dto';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  subtotal: number;
  updatedAt: string;
}

const CART_KEY = (userId: string) => `cart:${userId}`;
const CART_TTL = 60 * 60 * 24 * 7; // 7 days in seconds

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(private readonly redisService: RedisService) {}

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private calculateSubtotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  private async saveCart(userId: string, items: CartItem[]): Promise<Cart> {
    const cart: Cart = {
      userId,
      items,
      subtotal: this.calculateSubtotal(items),
      updatedAt: new Date().toISOString(),
    };
    await this.redisService.set(CART_KEY(userId), JSON.stringify(cart), CART_TTL);
    return cart;
  }

  private async loadItems(userId: string): Promise<CartItem[]> {
    const raw = await this.redisService.get(CART_KEY(userId));
    if (!raw) return [];
    const cart = JSON.parse(raw) as Cart;
    return cart.items;
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  async getCart(userId: string): Promise<Cart> {
    const items = await this.loadItems(userId);
    return {
      userId,
      items,
      subtotal: this.calculateSubtotal(items),
      updatedAt: new Date().toISOString(),
    };
  }

  async addItem(userId: string, dto: AddItemDto, productInfo: { name: string; price: number; image?: string }): Promise<Cart> {
    this.logger.log(`Adding product ${dto.productId} x${dto.quantity} to cart for user ${userId}`);
    const items = await this.loadItems(userId);

    const existingIndex = items.findIndex((i) => i.productId === dto.productId);
    if (existingIndex >= 0) {
      items[existingIndex].quantity += dto.quantity;
    } else {
      items.push({
        productId: dto.productId,
        name: productInfo.name,
        price: productInfo.price,
        image: productInfo.image,
        quantity: dto.quantity,
      });
    }

    return this.saveCart(userId, items);
  }

  async updateItem(userId: string, productId: string, dto: UpdateItemDto): Promise<Cart> {
    this.logger.log(`Updating product ${productId} quantity to ${dto.quantity} for user ${userId}`);
    const items = await this.loadItems(userId);

    const index = items.findIndex((i) => i.productId === productId);
    if (index < 0) {
      throw new NotFoundException(`Product ${productId} not found in cart`);
    }

    if (dto.quantity === 0) {
      items.splice(index, 1);
    } else {
      items[index].quantity = dto.quantity;
    }

    return this.saveCart(userId, items);
  }

  async removeItem(userId: string, productId: string): Promise<Cart> {
    this.logger.log(`Removing product ${productId} from cart for user ${userId}`);
    const items = await this.loadItems(userId);
    const filtered = items.filter((i) => i.productId !== productId);

    if (filtered.length === items.length) {
      throw new NotFoundException(`Product ${productId} not found in cart`);
    }

    return this.saveCart(userId, filtered);
  }

  async clearCart(userId: string): Promise<void> {
    this.logger.log(`Clearing cart for user ${userId}`);
    await this.redisService.del(CART_KEY(userId));
  }
}
