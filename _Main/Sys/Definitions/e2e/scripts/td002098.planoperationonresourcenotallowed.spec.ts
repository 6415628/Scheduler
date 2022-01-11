/**
 * @file        TD002098
 * @description Plan on selected resource which is not allowed
 * @author      Adrian Foo
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { ListOperationColumn } from '../libsch/forms/workordersandoperations';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { ResourceName } from '../libsch/data/data.resource';
import { CasingResourceIndex } from '../libsch/data/data.schedule';
import { OperationType } from '../libsch/data/data.workorder';

describe('TD002098, Plan on selected resource which is not allowed', () => {
  // Component used in this test script
  let appScheduler = AppScheduler.getInstance();

  let abpSchedule = appScheduler.abpSchedule;
  let formWorkOrdersAndOperation = appScheduler.viewSchedule.formWorkOrdersAndOperation;
  let pnlOperations = formWorkOrdersAndOperation.pnlOperations;
  let listOperation = formWorkOrdersAndOperation.pnlOperations.listOperations;

  let formResourceSchedule = appScheduler.viewSchedule.formResourceSchedule;
  let listResource = formResourceSchedule.pnlResourceSequenceDetails.listResource;
  let listTask = formResourceSchedule.pnlResourceSequenceDetails.listTask;

  // Data used in this test script
  let orderNr = '35';

  // Variable used across multiple test steps
  let operationRow: ListRow | undefined;

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

    expect(await formResourceSchedule.isVisible()).toBeTruthy('Expected: Form Resource Schedule should be visible');
  });

  it('Step 2: Click on Resource Sequence Details tab on Resource Schedule form', async () => {
    let panelResourceSeqDetails = formResourceSchedule.pnlResourceSequenceDetails;

    await panelResourceSeqDetails.clickTab();

    expect(await listResource.isVisible()).toBe(true, 'Resource List is not visible');
    expect(await listTask.isVisible()).toBe(true, 'Task List is not visible');
  });

  it(`Step 3: Select resource ${ResourceName._1201} in Resource List`, async () => {
    let resourceRow: undefined | ListRow;
    try {
      // TODO: change getRowByIndex to getRowByValue with parent values ONCE Scheduler is upgraded to 6.2.
      resourceRow = await listResource.getRowByIndex(CasingResourceIndex._1201);
      await resourceRow.leftClick();
    } catch (e) {
      expect(resourceRow).toBeDefined(`Resource ${ResourceName._1201} couldn't be found in resource list. ${e}`);
    }
  });

  it(`Step 4: Select printing operation of OrderNr ${orderNr}`, async () => {
    await pnlOperations.clickTab();
    let dialogFilterManager = await listOperation.openFilterDialogOnColumn(ListOperationColumn.OperationType);
    await dialogFilterManager.filter(OperationType.Printing);
    await listOperation.searchList(ListOperationColumn.OrderNr, orderNr);

    operationRow = await listOperation.getRowByValue([{ columnID: ListOperationColumn.OrderNr, value: orderNr }]);
    expect(operationRow).toBeDefined(`Operation row of order ${orderNr} could not be found`);
    await operationRow.leftClick();
  });

  it('Step 5: Hover on "Plan On Selected" button at action bar page "Schedule"', async () => {
    let btnPlanOnSelected = abpSchedule.btnPlanOnSelected;
    let tooltipPattern = new RegExp(
      `[\\S]+ cannot be planned on ${ResourceName._1201} because:\\&lt;br&gt;[\\S]+ has type ${OperationType.Printing} while resource ${ResourceName._1201} has type ${OperationType.Casing}.`,
      'g',
    );

    await abpSchedule.click();
    let tooltipText = await btnPlanOnSelected.getTooltip(); // Hover and get the tooltip text
    let hasValidTooltipText = tooltipPattern.test(tooltipText);

    expect(btnPlanOnSelected.isDisabled()).toBe(true, 'Expected: Plan on selected button should be disabled');
    expect(hasValidTooltipText).toBe(true, `Unexpected tooltip text: ${tooltipText}, expected to be like ${tooltipPattern}`);
  });
});
