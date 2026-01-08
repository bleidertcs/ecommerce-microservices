import request from 'supertest';

describe('Gateway Connectivity (Post)', () => {
    const gatewayUrl = 'http://localhost:8080';

    it('should reach post-service via gateway', async () => {
        await request(gatewayUrl)
            .get('/post/health')
            .expect(200)
            .expect((res) => {
                // Ensure response comes from the service
                if (!res.body.status || res.body.status !== 'healthy') {
                    throw new Error('Response is not from post-service health check');
                }
            });
    });
});
