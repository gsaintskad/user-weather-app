import { Controller, Post, Body } from '@nestjs/common';
import { AdviceService } from './advice.service';
import { GetAdviceDto } from './dto/get-advice.dto';

@Controller('advice')
export class AdviceController {
  constructor(private readonly adviceService: AdviceService) {}

  @Post()
  getAdvice(@Body() getAdviceDto: GetAdviceDto) {
    return this.adviceService.getClothingAdvice(getAdviceDto);
  }
}
