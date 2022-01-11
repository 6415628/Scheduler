/**
 * @file        ADSC-26119
 * @description Import / Export "On Hold" horizon configuration to demo scenario
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { LogMessage } from '../libappbase/logmessage';
import { ActionTriggerType } from '../libappbase/utils';
import { AppScheduler } from '../libsch/appsch';
import { OnHoldPeriod } from '../libsch/data/data.configureproduction';
import { ResourceGroupName, ResourceName } from '../libsch/data/data.resource';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { InputResourceOnHoldPeriodFields } from '../libsch/dialogs/resource';
import { InputResourceGroupTimeHorizonFields } from '../libsch/dialogs/resourcegroup';
import { FormManageDemo, ListDemoCategoryColumn, ListDemoScenarioColumn } from '../libsch/forms/form.managedemo';
import { ListResourceGroupChildColumn, ListResourceGroupParentColumn } from '../libsch/forms/form.productionenvironment';

describe('ADSC-26119, Import Export On Hold horizon configuration to demo scenario', () => {
  const appScheduler = AppScheduler.getInstance();

  const viewConfigureProduction = appScheduler.viewConfigureProduction;
  const formProductionEnvironment = viewConfigureProduction.formProductionEnvironment;
  const listResourceGroup = formProductionEnvironment.listResourceGroup;
  const abpDevelop = appScheduler.abpDevelop;
  let formManageDemo: FormManageDemo;
  let heatingResourceGroupRow: ListRow;
  let bigPit1ResourceRow: ListRow;
  let sc1ResourceRow: ListRow;

  const heatingTimeHorizonFields: InputResourceGroupTimeHorizonFields = {
    setOnHoldPeriodForResourceGroup: true,
    onHoldPeriod: [OnHoldPeriod.Hour06, OnHoldPeriod.Min00],
  };

  const bigPit1OnHoldPeriodFields: InputResourceOnHoldPeriodFields = {
    setOnHoldPeriodOnResource: true,
    onHoldPeriod: [OnHoldPeriod.Hour03, OnHoldPeriod.Min00],
  };

  const sc1OnHoldPeriodFields: InputResourceOnHoldPeriodFields = {
    setOnHoldPeriodOnResource: true,
    onHoldPeriod: [OnHoldPeriod.Hour05, OnHoldPeriod.Min00],
  };

  const resourceGroupWithoutOnHold: InputResourceGroupTimeHorizonFields = {
    setOnHoldPeriodForResourceGroup: false,
    onHoldPeriod: [OnHoldPeriod.Hour00, OnHoldPeriod.Min00],
  };
  const resourceWithoutOnHold: InputResourceOnHoldPeriodFields = {
    setOnHoldPeriodOnResource: false,
    onHoldPeriod: [OnHoldPeriod.Hour00, OnHoldPeriod.Min00],
  };

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
  });

  afterAll(async () => {
    await appScheduler.cleanUpDataset();
    await appScheduler.logout();
  });

  afterEach(async () => {
    await appScheduler.checkToastMessage();
  });

  it('Setup: AluminumHotRolling dataset is loaded', async () => {
    await appScheduler.switchToDemoScenario(DemoCategory.SalesDemo, DemoScenario.AluminumHotRolling);
  });

  it('Step 1: Open view Data -> Configure Production', async () => {
    await viewConfigureProduction.switchTo();
    expect(await formProductionEnvironment.isVisible()).toBe(true, LogMessage.form_notVisible(await formProductionEnvironment.getTitle()));
  });

  it('Step 2: Add 6 hour "OnHold" horizon on resource group "Heating". Add a 3 hour "OnHold" horizon on resource "BigPit1" and "SC1"', async () => {
    // Edit Heating resource group
    heatingResourceGroupRow = await listResourceGroup.getRowByCellValue(ListResourceGroupParentColumn.Name, ResourceGroupName.Heating);
    const dlgResourceGroup = await listResourceGroup.openDialogResourceGroup(ActionTriggerType.ContextMenu, heatingResourceGroupRow);
    expect(await dlgResourceGroup.isVisible()).toBe(true, LogMessage.dialog_notVisible(await dlgResourceGroup.getTitle()));
    // Add 6 hour "OnHold" horizon
    await dlgResourceGroup.pnlTimeHorizons.switchTo();
    await dlgResourceGroup.pnlTimeHorizons.updatePanelValues(heatingTimeHorizonFields);
    await dlgResourceGroup.clickOK();

    // Edit BigPit1 resource
    bigPit1ResourceRow = await listResourceGroup.getRowByValueInHierarchy(
      [{ columnID: ListResourceGroupChildColumn.Name, value: ResourceName.BigPit1 }],
      [[{ columnID: ListResourceGroupParentColumn.Name, value: ResourceGroupName.Heating }]],
    );
    let dlgResource = await listResourceGroup.openDialogResource(ActionTriggerType.ContextMenu, bigPit1ResourceRow);
    await dlgResource.pnlOnHoldPeriod.switchTo();
    await dlgResource.pnlOnHoldPeriod.updatePanelValues(bigPit1OnHoldPeriodFields);
    await dlgResource.clickOK();

    // Edit SC1 resource
    sc1ResourceRow = await listResourceGroup.getRowByValueInHierarchy(
      [{ columnID: ListResourceGroupChildColumn.Name, value: ResourceName.Sc1 }],
      [[{ columnID: ListResourceGroupParentColumn.Name, value: ResourceGroupName.Scalping }]],
    );
    dlgResource = await listResourceGroup.openDialogResource(ActionTriggerType.ContextMenu, sc1ResourceRow);
    await dlgResource.pnlOnHoldPeriod.switchTo();
    await dlgResource.pnlOnHoldPeriod.updatePanelValues(sc1OnHoldPeriodFields);
    await dlgResource.clickOK();
  });

  it('Step 3: Go to tab "Develop" and select "Manage Demo" action button.', async () => {
    formManageDemo = await abpDevelop.openManageDemoForm();
    expect(await formManageDemo.isVisible()).toBe(true, LogMessage.form_notVisible(await formManageDemo.getTitle()));
  });

  it('Step 4: Right click on the demo scenario list and select "Save as". In the dialog select Category: Test demo. Give the new scenario the name Aluminum_OnHold and press OK.', async () => {
    // Select Sales Demo in Demo Category list
    let demoCategoryRow = await formManageDemo.listDemoCategory.getRowByCellValue(ListDemoCategoryColumn.Name, DemoCategory.SalesDemo);
    await formManageDemo.listDemoCategory.selectRows([demoCategoryRow]);

    // Right click on the demo scenario list and select "Save as"
    await formManageDemo.listDemoScenario.waitForDataReady();
    const demoScenarioRow = await formManageDemo.listDemoScenario.getRowByCellValue(ListDemoScenarioColumn.Name, DemoScenario.AluminumHotRolling);
    const dlgCreateEditDemoScenario = await formManageDemo.listDemoScenario.openDialogCreateEditDemoScenario(demoScenarioRow);
    // In the dialog select Category: Test demo. Give the new scenario the name Aluminum_OnHold and press OK.
    await dlgCreateEditDemoScenario.updateDialogValues({ demoCategory: DemoCategory.TestDemo, demoScenarioName: DemoScenario.AluminumOnHold });
    await dlgCreateEditDemoScenario.clickOK();

    // Verify new scenario aluminum_OnHold is created
    demoCategoryRow = await formManageDemo.listDemoCategory.getRowByCellValue(ListDemoCategoryColumn.Name, DemoCategory.TestDemo);
    await formManageDemo.listDemoCategory.selectRows([demoCategoryRow]);
    const isAluminumOnHoldExisted = await formManageDemo.listDemoScenario.hasRow([{ columnID: ListDemoScenarioColumn.Name, value: DemoScenario.AluminumOnHold }]);
    expect(isAluminumOnHoldExisted).toBe(true, LogMessage.row_notFound(DemoScenario.AluminumOnHold));
  });

  it('Step 5: Import Aluminum hot rolling sales demo and verify on hold horizons are removed.', async () => {
    // Select Sales Demo in Demo Category list
    const demoCategoryRow = await formManageDemo.listDemoCategory.getRowByCellValue(ListDemoCategoryColumn.Name, DemoCategory.SalesDemo);
    await formManageDemo.listDemoCategory.selectRows([demoCategoryRow]);

    // Start Aluminum hot rolling sales demo
    await formManageDemo.listDemoScenario.waitForDataReady();
    const demoScenarioRow = await formManageDemo.listDemoScenario.getRowByCellValue(ListDemoScenarioColumn.Name, DemoScenario.AluminumHotRolling);
    await formManageDemo.listDemoScenario.startDemoScenario(demoScenarioRow);

    await formManageDemo.close();

    // Verify Heating resource group has no OnHold Period
    const dlgResourceGroup = await listResourceGroup.openDialogResourceGroup(ActionTriggerType.ContextMenu, heatingResourceGroupRow);
    await dlgResourceGroup.pnlTimeHorizons.switchTo();
    let feedback = await dlgResourceGroup.pnlTimeHorizons.verifyPanelValues(resourceGroupWithoutOnHold);
    expect(feedback.length).toBe(0, feedback);
    await dlgResourceGroup.clickOK();

    // Verify BigPit1 resource has no OnHold Period
    let dlgResource = await listResourceGroup.openDialogResource(ActionTriggerType.ContextMenu, bigPit1ResourceRow);
    await dlgResource.pnlOnHoldPeriod.switchTo();
    feedback = await dlgResource.pnlOnHoldPeriod.verifyPanelValues(resourceWithoutOnHold);
    expect(feedback.length).toBe(0, feedback);
    await dlgResource.clickOK();

    // Verify SC1 resource has no OnHold Period
    dlgResource = await listResourceGroup.openDialogResource(ActionTriggerType.ContextMenu, sc1ResourceRow);
    await dlgResource.pnlOnHoldPeriod.switchTo();
    feedback = await dlgResource.pnlOnHoldPeriod.verifyPanelValues(resourceWithoutOnHold);
    expect(feedback.length).toBe(0, feedback);
    await dlgResource.clickOK();
  });

  it('Step 6: Import Aluminum_OnHold test demo and Aluminum_OnHold demo is loaded and on hold horizons are visible again as in step 2.', async () => {
    await appScheduler.switchToDemoScenario(DemoCategory.TestDemo, DemoScenario.AluminumOnHold);

    // Verify Heating resource group has no OnHold Period
    const dlgResourceGroup = await listResourceGroup.openDialogResourceGroup(ActionTriggerType.ContextMenu, heatingResourceGroupRow);
    await dlgResourceGroup.pnlTimeHorizons.switchTo();
    let feedback = await dlgResourceGroup.pnlTimeHorizons.verifyPanelValues(heatingTimeHorizonFields);
    expect(feedback.length).toBe(0, feedback);
    await dlgResourceGroup.clickOK();

    // Verify BigPit1 resource has no OnHold Period
    let dlgResource = await listResourceGroup.openDialogResource(ActionTriggerType.ContextMenu, bigPit1ResourceRow);
    await dlgResource.pnlOnHoldPeriod.switchTo();
    feedback = await dlgResource.pnlOnHoldPeriod.verifyPanelValues(bigPit1OnHoldPeriodFields);
    expect(feedback.length).toBe(0, feedback);
    await dlgResource.clickOK();

    // Verify SC1 resource has no OnHold Period
    dlgResource = await listResourceGroup.openDialogResource(ActionTriggerType.ContextMenu, sc1ResourceRow);
    await dlgResource.pnlOnHoldPeriod.switchTo();
    feedback = await dlgResource.pnlOnHoldPeriod.verifyPanelValues(sc1OnHoldPeriodFields);
    expect(feedback.length).toBe(0, feedback);
    await dlgResource.clickOK();
  });
});
