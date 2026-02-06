import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

async function testTcp() {
  console.log('Testing TCP Transport on localhost:3001...');
  const client = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3001,
    },
  });

  try {
    const result = await firstValueFrom(client.send('FindOne', { id: 'test-id' }));
    console.log('TCP Result:', result);
  } catch (error) {
    console.error('TCP Error:', error.message);
  } finally {
    await client.close();
  }
}

testTcp();
