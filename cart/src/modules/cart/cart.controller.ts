import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UnauthorizedException,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddItemDto } from './dtos/add-item.dto';
import { UpdateItemDto } from './dtos/update-item.dto';
import { AuthUser } from '../../common/decorators/auth-user.decorator';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  private readonly logger = new Logger(CartController.name);

  constructor(private readonly cartService: CartService) {}

  // ─── REST Endpoints ─────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  async getCart(@AuthUser() user: { id?: string }) {
    if (!user?.id) throw new UnauthorizedException('User identity not found');
    return this.cartService.getCart(user.id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add an item to the cart' })
  async addItem(
    @AuthUser() user: { id?: string },
    @Body() dto: AddItemDto,
  ) {
    if (!user?.id) throw new UnauthorizedException('User identity not found');
    // Inline product info — in production, fetch from Products gRPC
    const productInfo = { name: `Product ${dto.productId}`, price: 0 };
    return this.cartService.addItem(user.id, dto, productInfo);
  }

  @Patch('items/:productId')
  @ApiOperation({ summary: 'Update item quantity (set to 0 to remove)' })
  @ApiParam({ name: 'productId', type: String })
  async updateItem(
    @AuthUser() user: { id?: string },
    @Param('productId') productId: string,
    @Body() dto: UpdateItemDto,
  ) {
    if (!user?.id) throw new UnauthorizedException('User identity not found');
    return this.cartService.updateItem(user.id, productId, dto);
  }

  @Delete('items/:productId')
  @ApiOperation({ summary: 'Remove a specific item from the cart' })
  @ApiParam({ name: 'productId', type: String })
  @HttpCode(HttpStatus.OK)
  async removeItem(
    @AuthUser() user: { id?: string },
    @Param('productId') productId: string,
  ) {
    if (!user?.id) throw new UnauthorizedException('User identity not found');
    return this.cartService.removeItem(user.id, productId);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear the entire cart' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearCart(@AuthUser() user: { id?: string }) {
    if (!user?.id) throw new UnauthorizedException('User identity not found');
    await this.cartService.clearCart(user.id);
  }

  // ─── Event Listeners ────────────────────────────────────────────────────────

  @EventPattern('order.created')
  async handleOrderCreated(@Payload() payload: { userId: string; orderId: string }) {
    this.logger.log(`[order.created] Clearing cart for user ${payload.userId} after order ${payload.orderId}`);
    if (payload?.userId) {
      await this.cartService.clearCart(payload.userId);
    }
  }
}
