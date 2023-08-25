import { Module, Global, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Configuration from '../configuration/configuration';
import { MongoDBService } from '../databaase/mongodb.service';
import { KafkaService } from '../event-bus/kafka.service';
import { setupKafkaConfig } from '../event-bus/kafka.configuration';
import { Kafka } from 'kafkajs';
import { OutboxService } from '../outbox/outbox.service';
import { ScheduleModule } from '@nestjs/schedule';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [Configuration],
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [
    Logger,
    MongoDBService,
    KafkaService,
    OutboxService,
    {
      provide: 'KAFKA_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new Kafka(setupKafkaConfig(configService));
      },
      inject: [ConfigService],
    },
  ],
  exports: [ConfigModule, Logger, MongoDBService, KafkaService, OutboxService],
})
export class CommonModule {}
