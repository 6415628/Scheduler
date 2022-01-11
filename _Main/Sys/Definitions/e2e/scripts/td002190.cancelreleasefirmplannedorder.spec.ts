/**
 * @file        TD002190
 * @description TD002190 - Cancel release - single firm planned order
 * @author      Kwa Lay Yean
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { MPSIntegration } from '../libsch/data/data.configureintegration';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { WorkOrder } from '../libsch/data/data.workorder';
import { LogMessageSch } from '../libsch/logmessagesch';
import { ActionTriggerType } from '../libappbase/utils';
import { QToastType } from '../e2elib/lib/src/pageobjects/toast/toastmessage.component';
import { ButtonType } from '../libappbase/toastglobal';
import { ImgLifecycleState, ImgReleasedBy } from '../libsch/forms/form.workorders';

describe('TD002190 - Cancel release - single firm planned order', () => {
  let appScheduler = AppScheduler.getInstance();
  let bagA1: ListRow;
  let listWorkOrders = appScheduler.viewManageOrders.formWorkOrders.listWorkOrders;

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
    await appScheduler.switchToDemoScenario(DemoCategory.TestDemo, DemoScenario.ScErpIntegrationCancelReleaseFirmPlannedOrder);
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

  it(`Step 2: In the work order list, verify ${WorkOrder.BagA_1} work order has already been released, and it was marked for release manually`, async () => {
    bagA1 = await listWorkOrders.getWorkOrder(WorkOrder.BagA_1);

    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagA1, true)).toBe(
      ImgLifecycleState.BeenReleasedToExternal,
      LogMessageSch.workOrder_notReleasedToExternalSystem(WorkOrder.BagA_1),
    );

    expect(await listWorkOrders.getCellValueFromRow(ImgReleasedBy.ColumnIndex, bagA1, true)).toBe(
      ImgReleasedBy.MarkedByUser,
      LogMessageSch.workOrder_notMarkedForRelease(WorkOrder.BagA_1),
    );
  });

  it(`Step 3: Select ${WorkOrder.BagA_1} and cancel release in schedule action bar then click no button in toast warning`, async () => {
    const toastCancel = await listWorkOrders.cancelReleasedWorkOrder(ActionTriggerType.Button, [bagA1]);
    const expToastCancelMsg = 'One or more selected work orders have been released already. Cancelling the release now will not stop work order release';

    // Verify warning toast is popped up
    expect(await toastCancel.verifyLastToastType(QToastType.WARNING)).toBe(true, LogMessageSch.toast_notWarning('cancel release'));

    // Verify toast message
    const cancelToastMsg = await toastCancel.getLastToastMessage();
    expect(cancelToastMsg).toContain(expToastCancelMsg, LogMessageSch.value_notMatched(expToastCancelMsg, cancelToastMsg));

    await toastCancel.clickToastButton(ButtonType.No);
  });

  it(`Step 4: Verify ${WorkOrder.BagA_1} work order is still marked for released, and it was marked for release manually`, async () => {
    bagA1 = await listWorkOrders.getWorkOrder(WorkOrder.BagA_1);

    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagA1, true)).toBe(
      ImgLifecycleState.BeenReleasedToExternal,
      LogMessageSch.workOrder_notReleasedToExternalSystem(WorkOrder.BagA_1),
    );

    expect(await listWorkOrders.getCellValueFromRow(ImgReleasedBy.ColumnIndex, bagA1, true)).toBe(
      ImgReleasedBy.MarkedByUser,
      LogMessageSch.workOrder_notMarkedForRelease(WorkOrder.BagA_1),
    );
  });

  it(`Step 5: Select ${WorkOrder.BagA_1} and cancel release in schedule action bar`, async () => {
    const toastCancel = await listWorkOrders.cancelReleasedWorkOrder(ActionTriggerType.ContextMenu, [bagA1]);

    // Verify warning toast is popped up
    expect(await toastCancel.verifyLastToastType(QToastType.WARNING)).toBe(true, LogMessageSch.toast_notWarning('cancel release'));

    await toastCancel.clickToastButton(ButtonType.Yes);
  });

  it(`Step 6: Verify ${WorkOrder.BagA_1} work order is no longer released, and no longer marked for release manually`, async () => {
    bagA1 = await listWorkOrders.getWorkOrder(WorkOrder.BagA_1);

    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagA1, true)).toBe(
      ImgLifecycleState.CreatedButNotReleased,
      LogMessageSch.workOrder_releasedToExternalSystem(WorkOrder.BagA_1),
    );

    expect(await listWorkOrders.getCellValueFromRow(ImgReleasedBy.ColumnIndex, bagA1, true)).toBe(
      ImgReleasedBy.NotMarked,
      LogMessageSch.workOrder_markedForRelease(WorkOrder.BagA_1),
    );
  });

  it('Step 7: Go to Data action bar, click on button Publish Schedule.', async () => {
    const toast = await appScheduler.abpData.publishSchedule();

    // Verify success toast is popped up
    expect(await toast.verifyLastToastType(QToastType.SUCCESS)).toBe(true, LogMessageSch.toast_notSuccess('successful publish'));

    // Close toast message box
    await toast.closeLastToast();
  });

  it(`Step 8: Verify ${WorkOrder.BagA_1} work order remained as not released, and not marked for release manually`, async () => {
    bagA1 = await listWorkOrders.getWorkOrder(WorkOrder.BagA_1);

    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagA1, true)).toBe(
      ImgLifecycleState.CreatedButNotReleased,
      LogMessageSch.workOrder_releasedToExternalSystem(WorkOrder.BagA_1),
    );

    expect(await listWorkOrders.getCellValueFromRow(ImgReleasedBy.ColumnIndex, bagA1, true)).toBe(
      ImgReleasedBy.NotMarked,
      LogMessageSch.workOrder_markedForRelease(WorkOrder.BagA_1),
    );
  });
});
