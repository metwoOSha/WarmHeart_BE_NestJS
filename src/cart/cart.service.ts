import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BlanketsService } from '../blankets/blankets.service.js';

@Injectable()
export class CartService {
    private readonly logger = new Logger(CartService.name);

    constructor(
        private prisma: PrismaService,
        private blanketsService: BlanketsService
    ) {}

    async getCart(userId: string) {
        const cart = await this.getOrCreateCart(userId);
        const fullCart = await this.prisma.cart.findUniqueOrThrow({
            where: { id: cart.id },
            include: { items: { include: { blanket: true } } },
        });
        return this.toDto(fullCart);
    }

    async addItem(userId: string, blanketId: string, quantity: number) {
        const blanket = await this.prisma.blankets.findUnique({ where: { id: blanketId } });
        if (!blanket) {
            throw new NotFoundException('Blanket not found');
        }

        const cart = await this.getOrCreateCart(userId);

        const existingItem = await this.prisma.cartItem.findFirst({
            where: { cartId: cart.id, blanketId },
        });

        this.logger.log(`User ${userId} adding blanket ${blanketId} (qty ${quantity}) to cart`);

        if (existingItem) {
            return this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
            });
        }

        return this.prisma.cartItem.create({
            data: { cartId: cart.id, blanketId, quantity },
        });
    }

    async updateItem(userId: string, itemId: string, quantity: number) {
        await this.ensureItemBelongsToUser(userId, itemId);
        return this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
        });
    }

    async removeItem(userId: string, itemId: string) {
        await this.ensureItemBelongsToUser(userId, itemId);
        return this.prisma.cartItem.delete({ where: { id: itemId } });
    }

    private async getOrCreateCart(userId: string) {
        const existing = await this.prisma.cart.findUnique({ where: { userId } });
        if (existing) return existing;
        return this.prisma.cart.create({ data: { userId } });
    }

    private async ensureItemBelongsToUser(userId: string, itemId: string) {
        const item = await this.prisma.cartItem.findFirst({
            where: { id: itemId, cart: { userId } },
        });
        if (!item) {
            throw new NotFoundException('Cart item not found');
        }
        return item;
    }

    private toDto(cart: { items: { blanket: Parameters<BlanketsService['toDto']>[0] }[]; [key: string]: unknown }) {
        return {
            ...cart,
            items: cart.items.map((item) => ({
                ...item,
                blanket: this.blanketsService.toDto(item.blanket),
            })),
        };
    }
}
