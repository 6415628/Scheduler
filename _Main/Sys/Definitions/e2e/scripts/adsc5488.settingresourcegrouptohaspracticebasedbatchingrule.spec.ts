/**
 * @file        ADSC-5488
 * @description Setting a resource group to has practice based batching rule
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { LogMessage } from '../libappbase/logmessage';
import { ActionTriggerType } from '../libappbase/utils';
import { AppScheduler } from '../libsch/appsch';
import { OrderNr } from '../libsch/data/data.order';
import { ResourceGroupName, ResourceName } from '../libsch/data/data.resource';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { DialogResourceGroup, InputResourceGroupCharacteristicsFields } from '../libsch/dialogs/resourcegroup';
import { ListResourceGroupParentColumn } from '../libsch/forms/form.productionenvironment';
import { ListOperationColumn, ListOperations, OperationPrecondition } from '../libsch/forms/workordersandoperations';
import { LogMessageSch } from '../libsch/logmessagesch';

describe('ADSC-5488, Setting a resource group to has practice based batching rule', () => {
  const appScheduler = AppScheduler.getInstance();

  const viewConfigureProduction = appScheduler.viewConfigureProduction;
  const formProductionEnvironment = viewConfigureProduction.formProductionEnvironment;
  const listResourceGroup = formProductionEnvironment.listResourceGroup;
  let dlgResourceGroup: DialogResourceGroup;
  const viewSchedule = appScheduler.viewSchedule;
  const formWorkOrdersAndOperation = viewSchedule.formWorkOrdersAndOperation;
  const pnlOperations = formWorkOrdersAndOperation.pnlOperations;
  const listOperations = pnlOperations.listOperations;
  const cbAllowedOperation = pnlOperations.cbAllowedOperation;
  const formResourceSchedule = viewSchedule.formResourceSchedule;
  const gcResourceSchedule = formResourceSchedule.pnlScheduleOverview.gcResourceSchedule;
  const abpSchedule = appScheduler.abpSchedule;

  const expectedCharacteristicsFieldsBeforeEdit: InputResourceGroupCharacteristicsFields = {
    hasPractice: true,
  };
  const updatedCharacteristicsFields: InputResourceGroupCharacteristicsFields = {
    hasPractice: false,
  };
  const filter10041 = `${ListOperationColumn.OrderNrFilter} = ${OrderNr._10041}`;
  const filter10064 = `${ListOperationColumn.OrderNrFilter} = ${OrderNr._10064}`;
  const filter10132 = `${ListOperationColumn.OrderNrFilter} = ${OrderNr._10132}`;
  const filter10003 = `${ListOperationColumn.OrderNrFilter} = ${OrderNr._10003}`;
  const filterTerms = `${filter10041} ${filter10064} ${filter10132} ${filter10003}`;
  const expScheduleNotCommonPracticeOperationPreconMsg = OperationPrecondition.ScheduleNotCommonPractice;

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
    await appScheduler.switchToDemoScenario(DemoCategory.SalesDemo, DemoScenario.AluminumHotRolling);
  });

  afterAll(async () => {
    await viewSchedule.reset();
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

  it('Step 2: Edit Heating resource group. Verify that Has practice check box is checked.', async () => {
    // Edit Heating resource group
    const heatingResourceGroupRow = await listResourceGroup.getRowByCellValue(ListResourceGroupParentColumn.Name, ResourceGroupName.Heating);
    dlgResourceGroup = await listResourceGroup.openDialogResourceGroup(ActionTriggerType.ContextMenu, heatingResourceGroupRow);
    expect(await dlgResourceGroup.isVisible()).toBe(true, LogMessage.dialog_notVisible(await dlgResourceGroup.getTitle()));

    // Verify that Has practice check box is checked
    const feedback = await dlgResourceGroup.pnlCharacteristics.verifyDialogPanelValues(expectedCharacteristicsFieldsBeforeEdit);
    expect(feedback.length).toBe(0, feedback);

    await dlgResourceGroup.clickOK();
  });

  it('Step 3: Go to Scheduling view. Select some(4-5) heating operations which have different practices. Plan them on one of the heating resources. Verify that a soft precondition warns user that selected operations have different practices.', async () => {
    await viewSchedule.switchTo();
    expect(await formResourceSchedule.isVisible()).toBe(true, LogMessage.form_notVisible(await formResourceSchedule.getTitle()));
    expect(await formWorkOrdersAndOperation.isVisible()).toBe(true, LogMessage.form_notVisible(await formWorkOrdersAndOperation.getTitle()));
    await pnlOperations.switchTo();

    // Show Practice Column in the Operation list
    await listOperations.configureColumns(ListOperations.abpList, ListOperationColumn.Practice);

    // Filter heating operations of 4 orders with different Practice
    const dialogFilterManager = await listOperations.openFilterDialogOnColumn(ListOperationColumn.OrderNr);
    await dialogFilterManager.filter(filterTerms);

    // Select BigPit1 resource and toggle on "Allowed on resource" checkbox
    const gcBigPit1Row = (await gcResourceSchedule.getRowsByTitle(ResourceName.BigPit1))[0];
    await gcResourceSchedule.clickRow(gcBigPit1Row);
    await cbAllowedOperation.toggle(true);

    // Verify 4 operations with different practice are existed in operation list
    const heatingOperations = await listOperations.getAllRows();
    expect(heatingOperations.length).toBe(4, LogMessageSch.list_numOfRowsNotMatched('Operations', 4, heatingOperations.length));

    // Verify Plan on Selected Button is disabled with correct precondition
    await abpSchedule.click();
    await listOperations.selectRows(heatingOperations);
    let [isClickable, tooltip] = await abpSchedule.btnPlanOnSelected.verifyIsButtonClickable();
    expect(isClickable).toBe(false, LogMessage.btn_isEnabled(await abpSchedule.btnPlanOnSelected.getComponentLabel()));
    expect(tooltip).toContain(expScheduleNotCommonPracticeOperationPreconMsg, LogMessageSch.tooltip_notContains(expScheduleNotCommonPracticeOperationPreconMsg, tooltip));
  });

  it('Step 4: Go to production environment again. Edit heating resource group. Uncheck has practice checkbox.', async () => {
    await viewConfigureProduction.switchTo();

    // Edit heating resource group
    const heatingResourceGroupRow = await listResourceGroup.getRowByCellValue(ListResourceGroupParentColumn.Name, ResourceGroupName.Heating);
    dlgResourceGroup = await listResourceGroup.openDialogResourceGroup(ActionTriggerType.ContextMenu, heatingResourceGroupRow);

    // Toggle off Has practice checkbox
    await dlgResourceGroup.pnlCharacteristics.updateDialogValues(updatedCharacteristicsFields);

    // Verify that Has practice checkbox is toggled on
    const feedback = await dlgResourceGroup.pnlCharacteristics.verifyDialogPanelValues(updatedCharacteristicsFields);
    expect(feedback.length).toBe(0, feedback);

    await dlgResourceGroup.clickOK();
  });

  it('Step 5: Repeat step 3. Verify that there is no precondition this time.', async () => {
    await viewSchedule.switchTo();
    await pnlOperations.switchTo();

    const dialogFilterManager = await listOperations.openFilterDialogOnColumn(ListOperationColumn.OrderNr);
    await dialogFilterManager.filter(filterTerms);

    await cbAllowedOperation.toggle(true);

    const heatingOperations = await listOperations.getAllRows();
    await listOperations.selectRows(heatingOperations);

    let [isClickable, tooltip] = await abpSchedule.btnPlanOnSelected.verifyIsButtonClickable();
    expect(isClickable).toBe(true, LogMessage.btn_notClickable(await abpSchedule.btnPlanOnSelected.getComponentLabel(), tooltip));
  });
});
