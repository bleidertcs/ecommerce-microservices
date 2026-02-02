import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ClientProxy } from '@nestjs/microservices';
import { DatabaseService } from '../../common/services/database.service';

@Injectable()
export class OutboxWorker {
  private readonly logger = new Logger(OutboxWorker.name);
  private isProcessing = false;

  constructor(
    private readonly databaseService: DatabaseService,
    @Inject('RABBITMQ_SERVICE') private rmqClient: ClientProxy,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleOutbox() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      const messages = await this.databaseService.outbox.findMany({
        where: { status: 'PENDING' },
        take: 10,
        orderBy: { createdAt: 'asc' },
      });

      if (messages.length === 0) {
        this.isProcessing = false;
        return;
      }

      this.logger.log(`Processing ${messages.length} messages from outbox`);

      for (const message of messages) {
        try {
          // Publish to RabbitMQ
          this.rmqClient.emit(message.type, message.payload);

          // Mark as processed
          await this.databaseService.outbox.update({
            where: { id: message.id },
            data: {
              status: 'PROCESSED',
              processedAt: new Date(),
            },
          });
          
          this.logger.log(`Message ${message.id} [${message.type}] processed successfully`);
        } catch (error) {
          this.logger.error(`Error processing message ${message.id}: ${error.message}`);
          
          await this.databaseService.outbox.update({
            where: { id: message.id },
            data: {
              status: 'FAILED',
              error: error.message,
            },
          });
        }
      }
    } catch (error) {
      this.logger.error(`Outbox worker error: ${error.message}`);
    } finally {
      this.isProcessing = false;
    }
  }
}
