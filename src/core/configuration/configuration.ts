export interface Config {
  databaseUrl: string;
  kafkaClientId: string;
  kafkaBrokerCount: string;
  kafkaBroker: string;
}

export default (): Config => {
  return {
    databaseUrl: process.env.DATABASE_URL ?? '',
    kafkaClientId: process.env.KAFKA_CLIENT_ID ?? '',
    kafkaBrokerCount: process.env.KAFKA_BROKER_COUNT ?? '',
    kafkaBroker: process.env.KAFKA_BROKER_1 ?? '',
  };
};
