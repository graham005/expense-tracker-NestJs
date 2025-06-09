import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as Bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}
  async signIn(createAuthDto: CreateAuthDto) {
    //Check if the user exists in the database
    const foundUser = await this.userRepository.findOne({
      where: { email: createAuthDto.email },
      select: ['user_id', 'email', 'password'],
    });
    if (!foundUser) {
      throw new NotFoundException('User with email ${createAuthDto.email} not found');
    };

    // Compare hashed password with the provided password
    const foundPassword = await Bcrypt.compare(
      createAuthDto.password,
      foundUser.password,
    );
    if (!foundPassword) {
      throw new NotFoundException('Invalid credentials');
    }

    // Generate Tokens
    const { accessToken, refreshToken } = await this.getTokens(
      foundUser.user_id,
      foundUser.email 
    );

    // Save the refresh token in the database
    await this.saveRefreshToken(foundUser.user_id, refreshToken);

    return { accessToken, refreshToken}
  }

  async signOut(userId: number) {
    // Set user refresh token to null
    const user = await this.userRepository.update(userId, {
      hashedRefreshToken: null,
    });

    if (!user.affected) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User signed out successfully' };
  }

  async refreshTokens(id: number, refreshToken: string) {
  const foundUser = await this.userRepository.findOne({
    where: { user_id: id },
  });

  if (!foundUser) {
    throw new NotFoundException('User not found');
  }

  if (!refreshToken || !foundUser.hashedRefreshToken) {
    throw new NotFoundException('Refresh token not found');
  }

  const refreshTokenMatches = await Bcrypt.compare(
    refreshToken,
    foundUser.hashedRefreshToken,
  );

  if (!refreshTokenMatches) {
    throw new NotFoundException('Invalid refresh token');
  }

    // Generate new access and refresh tokens
    const { accessToken, refreshToken: newRefreshToken } = await this.getTokens(
      foundUser.user_id,
      foundUser.email
    );

    // Save the new refresh token in the database
    await this.saveRefreshToken(foundUser.user_id, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
  }

  //Helper method to hash the password
  private async hashData(data: string): Promise<string> {
    const salt = await Bcrypt.genSalt(10)
    return await Bcrypt.hash(data, salt);
  }

  // Helper method to generate access and refresh tokens 
  private async getTokens(userId: number, email: string){
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email
        },
        {
          secret: this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId, 
          email
        },
        {
          secret: this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
        }
      )
    ])
    return {
      accessToken: at,
      refreshToken: rt
    }
  }

  // Helper method to save the refresh token in the database
  private async saveRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);

    await this.userRepository.update(userId, {
      hashedRefreshToken: hashedRefreshToken,
    });
  }
}
