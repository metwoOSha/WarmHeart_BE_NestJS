import { ArgumentsHost, Catch, ConflictException, ExceptionFilter, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        const mapped = this.mapToHttpException(exception);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = mapped.getStatus();
        response.status(status).json(mapped.getResponse());
    }

    private mapToHttpException(exception: Prisma.PrismaClientKnownRequestError) {
        switch (exception.code) {
            case 'P2025':
                return new NotFoundException('Record not found');
            case 'P2002':
                return new ConflictException(`Duplicate value for field(s): ${(exception.meta?.target as string[])?.join(', ')}`);
            case 'P2003':
                return new BadRequestException('Related record does not exist');
            default:
                return new BadRequestException('Database request error');
        }
    }
}
