import { Module } from '@nestjs/common';
import { AdviceController } from './advice.controller';
import { AdviceService } from './advice.service';
import { HttpModule } from '@nestjs/axios'; // Import HttpModule

@Module({
  imports: [HttpModule], // Add HttpModule to the imports array
  controllers: [AdviceController],
  providers: [AdviceService],
})
export class AdviceModule {}