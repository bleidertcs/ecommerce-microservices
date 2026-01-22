import { Injectable, Logger } from '@nestjs/common';
import { GrpcClientService } from 'nestjs-grpc';
import { ValidateTokenRequest, ValidateTokenResponse } from '../../generated/auth';
import { CircuitBreakerService } from '../../common/services/circuit-breaker.service';

@Injectable()
export class GrpcAuthService {
    private readonly logger = new Logger(GrpcAuthService.name);

    constructor(
        private readonly grpcClientService: GrpcClientService,
        private readonly circuitBreaker: CircuitBreakerService,
    ) {}

    async validateToken(token: string): Promise<ValidateTokenResponse> {
        try {
            this.logger.debug(`Validating token via gRPC: ${token}...`);

            const request: ValidateTokenRequest = { token };

            const response = await this.circuitBreaker.fire<ValidateTokenRequest, ValidateTokenResponse>(
                'auth-validate-token',
                (req) => this.grpcClientService.call<ValidateTokenRequest, ValidateTokenResponse>('AuthService', 'ValidateToken', req),
                request,
            );

            this.logger.debug(`Token validation response: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            this.logger.error(`Token validation failed: ${error.message}`, error.stack);
            throw error;
        }
    }

    async getUserById(userId: string): Promise<any> {
        try {
            this.logger.debug(`Getting user by ID via gRPC: ${userId}`);

            const request = { id: userId };
            const response = await this.circuitBreaker.fire<any, any>(
                'auth-get-user-by-id',
                (req) => this.grpcClientService.call<any, any>('AuthService', 'GetUserById', req),
                request,
            );

            this.logger.debug(`Get user response: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            this.logger.error(`Get user by ID failed: ${error.message}`, error.stack);
            throw error;
        }
    }

    async getUserByEmail(email: string): Promise<any> {
        try {
            this.logger.debug(`Getting user by email via gRPC: ${email}`);

            const request = { email };
            const response = await this.circuitBreaker.fire<any, any>(
                'auth-get-user-by-email',
                (req) => this.grpcClientService.call<any, any>('AuthService', 'GetUserByEmail', req),
                request,
            );

            this.logger.debug(`Get user by email response: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            this.logger.error(`Get user by email failed: ${error.message}`, error.stack);
            throw error;
        }
    }
}
