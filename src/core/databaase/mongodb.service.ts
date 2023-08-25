import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';
import Papr, { Model } from 'papr';
import {
  Outbox,
  OutboxDefault,
  outboxSchema,
} from 'src/entities/outbox.entity';

@Injectable()
export class MongoDBService implements OnModuleInit {
  public client: MongoClient;
  private dbUrl: string;
  public papr: Papr;

  public outboxCollection: Model<Outbox, OutboxDefault>;

  public constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.papr = new Papr();
    this.dbUrl = this.configService.get('databaseUrl') as string;
  }

  async onModuleInit() {
    this.logger.log('init MongoDBService...');
    await this.connect();
  }

  public async connect(): Promise<void> {
    this.logger.log('Connecting mongo...');
    this.client = await MongoClient.connect(this.dbUrl);

    this.papr.initialize(this.client.db('example'));

    this.outboxCollection = this.papr.model('outbox', outboxSchema);

    await this.papr.updateSchemas();

    this.logger.log('Mongo connected...');
  }

  public async disconnect(): Promise<void> {
    await this.client.close();
    this.logger.log('Mongo disconnect...');
  }
}
