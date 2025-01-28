import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { StreaksService } from './streaks.service';

@Controller('streaks')
export class StreaksController {
  constructor(private readonly streaksService: StreaksService) {}

  @Get()
  greet() {
    return {
      message: 'Hello OTA pips!',
    };
  }

  // TODO: Validation, DTO, APIOperation
  @Get(':streakId')
  getStreaksByStreak(@Param('streakId', ParseIntPipe) streakId: number) {
    const streaks = this.streaksService.getStreaksDataByStreakId(streakId);

    return streaks;
  }
}
