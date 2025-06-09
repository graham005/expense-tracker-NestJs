import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Request } from 'express';
import { Public } from './decorators/public.decorator';

export interface RequestWithUser extends Request {
  user: {
    sub: number; // User ID
    email: string; // User email
    refreshToken: string; // Optional refresh token
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  signIn(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signIn(createAuthDto);
  }

  @Get('signout/:id')
  signOut(@Param('id', ParseIntPipe) id: number) {
    return this.authService.signOut(id);
  }

  @Public()
@Get('refresh')
refreshTokens(
  @Query('id', ParseIntPipe) id: number,
  @Query('refreshToken') refreshToken: string
) {
  if (!refreshToken) {
    throw new UnauthorizedException('Refresh token missing');
  }
  return this.authService.refreshTokens(id, refreshToken);
}
}
