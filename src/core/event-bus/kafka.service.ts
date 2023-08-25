import {
  Inject,
  Injectable,
  Logger,
  OnApplicationShutdown,
} from '@nestjs/common';
import { Kafka, Partitioners, Producer, RecordMetadata } from 'kafkajs';

@Injectable()
export class KafkaService implements OnApplicationShutdown {
  private producer: Producer;

  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: Kafka,
    private readonly logger: Logger,
  ) {
    this.producer = this.kafkaClient.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
      allowAutoTopicCreation: true,
    });
  }

  async setup() {
    this.logger.log('Connecting to Kafka...');

    await this.producer.connect();

    this.logger.log('Kafka connected!');
  }

  async onApplicationShutdown() {
    await this.teardown();
  }

  private async teardown() {
    await this.producer.disconnect();

    this.logger.log('Kafka disconnected!');
  }

  public async emit(message: string, topic: string): Promise<RecordMetadata[]> {
    const result = await this.producer.send({
      topic: topic,
      messages: [{ value: message }],
    });
    return result;
  }
}
