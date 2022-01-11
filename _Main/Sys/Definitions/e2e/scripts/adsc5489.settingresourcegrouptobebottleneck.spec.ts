/**
 * @file        ADSC-5489
 * @description Setting a resource group to be bottleneck resource group
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { LogMessage } from '../libappbase/logmessage';
import { ResourceGroupName } from '../libsch/data/data.resource';
import { ActionTriggerType } from '../libappbase/utils';
import { DialogResourceGroup, InputResourceGroupCharacteristicsFields } from '../libsch/dialogs/resourcegroup';
import { ListResourceGroupParentColumn } from '../libsch/forms/form.productionenvironment';

describe('ADSC-5489, Setting a resource group to be bottleneck resource group', () => {
  const appScheduler = AppScheduler.getInstance();

  const viewConfigureProduction = appScheduler.viewConfigureProduction;
  const formProductionEnvironment = viewConfigureProduction.formProductionEnvironment;
  const listResourceGroup = formProductionEnvironment.listResourceGroup;
  let dlgResourceGroup: DialogResourceGroup;
  const formKPIDashboard = appScheduler.formKPIDashboard;

  const characteristicsBottleneckOn: InputResourceGroupCharacteristicsFields = {
    isBottleneck: true,
  };
  const characteristicsBottleneckOff: InputResourceGroupCharacteristicsFields = {
    isBottleneck: false,
  };

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
    await appScheduler.switchToDemoScenario(DemoCategory.SalesDemo, DemoScenario.AluminumHotRolling);
  });

  afterAll(async () => {
    // Reset board to close docked panels
    await appScheduler.abpHome.resetBoard();
    await appScheduler.cleanUpDataset();
    await appScheduler.logout();
  });

  afterEach(async () => {
    await appScheduler.checkToastMessage();
  });

  it('Step 1: Open view Data -> Configure Production', async () => {
    await viewConfigureProduction.switchTo();
    expect(await formProductionEnvironment.isVisible()).toBe(true, LogMessage.form_notVisible(await formProductionEnvironment.getTitle()));
  });

  it('Step 2: Edit Hot rolling resource group. Verify that it is bottleneck resource group.', async () => {
    // Edit HotRolling resource group
    const heatingResourceGroupRow = await listResourceGroup.getRowByCellValue(ListResourceGroupParentColumn.Name, ResourceGroupName.HotRolling);
    dlgResourceGroup = await listResourceGroup.openDialogResourceGroup(ActionTriggerType.ContextMenu, heatingResourceGroupRow);
    expect(await dlgResourceGroup.isVisible()).toBe(true, LogMessage.dialog_notVisible(await dlgResourceGroup.getTitle()));

    // Verify that is bottleneck checkbox is checked
    const feedback = await dlgResourceGroup.pnlCharacteristics.verifyDialogPanelValues(characteristicsBottleneckOn);
    expect(feedback.length).toBe(0, feedback);

    await dlgResourceGroup.clickOK();
  });

  it('Step 3: Uncheck Is bottleneck checkbox. Verify that productivity KPI decreased from 88% to 0.', async () => {
    // Open KPI Dashboard
    await appScheduler.abpFixed.openKPIDashboard();
    expect(await formKPIDashboard.isVisible()).toBe(true, LogMessage.form_notVisible(await formKPIDashboard.getTitle()));

    // Get Productivity KPI
    let productivityKPIValue = await formKPIDashboard.gaugeKPIProductivity.getValue(0);
    expect(productivityKPIValue).toBe('88', LogMessage.value_notMatched('88', productivityKPIValue));

    // Edit HotRolling resource group
    const heatingResourceGroupRow = await listResourceGroup.getRowByCellValue(ListResourceGroupParentColumn.Name, ResourceGroupName.HotRolling);
    dlgResourceGroup = await listResourceGroup.openDialogResourceGroup(ActionTriggerType.ContextMenu, heatingResourceGroupRow);

    // Verify that Is bottleneck checkbox is toggled on
    const feedback = await dlgResourceGroup.pnlCharacteristics.verifyDialogPanelValues(characteristicsBottleneckOn);
    expect(feedback.length).toBe(0, feedback);

    // Toggle off Is bottleneck checkbox
    await dlgResourceGroup.pnlCharacteristics.updateDialogValues(characteristicsBottleneckOff);

    await dlgResourceGroup.clickOK();

    // Verify that productivity KPI decreased from 88% to 0
    productivityKPIValue = await formKPIDashboard.gaugeKPIProductivity.getValue(0);
    expect(productivityKPIValue).toBe('0', LogMessage.value_notMatched('0', productivityKPIValue));
  });

  it('Step 4: Edit welding resource group. Verify that Is bottleneck checkbox is unchecked.', async () => {
    // Edit welding resource group
    const heatingResourceGroupRow = await listResourceGroup.getRowByCellValue(ListResourceGroupParentColumn.Name, ResourceGroupName.Welding);
    dlgResourceGroup = await listResourceGroup.openDialogResourceGroup(ActionTriggerType.ContextMenu, heatingResourceGroupRow);

    // Verify that Is bottleneck checkbox is toggled off
    let feedback = await dlgResourceGroup.pnlCharacteristics.verifyDialogPanelValues(characteristicsBottleneckOff);
    expect(feedback.length).toBe(0, feedback);
  });

  it('Step 5: Check Is bottleneck checkbox. Verify that productivity KPI increased to 51%.', async () => {
    // Toggle on Is bottleneck checkbox
    await dlgResourceGroup.pnlCharacteristics.updateDialogValues(characteristicsBottleneckOn);
    await dlgResourceGroup.clickOK();

    // Verify that productivity KPI increased to 51%
    const productivityKPIValue = await formKPIDashboard.gaugeKPIProductivity.getValue(0);
    expect(productivityKPIValue).toBe('51', LogMessage.value_notMatched('51', productivityKPIValue));
  });
});
