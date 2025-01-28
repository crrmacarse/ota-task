import { Injectable } from '@nestjs/common';
import { subDays, format, addDays, isSameDay } from 'date-fns';
import { StreakDays, Streaks, DateWithActivities } from './streaks.dto';

const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';
const MAX_DAYS = 7;

/**
 * TODO:
 *  - Add validation that only allows 1-5 values
 */
@Injectable()
export class StreaksService {
  getStreaksDataByStreakId(streakId: number) {
    const days = this.mockDateWithActivityData(streakId);

    if (days) {
      const streaks = this.generateStreak(days);

      return streaks;
    }

    return {
      message: 'Not found',
    };
  }

  private generateStreak(dateWithActivities: DateWithActivities): Streaks {
    const sortedDates = Object.keys(dateWithActivities).sort();
    const INITIAL_DATE = new Date(sortedDates[0]);
    const PRESENT_DAY = new Date();
    const days: StreakDays = [];
    let ACTIVITIES_TODAY = 0;

    // Fill dates from initial to present day
    for (let i = 0; i < MAX_DAYS; i++) {
      const date = format(addDays(INITIAL_DATE, i), DEFAULT_DATE_FORMAT);
      const activities = dateWithActivities[date] || 0;

      days.push({
        date,
        activities,
        state: activities > 0 ? 'COMPLETED' : 'INCOMPLETE',
      });

      // Stop if same date
      if (isSameDay(date, PRESENT_DAY)) {
        // Assign today activity count
        ACTIVITIES_TODAY = dateWithActivities[date];

        break;
      }
    }

    /**
     * 
     * Streak State Definitions:

    - COMPLETED: At least 1 activity on that day.
    - AT_RISK: If there was a previous streak and today is the first or second day after the last "COMPLETED" day.
    - SAVED: If after being at risk, the user performs a sufficient number of activities:
        After 1 day of inactivity: At least 2 activities.
        After 2 days of inactivity: At least 3 activities.
    - INCOMPLETE:
        If the user hasn't completed the required activities for the current day (2 or 3).
        If no activities were logged on the day.
    */
    for (let b = 0; b < days.length; b++) {
      const currDay = days[b];
      const prevDay = days[b - 1];

      if (prevDay) {
        if (prevDay.state === 'COMPLETED') {
          if (currDay.activities > 0) {
            currDay.state = 'COMPLETED';
          } else if (currDay.activities == 0) {
            currDay.state = 'AT_RISK';
          }
        }

        if (prevDay.state === 'INCOMPLETE') {
          if (currDay.activities == 0) {
            currDay.state = 'INCOMPLETE';
          } else if (currDay.activities >= 3) {
            currDay.state = 'COMPLETED';
            prevDay.state = 'SAVED';

            const prevPrevDay = days[b - 2];
            if (
              prevPrevDay.state === 'AT_RISK' ||
              prevPrevDay.state === 'INCOMPLETE'
            ) {
              prevPrevDay.state = 'SAVED';
            }
          } else if (currDay.activities <= 2) {
            currDay.state = 'INCOMPLETE';
            prevDay.state = 'SAVED';
          }
        }
      }
    }

    const REMAINING_MAX_DAYS = MAX_DAYS - days.length;

    // fill remaining days as incomplete
    for (let a = 0; a < REMAINING_MAX_DAYS; a++) {
      days.push({
        // add days to present till hit remaining max_days
        date: format(addDays(PRESENT_DAY, a + 1), DEFAULT_DATE_FORMAT),
        activities: 0,
        state: 'INCOMPLETE',
      });
    }

    return {
      activitiesToday: ACTIVITIES_TODAY,
      // total streak
      total: days.filter((d) => d.state !== 'INCOMPLETE').length,
      days: days.reverse(),
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
  private mockDateWithActivityData(
    streakId: number,
  ): DateWithActivities | null {
    switch (streakId) {
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
      case 4: // from json code example
        return {
          [format(subDays(new Date(), 3), DEFAULT_DATE_FORMAT)]: 2,
          [format(new Date(), DEFAULT_DATE_FORMAT)]: 3,
          [format(addDays(new Date(), 3), DEFAULT_DATE_FORMAT)]: 0,
        };
      case 5: // from json code example
        return {
          [format(subDays(new Date(), 3), DEFAULT_DATE_FORMAT)]: 2,
          [format(new Date(), DEFAULT_DATE_FORMAT)]: 2,
          [format(addDays(new Date(), 3), DEFAULT_DATE_FORMAT)]: 2,
        };
      default:
        return null;
    }
  }
}
