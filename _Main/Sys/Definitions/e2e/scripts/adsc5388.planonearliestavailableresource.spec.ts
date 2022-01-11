/**
 * @file        ADSC-5388
 * @description Plan on earliest available resource
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { LogMessage } from '../libappbase/logmessage';
import { ResourceName } from '../libsch/data/data.resource';
import { ListOperationColumn } from '../libsch/forms/workordersandoperations';
import { SortDirection } from '../e2elib/lib/src/helper/enumhelper';
import { LogMessageSch } from '../libsch/logmessagesch';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { QConsole } from '../e2elib/lib/src/helper/qconsole';
import { GanttChartRow } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartrow';
import { OperationDueDate } from '../libsch/data/data.schedule';
import { ActionTriggerType } from '../libappbase/utils';

describe('ADSC-5388, Plan on earliest available resource', () => {
  const appScheduler = AppScheduler.getInstance();

  const viewSchedule = appScheduler.viewSchedule;
  const formWorkOrdersAndOperation = viewSchedule.formWorkOrdersAndOperation;
  const pnlOperations = formWorkOrdersAndOperation.pnlOperations;
  const listOperations = pnlOperations.listOperations;
  const cbUnplanned = pnlOperations.cbUnplanned;
  const cbAllowedOperation = pnlOperations.cbAllowedOperation;

  const formResourceSchedule = viewSchedule.formResourceSchedule;
  const pnlScheduleOverview = formResourceSchedule.pnlScheduleOverview;
  const gcResourceSchedule = pnlScheduleOverview.gcResourceSchedule;

  const _1101 = ResourceName._1101;
  const _1103 = ResourceName._1103;
  const gcResourceScheduleStart = new Date(2017, 0, 6);
  const gcResourceScheduleEnd = new Date(2017, 0, 10);
  const _10Jan2017 = OperationDueDate._10Jan2017;
  const _14Jan2017 = OperationDueDate._14Jan2017;
  const firstPlannedOperationDueDates: string[] = [OperationDueDate._08Jan2017, OperationDueDate._09Jan2017, _10Jan2017];
  const secondPlannedOperationDueDates: string[] = [OperationDueDate._11Jan2017, OperationDueDate._12Jan2017, OperationDueDate._13Jan2017, _14Jan2017];
  let selectedOperationOrderNrs: string[];
  let gc1101Row: GanttChartRow;
  let gc1103Row: GanttChartRow;
  let selectedRows: ListRow[];

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
    await appScheduler.switchToDemoScenario(DemoCategory.SalesDemo, DemoScenario.Paperbags);
  });

  afterAll(async () => {
    await viewSchedule.reset();
    await appScheduler.cleanUpDataset();
    await appScheduler.logout();
  });

  afterEach(async () => {
    await appScheduler.checkToastMessage();
  });

  it('Step 1: Open view Schedule -> Schedule', async () => {
    await viewSchedule.switchTo();
    expect(await formWorkOrdersAndOperation.isVisible()).toBe(true, LogMessage.form_notVisible('Work Orders and Operation'));
    expect(await formResourceSchedule.isVisible()).toBe(true, LogMessage.form_notVisible('Resource Schedule'));
  });

  it('Step 2: Sort the list "Operations" along ascending "DueDate" and "OrderNr" secondly', async () => {
    await pnlOperations.switchTo();

    // Sort the list "Operations" along ascending "DueDate" and "OrderNr" secondly
    await listOperations.sortColumn(ListOperationColumn.DueDate);
    await listOperations.sortColumn(ListOperationColumn.OrderNr, true, false, true);

    // Verify "DueDate" and "OrderNr" columns are sorted in ascending order
    const dueDateColumn = await listOperations.getColumnByValue(ListOperationColumn.DueDate);
    expect(await dueDateColumn.getSortDirection()).toBe(SortDirection.ASC, LogMessageSch.column_notSorted(ListOperationColumn.DueDate, 'Operation', 'ASC'));
    const orderNrColumn = await listOperations.getColumnByValue(ListOperationColumn.OrderNr);
    expect(await orderNrColumn.getSortDirection()).toBe(SortDirection.ASC, LogMessageSch.column_notSorted(ListOperationColumn.OrderNr, 'Operation', 'ASC'));
  });

  it('Step 3: Check "Unplanned" checkbox filter in Operation list', async () => {
    // Toggle on "Unplanned" checkbox
    expect(await cbUnplanned.isChecked()).toBe(false, LogMessage.checkbox_isChecked('Unplanned'));
    await cbUnplanned.toggle(true);
    expect(await cbUnplanned.isChecked()).toBe(true, LogMessage.checkbox_notChecked('Unplanned'));
  });

  it('Step 4: Select 1101 resource in Resource Schedule GC and check "Allowed on resource" checkbox filter in Operation list', async () => {
    await pnlScheduleOverview.switchTo();

    // Show the end of gantt chart
    await gcResourceSchedule.show(gcResourceScheduleStart, gcResourceScheduleEnd);
    await QConsole.waitForScreenUpdate();

    // Select 1101 resource
    gc1101Row = (await gcResourceSchedule.getRowsByTitle(_1101))[0];
    gc1103Row = (await gcResourceSchedule.getRowsByTitle(_1103))[0];
    await gcResourceSchedule.clickRow(gc1101Row);

    // Toggle on "Allowed on resource" checkbox
    expect(await cbAllowedOperation.isChecked()).toBe(false, LogMessage.checkbox_isChecked('Allowed on resource'));
    await cbAllowedOperation.toggle(true);
    expect(await cbAllowedOperation.isChecked()).toBe(true, LogMessage.checkbox_notChecked('Allowed on resource'));
  });

  it('Step 5: Select all "Printing" operations with DueDate <= Jan 10th, by first selecting the operation at the top of the list, then scrolling down and selecting the last of the operations with due date Jan 11th in the list, while holding the shift button', async () => {
    // Select all printing operation due <= Jan 10th by click on first row and then shift click on operation due = Jan 10th Jan
    await listOperations.selectListRowsByIndex([0]);
    await listOperations.selectListRowsByValue([[{ columnID: ListOperationColumn.DueDate, value: _10Jan2017 }]], false, true);

    selectedRows = await listOperations.getInboundSelectedRows();

    // Retrieve OrderNr of selected operations
    selectedOperationOrderNrs = await listOperations.getCellValueFromRow(ListOperationColumn.OrderNr, selectedRows);

    // Retrieve DueDate of selected operations
    const operationDueDates = await listOperations.getCellValueFromRow(ListOperationColumn.DueDate, selectedRows);

    // Verify selected operations due date are between Jan 8th to 10th
    const isAllSelectedOperationDueBefore11Jan = operationDueDates.every((dueDate: string) => firstPlannedOperationDueDates.includes(dueDate));
    expect(isAllSelectedOperationDueBefore11Jan).toBe(true, 'All Printing operations DueDate <= Jan 10th should be selected');
  });

  it('Step 6: From the context menu select "Plan on earliest avialable resource"', async () => {
    await listOperations.planOnEarliest(ActionTriggerType.ContextMenu, selectedRows, false);

    // Get all node text planned on 1101 and 1103 resources
    const plannedOrderNrsOn1101 = await gcResourceSchedule.getNodesText(gc1101Row);
    const plannedOrderNrsOn1103 = await gcResourceSchedule.getNodesText(gc1103Row);

    // Verify all selected operations have been planned
    selectedOperationOrderNrs = selectedOperationOrderNrs.filter((orderNr: string) => !plannedOrderNrsOn1101.includes(orderNr) && !plannedOrderNrsOn1103.includes(orderNr));
    expect(selectedOperationOrderNrs.length).toBe(
      0,
      `Printing Operation for ${selectedOperationOrderNrs.join(', ')} orders should be planned and visible on ${_1101} or ${_1103} resources`,
    );
  });

  xit('Step 7: Verify that operations have scheduled in the same sequence as they were selected', async () => {
    // FIX ME: (ADSC-24635) The verification is not possible due to the current bug we have in the model
  });

  it('Step 8: Select all unplanned Printing operations with DueDate <= Jan 14th', async () => {
    // Select all printing operation due <= Jan 10th by click on first row and then shift click on operation due = Jan 10th Jan
    await listOperations.selectListRowsByIndex([0]);
    await listOperations.selectListRowsByValue([[{ columnID: ListOperationColumn.DueDate, value: _14Jan2017 }]], false, true);

    selectedRows = await listOperations.getInboundSelectedRows();

    // Retrieve OrderNr of selected operations
    selectedOperationOrderNrs = await listOperations.getCellValueFromRow(ListOperationColumn.OrderNr, selectedRows);

    // Retrieve DueDate of selected operations
    const operationDueDates = await listOperations.getCellValueFromRow(ListOperationColumn.DueDate, selectedRows);

    // Verify selected operations due date are between Jan 11th to 14th
    const isAllSelectedOperationDueBefore11Jan = operationDueDates.every((dueDate: string) => secondPlannedOperationDueDates.includes(dueDate));
    expect(isAllSelectedOperationDueBefore11Jan).toBe(true, 'All Printing operations DueDate <= Jan 14th should be selected');
  });

  it('Step 9: In the action bar select the button "Plan on Earliest"', async () => {
    await listOperations.planOnEarliest(ActionTriggerType.Button, selectedRows, false);

    // Get all node text planned on 1101 and 1103 resources
    const plannedOrderNrsOn1101 = await gcResourceSchedule.getNodesText(gc1101Row);
    const plannedOrderNrsOn1103 = await gcResourceSchedule.getNodesText(gc1103Row);

    // Verify all selected operations have been planned
    selectedOperationOrderNrs = selectedOperationOrderNrs.filter((orderNr: string) => !plannedOrderNrsOn1101.includes(orderNr) && !plannedOrderNrsOn1103.includes(orderNr));
    expect(selectedOperationOrderNrs.length).toBe(
      0,
      `Printing Operation for ${selectedOperationOrderNrs.join(', ')} orders should be planned and visible on ${_1101} or ${_1103} resources`,
    );
  });

  xit('Step 10: Verify that operations have scheduled in the same sequence as they were selected', async () => {
    // FIX ME: (ADSC-24635) The verification is not possible due to the current bug we have in the model
  });
});
