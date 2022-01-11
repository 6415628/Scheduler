/**
 * @file        TD002176
 * @description Un-freezing firm planned order which has also been manually marked for release
 * @author      Adrian Foo
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { ImgReleasedBy, ListWorkOrdersColumn } from '../libsch/forms/form.workorders';
import { WorkOrder } from '../libsch/data/data.workorder';
import { GanttChartSubtaskColor } from '../libsch/data/data.schedule';
import { ResourceName } from '../libsch/data/data.resource';
import { ExtractionType } from '../e2elib/lib/src/helper/enumhelper';
import { ListColumn } from '../e2elib/lib/src/pageobjects/list/listcolumn.component';
import { GanttChartRow } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartrow';
import { GanttChartNode } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartnode';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { ButtonUnfreezeContextMenuItem } from '../libsch/actionbarpages/abp.ganttchartresourceschedule';
import { ActionTriggerType } from '../libappbase/utils';
import { minDate } from '../libappbase/timeutils';

describe('TD002176, Un-freezing firm planned order which has also been manually marked for release', () => {
  // Component used in this test script
  const appScheduler = AppScheduler.getInstance();
  const viewManageOrders = appScheduler.viewManageOrders;
  const viewSchedule = appScheduler.viewSchedule;
  const formWorkOrders = viewManageOrders.formWorkOrders;
  const formResourceSchedule = viewSchedule.formResourceSchedule;
  const listWorkOrders = formWorkOrders.listWorkOrders;
  const ganttChartResourceSchedule = formResourceSchedule.pnlScheduleOverview.gcResourceSchedule;
  const abpGanttChart = appScheduler.abpGanttChartResourceSchedule;

  // Variable used across multiple test steps
  let columnReleasedBy: ListColumn | undefined;
  let columnReleasedByIndex: number;
  let rowResourceFin01: GanttChartRow;
  let nodeTask: GanttChartNode;
  let rowWorkOrder: ListRow;

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

  it('Setup: Switch to "Manage Orders" view.', async () => {
    await viewManageOrders.switchTo();

    expect(await formWorkOrders.isVisible()).toBe(true, 'Form work orders is not visible');
  });

  it(`Setup: Mark work order ${WorkOrder.CogA_2_2} as release in Manage Orders view`, async () => {
    // Find the work order row cogB_2_2
    rowWorkOrder = await listWorkOrders.getRowByValue([{ columnID: ListWorkOrdersColumn.WorkOrder, value: WorkOrder.CogA_2_2 }]);
    await listWorkOrders.markWorkOrderAsRelease(ActionTriggerType.ContextMenu, [rowWorkOrder]);

    // Find the 'releasedBy' column
    columnReleasedBy = await listWorkOrders.getColumnByToolipTitle('ImgReleasedBy');
    if (columnReleasedBy) {
      columnReleasedByIndex = await columnReleasedBy.getIndex();
    }

    // Verify the image is a red arrow in the 'releasedBy' column
    let releasedByImg = await listWorkOrders.getCellValueFromRow(columnReleasedByIndex, rowWorkOrder, true);
    expect(releasedByImg).toBe(ImgReleasedBy.MarkedByUser);
  });

  it('Setup: Switch to "Scheduling" view', async () => {
    await viewSchedule.switchTo();

    expect(await formResourceSchedule.isVisible()).toBe(true, 'Form resource schedule is not visible');
  });

  it(`Step 1: Freeze schedule up to task ${WorkOrder.CogA_2_2} in resource ${ResourceName.Fin01} at "Resource schdule" Gantt chart`, async () => {
    let nodeEndDate: Date | undefined;

    // Find FIN01 resource row in Gantt chart
    rowResourceFin01 = (await ganttChartResourceSchedule.getRowsByTitle(ResourceName.Fin01))[0];

    // Find the task node of work order CobA_2_2 in FIN01 resource row
    let nodeFound = await ganttChartResourceSchedule.getNode(rowResourceFin01, WorkOrder.CogA_2_2);
    expect(nodeFound).toBeDefined(`Task node with text ${WorkOrder.CogA_2_2} not found in resource row ${ResourceName.Fin01}`);

    // If the task node is found, freeze the resource up to the node
    if (nodeFound) {
      nodeTask = nodeFound;

      // BUG: When running smoke test, particularly 2176 is ran after 2174, the gantt chart abp doesn't show up, causing the abpGanttChart.click() to fail.
      // NOTE: workaround - In this case, we have to explicit switch to resource seq tab in the schedule form, then switch back to the schedule gc form.
      await formResourceSchedule.pnlResourceSequenceDetails.switchTo();
      await formResourceSchedule.pnlScheduleOverview.switchTo();

      await ganttChartResourceSchedule.clickNode(nodeTask);
      await abpGanttChart.click();
      await abpGanttChart.btnFreeze.click();

      // Observe the node's end date
      nodeEndDate = await nodeTask.getEndDate();
      expect(nodeEndDate).toBeDefined('Node end date could not be retrieved');

      // If the node's end date is valid, verify all the nodes BEFORE the end date is blue
      if (nodeEndDate) {
        let allNodes = await rowResourceFin01.getNodes(minDate, nodeEndDate, ExtractionType.END, true);
        let colors = await ganttChartResourceSchedule.getNodesColor(allNodes);
        let isAllBlueNode = colors.every((color: string) => color === GanttChartSubtaskColor.Blue_FeedbackProcess);

        expect(isAllBlueNode).toBe(true, `All nodes before ${nodeEndDate.toString()} should be blue`);
      }
    }

    // Find FIN02 resource row in Gantt chart
    const rowResourceFin02 = (await ganttChartResourceSchedule.getRowsByTitle(ResourceName.Fin02))[0];

    // Find the task node of work order CobA_2_2 in FIN02 resource row
    nodeFound = await ganttChartResourceSchedule.getNode(rowResourceFin02, WorkOrder.CogA_2_2);
    expect(nodeFound).toBeDefined(`Task node with text ${WorkOrder.CogA_2_2} not found in resource row ${ResourceName.Fin02}`);
  });

  it(`Step 2: Switch to "Manage Work Orders" view and verify work order ${WorkOrder.CogA_2_2} is marked by user`, async () => {
    await viewManageOrders.switchTo();

    // Verify the image is still a red arrow in the 'releasedBy' column of CogA_2_2 work order row
    rowWorkOrder = await listWorkOrders.getRowByValue([{ columnID: ListWorkOrdersColumn.WorkOrder, value: WorkOrder.CogA_2_2 }]);
    let releasedByImg = await listWorkOrders.getCellValueFromRow(columnReleasedByIndex, rowWorkOrder, true);
    expect(releasedByImg).toBe(ImgReleasedBy.MarkedByUser);
  });

  it('Step 3: Switch to "Schedule view"', async () => {
    await viewSchedule.switchTo();

    expect(await formResourceSchedule.isVisible()).toBe(true, 'Form resource schedule is not visible');
  });

  it(`Step 4: Unfreeze resource ${ResourceName.Fin01} in "Resource schedule" Gantt chart`, async () => {
    await ganttChartResourceSchedule.clickNode(nodeTask);
    await abpGanttChart.click();
    await abpGanttChart.btnUnfreeze.clickDropdown(ButtonUnfreezeContextMenuItem.UnfreezeSelectedRecources);

    // Verify all the nodes in the resource FIN01 row are green
    let allNodes = await ganttChartResourceSchedule.getAllNodes(rowResourceFin01);
    let colors = await ganttChartResourceSchedule.getNodesColor(allNodes);
    let isAllNodesGreen = colors.every((color: string) => color === GanttChartSubtaskColor.Green_Process);
    expect(isAllNodesGreen).toBe(true, `All nodes in ${ResourceName.Fin01} row should be green`);
  });

  it(`Step 5: Switch to "Manage Work Orders" view and verify work order ${WorkOrder.CogA_2_2} is marked by user`, async () => {
    await viewManageOrders.switchTo();

    // Verify the image is still a red arrow in the 'releasedBy' column of CogB_2_2 work order row
    rowWorkOrder = await listWorkOrders.getRowByValue([{ columnID: ListWorkOrdersColumn.WorkOrder, value: WorkOrder.CogA_2_2 }]);
    let releasedByImg = await listWorkOrders.getCellValueFromRow(columnReleasedByIndex, rowWorkOrder, true);
    expect(releasedByImg).toBe(ImgReleasedBy.MarkedByUser);
  });
});
