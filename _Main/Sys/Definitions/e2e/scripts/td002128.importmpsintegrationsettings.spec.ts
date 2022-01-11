/**
 * @file        TD002128
 * @description Import MPS integration settings
 * @author      Umar Adkhamov (umar.adkhamov@3ds.com)
 * @copyright   Dassault Systèmes
 */

import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { FormIntegrationConfiguration, PanelMPSIntegration } from '../libsch/forms/form.integrationconfiguration';
import { MPSIntegration } from '../libsch/data/data.configureintegration';
import { ButtonImportSettingsContextMenuItem } from '../libsch/actionbarpages/abp.data';

describe('TD002128 - Import MPS integration settings', () => {
  let appScheduler = AppScheduler.getInstance();
  let formIntegration: FormIntegrationConfiguration;
  let panelIntegration: PanelMPSIntegration;

  let sanityCheckLimit = MPSIntegration.SanityCheckLimit;
  let horizon = MPSIntegration.Horizon;
  let source = MPSIntegration.Source;

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
    await appScheduler.switchToDemoScenario(DemoCategory.TestDemo, DemoScenario.Test2JoinAndSplitFirmPlannedOrder);
  });

  afterAll(async () => {
    await appScheduler.cleanUpDataset();
    await appScheduler.logout();
  });

  afterEach(async () => {
    await appScheduler.checkToastMessage();
  });

  it('Step 1: Set new values for Integration and verify they are set correctly', async () => {
    // Go to Integration view
    await appScheduler.viewIntegration.switchTo();

    // Set new values
    formIntegration = appScheduler.viewIntegration.formIntegrationConfiguration;
    panelIntegration = formIntegration.pnlMPSIntegration;
    await formIntegration.setMPSIntegrationValues(sanityCheckLimit, horizon, source);

    // Verify the values are set
    expect(await formIntegration.nmpSanityCheckLimit .getValue()).toBe(sanityCheckLimit, `Sanity Check Limit should be '${sanityCheckLimit}'`);
    expect(await panelIntegration.ddslMPSSource.getSelectedString()).toBe(source, `MPS Source should be '${source}'`);
    expect(await panelIntegration.dsMPSPlanHorizon.getDay()).toBe(horizon, `MPS Plan Horizon should be equal to ${horizon}`);
  });

  it('Step 2: Import settings and verify the values are set correctly', async () => {
    // reassigns the variable data with different ones
    sanityCheckLimit = MPSIntegration.SanityCheckLimitOrig;
    horizon = MPSIntegration.HorizonOrig;
    source = MPSIntegration.SsourceOrig;

    // Click on Import Settings button
    await appScheduler.abpData.btnImportSettings.clickDropdown(ButtonImportSettingsContextMenuItem.IntegrationConfiguration);

    // Verify the values are set
    expect(await formIntegration.nmpSanityCheckLimit .getValue()).toBe(sanityCheckLimit, `Sanity Check Limit should be ${sanityCheckLimit}`);
    expect(await panelIntegration.ddslMPSSource.getSelectedString()).toBe(source, `MPS Source should be ${source}`);
    expect(await panelIntegration.dsMPSPlanHorizon.getDay()).toBe(horizon, `MPS Plan Horizon should be equal to ${horizon}`);
  });
});
