import { Module } from '@nestjs/common';

import { AppService } from './modules/app/app.service';
import { AppController } from './modules/app/app.controller';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
