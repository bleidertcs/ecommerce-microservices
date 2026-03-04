export interface IAppConfig {
    env: string;
    name: string;
    versioning: {
        enable: boolean;
        prefix: string;
        version: string;
    };
    throttle: {
        ttl: number;
        limit: number;
    };
    http: {
        host: string;
        port: number;
    };
    cors: {
        origin: string[] | boolean;
        methods: string[];
        allowedHeaders: string[];
        credentials: boolean;
        exposedHeaders: string[];
    };
    sentry: {
        dsn?: string;
        env: string;
    };
    debug: boolean;
    logLevel: string;
}

export interface IRabbitMQConfig {
    url: string;
    queue: string;
}

export interface IDocConfig {
    name: string;
    description: string;
    version: string;
    prefix: string;
}
