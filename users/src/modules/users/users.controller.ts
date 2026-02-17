import { Controller, Get, Param, NotFoundException, Headers } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PublicRoute } from '../../common/decorators/public.decorator';

@ApiTags('Users')
@Controller('users')
@PublicRoute()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe(@Headers('x-user-id') userId: string) {
    if (!userId) {
      throw new NotFoundException('User identity not found in headers');
    }
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
