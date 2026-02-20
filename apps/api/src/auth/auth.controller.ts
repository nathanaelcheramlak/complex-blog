import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dtos/login.dto';
import { AuthTokenResponse } from 'src/auth/models/api-token-response.interface.ts';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login and receive JWT token' })
  @ApiOkResponse({ description: 'Registration succeeded.' })
  @Post('login')
  async login(@Body() body: LoginDto): Promise<AuthTokenResponse> {
    return this.authService.login(body);
  }
}
