import { Module } from '@nestjs/common';
import { StreaksModule } from './streaks/streaks.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    StreaksModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'out'),
      exclude: ['/streaks/*'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
