
import { Injectable } from '@nestjs/common';
import { GetAdviceDto } from './dto/get-advice.dto';

@Injectable()
export class AdviceService {
  getClothingAdvice(weatherData: GetAdviceDto): { advice: string } {
    const { temperature, condition } = weatherData;
    let advice = '';

    if (temperature > 20) {
      advice = "It's warm! A t-shirt and shorts would be perfect.";
      if (condition.toLowerCase().includes('sun')) {
        advice += ' Don\'t forget sunglasses!';
      }
    } else if (temperature > 10) {
      advice = 'It\'s a bit cool. A light jacket or sweater is a good idea.';
      if (condition.toLowerCase().includes('rain')) {
        advice += ' And maybe bring an umbrella.';
      }
    } else {
      advice = 'It\'s cold. You should wear a warm coat, a scarf, and a hat.';
      if (temperature <= 0) {
        advice += ' It\'s freezing, so layer up!';
      }
    }

    return { advice };
  }
}