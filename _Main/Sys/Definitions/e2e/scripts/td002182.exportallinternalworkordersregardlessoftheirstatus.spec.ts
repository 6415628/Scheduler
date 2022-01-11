/**
 * @file        TD002182
 * @description TD002182 - Exporting all internal work orders regardless of their release status
 * @author      Kwa Lay Yean
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { MPSIntegration } from '../libsch/data/data.configureintegration';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { WorkOrder } from '../libsch/data/data.workorder';
import { ImgLifecycleState, ImgDeliveryStatus } from '../libsch/forms/form.workorders';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { LogMessageSch } from '../libsch/logmessagesch';
import { QToastType } from '../e2elib/lib/src/pageobjects/toast/toastmessage.component';
import { PublishScheduleToastMessage } from '../libsch/actionbarpages/abp.data';

describe('TD002182 - Exporting all internal work orders regardless of their release status', () => {
  let appScheduler = AppScheduler.getInstance();
  let bagA1: ListRow;
  let bagA2: ListRow;
  let bagB1: ListRow;
  let bagB2: ListRow;
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
    const mpsExportPath = MPSIntegration.MpsExportPath;

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

  it('Step 2: In the work order list, verify firm planned order BagA-1 and BagA-2 already marked to be released.', async () => {
    bagA1 = await listWorkOrders.getWorkOrder(WorkOrder.BagA_1);
    bagA2 = await listWorkOrders.getWorkOrder(WorkOrder.BagA_2);
    // Verify firm planned orders BagA-1 and BagA-2 are already marked for released.
    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagA1, true)).toBe(
      ImgLifecycleState.MarkedForReleased,
      LogMessageSch.workOrder_notMarkedForRelease(WorkOrder.BagA_1),
    );
    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagA2, true)).toBe(
      ImgLifecycleState.MarkedForReleased,
      LogMessageSch.workOrder_notMarkedForRelease(WorkOrder.BagA_2),
    );
  });

  it('Step 3: In the work order list, verify internal work orders BagB-1 and BagB-2 are not marked to be released.', async () => {
    bagB1 = await listWorkOrders.getWorkOrder(WorkOrder.BagB_1);
    bagB2 = await listWorkOrders.getWorkOrder(WorkOrder.BagB_2);
    // Verify internal work orders BagB-1 and BagB-2 are not marked to be released.
    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagB1, true)).toBe(
      ImgLifecycleState.CreatedButNotReleased,
      LogMessageSch.workOrder_markedForRelease(WorkOrder.BagB_1),
    );
    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagB2, true)).toBe(
      ImgLifecycleState.CreatedButNotReleased,
      LogMessageSch.workOrder_markedForRelease(WorkOrder.BagB_2),
    );
  });

  it('Step 4: Verify the work orders are scheduled.', async () => {
    expect(await listWorkOrders.getCellValueFromRow(ImgDeliveryStatus.ColumnIndex, bagA1, true)).toBe(
      ImgDeliveryStatus.Planned,
      LogMessageSch.workOrder_notScheduled(WorkOrder.BagA_1),
    );
    expect(await listWorkOrders.getCellValueFromRow(ImgDeliveryStatus.ColumnIndex, bagA2, true)).toBe(
      ImgDeliveryStatus.Planned,
      LogMessageSch.workOrder_notScheduled(WorkOrder.BagA_2),
    );
    expect(await listWorkOrders.getCellValueFromRow(ImgDeliveryStatus.ColumnIndex, bagB1, true)).toBe(
      ImgDeliveryStatus.Planned,
      LogMessageSch.workOrder_notScheduled(WorkOrder.BagB_1),
    );
    expect(await listWorkOrders.getCellValueFromRow(ImgDeliveryStatus.ColumnIndex, bagB2, true)).toBe(
      ImgDeliveryStatus.Planned,
      LogMessageSch.workOrder_notScheduled(WorkOrder.BagB_2),
    );
  });

  it('Step 5: Go to Data action bar, click on button Publish Schedule.', async () => {
    const toast = await appScheduler.abpData.publishSchedule();
    const expToastMessage = PublishScheduleToastMessage.Success;

    // Verify success toast is popped up
    expect(await toast.verifyLastToastType(QToastType.SUCCESS)).toBe(true, LogMessageSch.toast_notSuccess('Publish Schedule'));

    // Verify toast message
    const toastMsg = await toast.getLastToastMessage();
    expect(toastMsg).toBe(expToastMessage, LogMessageSch.value_notMatched(expToastMessage, toastMsg));

    // Close toast message box
    await toast.closeLastToast();
  });

  it('Step 6: Verify that BagA-1 and BagA-2 are released to external system.', async () => {
    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagA1, true)).toBe(
      ImgLifecycleState.BeenReleasedToExternal,
      LogMessageSch.workOrder_notReleasedToExternalSystem(WorkOrder.BagA_1),
    );
    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagA2, true)).toBe(
      ImgLifecycleState.BeenReleasedToExternal,
      LogMessageSch.workOrder_notReleasedToExternalSystem(WorkOrder.BagA_2),
    );
  });

  it('Step 7: Verify that work orders BagB-1 and BagB-2 are not released to external system.', async () => {
    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagB1, true)).toBe(
      ImgLifecycleState.CreatedButNotReleased,
      LogMessageSch.workOrder_releasedToExternalSystem(WorkOrder.BagB_1),
    );
    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagB2, true)).toBe(
      ImgLifecycleState.CreatedButNotReleased,
      LogMessageSch.workOrder_releasedToExternalSystem(WorkOrder.BagB_2),
    );
  });
});
