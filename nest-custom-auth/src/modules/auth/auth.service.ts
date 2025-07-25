import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { RefreshTokenService } from './refreshToken.service';

import { verifyPassword } from '../../utils/auth';

import { CreateUserDTO } from '../user/dto/user.dto';
import { TRefreshTokenProps } from '../../types/types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async signUp(userDto: CreateUserDTO, refreshTokenData: TRefreshTokenProps) {
    const user = await this.userService.createUser(userDto);

    const payload = { email: user.email, id: user.id };
    const token = await this.jwtService.signAsync(payload);

    const { rawToken: refreshToken } = await this.refreshTokenService.create({
      userEmail: user.email,
      userAgent: refreshTokenData.userAgent,
      ipAddress: refreshTokenData.ipAddress,
    });

    return { user, token, refreshToken };
  }

  async signIn(
    email: string,
    password: string,
    refreshTokenData: TRefreshTokenProps,
  ) {
    const user = await this.userService.findOne(email);

    if (!user) throw new NotFoundException('user is not registered');

    const verified = verifyPassword(user.password, password);

    if (!verified) throw new UnauthorizedException('Wrong credentials');

    const payload = { email: user.email };

    const token = await this.jwtService.signAsync(payload);

    const { rawToken: refreshToken } = await this.refreshTokenService.create({
      userEmail: payload.email,
      userAgent: refreshTokenData.userAgent,
      ipAddress: refreshTokenData.ipAddress,
    });

    return { token, refreshToken };
  }
}
