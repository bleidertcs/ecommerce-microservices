import request from 'supertest';
import { faker } from '@faker-js/faker';

describe('Gateway Rate Limiting (Auth)', () => {
    const gatewayUrl = 'http://localhost:8080';
    let accessToken: string;

    beforeAll(async () => {
        // 1. Signup
        const email = faker.internet.email();
        const password = 'password123';
        const signupPayload = {
            email,
            password,
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        };

        await request(gatewayUrl)
            .post('/auth/signup')
            .send(signupPayload)
            .expect(201);

        // 2. Login
        const loginPayload = {
            email,
            password,
        };

        const response = await request(gatewayUrl)
            .post('/auth/login')
            .send(loginPayload)
            .expect(201);

        accessToken = response.body.data.accessToken;
        expect(accessToken).toBeDefined();
    });

    it('should return 429 when rate limit is exceeded on protected route', async () => {
        const limit = 10;
        let limitReached = false;

        for (let i = 0; i < limit + 10; i++) {
            try {
                const response = await request(gatewayUrl)
                    .get('/user/profile')
                    .set('Authorization', `Bearer ${accessToken}`);
                
                if (response.status === 429) {
                    limitReached = true;
                    break;
                }
            } catch (error) {
                console.error('Request failed', error);
            }
        }

        expect(limitReached).toBe(true);
    }, 30000);
});
