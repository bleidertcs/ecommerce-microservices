import { Injectable, Logger } from '@nestjs/common';
import CircuitBreaker from 'opossum';

@Injectable()
export class CircuitBreakerService {
    private readonly logger = new Logger(CircuitBreakerService.name);
    private readonly breakers: Map<string, CircuitBreaker<any, any>> = new Map();

    private readonly defaultOptions: CircuitBreaker.Options = {
        timeout: 15000,
        errorThresholdPercentage: 50,
        resetTimeout: 10000,
    };

    getBreaker<T, R>(
        name: string,
        action: (...args: T[]) => Promise<R>,
        options?: CircuitBreaker.Options,
    ): CircuitBreaker<T[], R> {
        if (!this.breakers.has(name)) {
            const breaker = new CircuitBreaker(action, { ...this.defaultOptions, ...options });

            breaker.on('open', () => this.logger.warn(`Circuit Breaker [${name}] is OPEN`));
            breaker.on('halfOpen', () => this.logger.log(`Circuit Breaker [${name}] is HALF_OPEN`));
            breaker.on('close', () => this.logger.log(`Circuit Breaker [${name}] is CLOSED`));
            breaker.on('fallback', (data) => this.logger.error(`Circuit Breaker [${name}] FALLBACK triggered`, data));

            this.breakers.set(name, breaker);
        }
        return this.breakers.get(name) as CircuitBreaker<T[], R>;
    }

    async fire<T, R>(name: string, action: (...args: T[]) => Promise<R>, ...args: T[]): Promise<R> {
        const breaker = this.getBreaker(name, action);
        return breaker.fire(...args);
    }
}
