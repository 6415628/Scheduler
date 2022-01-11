/**
 * @file        TD002185
 * @description TD002185 - Exporting multiple firm planned orders where some of them are marked for release and some of them are scheduled in frozen horizon
 * @author      Kwa Lay Yean
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { MPSIntegration } from '../libsch/data/data.configureintegration';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { ImgLifecycleState, ImgDeliveryStatus, ImgReleasedBy } from '../libsch/forms/form.workorders';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { WorkOrder, OperationType } from '../libsch/data/data.workorder';
import { ImgIsPlanned, ListOperationColumn } from '../libsch/forms/workordersandoperations';
import { LogMessageSch } from '../libsch/logmessagesch';
import { PrintingResourceIndex } from '../libsch/data/data.schedule';
import { ActionTriggerType } from '../libappbase/utils';
import { QToastType } from '../e2elib/lib/src/pageobjects/toast/toastmessage.component';
import { ButtonType } from '../libappbase/toastglobal';
import { PublishScheduleToastMessage } from '../libsch/actionbarpages/abp.data';
import { QConsole } from '../e2elib/lib/src/helper/qconsole';

describe('TD002185 - Exporting multiple firm planned orders where some of them are marked for release and some of them are scheduled in frozen horizon', () => {
  let appScheduler = AppScheduler.getInstance();
  let bagA4: ListRow;
  let bagB4: ListRow;
  let bagB5: ListRow;
  let bagA4Printing: ListRow;
  let bagA4Casing: ListRow;
  let bagB4Printing: ListRow;
  let listWorkOrders = appScheduler.viewManageOrders.formWorkOrders.listWorkOrders;
  let formWorkOrdersAndOperation = appScheduler.viewSchedule.formWorkOrdersAndOperation;
  let pnlOperations = formWorkOrdersAndOperation.pnlOperations;
  let listOperation = formWorkOrdersAndOperation.pnlOperations.listOperations;
  let formResourceSchedule = appScheduler.viewSchedule.formResourceSchedule;
  let listResource = formResourceSchedule.pnlResourceSequenceDetails.listResource;

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
    await appScheduler.switchToDemoScenario(DemoCategory.TestDemo, DemoScenario.ScErpIntegrationReleaseFirmPlannedOrder);
  });

  afterAll(async () => {
    await appScheduler.abpFixed.btnUndo.click();
    await appScheduler.cleanUpDataset();
    await appScheduler.logout();
  });

  afterEach(async () => {
    await appScheduler.checkToastMessage();
  });

  // ================================ IMPORTANT ===================================
  // ONLY needed when running in autotest enviroment
  // Comment out this setup when running locally
  // ==============================================================================
  it('Setup: Switch to Configure Integration view.', async () => {
    let mpsExportPath = MPSIntegration.MpsExportPath;

    await appScheduler.viewIntegration.switchTo();

    // Set new values
    const formIntegration = appScheduler.viewIntegration.formIntegrationConfiguration;
    const panelIntegration = formIntegration.pnlMPSIntegration;
    await formIntegration.setMPSExportPath(mpsExportPath);

    // Verify the path is set
    const mpsActPath = await panelIntegration.efMPSExportPath.getText();
    expect(mpsActPath).toBe(mpsExportPath, LogMessageSch.value_notMatched(mpsExportPath, mpsActPath));
  });

  it('Step 1: Go to Manage Work Orders action bar, open view Manage Orders.', async () => {
    await appScheduler.viewManageOrders.switchTo();
    expect(await appScheduler.viewManageOrders.formWorkOrders.isVisible()).toBe(true, LogMessageSch.form_notVisible('Work Orders'));
  });

  it(`Step 2: In the work order list, verify ${WorkOrder.BagA_4} work order is scheduled in frozen horizon so it is marked for release but not released yet`, async () => {
    bagA4 = await listWorkOrders.getWorkOrder(WorkOrder.BagA_4);

    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagA4, true)).toBe(
      ImgLifecycleState.MarkedForReleased,
      LogMessageSch.workOrder_notMarkedForRelease(WorkOrder.BagA_4),
    );

    expect(await listWorkOrders.getCellValueFromRow(ImgReleasedBy.ColumnIndex, bagA4, true)).toBe(
      ImgReleasedBy.MarkedAutomatically,
      LogMessageSch.workOrder_notScheduledInFrozenHorizon(WorkOrder.BagA_4),
    );
  });

  it(`Step 3: In the work order list, verify ${WorkOrder.BagB_4} & ${WorkOrder.BagB_5} are not scheduled, not marked for release and not released`, async () => {
    bagB4 = await listWorkOrders.getWorkOrder(WorkOrder.BagB_4);
    bagB5 = await listWorkOrders.getWorkOrder(WorkOrder.BagB_5);

    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagB4, true)).toBe(
      ImgLifecycleState.CreatedButNotReleased,
      LogMessageSch.workOrder_markedForRelease(WorkOrder.BagB_4),
    );

    expect(await listWorkOrders.getCellValueFromRow(ImgDeliveryStatus.ColumnIndex, bagB4, true)).toBe(
      ImgDeliveryStatus.NotPlanned,
      LogMessageSch.workOrder_scheduled(WorkOrder.BagB_4),
    );

    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagB5, true)).toBe(
      ImgLifecycleState.CreatedButNotReleased,
      LogMessageSch.workOrder_markedForRelease(WorkOrder.BagB_5),
    );

    expect(await listWorkOrders.getCellValueFromRow(ImgDeliveryStatus.ColumnIndex, bagB5, true)).toBe(
      ImgDeliveryStatus.NotPlanned,
      LogMessageSch.workOrder_scheduled(WorkOrder.BagB_5),
    );
  });

  it('Step 4: Go to Data action bar, click on button Publish Schedule.', async () => {
    const toast = await appScheduler.abpData.publishSchedule();
    const expToastMessage = PublishScheduleToastMessage.Success;

    // Verify success toast is popped up
    expect(await toast.verifyLastToastType(QToastType.SUCCESS)).toBe(true, LogMessageSch.toast_notSuccess('successful publish'));

    // Verify toast message
    const toastMsg = await toast.getLastToastMessage();
    expect(toastMsg).toBe(expToastMessage, LogMessageSch.value_notMatched(expToastMessage, toastMsg));

    // Close toast message box
    await toast.closeLastToast();
  });

  it(`Step 5: Verify that only work order ${WorkOrder.BagA_4} is released, ${WorkOrder.BagB_4} & ${WorkOrder.BagB_5} are not released.`, async () => {
    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagA4, true)).toBe(
      ImgLifecycleState.BeenReleasedToExternal,
      LogMessageSch.workOrder_notReleasedToExternalSystem(WorkOrder.BagA_4),
    );

    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagB4, true)).toBe(
      ImgLifecycleState.CreatedButNotReleased,
      LogMessageSch.workOrder_markedForRelease(WorkOrder.BagB_4),
    );

    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagB5, true)).toBe(
      ImgLifecycleState.CreatedButNotReleased,
      LogMessageSch.workOrder_markedForRelease(WorkOrder.BagB_5),
    );
  });

  it('Step 6: Switch to Scheduling view and select Operations tab.', async () => {
    await appScheduler.viewSchedule.switchTo();
    expect(await formWorkOrdersAndOperation.isVisible()).toBe(true, LogMessageSch.form_notVisible('Work Orders and Operation'));

    await pnlOperations.switchTo();

    expect(await listOperation.isVisible()).toBe(true, LogMessageSch.list_notVisible('Operations'));
  });

  it(`Step 7: Verify ${WorkOrder.BagA_4} printing operation in frozen horizon`, async () => {
    await pnlOperations.switchTo();
    let dialogFilterManager = await listOperation.openFilterDialogOnColumn(ListOperationColumn.OrderNr);
    await dialogFilterManager.filter(WorkOrder.BagA_4);

    bagA4Printing = await listOperation.getRowByOrderNrAndOperationType(WorkOrder.BagA_4, OperationType.Printing);
    bagA4Casing = await listOperation.getRowByOrderNrAndOperationType(WorkOrder.BagA_4, OperationType.Casing);

    expect(await listOperation.getCellValueFromRow(ImgIsPlanned.ColumnIndex, bagA4Printing, true)).toBe(
      ImgIsPlanned.PlannedInFrozen,
      LogMessageSch.workOrderOperation_notScheduledInFrozenHorizon(WorkOrder.BagA_4, OperationType.Printing),
    );

    expect(await listOperation.getCellValueFromRow(ImgIsPlanned.ColumnIndex, bagA4Casing, true)).toBe(
      ImgIsPlanned.Planned,
      LogMessageSch.workOrderOperation_notScheduled(WorkOrder.BagA_4, OperationType.Casing),
    );
  });

  it(`Step 8: Unplan all operations for ${WorkOrder.BagA_4}`, async () => {
    const toastWarning = await listOperation.unplanFrozenOperation([bagA4Casing, bagA4Printing]);
    const expToastWarningMsg = 'One or more of the selection falls within the frozen period';

    // Verify warning toast is popped up
    expect(await toastWarning.verifyLastToastType(QToastType.WARNING)).toBe(true, LogMessageSch.toast_notWarning('cancel release'));

    // Verify toast message
    const frozenToastMsg = await toastWarning.getLastToastMessage();
    expect(frozenToastMsg).toContain(expToastWarningMsg, LogMessageSch.value_notMatched(expToastWarningMsg, frozenToastMsg));

    await toastWarning.clickToastButton(ButtonType.Yes);
    await QConsole.waitForScreenUpdate();

    expect(await listOperation.getCellValueFromRow(ImgIsPlanned.ColumnIndex, bagA4Printing, true)).toBe(
      ImgIsPlanned.NotPlanned,
      LogMessageSch.workOrderOperation_scheduled(WorkOrder.BagA_4, OperationType.Printing),
    );

    expect(await listOperation.getCellValueFromRow(ImgIsPlanned.ColumnIndex, bagA4Casing, true)).toBe(
      ImgIsPlanned.NotPlanned,
      LogMessageSch.workOrderOperation_scheduled(WorkOrder.BagA_4, OperationType.Casing),
    );
  });

  it(`Step 9: Switch back to view Manage Orders and verify ${WorkOrder.BagA_4} is no longer marked as release but is released externally`, async () => {
    await appScheduler.viewManageOrders.switchTo();
    expect(await appScheduler.viewManageOrders.formWorkOrders.isVisible()).toBe(true, LogMessageSch.form_notVisible('Work Orders'));

    // Need to re-assign after switching view
    bagA4 = await listWorkOrders.getWorkOrder(WorkOrder.BagA_4);

    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagA4, true)).toBe(
      ImgLifecycleState.BeenReleasedToExternal,
      LogMessageSch.workOrder_notReleasedToExternalSystem(WorkOrder.BagA_4),
    );

    expect(await listWorkOrders.getCellValueFromRow(ImgReleasedBy.ColumnIndex, bagA4, true)).toBe(
      ImgReleasedBy.NotMarked,
      LogMessageSch.workOrder_markedForRelease(WorkOrder.BagA_4),
    );
  });

  it('Step 10: Switch to Scheduling view and select Operations tab. Checked Allowed operation checkbox.', async () => {
    await appScheduler.viewSchedule.switchTo();
    expect(await formWorkOrdersAndOperation.isVisible()).toBe(true, LogMessageSch.form_notVisible('Work Orders and Operation'));

    await pnlOperations.switchTo();

    expect(await listOperation.isVisible()).toBe(true, LogMessageSch.list_notVisible('Operations'));

    const checkboxAllowedOperation = formWorkOrdersAndOperation.pnlOperations.cbAllowedOperation;

    await checkboxAllowedOperation.toggle(true);
    expect(await checkboxAllowedOperation.isChecked()).toBe(true, LogMessageSch.checkbox_notChecked('Allowed Operation'));
  });

  it('Step 11: Click on Resource Sequence Details tab on Resource Schedule form', async () => {
    const panelResourceSeqDetails = formResourceSchedule.pnlResourceSequenceDetails;

    await panelResourceSeqDetails.clickTab();

    expect(await listResource.isVisible()).toBe(true, LogMessageSch.list_notVisible('Resource'));
  });

  it(`Step 12: Select resource ${PrintingResourceIndex._1102} in Resource List`, async () => {
    let resourceRow = await listResource.getRowByIndex(PrintingResourceIndex._1102);
    await resourceRow.leftClick();

    const allRows = await listOperation.getAllRows();
    let allRowsOperationType = await listOperation.rowHasValidValue(allRows, ListOperationColumn.OperationType, [OperationType.Printing]);
    expect(allRowsOperationType).toBe(true, `All cell values in column ${ListOperationColumn.OperationType} in ${listOperation.componentName} should be ${OperationType.Printing}`);
  });

  it(`Step 13: Schedule the ${OperationType.Printing} operation of firm planned order ${WorkOrder.BagB_4} in printing resource ${PrintingResourceIndex._1102}`, async () => {
    bagB4Printing = await listOperation.getRowByOrderNrAndOperationType(WorkOrder.BagB_4, OperationType.Printing);
    await listOperation.planOnSelected(ActionTriggerType.ContextMenu, [bagB4Printing]);

    expect(await listOperation.getCellValueFromRow(ImgIsPlanned.ColumnIndex, bagB4Printing, true)).toBe(
      ImgIsPlanned.PlannedInFrozen,
      LogMessageSch.workOrderOperation_notScheduledInFrozenHorizon(WorkOrder.BagB_4, OperationType.Printing),
    );
  });

  it(`Step 14: Switch back to view Manage Orders and verify ${WorkOrder.BagB_4} is automatically marked for release`, async () => {
    await appScheduler.viewManageOrders.switchTo();
    expect(await appScheduler.viewManageOrders.formWorkOrders.isVisible()).toBe(true, LogMessageSch.form_notVisible('Work Orders'));

    // Need to re-assign after switching view
    bagB4 = await listWorkOrders.getWorkOrder(WorkOrder.BagB_4);

    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagB4, true)).toBe(
      ImgLifecycleState.MarkedForReleased,
      LogMessageSch.workOrder_notMarkedForRelease(WorkOrder.BagB_4),
    );

    expect(await listWorkOrders.getCellValueFromRow(ImgReleasedBy.ColumnIndex, bagB4, true)).toBe(
      ImgReleasedBy.MarkedAutomatically,
      LogMessageSch.workOrder_notMarkedForReleaseAuto(WorkOrder.BagB_4),
    );
  });

  it(`Step 15: Select all three work orders ${WorkOrder.BagA_4}, ${WorkOrder.BagB_4} and ${WorkOrder.BagB_5} then marked for released`, async () => {
    // Need to re-assign after switching view
    bagA4 = await listWorkOrders.getWorkOrder(WorkOrder.BagA_4);
    bagB5 = await listWorkOrders.getWorkOrder(WorkOrder.BagB_5);

    await listWorkOrders.markWorkOrderAsRelease(ActionTriggerType.Button, [bagA4, bagB4, bagB5]);

    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagA4, true)).toBe(
      ImgLifecycleState.BeenReleasedToExternal,
      LogMessageSch.workOrder_notReleasedToExternalSystem(WorkOrder.BagA_4),
    );

    expect(await listWorkOrders.getCellValueFromRow(ImgReleasedBy.ColumnIndex, bagA4, true)).toBe(
      ImgReleasedBy.MarkedByUser,
      LogMessageSch.workOrder_notMarkedForRelease(WorkOrder.BagA_4),
    );

    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagB4, true)).toBe(
      ImgLifecycleState.MarkedForReleased,
      LogMessageSch.workOrder_notMarkedForRelease(WorkOrder.BagB_4),
    );

    expect(await listWorkOrders.getCellValueFromRow(ImgReleasedBy.ColumnIndex, bagB4, true)).toBe(
      ImgReleasedBy.MarkedByUser,
      LogMessageSch.workOrder_notMarkedForRelease(WorkOrder.BagB_4),
    );

    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagB5, true)).toBe(
      ImgLifecycleState.MarkedForReleased,
      LogMessageSch.workOrder_notMarkedForRelease(WorkOrder.BagB_5),
    );

    expect(await listWorkOrders.getCellValueFromRow(ImgReleasedBy.ColumnIndex, bagB5, true)).toBe(
      ImgReleasedBy.MarkedByUser,
      LogMessageSch.workOrder_notMarkedForRelease(WorkOrder.BagB_5),
    );
  });

  it('Step 16: Go to Data action bar, click on button Publish Schedule.', async () => {
    const toast = await appScheduler.abpData.publishSchedule();

    // Verify success toast is popped up
    expect(await toast.verifyLastToastType(QToastType.SUCCESS)).toBe(true, LogMessageSch.toast_notSuccess('successful publish'));

    // Close toast message box
    await toast.closeLastToast();
  });

  it(`Step 17: Verify that work order ${WorkOrder.BagA_4}, ${WorkOrder.BagB_4} & ${WorkOrder.BagB_5} are released externally.`, async () => {
    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagA4, true)).toBe(
      ImgLifecycleState.BeenReleasedToExternal,
      LogMessageSch.workOrder_notReleasedToExternalSystem(WorkOrder.BagA_4),
    );

    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagB4, true)).toBe(
      ImgLifecycleState.BeenReleasedToExternal,
      LogMessageSch.workOrder_notReleasedToExternalSystem(WorkOrder.BagB_4),
    );

    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagB5, true)).toBe(
      ImgLifecycleState.BeenReleasedToExternal,
      LogMessageSch.workOrder_notReleasedToExternalSystem(WorkOrder.BagB_5),
    );
  });
});
