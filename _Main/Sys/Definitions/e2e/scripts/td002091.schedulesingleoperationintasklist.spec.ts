/**
 * @file        TD002091
 * @description Schedule single operation in task list
 * @author      Adrian Foo
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { ResourceName } from '../libsch/data/data.resource';
import { ScalpingResourceIndex } from '../libsch/data/data.schedule';
import { ListOperationColumn } from '../libsch/forms/workordersandoperations';
import { ListTaskColumn } from '../libsch/forms/resourceschedule';
import { QConsole } from '../e2elib/lib/src/helper/qconsole';
import { OperationType } from '../libsch/data/data.workorder';

describe('TD002091, Schedule single operation in task list', () => {
  // Component used in this test script
  let appScheduler = AppScheduler.getInstance();
  let viewSchedule = appScheduler.viewSchedule;

  let formWorkOrdersAndOperation = viewSchedule.formWorkOrdersAndOperation;
  let pnlOperations = formWorkOrdersAndOperation.pnlOperations;
  let checkboxAllowedOperation = formWorkOrdersAndOperation.pnlOperations.cbAllowedOperation;
  let listOperation = formWorkOrdersAndOperation.pnlOperations.listOperations;

  let formResourceSchedule = appScheduler.viewSchedule.formResourceSchedule;
  let panelResouceSequenceDetails = formResourceSchedule.pnlResourceSequenceDetails;
  let listResource = panelResouceSequenceDetails.listResource;
  let listTask = panelResouceSequenceDetails.listTask;

  // Data used in this test script
  let operationOrderNr = '10099'; // operation with orderNr 10090 will be dragged
  let taskToDroppedIndex = 1; // second row of task will be dropped

  // Variable used across multiple test steps
  let task1OrderNrBefore: string;
  let task2OrderNrBefore: string;
  let previousTask2StartTime: string;
  let previousTask2EndTime: string;
  let previousTask3StartTime: string;

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
    await appScheduler.switchToDemoScenario(DemoCategory.SalesDemo, DemoScenario.AluminumHotRolling);
  });

  afterAll(async () => {
    await appScheduler.cleanUpDataset();
    await viewSchedule.reset();
    await appScheduler.logout();
  });

  afterEach(async () => {
    await appScheduler.checkToastMessage();
  });

  it('Setup: Switch to Scheduling view.', async () => {
    await appScheduler.viewSchedule.switchTo();

    expect(await formResourceSchedule.isVisible()).toBe(true, 'Expected: Form Resource Schedule should be visible');
    expect(await formWorkOrdersAndOperation.isVisible()).toBe(true, 'Expected: Form work orders and operations should be visible');
  });

  it('Setup: Click on "Operations" tab in the "Work Orders and Operation" form', async () => {
    await pnlOperations.clickTab();

    expect(await listOperation.isVisible()).toBe(true, 'List operation is not visible');
  });

  it('Setup: Check the "Allowed Operations" checkbox in the "Operation" panel', async () => {
    await checkboxAllowedOperation.click();

    expect(await checkboxAllowedOperation.isChecked()).toBe(true, '"Allowed Operation" checkbox should be checked');
  });

  it('Step 1: Click on "Resource Sequence Details" tab in the "Resource Schedule" form', async () => {
    await panelResouceSequenceDetails.clickTab();

    expect(await listResource.isVisible()).toBe(true, 'List resource is not visible');
    expect(await listTask.isVisible()).toBe(true, 'List resource is not visible');
  });

  it(`Step 2: Select resource ${ResourceName.Sc1} in the "Resources" list`, async () => {
    let resoureRow = await listResource.getRowByIndex(ScalpingResourceIndex.SC1);
    await resoureRow.leftClick();
    await QConsole.waitForStable();

    expect(await resoureRow.isSelected()).toBe(true, `Resource ${ResourceName.Sc1} is not selected`);

    // Verification
    let operationRows = await listOperation.getAllRows();
    let rowsOperationTypeValues = await listOperation.getCellValueFromRow(ListOperationColumn.OperationType, operationRows);
    let isAllCorectOperationType = rowsOperationTypeValues.every((value: string) => value === OperationType.Scalping);
    expect(isAllCorectOperationType).toBe(true, `Operation list should be showing only ${OperationType.Scalping} operations`);

    // Observation
    // Get the current tasks BEFORE drag and drop
    let rowTask1 = await listTask.getRowByIndex(taskToDroppedIndex - 1);
    let rowTask2 = await listTask.getRowByIndex(taskToDroppedIndex);
    let rowTask3 = await listTask.getRowByIndex(taskToDroppedIndex + 1);

    // Observe the order nr of the tasks BEFORE drag and drop
    task1OrderNrBefore = await listTask.getCellValueFromRow(ListTaskColumn.OrderNr, rowTask1);
    task2OrderNrBefore = await listTask.getCellValueFromRow(ListTaskColumn.OrderNr, rowTask2);

    // Observe the start and end time of the tasks BEFORE drag and drop
    previousTask2StartTime = await listTask.getCellValueFromRow(ListTaskColumn.Start, rowTask2);
    previousTask2EndTime = await listTask.getCellValueFromRow(ListTaskColumn.End, rowTask2);
    previousTask3StartTime = await listTask.getCellValueFromRow(ListTaskColumn.Start, rowTask3);
  });

  it(`Step 3: Drag operation with order nr ${operationOrderNr} onto task at row number ${taskToDroppedIndex + 1}`, async () => {
    // Filter out operation based on order nr
    let dialogFilterManager = await listOperation.openFilterDialogOnColumn(ListOperationColumn.OrderNr);
    await dialogFilterManager.filter(`${ListOperationColumn.OrderNrFilter} = ${operationOrderNr}`);

    // Drag the operation and plan it on task
    let sourceRow = await listOperation.getRowByValue([{ columnID: ListOperationColumn.OrderNr, value: operationOrderNr }]);
    let targetRow = await listTask.getRowByIndex(taskToDroppedIndex);
    await listTask.dropRowOnTargetRow(sourceRow, targetRow);

    // Observation
    // Get the current tasks AFTER drag and drop
    let rowTask1 = await listTask.getRowByIndex(taskToDroppedIndex - 1);
    let rowTask2 = await listTask.getRowByIndex(taskToDroppedIndex);
    let rowTask3 = await listTask.getRowByIndex(taskToDroppedIndex + 1);

    // Observe the order nr of the tasks AFTER drag and drop
    let task1OrderNrAfter = await listTask.getCellValueFromRow(ListTaskColumn.OrderNr, rowTask1);
    let task2OrderNrAfter = await listTask.getCellValueFromRow(ListTaskColumn.OrderNr, rowTask2);
    let task3OrderNrAfter = await listTask.getCellValueFromRow(ListTaskColumn.OrderNr, rowTask3);

    // Observe the start and end time of the tasks AFTER drag and drop
    let currentTask2StartTime = await listTask.getCellValueFromRow(ListTaskColumn.Start, rowTask2);
    let currentTask2EndTime = await listTask.getCellValueFromRow(ListTaskColumn.End, rowTask2);
    let currentTask3StartTime = await listTask.getCellValueFromRow(ListTaskColumn.Start, rowTask3);

    // Verification
    expect(task1OrderNrAfter).toBe(task1OrderNrBefore, `Order nr of task at row number ${taskToDroppedIndex} in task list should be ${task1OrderNrBefore}.`);
    expect(task2OrderNrAfter).toBe(operationOrderNr, `Order nr of task at row number ${taskToDroppedIndex + 1} in task list should be ${operationOrderNr}.`);
    expect(task3OrderNrAfter).toBe(task2OrderNrBefore, `Order nr of task at row number ${taskToDroppedIndex + 2} in task list should be ${task2OrderNrBefore}.`);

    expect(currentTask2StartTime).toBe(previousTask2StartTime);
    expect(currentTask2EndTime).toBe(previousTask2EndTime);
    expect(currentTask3StartTime).toBe(previousTask3StartTime);
  });
});
