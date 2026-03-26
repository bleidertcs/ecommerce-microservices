import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class QueryBuilderService {
    private readonly logger = new Logger(QueryBuilderService.name);

    buildWhereClause<T extends Record<string, any>>(
        filters: Partial<T>,
        searchableFields: string[] = [],
    ): any {
        const where: Record<string, any> = {};

        for (const [key, value] of Object.entries(filters)) {
            if (value === undefined || value === null || value === '') {
                continue;
            }

            if (searchableFields.includes(key) && typeof value === 'string') {
                where[key] = { contains: value, mode: 'insensitive' };
            } else if (Array.isArray(value)) {
                where[key] = { in: value };
            } else {
                where[key] = value;
            }
        }

        return where as any;
    }

    buildOrderBy<T>(
        sortBy: string | undefined,
        sortOrder: 'asc' | 'desc' | undefined,
        allowedFields: string[],
        defaultSort: Record<string, 'asc' | 'desc'> = { createdAt: 'desc' },
    ): any {
        if (sortBy && allowedFields.includes(sortBy)) {
            return { [sortBy]: sortOrder || 'desc' } as any;
        }
        return defaultSort as any;
    }

    buildPagination(page: number, limit: number): { skip: number; take: number } {
        const skip = (page - 1) * limit;
        const take = limit;
        return { skip, take };
    }
}
