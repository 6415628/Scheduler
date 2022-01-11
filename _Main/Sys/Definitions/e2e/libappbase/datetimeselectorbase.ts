import { DateTimeSelector } from '../e2elib/lib/src/pageobjects/datetimeselector.component';
import { Month } from './timeutils';

export class DateTimeSelectorBase extends DateTimeSelector {
  /**
   * Get date from datetime selector
   */
  public async getDate(): Promise<Date> {
    let year = Number(await this.getYear());
    let month = Month[await this.getMonth()];
    let day = Number(await this.getDay());
    return new Date(year, month, day);
  }

  /**
   * Get datetime from datetime selector
   */
  public async getDateTime(): Promise<Date> {
    let year = Number(await this.getYear());
    let month = Month[await this.getMonth()];
    let day = Number(await this.getDay());
    let hour = Number(await this.getHour());
    let minute = Number(await this.getMinute());
    let second = Number(await this.getSecond());
    return new Date(year, month, day, hour, minute, second);
  }

  /**
   * Set the day, month and year value
   * @param date date value
   */
  public async setDate(date: Date): Promise<void> {
    await this.setDay(date.getDate().toString());
    await this.setMonth((date.getMonth() + 1).toString());
    await this.setYear(date.getFullYear().toString());
  }
}
