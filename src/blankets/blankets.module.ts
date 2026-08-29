import { Module } from '@nestjs/common';
import { BlanketsService } from './blankets.service.js';
import { BlanketsController } from './blankets.controller.js';

@Module({
  controllers: [BlanketsController],
  providers: [BlanketsService],
  exports: [BlanketsService],
})
export class BlanketsModule {}
