/**
 * @file        TD002092
 * @description Drag single operation to resource task list where it is not allowed
 * @author      Adrian Foo
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { ResourceName } from '../libsch/data/data.resource';
import { PrintingResourceIndex } from '../libsch/data/data.schedule';
import { ListOperationColumn } from '../libsch/forms/workordersandoperations';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { OperationType } from '../libsch/data/data.workorder';

describe('TD002092, Drag single operation to resource task list where it is not allowed', () => {
  let appScheduler = AppScheduler.getInstance();

  let viewSchedule = appScheduler.viewSchedule;
  let formResourceSchedule = viewSchedule.formResourceSchedule;
  let listResource = formResourceSchedule.pnlResourceSequenceDetails.listResource;
  let listTask = formResourceSchedule.pnlResourceSequenceDetails.listTask;
  let formWorkOrdersAndOperations = viewSchedule.formWorkOrdersAndOperation;
  let listOperation = formWorkOrdersAndOperations.pnlOperations.listOperations;

  // Data used in this script
  let operationOrderNr = '35';
  let operationResourceAllowed = [ResourceName._1101.valueOf(), ResourceName._1103.valueOf()];

  // Variable used across multiple test steps
  let operationRowToPlan: ListRow;

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
    await appScheduler.switchToDemoScenario(DemoCategory.SalesDemo, DemoScenario.Paperbags);
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

  it(`Step 2: Select resource ${ResourceName._1102} in the resource list in the tab Resource Sequence Details.`, async () => {
    await formResourceSchedule.pnlResourceSequenceDetails.clickTab();
    await listResource.selectListRowsByIndex([PrintingResourceIndex._1102]);
  });

  it(`Step 3: Find the ${OperationType.Printing} operation of order nr ${operationOrderNr} in the operations list.`, async () => {
    await formWorkOrdersAndOperations.pnlOperations.clickTab();
    let dialogFilterManager = await listOperation.openFilterDialogOnColumn(ListOperationColumn.OperationType);
    await dialogFilterManager.filter(OperationType.Printing);
    await listOperation.searchList(ListOperationColumn.OrderNr, operationOrderNr);

    let selectedRows = await listOperation.getInboundSelectedRows();
    expect(selectedRows.length).toBe(1, `Expect only 1 row is selected but getting ${selectedRows.length}`);
    operationRowToPlan = selectedRows[0];

    // Verify the value of ResourceAllowed of the operation row
    let allowedResourceCellValue = await listOperation.getCellValueFromRow(ListOperationColumn.AllowedResource, operationRowToPlan);
    let allowedResources = allowedResourceCellValue.split(';').map((value: string) => value.trim()); // Split the cell value by ; and trim the whitespace

    let hasValidAllowedResources = allowedResources.every((allowedResource: string) => operationResourceAllowed.indexOf(allowedResource) >= 0); // Check does allowedResources contains every element in operationResourceAllowed
    let errMsg = `Expect ${OperationType.Printing} operation of order nr ${operationOrderNr} has ${operationResourceAllowed.join(
      ', ',
    )} as allowed resource but getting ${allowedResources.join(', ')}`;
    expect(hasValidAllowedResources).toBe(true, errMsg);
  });

  it(`Step 4: Drag the ${OperationType.Printing} operation of order ${operationOrderNr} to the task list`, async () => {
    let firstTaskRow = await listTask.getRowByIndex(0);
    let tooltip = await listTask.dropRowOnTargetRow(operationRowToPlan, firstTaskRow, true);

    expect(tooltip).not.toBe('', 'Precondition should be shown to prevent planning the opreation on a resource where it is not allowed.');
  });
});
