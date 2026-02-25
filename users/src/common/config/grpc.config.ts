import { registerAs } from '@nestjs/config';

export default registerAs('grpc', (): any => {
    const grpcUrl = process.env.GRPC_URL;
    const grpcPackage = process.env.GRPC_PACKAGE;

    return {
        url: grpcUrl,
        package: grpcPackage,
    };
});
