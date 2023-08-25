import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async forwardMessage(@Body() message: Record<string, any>) {
    return this.appService.forwardMessage(message);
  }
}
