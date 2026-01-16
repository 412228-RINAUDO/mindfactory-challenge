import { Controller, Get, Param, Put, Body, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForbiddenException } from '../common/exceptions/forbidden.exception';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(id);
    return new UserResponseDto(user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ): Promise<UserResponseDto> {
    if (!this.isOwner(req.user.sub, id)) {
      throw new ForbiddenException();
    }

    const user = await this.usersService.update(id, updateUserDto);
    return new UserResponseDto(user);
  }

  private isOwner(userId: string, resourceId: string): boolean {
    return userId === resourceId;
  }
}
