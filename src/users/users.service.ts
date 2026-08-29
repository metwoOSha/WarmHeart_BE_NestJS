import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async findByEmail(email: string) {
        return await this.prisma.users.findUnique({ where: { email } });
    }

    async findById(id: string) {
        return await this.prisma.users.findUnique({ where: { id } });
    }

    async create(data: { email: string; password: string; name: string }) {
        return await this.prisma.users.create({ data });
    }
}
