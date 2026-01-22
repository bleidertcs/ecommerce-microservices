import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class EventsService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(EventsService.name);
    private client: ClientProxy;

    constructor(private readonly configService: ConfigService) {
        const rabbitUrl = this.configService.get<string>('REDIS_URL') || 'amqp://guest:guest@rabbitmq:5672'; 
        // Note: In a real app, I'd add RABBIT_URL to config, but for now I'll use the service name 'rabbitmq' from docker-compose
        
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: ['amqp://guest:guest@rabbitmq:5672'],
                queue: 'auth_queue',
                queueOptions: {
                    durable: false,
                },
            },
        });
    }

    async onModuleInit() {
        try {
            await this.client.connect();
            this.logger.log('Successfully connected to RabbitMQ');
        } catch (error) {
            this.logger.error('Failed to connect to RabbitMQ', error);
        }
    }

    async onModuleDestroy() {
        await this.client.close();
    }

    publish(pattern: string, data: any) {
        this.logger.log(`Publishing event: ${pattern}`);
        return this.client.emit(pattern, data);
    }
}
