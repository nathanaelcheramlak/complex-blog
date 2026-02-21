import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dtos/login.dto';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  AuthTokenResponse,
  UserResponse,
} from 'src/auth/models/auth-token-response.model';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

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

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth('jwt')
  @ApiOkResponse({
    description: 'Current user profile retrieved successfully.',
    type: UserResponse,
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(
    @CurrentUser('userId') userId: number,
  ): Promise<AuthTokenResponse['user']> {
    return this.authService.getProfile(userId);
  }
}
