import { Injectable, Logger } from '@nestjs/common';
import { MongoDBService } from './core/database/mongodb.service';
import { KafkaService } from './core/event-bus/kafka.service';
import { nanoid } from 'nanoid';
import { DEFAULT_KAFKA_TOPIC } from './core/event-bus/kafka.configuration';

@Injectable()
export class AppService {
  constructor(
    private readonly db: MongoDBService,
    private readonly eventBusService: KafkaService,
    private readonly logger: Logger,
  ) {}

  async forwardMessage(message: Record<string, any>) {
    try {
      const _id = nanoid();

      await this.db.outboxCollection.insertOne({
        _id,
        message,
        sent: false,
        topic: DEFAULT_KAFKA_TOPIC,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await this.eventBusService.emit(
        JSON.stringify(message),
        DEFAULT_KAFKA_TOPIC,
      );

      return await this.db.outboxCollection.findOneAndUpdate(
        { _id },
        { $set: { sent: true } },
      );
    } catch (error) {
      this.logger.error('An error occurred while forwarding the message');

      throw error;
    }
  }
}
