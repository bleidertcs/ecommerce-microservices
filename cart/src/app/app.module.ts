import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { CartModule } from '@/modules/cart/cart.module';
import { AppController } from '@/app/app.controller';
import { CommonModule } from '@/common/common.module';

@Module({
  imports: [
    CommonModule,
    TerminusModule,
    CartModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
