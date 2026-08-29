import { ApiProperty } from '@nestjs/swagger';

export class BlanketDto {
    @ApiProperty({ description: 'ID Blanket', example: 'a1b2c3d4-e5f6-...', type: String })
    id: string;

    @ApiProperty({ description: 'Name Blanket', example: 'Ingrun', type: String })
    name: string;

    @ApiProperty({ description: 'Size Blanket', example: '130x170 cm', type: String })
    size: string;

    @ApiProperty({ description: 'Price Blanket', example: 90, type: Number })
    price: number;

    @ApiProperty({ description: 'Image URL Blanket', example: 'https://example.com/image.jpg', type: String })
    image: string;

    @ApiProperty({ description: 'Color Blanket', example: 'beige', type: String })
    color: string;

    @ApiProperty({ description: 'Is Blanket popular', example: true, type: Boolean })
    popular: boolean;

    @ApiProperty({ description: 'Date when Blanket was created', type: Date })
    createdAt: Date;

    @ApiProperty({ description: 'Date when Blanket was last updated', type: Date })
    updatedAt: Date;
}
