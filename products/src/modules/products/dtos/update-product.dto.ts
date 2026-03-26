import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from '@/modules/products/dtos/create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) { }
