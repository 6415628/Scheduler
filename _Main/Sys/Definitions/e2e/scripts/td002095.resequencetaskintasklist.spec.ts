/**
 * @file        TD002095
 * @description Resequence task in task list
 * @author      Adrian Foo
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { ListTaskColumn } from '../libsch/forms/resourceschedule';
import { ResourceName } from '../libsch/data/data.resource';
import { ScalpingResourceIndex } from '../libsch/data/data.schedule';
import { QConsole } from '../e2elib/lib/src/helper/qconsole';

describe('TD002095, Resequence task in task list', () => {
  let appScheduler = AppScheduler.getInstance();

  let formResourceSchedule = appScheduler.viewSchedule.formResourceSchedule;
  let listResource = formResourceSchedule.pnlResourceSequenceDetails.listResource;
  let listTask = formResourceSchedule.pnlResourceSequenceDetails.listTask;

  let fourthTaskListRow: ListRow;

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

  it('Step 1: Switch to Scheduling view.', async () => {
    await appScheduler.viewSchedule.switchTo();

    expect(await formResourceSchedule.isVisible()).toBeTruthy('Expected: Form Resource Schedule should be visible');
  });

  it('Step 2: Click on Resource Sequence Details tab on Resource Schedule form', async () => {
    let panelResourceSeqDetails = formResourceSchedule.pnlResourceSequenceDetails;

    await panelResourceSeqDetails.clickTab();

    expect(await listResource.isVisible()).toBeTruthy('Resource List is not visible');
    expect(await listTask.isVisible()).toBeTruthy('Task List is not visible');
  });

  it('Step 3: Select resource SC1 in Resource List', async () => {
    let resourceRow: ListRow | undefined;
    let resourceName = ResourceName.Sc1;
    let resourceIndex = ScalpingResourceIndex.SC1;

    try {
      resourceRow = await listResource.getRowByIndex(resourceIndex);
      await resourceRow.leftClick();
      await QConsole.waitForScreenUpdate();
    } catch {
      expect(resourceRow).toBeDefined(`Resource ${resourceName} could not be selected`);
    }
  });

  it('Step 4: Select 4th task in Task list', async () => {
    try {
      fourthTaskListRow = await listTask.getRowByIndex(3);
      await fourthTaskListRow.leftClick();
    } catch {
      expect(false).toBeTruthy('Fourth task could not be selected');
    }
  });

  it('Step 5: Drag and drop 4th task to 2nd task in Task List', async () => {
    let orderNrcolumn = ListTaskColumn.OrderNr;

    let firstTaskListRow = await listTask.getRowByIndex(0);
    let secondTaskListRow = await listTask.getRowByIndex(1);
    let thirdTaskListRow = await listTask.getRowByIndex(2);

    // Get the OrderNr of the first fourth task row BEFORE drag and drop action
    let firstTaskOrderNrBefore = await listTask.getCellValueFromRow(orderNrcolumn, firstTaskListRow);
    let secondTaskOrderNrBefore = await listTask.getCellValueFromRow(orderNrcolumn, secondTaskListRow);
    let thirdTaskOrderNrBefore = await listTask.getCellValueFromRow(orderNrcolumn, thirdTaskListRow);
    let fourthTaskOrderNrBefore = await listTask.getCellValueFromRow(orderNrcolumn, fourthTaskListRow);

    try {
      if (fourthTaskListRow !== undefined && secondTaskListRow !== undefined) {
        await listTask.dropRowOnTargetRow(fourthTaskListRow, secondTaskListRow);
      }
    } catch (e) {
      expect(false).toBeTruthy('Drag and drop action failed');
    } finally {
      // get first 4 task list rows AFTER drag and drop action done
      firstTaskListRow = await listTask.getRowByIndex(0);
      secondTaskListRow = await listTask.getRowByIndex(1);
      thirdTaskListRow = await listTask.getRowByIndex(2);
      fourthTaskListRow = await listTask.getRowByIndex(3);

      // get the orderNr of the first 4 task AFTER drag and drop action
      let firstTaskOrderNrAfter = await listTask.getCellValueFromRow(orderNrcolumn, firstTaskListRow);
      let secondTaskOrderNrAfter = await listTask.getCellValueFromRow(orderNrcolumn, secondTaskListRow);
      let thirdTaskOrderNrAfter = await listTask.getCellValueFromRow(orderNrcolumn, thirdTaskListRow);
      let fourthTaskOrderNrAfter = await listTask.getCellValueFromRow(orderNrcolumn, fourthTaskListRow);

      // verification
      expect(firstTaskOrderNrAfter === firstTaskOrderNrBefore).toBeTruthy(`Expected first task to be ${firstTaskOrderNrBefore}. Result: ${firstTaskOrderNrAfter}`);
      expect(secondTaskOrderNrAfter === fourthTaskOrderNrBefore).toBeTruthy(`Expected second task to be ${fourthTaskOrderNrBefore}. Result: ${secondTaskOrderNrAfter}`);
      expect(thirdTaskOrderNrAfter === secondTaskOrderNrBefore).toBeTruthy(`Expected third task to be ${secondTaskOrderNrBefore}. Result: ${thirdTaskOrderNrAfter}`);
      expect(fourthTaskOrderNrAfter === thirdTaskOrderNrBefore).toBeTruthy(`Expected fourth task to be ${thirdTaskOrderNrBefore}. Result: ${fourthTaskOrderNrAfter}`);
    }
  });
});
