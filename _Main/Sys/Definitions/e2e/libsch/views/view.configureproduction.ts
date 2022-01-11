import { ViewBase } from '../../libappbase/viewbase';
import { AppScheduler } from '../appsch';
import { FormProductionEnvironment } from '../forms/form.productionenvironment';

export class ViewConfigureProduction extends ViewBase {
  public readonly name = 'Configure Production Environment';

  public formProductionEnvironment = new FormProductionEnvironment();

  public async switchTo(): Promise<void> {
    let appScheduler = AppScheduler.getInstance();

    // Go to "Data" action bar page
    await appScheduler.abpData.click();

    // Click on "Configure Environment" button
    await appScheduler.abpData.btnConfigureProduction.click();

    // Wait until form "Production Environment" is present.
    await this.formProductionEnvironment.waitUntilPresent();
  }
}
