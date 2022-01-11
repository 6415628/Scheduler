/**
 * @file        TD002183
 * @description TD002183 - A firm planned order that has status of ready for release is marked as released after publishing its schedule
 * @author      Kwa Lay Yean
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { MPSIntegration } from '../libsch/data/data.configureintegration';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { WorkOrder } from '../libsch/data/data.workorder';
import { ImgLifecycleState, ImgDeliveryStatus, ImgReleasedBy } from '../libsch/forms/form.workorders';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { LogMessageSch } from '../libsch/logmessagesch';
import { QToastType } from '../e2elib/lib/src/pageobjects/toast/toastmessage.component';
import { PublishScheduleToastMessage } from '../libsch/actionbarpages/abp.data';

describe('TD002183 - A firm planned order that has status of ready for release is marked as released after publishing its schedule', () => {
  let appScheduler = AppScheduler.getInstance();
  let bagA3: ListRow;
  let listWorkOrders = appScheduler.viewManageOrders.formWorkOrders.listWorkOrders;

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

  it('Step 2: In the work order list, verify that BagA-3 is marked as ready for release but it is not yet released', async () => {
    bagA3 = await listWorkOrders.getWorkOrder(WorkOrder.BagA_3);
    // Verify firm planned orders BagA-3 is already marked for released.
    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagA3, true)).toBe(
      ImgLifecycleState.MarkedForReleased,
      LogMessageSch.workOrder_notMarkedForRelease(WorkOrder.BagA_3),
    );
    // Verify firm planned order BagA-3 is explicitly marked for released by user
    expect(await listWorkOrders.getCellValueFromRow(ImgReleasedBy.ColumnIndex, bagA3, true)).toBe(
      ImgReleasedBy.MarkedByUser,
      `${WorkOrder.BagA_3} should be explicitly marked for release by user.`,
    );
  });

  it('Step 3: In the work order list, verify work order BagA-3 is not scheduled yet', async () => {
    expect(await listWorkOrders.getCellValueFromRow(ImgDeliveryStatus.ColumnIndex, bagA3, true)).toBe(ImgDeliveryStatus.Late, `${WorkOrder.BagA_3} should not be scheduled yet.`);
  });

  it('Step 4: Go to Data action bar, click on button Publish Schedule.', async () => {
    const toast = await appScheduler.abpData.publishSchedule();
    const expToastMessage = PublishScheduleToastMessage.Success;

    // Verify success toast is popped up
    expect(await toast.verifyLastToastType(QToastType.SUCCESS)).toBe(true, 'Expected: Success toast box should be popped up for successful publish.');

    // Verify toast message
    const toastMsg = await toast.getLastToastMessage();
    expect(toastMsg).toBe(expToastMessage, LogMessageSch.value_notMatched(expToastMessage, toastMsg));

    // Close toast message box
    await toast.closeLastToast();
  });

  it('Step 5: Verify that BagA-3 is released to external system.', async () => {
    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagA3, true)).toBe(
      ImgLifecycleState.BeenReleasedToExternal,
      LogMessageSch.workOrder_notReleasedToExternalSystem(WorkOrder.BagA_3),
    );
  });
});
