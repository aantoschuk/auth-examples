import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { DBModule } from '../database/db.module';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { RefreshTokenService } from './refreshToken.service';

import configuration from '../../config/configuration';

@Module({
  imports: [
    DBModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: async () => {
        const config = configuration();
        return {
          secret: config.secret,
          signOptions: { expiresIn: '15m' },
        };
      },
    }),
  ],
  providers: [AuthService, UserService, RefreshTokenService],
  controllers: [AuthController],
})
export class AuthModule {}
