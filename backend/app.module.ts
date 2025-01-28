import { Module } from '@nestjs/common';
import { StreaksModule } from './streaks/streaks.module';

@Module({
  imports: [StreaksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
