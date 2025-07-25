import {
  Controller,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
  Body,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBody } from '@nestjs/swagger';
import { Response, Request } from 'express';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './refreshToken.service';

import { SignInDTO } from './dto/auth.dto';
import { RequestWithUser } from '../../types/types';
import { CreateUserDTO } from '../user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  @Post('signin')
  @UsePipes(new ValidationPipe({ transform: true }))
  async signIn(
    @Req() req: Request,
    @Body() signInDto: SignInDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, refreshToken } = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
      { userAgent: req.headers['user-agent'], ipAddress: req.ip },
    );

    this.setCookie(res, refreshToken);

    return { message: 'Logged in', token };
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'test@gmail.com' },
        name: { type: 'string', example: 'John Doe' },
        password: { type: 'string', example: 'supersecret123' },
      },
    },
  })
  @Post('signup')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(
    @Req() req: Request,
    @Body() createUserDto: CreateUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, refreshToken } = await this.authService.signUp(
      createUserDto,
      {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
      },
    );

    this.setCookie(res, refreshToken);

    return { message: 'User registered', token };
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('refresh')
  async refreshToken(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const email = req?.user?.email;

      if (!email) {
        throw new UnauthorizedException('no email');
      }

      const rawToken = req.cookies.refreshToken;

      if (!rawToken) {
        throw new UnauthorizedException('No refresh token');
      }

      const tokenRecord = await this.refreshTokenService.validate(
        email,
        rawToken,
      );

      if (!tokenRecord) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      await this.refreshTokenService.revoke(tokenRecord.id);

      const { rawToken: newRefreshToken } =
        await this.refreshTokenService.create({
          userEmail: email,
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip,
        });

      const newAccessToken = this.jwtService.sign({ email });

      this.setCookie(res, newRefreshToken);

      return {
        token: newAccessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Something Happened');
    }
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const email = req.user?.email;
    const rawToken = req.cookies.refreshToken;
    if (!email || !rawToken) {
      throw new UnauthorizedException();
    }

    const tokenRecord = await this.refreshTokenService.validate(
      email,
      rawToken,
    );

    if (tokenRecord) {
      await this.refreshTokenService.revoke(tokenRecord.id);
    }

    res.clearCookie('refreshToken', {
      path: '/auth/refresh',
    });

    return { message: 'Logged out' };
  }

  private setCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // set true in prod, false in dev
      sameSite: 'lax',
      path: '/auth', // cookie only sent to refresh endpoint
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });
  }
}
