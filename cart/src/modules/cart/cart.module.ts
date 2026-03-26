import { Module } from '@nestjs/common';
import { CartController } from '@/modules/cart/cart.controller';
import { CartService } from '@/modules/cart/cart.service';
import { RedisService } from '@/common/services/redis.service';

@Module({
  controllers: [CartController],
  providers: [CartService, RedisService],
  exports: [CartService],
})
export class CartModule {}
