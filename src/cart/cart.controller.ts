// cart/cart.controller.ts
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CartService } from './cart.service.js';
import { AddToCartDto } from './dto/add-to-cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';
import { JwtAuthGuard } from '../auth/guards/auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator.js';

@ApiTags('Cart')
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    @ApiOperation({ summary: 'Get current user cart' })
    getCart(@CurrentUser() user: AuthenticatedUser) {
        return this.cartService.getCart(user.userId);
    }

    @Post('items')
    @ApiOperation({ summary: 'Add item to cart' })
    addItem(@CurrentUser() user: AuthenticatedUser, @Body() dto: AddToCartDto) {
        return this.cartService.addItem(user.userId, dto.blanketId, dto.quantity);
    }

    @Patch('items/:id')
    @ApiOperation({ summary: 'Update cart item quantity' })
    updateItem(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateCartItemDto) {
        return this.cartService.updateItem(user.userId, id, dto.quantity);
    }

    @Delete('items/:id')
    @ApiOperation({ summary: 'Remove item from cart' })
    removeItem(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
        return this.cartService.removeItem(user.userId, id);
    }
}
