import { Controller, Get, Param, Query } from '@nestjs/common';
import { BlanketsService } from './blankets.service.js';
import { BlanketDto } from './dto/blankets.dto.js';
import { PaginationQueryDto } from './dto/pagination-query.dto.js';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('blankets')
export class BlanketsController {
    constructor(private readonly blanketsService: BlanketsService) {}

    @Get()
    @ApiOperation({ summary: 'Get all blankets' })
    @ApiResponse({ status: 200, description: 'List of blankets', type: [BlanketDto] })
    findAll(@Query() query: PaginationQueryDto): Promise<BlanketDto[]> {
        return this.blanketsService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single blanket by id' })
    @ApiParam({ name: 'id', description: 'Blanket ID', type: String })
    @ApiResponse({ status: 200, description: 'Blanket found', type: BlanketDto })
    @ApiResponse({ status: 404, description: 'Blanket not found' })
    findOneById(@Param('id') id: string): Promise<BlanketDto> {
        return this.blanketsService.findOneById(id);
    }
}
