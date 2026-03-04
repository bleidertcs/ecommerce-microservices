import { GrpcController, GrpcMethod, GrpcException } from 'nestjs-grpc';
import { UsersService } from '../modules/users/users.service';

@GrpcController('UsersService')
export class UsersGrpcController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('FindOne')
  async findOne(data: { id: string }) {
    const user = await this.usersService.findOne(data.id);
    if (!user) {
      throw GrpcException.notFound(`User with ID ${data.id} not found`, { id: data.id });
    }
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
