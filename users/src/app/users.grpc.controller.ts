import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { UsersService } from '../modules/users/users.service';

@Controller()
export class UsersGrpcController {
  private readonly logger = new Logger(UsersGrpcController.name);

  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('UsersService', 'FindOne')
  async findOne(data: { id: string }) {
    this.logger.log(`gRPC: FindOne received for ID: ${data.id}`);
    const user = await this.usersService.findOne(data.id);
    if (!user) {
      // Return NOT_FOUND (5) status code via RpcException
      throw new RpcException({
        code: 5,
        message: `User with ID ${data.id} not found`,
      });
    }
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
