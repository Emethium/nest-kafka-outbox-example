import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { KafkaService } from './core/event-bus/kafka.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const kafkaService = app.get(KafkaService);

  await kafkaService.setup();
  await app.listen(3000);
}
bootstrap();
