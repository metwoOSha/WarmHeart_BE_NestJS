import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ description: 'Email', example: 'test@test.com', type: String })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Password', example: 'test1234', type: String })
    @IsString()
    password: string;
}
