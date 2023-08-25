import { schema, types } from 'papr';

export const outboxSchema = schema(
  {
    _id: types.string({ required: true }),
    message: types.unknown({ required: true }),
    topic: types.string({ required: true }),
    sent: types.boolean({ required: true }),
  },
  { timestamps: true },
);

export type Outbox = (typeof outboxSchema)[0];
export type OutboxDefault = (typeof outboxSchema)[1];
