import { ViewBase } from '../../libappbase/viewbase';
import { AppScheduler } from '../appsch';
import { FormBatchDetail } from '../forms/form.batchdetail';
import { FormResourceSchedule } from '../forms/resourceschedule';
import { FormWorkOrdersAndOperations } from '../forms/workordersandoperations';

export class ViewSchedule extends ViewBase {
  public readonly name = 'Schedule';

  public formWorkOrdersAndOperation = new FormWorkOrdersAndOperations();
  public formResourceSchedule = new FormResourceSchedule();
  public formBatchDetail = new FormBatchDetail();

  public async switchTo(): Promise<void> {
    let appScheduler = AppScheduler.getInstance();

    // Go to "Schedule" action bar page
    await appScheduler.abpSchedule.click();

    // Click on "Schedule" button
    await appScheduler.abpSchedule.btnSchedule.click();

    // Wait until form "Work Order and Operations" and form "Resource Schedule" are present.
    await this.formWorkOrdersAndOperation.waitUntilPresent();
    await this.formResourceSchedule.waitUntilPresent();
  }
}
