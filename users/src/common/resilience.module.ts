import { Global, Module } from '@nestjs/common';
import { CircuitBreakerService } from '@/common/services/circuit-breaker.service';

@Global()
@Module({
    providers: [CircuitBreakerService],
    exports: [CircuitBreakerService],
})
export class ResilienceModule {}
