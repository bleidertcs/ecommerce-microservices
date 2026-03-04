import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsBoolean,
  Min,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Lumina Aura Pro' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ example: 'Premium device for professionals.' })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ example: 'SKU-LUM-001' })
  @IsString()
  @IsOptional()
  @MaxLength(64)
  sku?: string;

  @ApiPropertyOptional({ example: 'Lumina Elite' })
  @IsString()
  @IsOptional()
  @MaxLength(128)
  brand?: string;

  @ApiProperty({ example: 299.99 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({ example: 50, default: 0 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  stock?: number;

  @ApiPropertyOptional({ example: 'Electronics' })
  @IsString()
  @IsOptional()
  @MaxLength(128)
  category?: string;

  @ApiPropertyOptional({
    example: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
    description: 'URLs of product images',
  })
  @IsArray()
  @IsOptional()
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiPropertyOptional({ example: ['premium', 'wireless'], default: [] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: false, default: false })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  featured?: boolean;
}
