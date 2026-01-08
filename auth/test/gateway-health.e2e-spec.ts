import request from 'supertest';

describe('Gateway Connectivity (Auth)', () => {
    const gatewayUrl = 'http://127.0.0.1:8080';

    it('should reach auth-service via gateway', async () => {
        await request(gatewayUrl)
            .get('/auth/health')
            .expect(200)
            .expect((res) => {
                console.log('DEBUG RES BODY:', res.body);
                // Ensure response comes from the service
                if (!res.body.status || res.body.status !== 'healthy') {
                    throw new Error('Response is not from auth-service health check');
                }
            });
    });
});
