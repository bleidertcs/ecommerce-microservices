import { GrpcController, GrpcMethod } from 'nestjs-grpc';
import { ProductsService } from '../modules/products/products.service';

@GrpcController('ProductsService')
export class ProductsGrpcController {
  constructor(private readonly productsService: ProductsService) {}

  @GrpcMethod('FindOne')
  async findOne(data: { id: string }) {
    const product = await this.productsService.findOne(data.id);
    if (!product) return null;
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
    };
  }

  @GrpcMethod('ValidateStock')
  async validateStock(data: { id: string; quantity: number }) {
    const product = await this.productsService.findOne(data.id);
    if (!product || product.stock < data.quantity) {
      return { available: false };
    }
    return { available: true };
  }
}
