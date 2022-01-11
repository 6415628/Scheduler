/**
 * @file        ADSC-5357
 * @description Exporting a firm planned order that is scheduled in frozen horizon
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { LogMessage } from '../libappbase/logmessage';
import { ResourceName } from '../libsch/data/data.resource';
import { GanttChartNode } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartnode';
import { WorkOrder } from '../libsch/data/data.workorder';
import { LogMessageSch } from '../libsch/logmessagesch';
import { QToastType } from '../e2elib/lib/src/pageobjects/toast/toastmessage.component';
import { GanttChartSubtaskColor } from '../libsch/data/data.schedule';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { ImgLifecycleState, ImgReleasedBy, ListWorkOrdersContextMenuItem, WorkOrderPrecondition } from '../libsch/forms/form.workorders';
import { MPSIntegration } from '../libsch/data/data.configureintegration';
import { PublishScheduleToastMessage } from '../libsch/actionbarpages/abp.data';

describe('ADSC-5357, Exporting a firm planned order that is scheduled in frozen horizon', () => {
  const appScheduler = AppScheduler.getInstance();

  const viewManageOrders = appScheduler.viewManageOrders;
  const formWorkOrders = viewManageOrders.formWorkOrders;
  const listWorkOrders = formWorkOrders.listWorkOrders;
  let bagB3row: ListRow;
  let bagA3row: ListRow;

  const viewSchedule = appScheduler.viewSchedule;
  const formResourceSchedule = viewSchedule.formResourceSchedule;
  const gcResourceSchedule = formResourceSchedule.pnlScheduleOverview.gcResourceSchedule;

  const abpManageWorkOrders = appScheduler.abpManageWorkOrders;

  const bagB3 = WorkOrder.BagB_3;
  const bagA3 = WorkOrder.BagA_3;
  const expPublishScheduleToastMessage = PublishScheduleToastMessage.Success;
  const expReleasedWorkOrderPrecondition = WorkOrderPrecondition.WorkOrderAlreadyReleased;

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
    await appScheduler.switchToDemoScenario(DemoCategory.TestDemo, DemoScenario.ScErpIntegrationReleaseFirmPlannedOrder);
  });

  afterAll(async () => {
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

  it('Step 1: Open view Manage Work Orders-> Manage Orders', async () => {
    await viewManageOrders.switchTo();
    expect(await formWorkOrders.isVisible()).toBe(true, LogMessage.form_notVisible('Work Orders'));
  });

  it('Step 2: In the work order list, select firm planned order BagB-3. Verify that, it is scheduled in frozen horizon so it is marked for release.', async () => {
    bagB3row = await listWorkOrders.getWorkOrder(bagB3);

    // Verify it is scheduled in frozen horizon
    const bagB3releasedBy = await listWorkOrders.getCellValueFromRow(ImgReleasedBy.ColumnIndex, bagB3row, true);
    expect(bagB3releasedBy).toBe(ImgReleasedBy.MarkedAutomatically, LogMessageSch.workOrder_notScheduledInFrozenHorizon(bagB3));

    // Verify it is marked for release
    const bagB3lifecycleState = await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagB3row, true);
    expect(bagB3lifecycleState).toBe(ImgLifecycleState.MarkedForReleased, LogMessageSch.workOrder_notMarkedForRelease(bagB3));
  });

  it('Step 3: Press the "Publish Schedule" button', async () => {
    // Press the "Publish Schedule" button from Data Action bar page
    const toast = await appScheduler.abpData.publishSchedule();

    // Verify success toast is popped up for Publish Schedule
    expect(await toast.verifyLastToastType(QToastType.SUCCESS)).toBe(true, LogMessageSch.toast_notSuccess('Publish Schedule'));

    // Verify toast message
    const toastMsg = await toast.getLastToastMessage();
    expect(toastMsg).toBe(expPublishScheduleToastMessage, LogMessageSch.value_notMatched(expPublishScheduleToastMessage, toastMsg));

    // Close toast message box
    await toast.closeLastToast();
  });

  it('Step 4: Verify that work order BagB-3 is released.', async () => {
    await viewManageOrders.switchTo();

    bagB3row = await listWorkOrders.getWorkOrder(bagB3);

    // Verify it is released
    const bagB3lifecycleState = await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagB3row, true);
    expect(bagB3lifecycleState).toBe(ImgLifecycleState.BeenReleasedToExternal, LogMessageSch.workOrder_notReleasedToExternalSystem(bagB3));
  });

  it('Step 5: Reschedule the printing operation of BagB-3 from resource 1102 to resource 1101', async () => {
    await viewSchedule.switchTo();
    expect(await formResourceSchedule.isVisible()).toBe(true, LogMessage.form_notVisible('Resource Schedule'));

    const gcRow1102 = (await gcResourceSchedule.getRowsByTitle(ResourceName._1102))[0];
    const gcRow1101 = (await gcResourceSchedule.getRowsByTitle(ResourceName._1101))[0];
    let nodeBagB3 = <GanttChartNode>await gcResourceSchedule.getNode(gcRow1102, bagB3);

    // Verify the node is blue color as it is in frozen horizon
    let nodeColorBagB3 = (await gcResourceSchedule.getNodesColor([nodeBagB3]))[0];
    expect(nodeColorBagB3).toBe(GanttChartSubtaskColor.Blue_FeedbackProcess, LogMessage.value_notMatched(GanttChartSubtaskColor.Blue_FeedbackProcess, nodeColorBagB3));

    // Get the start time of the node to drop it in the same time
    const startTime = await nodeBagB3.getStartDate();

    // Since the task is frozen on 1102, a soft pre-condition needs to be overruled by the CTRL button when the task/operation is dropped on the new resource 1101
    await gcResourceSchedule.dropNodeOnRow(nodeBagB3, gcRow1101, startTime, { ctrlKey: true });

    // Since there is no frozen period defined on 1101, this will un-freeze the operation. Verify the node is green color
    nodeBagB3 = <GanttChartNode>await gcResourceSchedule.getNode(gcRow1101, bagB3);
    nodeColorBagB3 = (await gcResourceSchedule.getNodesColor([nodeBagB3]))[0];
    expect(nodeColorBagB3).toBe(GanttChartSubtaskColor.Green_Process, LogMessage.value_notMatched(GanttChartSubtaskColor.Green_Process, nodeColorBagB3));
  });

  it('Step 6: Verify that BagB-3 workorder IsMarkedForReleaseFrozen = false, IsMarkedForRelease = false but IsReleased = true.', async () => {
    await viewManageOrders.switchTo();

    bagB3row = await listWorkOrders.getWorkOrder(bagB3);

    // Verify it is not scheduled in frozen horizon
    const bagB3releasedBy = await listWorkOrders.getCellValueFromRow(ImgReleasedBy.ColumnIndex, bagB3row, true);
    expect(bagB3releasedBy).not.toBe(ImgReleasedBy.MarkedAutomatically, LogMessageSch.workOrder_scheduledInFrozenHorizon(bagB3));

    // Verify it is not marked for release
    const bagB3lifecycleState = await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, bagB3row, true);
    expect(bagB3lifecycleState).not.toBe(ImgLifecycleState.MarkedForReleased, LogMessageSch.workOrder_markedForRelease(bagB3));

    // Verify it is released
    expect(bagB3lifecycleState).toBe(ImgLifecycleState.BeenReleasedToExternal, LogMessageSch.workOrder_notReleasedToExternalSystem(bagB3));
  });

  it('Step 7: Verify that action buttons to Edit, Delete, Split and Join are disabled when order BagB-3 is selected in the work order form, with feedback that the respective action is not allowed for an order that has been released', async () => {
    await listWorkOrders.selectRows([bagB3row]);

    // Verify Edit Button is disabled
    let [isClickable, tooltip] = await abpManageWorkOrders.btnEditWorkOrder.verifyIsButtonClickable();
    expect(isClickable).toBe(false, LogMessage.btn_isEnabled('Edit'));
    expect(tooltip).toContain(expReleasedWorkOrderPrecondition, LogMessageSch.tooltip_notContains(expReleasedWorkOrderPrecondition, tooltip));

    // Verify Delete Button is disabled
    [isClickable, tooltip] = await abpManageWorkOrders.btnDeleteWorkOrder.verifyIsButtonClickable();
    expect(isClickable).toBe(false, LogMessage.btn_isEnabled('Delete'));
    expect(tooltip).toContain(expReleasedWorkOrderPrecondition, LogMessageSch.tooltip_notContains(expReleasedWorkOrderPrecondition, tooltip));

    // Verify Split Button is disabled
    [isClickable, tooltip] = await abpManageWorkOrders.btnSplitPlannedOrder.verifyIsButtonClickable();
    expect(isClickable).toBe(false, LogMessage.btn_isEnabled('Split'));
    expect(tooltip).toContain(expReleasedWorkOrderPrecondition, LogMessageSch.tooltip_notContains(expReleasedWorkOrderPrecondition, tooltip));

    // Select at least 2 work orders to see button Join precondition
    bagA3row = await listWorkOrders.getWorkOrder(bagA3);
    await listWorkOrders.selectRows([bagB3row,bagA3row]);

    // Verify Join Button is disabled
    [isClickable, tooltip] = await abpManageWorkOrders.btnJoinPlannedOrder.verifyIsButtonClickable();
    expect(isClickable).toBe(false, LogMessage.btn_isEnabled('Join'));
    expect(tooltip).toContain(expReleasedWorkOrderPrecondition, LogMessageSch.tooltip_notContains(expReleasedWorkOrderPrecondition, tooltip));
  });

  it('Step 8: Verify that the "Mark for release" button is disabled, since IsReleased = true.', async () => {
    // Verify Mark for release menu item is disabled
    const [isClickable, tooltip] = await listWorkOrders.verifyIsMenuItemClickable(ListWorkOrdersContextMenuItem.MarkForRelease, [bagB3row]);
    expect(isClickable).toBe(false, LogMessage.menu_isEnabled('Mark for release'));
    // Verify Mark for release menu item displays correct tooltip
    expect(tooltip).toContain(expReleasedWorkOrderPrecondition, LogMessageSch.tooltip_notContains(expReleasedWorkOrderPrecondition, tooltip));
  });
});
