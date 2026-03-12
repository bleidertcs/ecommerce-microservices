import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateItemDto {
  @ApiProperty({ description: 'New item quantity (0 to remove)', example: 2, minimum: 0 })
  @IsInt()
  @Min(0)
  quantity: number;
}
