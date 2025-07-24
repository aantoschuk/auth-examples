import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppService } from './modules/app/app.service';
import { AppController } from './modules/app/app.controller';

import configuration from './config/configuration';

@Module({
  imports: [ConfigModule.forRoot({load: [configuration] })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
