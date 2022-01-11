/**
 * @file        TD002162
 * @description Split a firm planned order by entering incorrect multiples quantity
 * @author      Adrian Foo
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { ResourceName } from '../libsch/data/data.resource';
import { WorkOrder } from '../libsch/data/data.workorder';
import { Product } from '../libsch/data/data.product';
import { Routing } from '../libsch/data/data.routing';
import { ListWorkOrdersColumn } from '../libsch/forms/form.workorders';
import { DialogSplitInternalWorkOrder } from '../libsch/dialogs';

describe('TD002162, Split a firm planned order by entering incorrect multiples quantity', () => {
  // Component used in this test script
  const appScheduler = AppScheduler.getInstance();
  const viewManageOrders = appScheduler.viewManageOrders;
  const viewSchedule = appScheduler.viewSchedule;
  const formWorkOrders = viewManageOrders.formWorkOrders;
  const formResourceSchedule = viewSchedule.formResourceSchedule;
  const listWorkOrders = formWorkOrders.listWorkOrders;
  const ganttChartResourceSchedule = formResourceSchedule.pnlScheduleOverview.gcResourceSchedule;

  let dialogSplitWorkOrder: DialogSplitInternalWorkOrder;

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
    await appScheduler.switchToDemoScenario(DemoCategory.TestDemo, DemoScenario.Test2JoinAndSplitFirmPlannedOrder);
  });

  afterAll(async () => {
    await appScheduler.cleanUpDataset();
    await appScheduler.logout();
  });

  afterEach(async () => {
    await appScheduler.checkToastMessage();
  });

  it('Step 1: Switch to "Schedule" view.', async () => {
    await viewSchedule.switchTo();

    expect(await formResourceSchedule.isVisible()).toBe(true, 'Form resource schedule is not visible');
  });

  it(`Step 2: Find the task nodes on resource ${ResourceName.Fin01}`, async () => {
    let resourceRow = (await ganttChartResourceSchedule.getRowsByTitle(ResourceName.Fin01))[0];
    let nodeTexts = await ganttChartResourceSchedule.getNodesText(resourceRow);

    // Verify the task node sequence is CogA-1-8 -> CogA-2-2 -> CogA-2-1
    expect(nodeTexts[0]).toBe(WorkOrder.CogA_1_8);
    expect(nodeTexts[1]).toBe(WorkOrder.CogA_2_2);
    expect(nodeTexts[2]).toBe(WorkOrder.CogA_2_1);
  });

  it(`Step 3: Find the task nodes on resource ${ResourceName.Fin02}`, async () => {
    let resourceRow = (await ganttChartResourceSchedule.getRowsByTitle(ResourceName.Fin02))[0];
    let nodeTexts = await ganttChartResourceSchedule.getNodesText(resourceRow);

    // Verify the task node sequence is CogA-1-8 -> CogA-2-2 -> CogA-2-1
    expect(nodeTexts[0]).toBe(WorkOrder.CogA_1_8);
    expect(nodeTexts[1]).toBe(WorkOrder.CogA_2_2);
    expect(nodeTexts[2]).toBe(WorkOrder.CogA_2_1);
  });

  it('Step 4: Switch to "Work Order" view', async () => {
    await viewManageOrders.switchTo();

    expect(await formWorkOrders.isVisible()).toBe(true, 'Form work orders is not visible');
  });

  it(`Step 5: Right click on ${WorkOrder.CogA_2_2} work order in list "Work Order" and select split to open a dialog`, async () => {
    let rowWorkOrder = await listWorkOrders.findRowByValue({ columnID: ListWorkOrdersColumn.WorkOrder, searchValue: WorkOrder.CogA_2_2 });
    dialogSplitWorkOrder = await listWorkOrders.openSplitWorkOrderDialog(rowWorkOrder);

    expect(await dialogSplitWorkOrder.isVisible()).toBe(true, 'Split work order dialog is not visible');
  });

  it('Step 6: Enter 13 into the quantity text box', async () => {
    const btnOk = dialogSplitWorkOrder.btnOk;

    await dialogSplitWorkOrder.setQty('13');
    expect(await btnOk.isClickable()).toBe(false, 'OK button should be disabled');

    let lotSize = await dialogSplitWorkOrder.nmpNrOfLots.getValue();
    expect(lotSize).toBe('3', 'Expect number of lots in the text editor to be 3');

    let tooltip = await dialogSplitWorkOrder.btnOk.getTooltip();
    expect(tooltip).not.toBe('', 'Tooltip not shown at OK button');
  });

  it('Step 7: Override the warning checkbox and click OK button', async () => {
    const btnOk = dialogSplitWorkOrder.btnOk;

    await dialogSplitWorkOrder.cbOverrideWarning.click();
    expect(await btnOk.isClickable()).toBe(true, 'OK button should be enabled');

    await dialogSplitWorkOrder.btnOk.click();
  });

  it(`Step 8: Find the new split work order - ${WorkOrder.CogA_2_3}`, async () => {
    let rowWorkOrderNew = await listWorkOrders.findRowByValue({ columnID: ListWorkOrdersColumn.WorkOrder, searchValue: WorkOrder.CogA_2_3 });
    expect(rowWorkOrderNew).toBeDefined(`Split work order ${WorkOrder.CogA_2_3} couldn't be found.`);
    // Verify new split work order has correct due date, qty, product, and routing
    const { Due, Qty, ProductCol, RoutingCol } = await listWorkOrders.getCellValuesFromRow(rowWorkOrderNew, ListWorkOrdersColumn);
    const expectedDue = '2-Jan-2019 0:00';
    const expectedQty = '13';

    expect(Due).toBe(expectedDue, `Expected due date to be ${expectedDue}`);
    expect(Qty).toBe(expectedQty, `Expected qty to be ${expectedQty}`);
    expect(ProductCol).toBe(Product.CogA);
    expect(RoutingCol).toBe(Routing.CogA2);
  });

  it(`Step 9: Find the original work order - ${WorkOrder.CogA_2_2}`, async () => {
    let rowWorkOrderOriginal = await listWorkOrders.findRowByValue({ columnID: ListWorkOrdersColumn.WorkOrder, searchValue: WorkOrder.CogA_2_2 });
    expect(rowWorkOrderOriginal).toBeDefined(`Split work order ${WorkOrder.CogA_2_2} couldn't be found.`);

    // Verify original split work order has correct due date, qty, product, and routing
    let { Due, Qty, ProductCol, RoutingCol } = await listWorkOrders.getCellValuesFromRow(rowWorkOrderOriginal, ListWorkOrdersColumn);
    const expectedDue = '2-Jan-2019 0:00';
    const expectedQty = '11';

    expect(Due).toBe(expectedDue, `Expected due date to be ${expectedDue}`);
    expect(Qty).toBe(expectedQty, `Expected qty to be ${expectedQty}`);
    expect(ProductCol).toBe(Product.CogA);
    expect(RoutingCol).toBe(Routing.CogA2);
  });

  it('Step 10: Switch to "Schedule" view.', async () => {
    await viewSchedule.switchTo();

    expect(await formResourceSchedule.isVisible()).toBe(true, 'Form resource schedule is not visible');
  });

  it(`Step 11: Find the tasks nodes on resource ${ResourceName.Fin01} Gantt chart row`, async () => {
    let resourceRow = (await ganttChartResourceSchedule.getRowsByTitle(ResourceName.Fin01))[0];
    let nodeTexts = await ganttChartResourceSchedule.getNodesText(resourceRow);

    expect(nodeTexts[0]).toBe(WorkOrder.CogA_1_8);
    expect(nodeTexts[1]).toBe(WorkOrder.CogA_2_2);
    expect(nodeTexts[2]).toBe(WorkOrder.CogA_2_3);
    expect(nodeTexts[3]).toBe(WorkOrder.CogA_2_1);
  });
});
