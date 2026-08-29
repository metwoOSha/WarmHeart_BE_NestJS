import { Injectable, Logger, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async register(dto: RegisterDto) {
        const existingUser = await this.usersService.findByEmail(dto.email);
        if (existingUser) {
            this.logger.warn(`Registration rejected, email already in use: ${dto.email}`);
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.usersService.create({
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
        });

        this.logger.log(`User registered: ${user.id}`);
        return this.generateToken(user.id);
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            this.logger.warn(`Login failed, unknown email: ${dto.email}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            this.logger.warn(`Login failed, wrong password for user: ${user.id}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        this.logger.log(`User logged in: ${user.id}`);
        return this.generateToken(user.id);
    }

    private generateToken(userId: string) {
        return this.jwtService.sign({ sub: userId });
    }
}
