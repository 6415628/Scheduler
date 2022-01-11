import { ViewBase } from '../../libappbase/viewbase';
import { AppScheduler } from '../appsch';
import { FormOperationsAndBatches } from '../forms/form.operationsandbatches';

export class ViewOperationBatching extends ViewBase {
  public readonly name = 'Operation Batching';

  public formOperationsAndBatches = new FormOperationsAndBatches();

  public async switchTo(): Promise<void> {
    let appScheduler = AppScheduler.getInstance();

    // Go to "Schedule" action bar page
    await appScheduler.abpSchedule.click();

    // Click on "Operation Batching" button
    await appScheduler.abpSchedule.btnOperationBatching.click();

    // Wait until form "Operations and Batches" is present.
    await this.formOperationsAndBatches.waitUntilPresent();
  }
}
