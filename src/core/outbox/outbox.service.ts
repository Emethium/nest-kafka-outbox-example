import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MongoDBService } from '../databaase/mongodb.service';
import { KafkaService } from '../event-bus/kafka.service';
import { DEFAULT_KAFKA_TOPIC } from '../event-bus/kafka.configuration';

@Injectable()
export class OutboxService {
  constructor(
    private readonly db: MongoDBService,
    private readonly eventBusService: KafkaService,
    private readonly logger: Logger,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async verifyUnsentMessages() {
    this.logger.log('Checking for unsent messages...');

    try {
      const unsentMessages = await this.db.outboxCollection.find({
        sent: false,
      });

      this.logger.log(`Found ${unsentMessages.length} messages in the outbox!`);

      await Promise.all(
        unsentMessages.map(async (message) => {
          const payload = JSON.stringify(message.message);

          await this.eventBusService.emit(payload, DEFAULT_KAFKA_TOPIC);

          this.logger.log(
            `Message with the id ${message._id} sent from the outbox!`,
          );

          await this.db.outboxCollection.findOneAndUpdate(
            { _id: message._id },
            { $set: { sent: true } },
          );
        }),
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
