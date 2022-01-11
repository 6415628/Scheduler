import { ViewBase } from '../../libappbase/viewbase';
import { AppScheduler } from '../appsch';
import { FormSuppliesAndDemands } from '../forms/suppliesanddemands';

export class ViewReserveMaterial extends ViewBase {
  public readonly name = 'Reserve Material';

  public formSuppliesAndDemands = new FormSuppliesAndDemands();

  public async switchTo(): Promise<void> {
    let appScheduler = AppScheduler.getInstance();

    // Go to "Manage Materials" action bar page
    await appScheduler.abpManageMaterials.click();

    // Click on "Reserve Material" button
    await appScheduler.abpManageMaterials.btnReserveMaterialView.click();

    // Wait until form "Supplies and Demands" are present.
    await this.formSuppliesAndDemands.waitUntilPresent();
  }
}
