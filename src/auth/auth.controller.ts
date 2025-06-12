import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Request } from 'express';
import { Public } from './decorators/public.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User as UserDecorator} from 'src/auth/decorators/user.decorator'
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UpdateProfileDto } from './dto/update-profile';

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

  @Patch('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @UserDecorator() user: any) {
    return this.authService.changePassword(
      user.user_id,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    )
  }

  @Post('forgot-password')
    forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto){
      return this.authService.forgotPassword(forgotPasswordDto.email)
    }

  @Get('me')
  getProfile(@UserDecorator() user: any){
    return this.authService.getProfile(user)
  }

  @Patch('me')
  editProfile(@Body() updateProfileDto: UpdateProfileDto, @UserDecorator() user: any) {
    return this.authService.editProfile(user, updateProfileDto)
  }
}
