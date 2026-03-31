import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HashService {
    private readonly logger = new Logger(HashService.name);
    private readonly saltRounds = 12;

    async hash(data: string): Promise<string> {
        try {
            return await bcrypt.hash(data, this.saltRounds);
        } catch (error) {
            this.logger.error('Error hashing data', error);
            throw error;
        }
    }

    async compare(data: string, encrypted: string): Promise<boolean> {
        try {
            return await bcrypt.compare(data, encrypted);
        } catch (error) {
            this.logger.error('Error comparing hash', error);
            return false;
        }
    }
}
