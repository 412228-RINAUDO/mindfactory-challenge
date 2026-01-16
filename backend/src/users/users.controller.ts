import { Controller, Get, Param, Put, Body, Req } from '@nestjs/common';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.interface';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthorizationService } from '../common/services/authorization.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(id);
    return new UserResponseDto(user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<UserResponseDto> {
    this.authorizationService.checkOwnership(req.user.sub, id);

    const user = await this.usersService.update(id, updateUserDto);
    return new UserResponseDto(user);
  }
}
