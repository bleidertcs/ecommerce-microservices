export interface IApiBaseResponse {
    statusCode: number;
    timestamp: string;
    message: string | string[];
}

export interface IApiResponse<T = any> {
    statusCode: number;
    timestamp: string;
    message: string;
    data: T | null;
}

export interface IPaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface IPaginatedData<T> {
    items: T[];
    meta: IPaginationMeta;
}

export interface IApiPaginatedResponse<T> {
    statusCode: number;
    timestamp: string;
    message: string;
    data: IPaginatedData<T>;
}

export interface IErrorResponse {
    statusCode: number;
    message: string;
    timestamp: string;
    path: string;
    method: string;
    error?: string;
    stack?: string;
}
