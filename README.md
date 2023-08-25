# nest-kafka-outbox-example

A repository example of a Nest application using the Outbox pattern to publish Kafka Events

## Setup

- Create a local `.env` file using the same information provided in the `.env.example`
- Install local dependencies with a `yarn`
- Start the Docker containers with a `yarn run docker`
- Start the application with a `yarn start:dev`

## Test

- Send any payload as a POST to `http://localhost:3000/`
- Check the message published (or not) on the `kafka-ui` by accessing `http://localhost:8080` on your browser
  > `kafka-ui` is already included on the `docker-compose`

## References

[nikasakandelidze kafka-replication repository](https://github.com/nikasakandelidze/kafka-replication)
