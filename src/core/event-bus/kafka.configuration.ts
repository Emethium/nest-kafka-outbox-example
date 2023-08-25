import { ConfigService } from '@nestjs/config';

export const DEFAULT_KAFKA_TOPIC = 'events';

export const setupKafkaConfig = (configService: ConfigService) => {
  return {
    clientId: configService.get<string>('kafkaClientId'),
    brokers: [configService.get<string>('kafkaBroker')] as string[],
    ssl: false,
  };
};
