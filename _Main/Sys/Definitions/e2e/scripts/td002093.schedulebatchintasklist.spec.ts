/**
 * @file        TD002093
 * @description  Schedule batch in task list
 * @author      Adrian Foo
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { ResourceName } from '../libsch/data/data.resource';
import { OperationType, Practice } from '../libsch/data/data.workorder';
import { HeatingResourceIndex } from '../libsch/data/data.schedule';
import { ListOperationColumn, ListOperations } from '../libsch/forms/workordersandoperations';
import { ListTask, ListTaskColumn } from '../libsch/forms/resourceschedule';

describe('TD002093 , Schedule batch in task list', () => {
  // Component used in this test script
  let appScheduler = AppScheduler.getInstance();

  let formWorkOrdersAndOperation = appScheduler.viewSchedule.formWorkOrdersAndOperation;
  let pnlOperations = formWorkOrdersAndOperation.pnlOperations;
  let listOperation = formWorkOrdersAndOperation.pnlOperations.listOperations;

  let formResourceSchedule = appScheduler.viewSchedule.formResourceSchedule;
  let pnlResourceSequenceDetails = formResourceSchedule.pnlResourceSequenceDetails;
  let listResource = pnlResourceSequenceDetails.listResource;
  let listTask = pnlResourceSequenceDetails.listTask;

  // Data used in this test script
  let expectedStartTime = '5-Jan 16:57';
  let expectedEndTime = '6-Jan 4:57';

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

  it('Setup - Switch to Scheduling view.', async () => {
    await appScheduler.viewSchedule.switchTo();

    expect(await formResourceSchedule.isVisible()).toBe(true, 'Expected: Form Resource Schedule should be visible');
    expect(await formWorkOrdersAndOperation.isVisible()).toBe(true, 'Expected: Form work orders and operations should be visible');
  });

  it('Setup - Click on "Operations" tab in the "Work Orders and Operation" form', async () => {
    await pnlOperations.clickTab();

    expect(await listOperation.isVisible()).toBe(true, 'List operation is not visible');
  });

  it('Setup - Check the "Allowed Operations" and "Unplanned" checkbox in the "Operation" panel', async () => {
    let checkboxAllowedOperation = formWorkOrdersAndOperation.pnlOperations.cbAllowedOperation;
    let checkboxUnplanned = formWorkOrdersAndOperation.pnlOperations.cbUnplanned;

    await checkboxAllowedOperation.click();
    await checkboxUnplanned.click();

    expect(await checkboxAllowedOperation.isChecked()).toBe(true, '"Allowed Operation" checkbox should be checked');
    expect(await checkboxUnplanned.isChecked()).toBe(true, '"Unplanned" checkbox should be checked');
  });

  it('Step 1: Click on "Resource Sequence Details" tab in the "Resource Schedule" form', async () => {
    await pnlResourceSequenceDetails.clickTab();

    expect(await listResource.isVisible()).toBe(true, 'List resource is not visible');
    expect(await listTask.isVisible()).toBe(true, 'List resource is not visible');
  });

  it(`Step 2: Select resource ${ResourceName.BigPit1} in the "Resources" list`, async () => {
    let resoureRow = await listResource.getRowByIndex(HeatingResourceIndex.BigPit1);
    await resoureRow.leftClick();

    expect(await resoureRow.isSelected()).toBe(true, `Resource ${ResourceName.BigPit1} is not selected`);

    // Verification
    let operationRows = await listOperation.getAllRows();
    let rowsOperationTypeValues = await listOperation.getCellValueFromRow(ListOperationColumn.OperationType, operationRows);
    let isAllCorectOperationType = rowsOperationTypeValues.every((value: string) => value === OperationType.Heating);
    expect(isAllCorectOperationType).toBe(true, `Operation list should be showing only ${OperationType.Heating} operations`);
  });

  it('Step 3: Drag first 3 operations onto task at first row', async () => {
    // configure columns at operation list and task list
    await listOperation.configureColumns(ListOperations.abpList, ListOperationColumn.Practice);
    await listTask.configureColumns(ListTask.abpList, ListTaskColumn.BatchId);

    // filter out practice B
    let dialogFilterManager = await listOperation.openFilterDialogOnColumn(ListOperationColumn.Practice);
    await dialogFilterManager.filter(`Practice = ${Practice.B}`);

    // select first 3 rows
    await listOperation.selectListRowsByIndex([0], true); // Deselect the first row
    await listOperation.selectListRowsByIndex([0, 1, 2], true);
    let selectedRows = await listOperation.getInboundSelectedRows();
    let selectedRowsOrderNr = await listOperation.getCellValueFromRow(ListOperationColumn.OrderNr, selectedRows);

    // drop selected rows to task list
    await listTask.dropRowOnWhiteSpace(selectedRows);

    // At task list, click on the last row
    let newTaskRow = await listTask.getLastRow();
    let newTaskBatchId = await listTask.getCellValueFromRow(ListTaskColumn.BatchId, newTaskRow);
    await newTaskRow.leftClick();

    // At operation list, uncheck the 'unplanned' checkbox and observe the highlighted row
    await formWorkOrdersAndOperation.pnlOperations.cbUnplanned.click();
    let highlightedRow = await listOperation.getHighlightedRows();
    let highlightedRowOrderNr = await listOperation.getCellValueFromRow(ListOperationColumn.OrderNr, highlightedRow);

    // Verification: New batch is created with 3 selected operations
    let isAllOrderNrMatch = highlightedRowOrderNr.every((el: string) => selectedRowsOrderNr.indexOf(el) !== -1);
    expect(isAllOrderNrMatch).toBe(true, `Highlighted operation should have order nr ${selectedRowsOrderNr.join(', ')}.`);

    // Verification: New batch is at second row
    let secondRow = await listTask.getRowByIndex(1);
    let secondRowBatchId = await listTask.getCellValueFromRow(ListTaskColumn.BatchId, secondRow);
    expect(secondRowBatchId).toBe(newTaskBatchId, `New task with batch id ${newTaskBatchId} should be scheduled as the second task on ${ResourceName.BigPit1}.`);

    // Verification: Verify start time and end time to be 5-Jan 16:57 and 6-Jan 4:57
    let startTime = await listTask.getCellValueFromRow(ListTaskColumn.Start, newTaskRow);
    let endTime = await listTask.getCellValueFromRow(ListTaskColumn.End, newTaskRow);
    expect(startTime).toBe(expectedStartTime);
    expect(endTime).toBe(expectedEndTime);
  });
});
