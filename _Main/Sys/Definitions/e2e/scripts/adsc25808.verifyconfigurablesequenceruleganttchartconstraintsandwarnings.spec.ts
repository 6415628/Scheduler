/**
 * @file        ADSC-25808
 * @description Verify configurable sequence rule gantt chart constraints and warnings
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { QUtils } from '../e2elib/lib/src/main/qutils.class';
import { GanttChartNode } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartnode';
import { GanttChartRow } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartrow';
import { browser } from '../e2elib/node_modules/protractor/built';
import { LogMessage } from '../libappbase/logmessage';
import { asyncEvery, asyncFilter } from '../libappbase/utils';
import { AppScheduler } from '../libsch/appsch';
import { OrderNr } from '../libsch/data/data.order';
import { ResourceGroupName, ResourceName } from '../libsch/data/data.resource';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { GanttChartNodeColor } from '../libsch/data/data.schedule';
import { OperationType } from '../libsch/data/data.workorder';
import { ListResourceColumn } from '../libsch/forms/resourceschedule';
import { ImgIsPlanned, ListOperationColumn } from '../libsch/forms/workordersandoperations';
import { LogMessageSch } from '../libsch/logmessagesch';

describe('ADSC-25808, Verify configurable sequence rule gantt chart constraints and warnings', () => {
  const appScheduler = AppScheduler.getInstance();

  const viewSchedule = appScheduler.viewSchedule;
  const formWorkOrdersAndOperation = viewSchedule.formWorkOrdersAndOperation;
  const formResourceSchedule = viewSchedule.formResourceSchedule;
  const pnlOperations = formWorkOrdersAndOperation.pnlOperations;
  const listOperations = pnlOperations.listOperations;
  const pnlScheduleOverview = formResourceSchedule.pnlScheduleOverview;
  const gcResourceSchedule = pnlScheduleOverview.gcResourceSchedule;
  const pnlResourceSequenceDetails = formResourceSchedule.pnlResourceSequenceDetails;
  const listResource = pnlResourceSequenceDetails.listResource;
  const listTask = pnlResourceSequenceDetails.listTask;
  let gcRowHDGL1: GanttChartRow;

  const gcResourceScheduleStart = new Date(2021, 3, 5, 1, 15);
  const gcResourceScheduleEnd = new Date(2021, 3, 6);
  const PLTCM = ResourceName.PLTCM;
  const HDGL1 = ResourceName.HDGL1;
  const expPLTCMNodeConstraint = 'Working rolls - Rule [04. PL-TCM rolls HEAD - Max length]';
  const expHDGL1NodeConstraint = 'Rule [06. HDGL1/3 cycle (Default) - Allowed treatment types]: The [Operation treatment type] [P] is in the not allowed value set.';
  const filterTerms = `${ListOperationColumn.OrderNrFilter} = ${OrderNr._1192817240} ${ListOperationColumn.OperationTypeFilter} = ${OperationType.Galvanizing}`;

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
  });

  afterAll(async () => {
    await appScheduler.cleanUpDataset();
    await appScheduler.logout();
  });

  afterEach(async () => {
    await appScheduler.checkToastMessage();
  });

  it('Setup: SteelColdMill_WC Test Demo dataset is loaded', async () => {
    await appScheduler.switchToDemoScenario(DemoCategory.TestDemo, DemoScenario.SteelColdMillWC);
  });

  it('Step 1: Open view Schedule -> Schedule.', async () => {
    await viewSchedule.switchTo();
    expect(await formWorkOrdersAndOperation.isVisible()).toBe(true, LogMessage.form_notVisible(await formWorkOrdersAndOperation.getTitle()));
    expect(await formResourceSchedule.isVisible()).toBe(true, LogMessage.form_notVisible(await formResourceSchedule.getTitle()));
  });

  it('Step 2: In the gantt chart, there is two tasks with a rule violation on resource PL-TCM in head phase. The tooltip explains that rule "PL-TCM - maximum combined length" is violated for head phase, since the total length in the phase is more than the max combined length for the head phase.', async () => {
    await gcResourceSchedule.show(gcResourceScheduleStart, gcResourceScheduleEnd);
    // FIX ME: RFC raised (CTAS-110946) to avoid calling browser sleep
    await browser.sleep(1000);

    // Get all the nodes on PL-TCM
    const gcRowPLTCM = (await gcResourceSchedule.getRowsByTitle(PLTCM))[0];
    const allPLTCMNodes = await gcResourceSchedule.getAllNodes(gcRowPLTCM);
    // Get constraint violated nodes
    const violatedPLTCMNodes = await asyncFilter(
      allPLTCMNodes,
      async (node: GanttChartNode) => (await gcResourceSchedule.getNodesColor([node]))[0] === GanttChartNodeColor.ConstraintViolated,
    );
    const first2ViolatedPLTCMNodes = violatedPLTCMNodes.slice(0, 2);
    const isViolatedNodesHasTooltip = await asyncEvery(first2ViolatedPLTCMNodes, async (node: GanttChartNode) =>
      (await gcResourceSchedule.triggerTooltip(node)).includes(expPLTCMNodeConstraint),
    );
    expect(isViolatedNodesHasTooltip).toBe(true, `First 2 violated tasks on ${PLTCM} should have '${expPLTCMNodeConstraint}' for constraint message.`);
  });

  it('Step 3: Verify there are 16 tasks with constraint violations on resource HDGL1. For each of these tasks, the tooltip should explain that operation treatment type is not allowed in the program', async () => {
    gcRowHDGL1 = (await gcResourceSchedule.getRowsByTitle(HDGL1))[0];
    const allHDGL1Nodes = await gcResourceSchedule.getAllNodes(gcRowHDGL1);
    const violatedHDGL1Nodes = await asyncFilter(
      allHDGL1Nodes,
      async (node: GanttChartNode) => (await gcResourceSchedule.getNodesColor([node]))[0] === GanttChartNodeColor.ConstraintViolated,
    );
    expect(violatedHDGL1Nodes.length).toBe(16, LogMessageSch.ganttchart_numOfNodesNotMatched(HDGL1, 16, violatedHDGL1Nodes.length));

    const isViolatedNodesHasTooltip = await asyncEvery(violatedHDGL1Nodes, async (node: GanttChartNode) =>
      (await gcResourceSchedule.triggerTooltip(node)).includes(expHDGL1NodeConstraint),
    );
    expect(isViolatedNodesHasTooltip).toBe(true, `All violated tasks on ${HDGL1} should have '${expHDGL1NodeConstraint}' for constraint message.`);
  });

  it('Step 4: In the operations list, find a galvanizing operation with operation treatment type=P, for instance 1192817240', async () => {
    await pnlOperations.switchTo();

    // Filter galvanizing operation of order 1192817240
    let dialogFilterManager = await listOperations.openFilterDialogOnColumn(ListOperationColumn.OrderNr);
    await dialogFilterManager.filter(filterTerms);

    const operationRows = await listOperations.getAllRows();
    expect(operationRows.length).toBe(1, LogMessageSch.list_numOfRowsNotMatched('Operation', 1, operationRows.length));
  });

  xit('Step 5: Drag the operation to the HDGL1 resource in the gantt chart. A precondition prevents planning the operation on the resource. Verify that it is possible to overrule the precondition by holding the CTRL key', async () => {
    // FIX ME: CTAS-108796, gc interaction with other component is not supported by e2elib at the moment 108796
  });

  xit('Step 6: Redo the previous step.', async () => {
    // FIX ME: after implementing pervious step
  });

  it('Step 7: select the "Resource sequence details" tab, and drag the operation to the task list of resource HDGL1. Same as step 5, Verify that it is possible to overrule the precondition by holding the CTRL key', async () => {
    await pnlResourceSequenceDetails.switchTo();

    const hdgl1ResourceRow = await listResource.getRowByValueInHierarchy(
      [{ columnID: ListResourceColumn.Name, value: HDGL1 }],
      [[{ columnID: ListResourceColumn.Name, value: ResourceGroupName.Galvanizing }]],
    );
    await listResource.selectRows([hdgl1ResourceRow]);
    const firstHDGL1Task = await listTask.getRowByIndex(0);

    let operationRow = await listOperations.getRowByIndex(0);
    await listOperations.selectRows([operationRow]);

    // Verify precondtion message
    const preconMsg = await QUtils.emitDragAndDropEvent(operationRow.element, firstHDGL1Task.element, true);
    expect(preconMsg).toContain(expHDGL1NodeConstraint, LogMessageSch.tooltip_notContains(expHDGL1NodeConstraint, preconMsg));

    // Perform drag and drop action again but this time override the soft precondition by holding CTRL
    await QUtils.emitDragAndDropEvent(operationRow.element, firstHDGL1Task.element, undefined, undefined, true);

    // Verify if the operation is planned
    operationRow = await listOperations.getRowByIndex(0);
    const isPlanned = await listOperations.getCellValueFromRow(ImgIsPlanned.ColumnIndex, operationRow, true);
    expect(isPlanned).toBe(ImgIsPlanned.Planned, LogMessage.value_notMatched(ImgIsPlanned.Planned, isPlanned));

    // Switch to gantt chart and verify the task has expected constraint
    await pnlScheduleOverview.switchTo();
    const firstNode = <GanttChartNode>await gcRowHDGL1.getNode(0);
    const firstNodeColor = (await gcResourceSchedule.getNodesColor([firstNode]))[0];
    expect(firstNodeColor).toBe(GanttChartNodeColor.ConstraintViolated, LogMessage.value_notMatched(GanttChartNodeColor.ConstraintViolated, firstNodeColor));
    const nodeTooltip = await gcResourceSchedule.triggerTooltip(firstNode);
    expect(nodeTooltip).toContain(expHDGL1NodeConstraint, LogMessageSch.tooltip_notContains(expHDGL1NodeConstraint, nodeTooltip));
  });
});
