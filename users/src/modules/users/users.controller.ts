import { Controller, Get, Post, Body, Param, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthUser } from '../../common/decorators/auth-user.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  async create(@Body() createUserDto: any) {
    return this.usersService.create(createUserDto);
  }

  @Post('sync')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sync user from IDProvider to local DB' })
  async syncUser(@AuthUser() user: any) {
    if (!user || !user.id) {
      throw new UnauthorizedException('User identity not found in token');
    }
    // AuthUser decorator provides verified JWT claims.
    // The Casdoor token payload will be passed to syncUser.
    return this.usersService.syncUser(user);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe(@AuthUser() user: any) {
    if (!user || !user.id) {
      throw new UnauthorizedException('User identity not found');
    }
    const userProfile = await this.usersService.findOne(user.id);
    if (!userProfile) throw new NotFoundException('User not found');
    return userProfile;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
