import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BlanketDto } from './dto/blankets.dto.js';
import { PaginationQueryDto } from './dto/pagination-query.dto.js';
import { BlanketsModel } from '../generated/prisma/models.js';

@Injectable()
export class BlanketsService {
    constructor(private prisma: PrismaService) {}

    async findAll({ page = 1, limit = 20 }: PaginationQueryDto): Promise<BlanketDto[]> {
        const blankets = await this.prisma.blankets.findMany({
            skip: (page - 1) * limit,
            take: limit,
        });
        return blankets.map((b) => this.toDto(b));
    }

    async findOneById(id: string): Promise<BlanketDto> {
        const blanket = await this.prisma.blankets.findUniqueOrThrow({ where: { id } });
        return this.toDto(blanket);
    }

    toDto(blanket: BlanketsModel): BlanketDto {
        return {
            ...blanket,
            price: Number(blanket.price),
        };
    }
}
