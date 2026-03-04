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
  ) { }

  private readonly MAX_RETRIES = 5;

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleOutbox() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      const now = new Date();
      const messages = await this.databaseService.outbox.findMany({
        where: {
          OR: [
            { status: 'PENDING' },
            {
              status: 'FAILED',
              retryCount: { lt: this.MAX_RETRIES },
              nextRetryAt: { lte: now }
            },
          ],
        },
        take: 10,
        orderBy: { createdAt: 'asc' },
      });

      if (messages.length === 0) {
        this.isProcessing = false;
        return;
      }

      this.logger.log(`Processing ${messages.length} messages from outbox (including retries)`);

      for (const msg of messages) {
        const message = msg as any;
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
          const nextRetryCount = message.retryCount + 1;
          // Exponential backoff: 2^attemptsSoFar * 5 seconds (first retry = 5s, second = 10s, etc.)
          const delayInSeconds = Math.pow(2, message.retryCount) * 5;
          const nextRetryAt = new Date(Date.now() + delayInSeconds * 1000);

          this.logger.error(
            `Error processing message ${message.id} [Try ${nextRetryCount}/${this.MAX_RETRIES}]: ${error.message}. ` +
            `Next retry at ${nextRetryAt.toISOString()}`
          );

          await this.databaseService.outbox.update({
            where: { id: message.id },
            data: {
              status: 'FAILED',
              retryCount: nextRetryCount,
              nextRetryAt: nextRetryAt,
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
