import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdviceModule } from './advice/advice.module';

@Module({
  imports: [AdviceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
