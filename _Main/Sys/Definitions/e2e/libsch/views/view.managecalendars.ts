import { ViewBase } from '../../libappbase/viewbase';
import { AppScheduler } from '../appsch';
import { FormCommonCalendar } from '../forms/commoncalendar';
import { FormResourceCalendar } from '../forms/resourcecalendar';

export class ViewManageCalendars extends ViewBase {
  public readonly name = 'Manage Calendars';

  public formResourceCalendar = new FormResourceCalendar();
  public formCommonCalendar = new FormCommonCalendar();

  public async switchTo(): Promise<void> {
    let appScheduler = AppScheduler.getInstance();

    // Go to "Data" action bar page
    await appScheduler.abpData.click();

    // Click on "Manage Calendars" button
    await appScheduler.abpData.btnManageCalendarsView.click();

    // Wait until form "Resource Calendar" and form "Common Calendar" are present.
    await this.formResourceCalendar.waitUntilPresent();
    await this.formCommonCalendar.waitUntilPresent();
  }
}
