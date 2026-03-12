import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsUUID, IsNotEmpty } from 'class-validator';

export class AddItemDto {
  @ApiProperty({ description: 'Product UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Quantity to add', example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}
