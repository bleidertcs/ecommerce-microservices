import { ClientNats } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

async function verifyNats() {
  const client = new ClientNats({
    servers: ['nats://localhost:4222'],
  });

  console.log('Connecting to NATS...');
  await client.connect();
  console.log('Connected!');

  try {
    console.log('Sending FindOne request via NATS...');
    const result = await firstValueFrom(client.send('FindOne', { id: 'some-user-id' }));
    console.log('NATS Response:', result);
  } catch (error) {
    console.error('NATS Error:', error);
  } finally {
    await client.close();
  }
}

verifyNats();
