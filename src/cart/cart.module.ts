import { Module } from '@nestjs/common';
import { CartService } from './cart.service.js';
import { CartController } from './cart.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { BlanketsModule } from '../blankets/blankets.module.js';

@Module({
  imports: [AuthModule, BlanketsModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
