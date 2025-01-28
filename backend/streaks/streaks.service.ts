import { Injectable } from '@nestjs/common';
import { subDays, format } from 'date-fns';

const DEFAULT_DATE_FORMAT = 'yyyy-mm-dd';

@Injectable()
export class StreaksService {
  // Add validation that only allows 1-3
  async getStreaksDataByStreakId(streakId: number) {
    const streaks = await this.mockData(streakId);

    if (streaks) return streaks;

    return {
      message: 'not found',
    };
  }

  /**
  case #1:
  3 day recovery success
  now().subtract(3, ‘days’) = 1 activity
  now() = 3 activities

  case #2:
  3 day recovery ongoing
  now().subtract(4, ‘days’) = 1 activity
  now().subtract(3, ‘days’) = 1 activity
  now() = 1 activity

  case #3
  3 day recovery fail
  now().subtract(4, ‘days’) = 1 activity
  now().subtract(1, ‘days’) = 3 activities
  */
  private mockData(id: number) {
    switch (id) {
      case 1: // 3 day recovery success
        return {
          [format(subDays(new Date(), 3), DEFAULT_DATE_FORMAT)]: 1,
          [format(new Date(), DEFAULT_DATE_FORMAT)]: 3,
        };
      case 2: // 3 day recovery ongoing
        return {
          [format(subDays(new Date(), 4), DEFAULT_DATE_FORMAT)]: 1,
          [format(subDays(new Date(), 3), DEFAULT_DATE_FORMAT)]: 1,
          [format(new Date(), DEFAULT_DATE_FORMAT)]: 1,
        };
      case 3: // 3 day recovery fail
        return {
          [format(subDays(new Date(), 4), DEFAULT_DATE_FORMAT)]: 1,
          [format(subDays(new Date(), 1), DEFAULT_DATE_FORMAT)]: 3,
        };
      default:
        return null;
    }
  }
}
