import AuthConfig from '@/common/config/auth.config';
import AppConfig from '@/common/config/app.config';
import DocConfig from '@/common/config/doc.config';
import GrpcConfig from '@/common/config/grpc.config';
import RedisConfig from '@/common/config/redis.config';
import envs from '@/config/envs';

export default [AuthConfig, AppConfig, DocConfig, GrpcConfig, RedisConfig, envs];
