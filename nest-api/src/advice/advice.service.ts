// nest-api/src/advice/advice.service.ts

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GetAdviceDto } from './dto/get-advice.dto';

@Injectable()
export class AdviceService {
  // Inject the HttpService
  constructor(private readonly httpService: HttpService) {}

  async getClothingAdvice(weatherData: GetAdviceDto): Promise<{ advice: string }> {
    const { temperature, condition } = weatherData;

    // Create a prompt for the LLM
    const prompt = `The weather is ${condition} with a temperature of ${temperature}°C. What should I wear for a walk? Give a short, practical suggestion.`;

    try {
      // The URL points to the Ollama container on the Docker network
      const ollamaUrl = 'http://ollama:11434/api/generate';

      const response = await firstValueFrom(
        this.httpService.post(ollamaUrl, {
          model: 'gemma:2b', // A good, lightweight model for your hardware
          prompt: prompt,
          stream: false, // We want the full response at once
        }),
      );

      // Return the response from the LLM
      return { advice: response.data.response };
    } catch (error) {
      console.error('Error contacting Ollama:', error.message);
      return { advice: 'Sorry, I couldn\'t get any advice right now.' };
    }
  }
}