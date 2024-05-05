import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  dateNow(): Date {
    const date = new Date();

    const singaporeTimezoneOffset = 8 * 60;
    const singaporeTimezoneOffsetMilliseconds =
      singaporeTimezoneOffset * 60 * 1000;

    date
      .setTime(date.getTime() + singaporeTimezoneOffsetMilliseconds)
      .toString()
      .slice(0, -1);

    return date;
  }
}
