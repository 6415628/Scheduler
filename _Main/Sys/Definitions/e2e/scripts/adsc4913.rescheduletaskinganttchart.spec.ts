/**
 * @file        ADSC-4913
 * @description Reschedule task in Gantt chart
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { LogMessage } from '../libappbase/logmessage';
import { ResourceName } from '../libsch/data/data.resource';
import { GanttChartNode } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartnode';
import { QConsole } from '../e2elib/lib/src/helper/qconsole';
import { GanttChartNodeText } from '../libsch/data/data.schedule';

describe('ADSC-4913, Reschedule task in Gantt chart', () => {
  const appScheduler = AppScheduler.getInstance();

  const viewSchedule = appScheduler.viewSchedule;
  const formResourceSchedule = viewSchedule.formResourceSchedule;
  const gcResourceSchedule = formResourceSchedule.pnlScheduleOverview.gcResourceSchedule;

  const gcResourceScheduleStart = new Date(2017, 0, 5);
  const gcResourceScheduleEnd = new Date(2017, 0, 7);
  const SC1 = ResourceName.Sc1;
  const WE = ResourceName.We;
  const smallPit2 = ResourceName.SmallPit2;
  const smallPit3 = ResourceName.SmallPit3;
  const _10064 = GanttChartNodeText._10064;
  const _10024 = GanttChartNodeText._10024;
  const _10170 = GanttChartNodeText._10170;
  const _10176 = GanttChartNodeText._10176;
  const batch15 = GanttChartNodeText.batch15;
  const batch16 = GanttChartNodeText.batch16;
  const lastFeedbackOnSmallPit2 = GanttChartNodeText.FeedbackBatch18;
  const lastFeedbackOnSmallPit3 = GanttChartNodeText.FeedbackBatch19;
  const _5Jan0400 = 'Thu, 05 Jan 2017 04:00:00 GMT';
  const _5Jan0600 = 'Thu, 05 Jan 2017 06:00:00 GMT';
  const _5Jan0650 = 'Thu, 05 Jan 2017 06:50:00 GMT';
  const _5Jan0820 = 'Thu, 05 Jan 2017 08:20:00 GMT';
  const firstEmptySlotBefore10170Date = new Date(Date.UTC(2017, 0, 5, 7));

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
    await appScheduler.switchToDemoScenario(DemoCategory.SalesDemo, DemoScenario.AluminumHotRolling);
  });

  afterAll(async () => {
    await appScheduler.cleanUpDataset();
    await appScheduler.logout();
  });

  afterEach(async () => {
    await appScheduler.checkToastMessage();
  });

  it('Step 1: Open view Schedule -> Schedule', async () => {
    await viewSchedule.switchTo();
    expect(await viewSchedule.formWorkOrdersAndOperation.isVisible()).toBe(true, LogMessage.form_notVisible('Work Orders and Operation'));
  });

  it('Step 2: In the Gantt chart drag & drop scalping task 10064 (starts at 6:00) onto scalping task 10024 (starts at 4:00)', async () => {
    await gcResourceSchedule.show(gcResourceScheduleStart, gcResourceScheduleEnd);
    await QConsole.waitForScreenUpdate();

    const gcRowSC1 = (await gcResourceSchedule.getRowsByTitle(SC1))[0];

    // Verify source node start time before drag & drop
    let sourceNode = <GanttChartNode>await gcResourceSchedule.getNode(gcRowSC1, _10064);
    let sourceNodeStartTime = ((await sourceNode.getStartDate()) as Date).toUTCString();
    expect(sourceNodeStartTime).toBe(_5Jan0600, LogMessage.value_notMatched(_5Jan0600, sourceNodeStartTime));

    // Verify target node start time before drag & drop
    let targetNode = <GanttChartNode>await gcResourceSchedule.getNode(gcRowSC1, _10024);
    let targetNodeStartTime = ((await targetNode.getStartDate()) as Date).toUTCString();
    expect(targetNodeStartTime).toBe(_5Jan0400, LogMessage.value_notMatched(_5Jan0400, targetNodeStartTime));

    await gcResourceSchedule.dropNode(sourceNode, targetNode);
    await QConsole.waitForScreenUpdate();

    // Verify source node start time after drag & drop
    sourceNode = <GanttChartNode>await gcResourceSchedule.getNode(gcRowSC1, _10064);
    sourceNodeStartTime = ((await sourceNode.getStartDate()) as Date).toUTCString();
    const sourceNodeEndTime = ((await sourceNode.getEndDate()) as Date).toUTCString();
    expect(sourceNodeStartTime).toBe(_5Jan0400, LogMessage.value_notMatched(_5Jan0400, sourceNodeStartTime));

    // Verify target node start time after drag & drop
    targetNode = <GanttChartNode>await gcResourceSchedule.getNode(gcRowSC1, _10024);
    targetNodeStartTime = ((await targetNode.getStartDate()) as Date).toUTCString();
    expect(targetNodeStartTime).toBe(sourceNodeEndTime, LogMessage.value_notMatched(sourceNodeEndTime, targetNodeStartTime));
  });

  it('Step 3: In the Gantt chart drag & drop welding task 10170 (starts at 8:20) onto the first available empty space to the left (earlier)', async () => {
    const gcRowWE = (await gcResourceSchedule.getRowsByTitle(WE))[0];

    // Verify source node start time before drag & drop
    let sourceNode = <GanttChartNode>await gcResourceSchedule.getNode(gcRowWE, _10170);
    let sourceNodeStartTime = ((await sourceNode.getStartDate()) as Date).toUTCString();
    expect(sourceNodeStartTime).toBe(_5Jan0820, LogMessage.value_notMatched(_5Jan0820, sourceNodeStartTime));

    await gcResourceSchedule.dropNodeOnRow(sourceNode, gcRowWE, firstEmptySlotBefore10170Date);
    await QConsole.waitForScreenUpdate();

    // Verify welding task 10170 now starts at 6:50 and is scheduled directly after welding task 10176
    sourceNode = <GanttChartNode>await gcResourceSchedule.getNode(gcRowWE, _10170);
    sourceNodeStartTime = ((await sourceNode.getStartDate()) as Date).toUTCString();
    const beforeSourceNode = <GanttChartNode>await gcResourceSchedule.getNode(gcRowWE, _10176);
    const beforeSourceEndTime = ((await beforeSourceNode.getEndDate()) as Date).toUTCString();
    expect(sourceNodeStartTime).toBe(_5Jan0650, LogMessage.value_notMatched(_5Jan0650, sourceNodeStartTime));
    expect(sourceNodeStartTime).toBe(beforeSourceEndTime, LogMessage.value_notMatched(beforeSourceEndTime, sourceNodeStartTime));
  });

  it('Step 4: In the Gantt chart drag & drop the batch task on SmallPit3 (Batch 16) onto the free space after the batch task on SmallPit2', async () => {
    const gcRowSmallPit2 = (await gcResourceSchedule.getRowsByTitle(smallPit2))[0];
    const gcRowSmallPit3 = (await gcResourceSchedule.getRowsByTitle(smallPit3))[0];

    let sourceNode = <GanttChartNode>await gcResourceSchedule.getNode(gcRowSmallPit3, batch16);

    await gcResourceSchedule.dropNodeOnRow(sourceNode, gcRowSmallPit2, gcResourceScheduleEnd);
    await QConsole.waitForScreenUpdate();

    // Verify the batch task is now scheduled directly after Batch 15 on SmallPit2.
    sourceNode = <GanttChartNode>await gcResourceSchedule.getNode(gcRowSmallPit2, batch16);
    const sourceNodeStartTime = ((await sourceNode.getStartDate()) as Date).toUTCString();
    const beforeSourceNode = <GanttChartNode>await gcResourceSchedule.getNode(gcRowSmallPit2, batch15);
    const beforeSourceEndTime = ((await beforeSourceNode.getEndDate()) as Date).toUTCString();
    expect(sourceNodeStartTime).toBe(beforeSourceEndTime, LogMessage.value_notMatched(beforeSourceEndTime, sourceNodeStartTime));
  });

  it('Step 5: In the Gantt chart drag & drop the last batch task on SmallPit2 (Batch 16) onto the first batch task on SmallPit2 (Batch 15)', async () => {
    const gcRowSmallPit2 = (await gcResourceSchedule.getRowsByTitle(smallPit2))[0];

    // Verify source node start time before drag & drop
    let sourceNode = <GanttChartNode>await gcResourceSchedule.getNode(gcRowSmallPit2, batch16);
    let targetNode = <GanttChartNode>await gcResourceSchedule.getNode(gcRowSmallPit2, batch15);

    await gcResourceSchedule.dropNode(sourceNode, targetNode);
    await QConsole.waitForScreenUpdate();

    // Verify Batch16 is now scheduled in front of Batch 15 on SmallPit2.
    sourceNode = <GanttChartNode>await gcResourceSchedule.getNode(gcRowSmallPit2, batch16);
    const sourceNodeEndTime = ((await sourceNode.getEndDate()) as Date).toUTCString();
    targetNode = <GanttChartNode>await gcResourceSchedule.getNode(gcRowSmallPit2, batch15);
    const targetNodeStartTime = ((await targetNode.getStartDate()) as Date).toUTCString();
    expect(sourceNodeEndTime).toBe(targetNodeStartTime, LogMessage.value_notMatched(targetNodeStartTime, sourceNodeEndTime));
  });

  it('Step 6: In the Gantt chart drag & drop the 1st batch task on SmallPit2 (Batch 16) onto the free space after the last feedback task on SmallPit3', async () => {
    const gcRowSmallPit2 = (await gcResourceSchedule.getRowsByTitle(smallPit2))[0];
    const gcRowSmallPit3 = (await gcResourceSchedule.getRowsByTitle(smallPit3))[0];

    let sourceNode = <GanttChartNode>await gcResourceSchedule.getNode(gcRowSmallPit2, batch16);

    await gcResourceSchedule.dropNodeOnRow(sourceNode, gcRowSmallPit3, gcResourceScheduleEnd);
    await QConsole.waitForScreenUpdate();

    // Verify on SmallPit2 Batch 15 is now scheduled directly after the last feedback task on SmallPit2
    const batch15Node = <GanttChartNode>await gcResourceSchedule.getNode(gcRowSmallPit2, batch15);
    const batch15NodeStartTime = ((await batch15Node.getStartDate()) as Date).toUTCString();
    const lastFeedbackOnSmallPit2Node = <GanttChartNode>await gcResourceSchedule.getNode(gcRowSmallPit2, lastFeedbackOnSmallPit2);
    const lastFeedbackOnSmallPit2EndTime = ((await lastFeedbackOnSmallPit2Node.getEndDate()) as Date).toUTCString();
    expect(batch15NodeStartTime).toBe(lastFeedbackOnSmallPit2EndTime, LogMessage.value_notMatched(lastFeedbackOnSmallPit2EndTime, batch15NodeStartTime));

    // Verify on SmallPit3 Batch 16 is now scheduled directly after the last feedback task on SmallPit3
    sourceNode = <GanttChartNode>await gcResourceSchedule.getNode(gcRowSmallPit3, batch16);
    const sourceNodeStartTime = ((await sourceNode.getStartDate()) as Date).toUTCString();
    const beforeSourceNode = <GanttChartNode>await gcResourceSchedule.getNode(gcRowSmallPit3, lastFeedbackOnSmallPit3);
    const beforeSourceEndTime = ((await beforeSourceNode.getEndDate()) as Date).toUTCString();
    expect(sourceNodeStartTime).toBe(beforeSourceEndTime, LogMessage.value_notMatched(beforeSourceEndTime, sourceNodeStartTime));
  });
});
