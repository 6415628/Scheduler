import { ViewBase } from '../../libappbase/viewbase';
import { AppScheduler } from '../appsch';
import { FormIntegrationConfiguration } from '../forms/form.integrationconfiguration';

export class ViewIntegration extends ViewBase {
  public readonly name = 'Configure Integration';

  public formIntegrationConfiguration = new FormIntegrationConfiguration();

  public async switchTo(): Promise<void> {
    let appScheduler = AppScheduler.getInstance();

    // Go to "Data" action bar page
    await appScheduler.abpData.click();

    // Click on "Configure Integration" button
    await appScheduler.abpData.btnConfigureIntegration.click();

    // Wait until form "Integration" is present.
    await this.formIntegrationConfiguration.waitUntilPresent();
  }
}
