import { GrpcController, GrpcMethod } from 'nestjs-grpc';
import { UsersService } from '../modules/users/users.service';

@GrpcController('UsersService')
export class UsersGrpcController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('FindOne')
  async findOne(data: { id: string }) {
    const user = await this.usersService.findOne(data.id);
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
