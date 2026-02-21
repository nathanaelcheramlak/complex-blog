import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dtos/login.dto';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { AuthTokenResponse } from 'src/auth/models/auth-token-response.model';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'User successfully registered.',
    type: AuthTokenResponse,
  })
  @Post('register')
  async register(@Body() body: RegisterDto): Promise<AuthTokenResponse> {
    return this.authService.register(body);
  }

  @ApiOperation({ summary: 'Login and receive JWT token' })
  @ApiOkResponse({
    description: 'Login successful. Returns JWT access token.',
    type: AuthTokenResponse,
  })
  @Post('login')
  async login(@Body() body: LoginDto): Promise<AuthTokenResponse> {
    return this.authService.login(body);
  }
}
