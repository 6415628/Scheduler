/**
 * @file        TD002094
 * @description Drag operations with incompatible practice to batch resource task list
 * @author      Adrian Foo
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { HeatingResourceIndex } from '../libsch/data/data.schedule';
import { ResourceName } from '../libsch/data/data.resource';
import { ListOperations, ListOperationColumn } from '../libsch/forms/workordersandoperations';
import { ListTask, ListTaskColumn } from '../libsch/forms/resourceschedule';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';

describe('TD002094, Drag operations with incompatible practice to batch resource task list', () => {
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
  let operationPractice = 'B';

  // Variable used accross multiple test steps
  let taskMaxBatchSize: number;
  let taskBatchSize: number;
  let taskPossiblePractices: string;
  let taskRowToBePlanned: ListRow;

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

  it('Setup: Switch to Scheduling view.', async () => {
    await appScheduler.viewSchedule.switchTo();

    expect(await formResourceSchedule.isVisible()).toBe(true, 'Expected: Form Resource Schedule should be visible');
  });

  it('Setup: Click on Resource Sequence Details tab in Resource Schedule form', async () => {
    await pnlResourceSequenceDetails.clickTab();

    expect(await listResource.isVisible()).toBe(true, 'Resources List is not visible');
    expect(await listTask.isVisible()).toBe(true, 'Resources List is not visible');
  });

  it('Setup: Click on Operations tab on Work Orders and Operations list and check the Allowed Operation checkbox', async () => {
    await pnlOperations.clickTab();
    await formWorkOrdersAndOperation.pnlOperations.cbAllowedOperation.click();

    expect(await listOperation.isVisible()).toBe(true, 'Operation List is not visible');
  });

  it(`Step 1: Click on resource ${ResourceName.BigPit1} in Resource List`, async () => {
    let resourceRow: undefined | ListRow;

    try {
      resourceRow = await listResource.getRowByIndex(HeatingResourceIndex.BigPit1);
      await resourceRow.leftClick();
    } catch (e) {
      expect(resourceRow).toBeDefined(`Resource ${ResourceName.BigPit1} couldn't be found. ${e}`);
    }
  });

  it('Step 2: Configure column on Task list and Operation List', async () => {
    let taskColumnsToShow = [ListTaskColumn.MaxBatchSize, 'ListTasks_astype(BatchTask).Batch.Size', ListTaskColumn.PossiblePractices];
    // let taskColumnsToShow = [ListTaskColumn.MAX_BATCH_SIZE, ListTaskColumn.BATCH_SIZE, ListTaskColumn.POSSIBLE_PRACTICES];
    await listTask.configureColumns(ListTask.abpList, ...taskColumnsToShow);
    await listOperation.configureColumns(ListOperations.abpList, ListOperationColumn.Practice);

    // Observe the values of ths task row to be used for verification in other steps
    taskRowToBePlanned = await listTask.getRowByIndex(0);
    taskMaxBatchSize = parseInt(await listTask.getCellValueFromRow(ListTaskColumn.MaxBatchSize, taskRowToBePlanned), 10);
    taskBatchSize = parseInt(await listTask.getCellValueFromRow(ListTaskColumn.BatchSize, taskRowToBePlanned), 10);
    taskPossiblePractices = await listTask.getCellValueFromRow(ListTaskColumn.PossiblePractices, taskRowToBePlanned);
  });

  it(`Step 4: Drag first 3 operation with practisce ${operationPractice} and drop it on first list task`, async () => {
    // Filter out operation with practice B
    let dialogFilterManager = await listOperation.openFilterDialogOnColumn(ListOperationColumn.Practice);
    await dialogFilterManager.filter(`Practice = ${operationPractice}`);

    // Select first 3 operation row
    await listOperation.selectListRowsByIndex([0, 1, 2], true);
    let selectedOperationRows = await listOperation.getInboundSelectedRows();

    // Drag and drop the selected operations row
    let tooltip = await listOperation.dropRowOnTargetRow(selectedOperationRows, taskRowToBePlanned, true);

    // Verification of the tooltip text
    let operationNotAllowedText = `Selected operations are not allowed on ${ResourceName.BigPit1} because:`;
    let isValidTooltip = tooltip.includes(operationNotAllowedText);
    expect(isValidTooltip).toBe(true, `Tooltip does not include: "${operationNotAllowedText}"`);

    let totalBatch = 3 + taskBatchSize;
    let isBatchSizeExceeded = totalBatch > taskMaxBatchSize;
    let isValidPractice = taskPossiblePractices === operationPractice;

    if (isBatchSizeExceeded) {
      let batchSizeExceededText = `The batch cannot fit in the resource. Max Batch Size is ${taskMaxBatchSize}`;
      isValidTooltip = isBatchSizeExceeded ? tooltip.includes(batchSizeExceededText) : true;

      expect(isValidTooltip).toBe(true, `Tooltip does not include: '${batchSizeExceededText}'`);
    }

    if (!isValidPractice) {
      let incorrectPracticeText = 'Selected operations do not have a practice in common';
      isValidTooltip = isValidPractice ? true : tooltip.includes(incorrectPracticeText);

      expect(isValidTooltip).toBe(true, `Tooltip does not include: '${incorrectPracticeText}'`);
    }
  });
});
