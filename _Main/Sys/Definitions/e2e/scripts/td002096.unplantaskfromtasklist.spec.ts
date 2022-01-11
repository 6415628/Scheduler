/**
 * @file        TD002096
 * @description Unplan task from list 'Task'
 * @author      Adrian Foo, Lua Hau Zheng
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { ListCell } from '../e2elib/lib/src/pageobjects/list/listcell.component';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';

describe('TD002096, Unplan task from task list', () => {
  let appScheduler = AppScheduler.getInstance();

  let pnlResourceSequenceDetails = appScheduler.viewSchedule.formResourceSchedule.pnlResourceSequenceDetails;
  let listTask = pnlResourceSequenceDetails.listTask;
  let listResource = pnlResourceSequenceDetails.listResource;
  let orderNrSecondTask: string;

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
    let viewSchedule = appScheduler.viewSchedule;
    let formResourceSchedule = viewSchedule.formResourceSchedule;

    await viewSchedule.switchTo();

    expect(await formResourceSchedule.isVisible()).toBeTruthy('Expected: Form Resource Schedule should be visible');
  });

  it('Step 2: On Resource Schedule form, Switch to Resource Sequence Details tab.', async () => {
    await pnlResourceSequenceDetails.clickTab();

    expect(listResource.isVisible).toBeTruthy("Expected: List 'Resource' should be visible");
    expect(listTask.isVisible).toBeTruthy("Expected: List 'Resource' should be visible");
  });

  it('Step 3: Select Resource SC1 from Resource list.', async () => {
    let taskRowSecondTask: ListRow | undefined;

    try {
      let resourceRowSC1 = await listResource.getRowByIndex(1); // Resource SC1 is at index 1

      await resourceRowSC1.leftClick();
      await listResource.waitForScreenUpdate(1000);
    } catch {
      expect(taskRowSecondTask).toBeDefined('Resource SC1 could not be found in resource list');
    }
  });

  it('Step 4: Select 2nd task from Task list.', async () => {
    let taskRowSecondTask: ListRow | undefined;
    let taskCellSecondTask: ListCell | undefined;

    try {
      taskRowSecondTask = await listTask.getRowByIndex(1); // Second task is at index 1
      taskCellSecondTask = await taskRowSecondTask.getCell('OrderNr');
      orderNrSecondTask = await taskCellSecondTask.element.getText();
      await taskRowSecondTask.leftClick();
    } catch {
      expect(taskRowSecondTask).toBeDefined('Task row could not be selected in task list');
      expect(taskCellSecondTask).toBeDefined('OrderNr column could not be found in task row');
      expect(orderNrSecondTask).toBeDefined('Value of OrderNr could not be retrieved');
    }
  });

  it('Step 5: Unplan the 2nd task using action bar', async () => {
    let result: ListRow | undefined;

    await appScheduler.abpSchedule.btnUnplan.click();

    try {
      result = await listTask.getRowByValue([{ columnID: 'OrderNr', value: orderNrSecondTask }]);
    } catch {
      // Catch the error by doing nothing as getting error means the task is unplanned
    } finally {
      expect(result).toBeUndefined(`Expected result: Task ${orderNrSecondTask} is unplanned.`);
    }
  });
});
