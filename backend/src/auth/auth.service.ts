import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, AuthUserDto } from './dto/auth-response.dto';
import { EmailAlreadyExistsException } from '../common/exceptions/email-already-exists.exception';
import { InvalidCredentialsException } from '../common/exceptions/invalid-credentials.exception';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(data: LoginDto): Promise<AuthResponseDto> {
    this.logger.log(`Login attempt for email: ${data.email}`);

    const user = await this.usersService.findByEmail(data.email);
    if (!user) {
      this.logger.warn(`Failed login - user not found: ${data.email}`);
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Failed login - invalid password: ${data.email}, userId: ${user.id}`);
      throw new InvalidCredentialsException();
    }

    this.logger.log(`Successful login: ${user.email}, userId: ${user.id}`);

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return new AuthResponseDto(user, accessToken);
  }

  async register(data: RegisterDto): Promise<AuthResponseDto> {
    this.logger.log(`Registration attempt for email: ${data.email}`);

    const existingUser = await this.usersService.findByEmail(data.email);
    if (existingUser) {
      this.logger.warn(`Failed registration - email already exists: ${data.email}`);
      throw new EmailAlreadyExistsException();
    }

    const user = await this.usersService.create({ 
      ...data,
      password: await bcrypt.hash(data.password, 10)
    });
    
    this.logger.log(`Successful registration: ${user.email}, userId: ${user.id}`);
    
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return new AuthResponseDto(user, accessToken);
  }
}
