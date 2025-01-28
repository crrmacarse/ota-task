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

  @Get(':streakId')
  // TODO: Validation, DTO
  async getStreaksByStreak(@Param('streakId', ParseIntPipe) streakId: number) {
    const streaks =
      await this.streaksService.getStreaksDataByStreakId(streakId);

    return {
      activitiesToday: 3,
      total: 4,
      days: streaks,
    };
  }
}
