/**
 * @file        TD002097
 * @description Plan operation on selected resource
 * @author      Adrian Foo
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { ListCell } from '../e2elib/lib/src/pageobjects/list/listcell.component';
import { SortDirection } from '../e2elib/lib/src/helper/enumhelper';
import { ListOperationColumn } from '../libsch/forms/workordersandoperations';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { ResourceName } from '../libsch/data/data.resource';
import { PrintingResourceIndex } from '../libsch/data/data.schedule';
import { ListTaskColumn } from '../libsch/forms/resourceschedule';
import { ActionTriggerType } from '../libappbase/utils';

describe('TD002097, Plan operation on selected resource', () => {
  let appScheduler = AppScheduler.getInstance();

  let formWorkOrdersAndOperation = appScheduler.viewSchedule.formWorkOrdersAndOperation;
  let pnlOperations = formWorkOrdersAndOperation.pnlOperations;
  let listOperation = formWorkOrdersAndOperation.pnlOperations.listOperations;

  let formResourceSchedule = appScheduler.viewSchedule.formResourceSchedule;
  let listResource = formResourceSchedule.pnlResourceSequenceDetails.listResource;
  let listTask = formResourceSchedule.pnlResourceSequenceDetails.listTask;

  let operationRow: ListRow | undefined;
  let orderNrOfOperation = '35';

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

  it('Step 1: Switch to Scheduling view.', async () => {
    await appScheduler.viewSchedule.switchTo();

    expect(await formResourceSchedule.isVisible()).toBe(true, 'Expected: Form Resource Schedule should be visible');
  });

  it('Step 2: Click on Operations tab on Work Orders and Operations list', async () => {
    let checkboxAllowedOperation = formWorkOrdersAndOperation.pnlOperations.cbAllowedOperation;

    await pnlOperations.clickTab();

    if (!(await checkboxAllowedOperation.isChecked())) {
      await checkboxAllowedOperation.click();
    }
  });

  it('Step 3: Click on Resource Sequence Details tab on Resource Schedule form', async () => {
    let panelResourceSeqDetails = formResourceSchedule.pnlResourceSequenceDetails;

    await panelResourceSeqDetails.clickTab();

    expect(await listResource.isVisible()).toBe(true, 'Resource List is not visible');
    expect(await listTask.isVisible()).toBe(true, 'Task List is not visible');
  });

  it('Step 4: Select resource 1101 in Resource List', async () => {
    let resourceRow = await listResource.getRowByIndex(PrintingResourceIndex._1101);
    await resourceRow.leftClick();

    let allOperationRows = await listOperation.getAllRows();
    let allRowsOperationType = await listOperation.getCellValueFromRow(ListOperationColumn.OperationType, allOperationRows);

    // for every operationType in allRowsOperationType should be 'printing' operation
    let isAllPrintingOperation = allRowsOperationType.every((operationType: string) => operationType === 'Printing');

    expect(isAllPrintingOperation).toBe(true, 'Expected: All operation type should be Printing operation');
  });

  it('Step 5: Find printing operation of OrderNr 35', async () => {
    let allowedResourceCell: ListCell | undefined;
    let allowedResources: string[] | undefined;

    try {
      let orderNrColumn = await listOperation.getColumnByValue(ListOperationColumn.OrderNr);
      await orderNrColumn.leftClick(); // Click on the column to reset the sorting
      await orderNrColumn.setSortDirection(SortDirection.ASC);

      operationRow = await listOperation.getRowByValue([{ columnID: ListOperationColumn.OrderNr, value: orderNrOfOperation }]);
      await listOperation.scrollToRow(operationRow);

      if (operationRow !== undefined) {
        await operationRow.leftClick();
      }
      let allowedResourceStr = await listOperation.getCellValueFromRow(ListOperationColumn.AllowedResource, operationRow);

      // Split the returned string by ';' and trim the white space for each value
      allowedResources = allowedResourceStr.split(';').map((resource: string) => resource.trim());
    } catch (e) {
      expect(operationRow).toBeDefined(`Operation row of order ${orderNrOfOperation} could not be found`);
      expect(allowedResourceCell).toBeDefined(`${ListOperationColumn.AllowedResource} column couldn't be found in operation row of order ${orderNrOfOperation}`);
    } finally {
      if (allowedResources !== undefined) {
        let isResource1101Exist = allowedResources.some((resource: string) => resource === ResourceName._1101); // check if some of the resource is 1101
        let isResource1103Exist = allowedResources.some((resource: string) => resource === ResourceName._1103); // check if some of the resource is 1103
        expect(isResource1101Exist).toBe(true, `${ResourceName._1101} is not in the Allowed Resource column`);
        expect(isResource1103Exist).toBe(true, `${ResourceName._1103} is not in the Allowed Resource column`);
      }
    }
  });

  it('Step 6: Plan printing operation of OrderNr 35 on resource 1101', async () => {
    try {
      if (operationRow !== undefined) {
        await listOperation.planOnSelected(ActionTriggerType.ContextMenu, [operationRow]);
      }
      await listTask.getRowByValue([{ columnID: 'OrderNr', value: orderNrOfOperation }]); // Error will be thrown if task couldn't be found
    } catch (error) {
      let taskRowFound = false; // Error is thrown means task is not found
      expect(taskRowFound).toBe(true, `Task with orderNr ${orderNrOfOperation} could not be found in task list. ${error.message}.`);
    }
  });

  it('Step 7: Unplan operation of OrderNr 35', async () => {
    let result: ListRow | undefined;

    if (operationRow !== undefined) {
      await listOperation.unplan(operationRow);
    }
    try {
      result = await listTask.getRowByValue([{ columnID: ListTaskColumn.OrderNr, value: orderNrOfOperation }]);
    } catch {
      // Catch the error by doing nothing as getting error means the task is unplanned
    } finally {
      expect(result).toBeUndefined(`Expected result: Task ${orderNrOfOperation} is unplanned.`);
    }
  });

  it('Step 8: Select resource 1103 in Resource Sequence List', async () => {
    let resourceRow = await listResource.getRowByIndex(PrintingResourceIndex._1103);
    await resourceRow.leftClick();

    let allOperationRows = await listOperation.getAllRows();
    let allRowsOperationType = await listOperation.getCellValueFromRow(ListOperationColumn.OperationType, allOperationRows);

    // for every operationType in allRowsOperationType should be 'printing' operation
    let isAllPrintingOperation = allRowsOperationType.every((operationType: string) => operationType === 'Printing');

    expect(isAllPrintingOperation).toBe(true, 'Expected: All operation type should be Printing operation');
  });

  it('Step 9: Select operation with OrderNr 35 and plan it on resource 1103', async () => {
    try {
      operationRow = await listOperation.getRowByValue([{ columnID: ListOperationColumn.OrderNr, value: orderNrOfOperation }]); // row is changed after selecting other resource

      if (operationRow !== undefined) {
        await listOperation.planOnSelected(ActionTriggerType.Button, [operationRow]);
      }
      await listTask.getRowByValue([{ columnID: ListTaskColumn.OrderNr, value: orderNrOfOperation }]); // Error will be thrown if task couldn't be found
    } catch (error) {
      let taskRowFound = false; // Error is thrown means task is not found
      expect(taskRowFound).toBe(true, `Task with orderNr ${orderNrOfOperation} could not be found in task list. ${error.message}`);
    }
  });
});
