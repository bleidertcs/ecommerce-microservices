import * as amqp from 'amqplib';

const RABBITMQ_URL = 'amqp://guest:guest@localhost:5672';
const QUEUE_NAME = 'ecommerce_events';

async function verify() {
    console.log('🚀 Starting Notifications Verification via RabbitMQ...');

    let connection;
    try {
        connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        await channel.assertQueue(QUEUE_NAME, { durable: true });

        // Helper to format payload as NestJS microservice expects it
        const sendEvent = (pattern: string, data: any) => {
            const message = JSON.stringify({ pattern, data });
            channel.sendToQueue(QUEUE_NAME, Buffer.from(message));
            console.log(`✅ Emitted '${pattern}' event successfully.`);
        };

        console.log('\nStep 1: Emitting user.created event...');
        sendEvent('user.created', {
            id: 'fake-user-id',
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
        });

        console.log('\nStep 2: Emitting order.created event...');
        sendEvent('order.created', {
            id: 'fake-order-id',
            userId: 'fake-user-id',
            total: 150.0,
        });

        console.log('\nStep 3: Emitting order.paid event...');
        sendEvent('order.paid', {
            id: 'fake-order-id',
            userId: 'fake-user-id',
            total: 150.0,
        });

        console.log('\n✨ All test events published to RabbitMQ successfully!');
        console.log(
            '📝 Please check docker logs of bw-notifications-service to ensure they process correctly.',
        );

        setTimeout(async () => {
            await channel.close();
            await connection.close();
        }, 1000);
    } catch (error) {
        console.error('❌ Error during verification:', error);
    }
}

verify();
