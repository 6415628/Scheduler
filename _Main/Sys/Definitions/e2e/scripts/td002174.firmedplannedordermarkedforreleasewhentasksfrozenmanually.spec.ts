/**
 * @file        TD002174
 * @description Firm planned order marked for release when tasks frozen manually
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { ImgLifecycleState, ImgReleasedBy } from '../libsch/forms/form.workorders';
import { WorkOrder } from '../libsch/data/data.workorder';
import { GanttChartRow } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartrow';
import { GanttChartNode } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartnode';
import { Finisher1ResourceIndex, Finisher2ResourceIndex, GanttChartSubtaskColor } from '../libsch/data/data.schedule';

describe('TD002174 , Firm planned order marked for release when tasks frozen manually.', () => {
  let appScheduler = AppScheduler.getInstance();

  let formResourceSchedule = appScheduler.viewSchedule.formResourceSchedule;

  let listResource = formResourceSchedule.pnlResourceSequenceDetails.listResource;
  let listTask = formResourceSchedule.pnlResourceSequenceDetails.listTask;
  let listWorkOrders = appScheduler.viewManageOrders.formWorkOrders.listWorkOrders;
  let gcResourceSchedule = formResourceSchedule.pnlScheduleOverview.gcResourceSchedule;

  let fin01Index = Finisher1ResourceIndex.FIN01;
  let fin02Index = Finisher2ResourceIndex.FIN02;
  let cogA18 = WorkOrder.CogA_1_8;

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
    // await appScheduler.checkToastMessage();
  });

  it('Step 1: Schedule view is open in a web client (Schedule-> Schedule)', async () => {
    await appScheduler.viewSchedule.switchTo();
    expect(await formResourceSchedule.isVisible()).toBe(true, 'Expected: Form Resource Schedule should be visible');
  });

  it('Step 2: Verify that the operations of work order CogA-1-8 are scheduled on resources FIN01 and FIN02, respectively. Verify that there is no frozen horizon on the resources (all tasks in the gantt chart are shown in green color)', async () => {
    await formResourceSchedule.pnlResourceSequenceDetails.switchTo();
    // Verify that the operations of work order CogA-1-8 are scheduled on resources FIN01 and FIN02
    await listResource.selectResource(fin01Index);
    expect(listTask.isTaskExisted(cogA18)).toBe(true, `${cogA18} should be scheduled in FIN01`);
    await listResource.selectResource(fin02Index);
    expect(listTask.isTaskExisted(cogA18)).toBe(true, `${cogA18} should be scheduled in FIN02`);
    // Verify that there is no frozen horizon on the resources (all tasks in the gantt chart are shown in green color)
    await formResourceSchedule.pnlScheduleOverview.switchTo();
    expect(await gcResourceSchedule.verifyTasksColor(await gcResourceSchedule.getAllNodes(), GanttChartSubtaskColor.Green_Process)).toBe(
      true,
      'All tasks in the gantt chart should be green color',
    );
  });

  it(`Step 3: Go to Manage Work Orders -> Manage Orders view and, verify that work order ${cogA18} is not marked for release (refer to column ImgLifeCycleState)`, async () => {
    await appScheduler.viewManageOrders.switchTo();
    // Verify that work order CogA-1-8 is not marked for release
    let cogA18Row = await listWorkOrders.getWorkOrder(cogA18);
    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, cogA18Row, true)).toBe(
      ImgLifecycleState.CreatedButNotReleased,
      `${cogA18} should not be marked for release.`,
    );
  });

  it('Step 4: Go back to schedule view. In the gantt chart, select the last task on resource FIN2 then select Gantt Chart (action bar) > Freeze (button). In the gantt chart, verify that the second operation of work order CogA-1-8 is frozen (shown in blue color in the gantt chart.)', async () => {
    await appScheduler.viewSchedule.switchTo();
    await formResourceSchedule.pnlScheduleOverview.switchTo();
    // Select the last task on resource FIN2
    let fin02GanttChartRow = <GanttChartRow>await gcResourceSchedule.getRow(fin02Index);
    let lastFIN02Task = await gcResourceSchedule.getLastNode(fin02GanttChartRow);
    await gcResourceSchedule.clickNode(lastFIN02Task);
    // Select Gantt Chart (action bar) > Freeze (button)
    await appScheduler.abpGanttChartResourceSchedule.click();
    await appScheduler.abpGanttChartResourceSchedule.btnFreeze.click();
    // Verify that the second operation of work order CogA-1-8 is frozen (shown in blue color in the gantt chart.)
    let secondOperationCogA18Task = <GanttChartNode>await gcResourceSchedule.getNode(fin02GanttChartRow, cogA18);
    expect(await gcResourceSchedule.verifyTasksColor([secondOperationCogA18Task], GanttChartSubtaskColor.Blue_FeedbackProcess)).toBe(
      true,
      'Second operation of work order CogA-1-8 task should have blue color',
    );
  });

  it(`Step 5: Go back manage order view and verify that work order ${cogA18} is now marked for release, on account of being scheduled in the frozen horizon`, async () => {
    await appScheduler.viewManageOrders.switchTo();
    let cogA18Row = await listWorkOrders.getWorkOrder(cogA18);
    expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, cogA18Row, true)).toBe(
      ImgLifecycleState.MarkedForReleased,
      `${cogA18} should be marked for release.`,
    );
    expect(await listWorkOrders.getCellValueFromRow(ImgReleasedBy.ColumnIndex, cogA18Row, true)).toBe(
      ImgReleasedBy.MarkedAutomatically,
      `${cogA18} should be automatically marked for release as it has frozen operations.`,
    );
  });
});
