/**
 * @file        ADSC-5288
 * @description Creating firm planned orders for multiple planned orders
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { LogMessage } from '../libappbase/logmessage';
import { ListPlannedOrdersColumn } from '../libsch/forms/form.mpsplannedorder';
import { Routing } from '../libsch/data/data.routing';
import { DueDate, WorkOrder } from '../libsch/data/data.workorder';
import { ActionTriggerType, asyncFilter } from '../libappbase/utils';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { QuantityType } from '../libsch/data/data.manageorders';
import { ListWorkOrdersColumn } from '../libsch/forms/form.workorders';

describe('ADSC-5288, Creating firm planned orders for multiple planned orders', () => {
  const appScheduler = AppScheduler.getInstance();

  const viewManageOrders = appScheduler.viewManageOrders;
  const formMPSPlannedOrders = viewManageOrders.formMPSPlannedOrders;
  const listPlannedOrders = formMPSPlannedOrders.listPlannedOrders;
  const formWorkOrders = viewManageOrders.formWorkOrders;
  const listWorkOrders = formWorkOrders.listWorkOrders;
  let plannedOrderRow1: ListRow;
  let plannedOrderRow2: ListRow;
  let plannedOrder1Qty = '64';
  let plannedOrder2Qty = '52';

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
    await appScheduler.switchToDemoScenario(DemoCategory.TestDemo, DemoScenario.MpScIntegrationWithExistingMPSData);
  });

  afterAll(async () => {
    await appScheduler.cleanUpDataset();
    await appScheduler.logout();
  });

  afterEach(async () => {
    await appScheduler.checkToastMessage();
  });

  it('Step 1: Open view Manage Work Order -> Manage Orders', async () => {
    await viewManageOrders.switchTo();
    expect(await formMPSPlannedOrders.isVisible()).toBe(true, LogMessage.form_notVisible('MPS Planned Order'));
    expect(await formWorkOrders.isVisible()).toBe(true, LogMessage.form_notVisible('Work Order'));
  });

  it('Step 2: Select planned order with RoutingID Electrical engine 120kW, DueDate 2-Jan-2019 in form MPS Planned Orders and press Convert to Firm', async () => {
    // Get planned order row
    plannedOrderRow1 = await listPlannedOrders.getRowByRoutingAndDueDate(Routing.ElectricalEngine120kW, DueDate._2Jan2019);

    // Verify total quantity = open quantity = 64 and firmed quantity is 0
    const totalQty = await listPlannedOrders.getCellValueFromRow(ListPlannedOrdersColumn.Qty, plannedOrderRow1);
    expect(totalQty).toBe(plannedOrder1Qty, LogMessage.value_notMatched(plannedOrder1Qty, totalQty));
    const openQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Open, plannedOrderRow1))[0];
    expect(openQty).toBe(totalQty, LogMessage.value_notMatched(totalQty, openQty));
    const firmedQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Firmed, plannedOrderRow1))[0];
    expect(firmedQty).toBe('0', LogMessage.value_notMatched('0', firmedQty));

    // Convert the Planned Order to Firmed Planned Order
    await listPlannedOrders.createFirmPlannedOrder(ActionTriggerType.Button, [plannedOrderRow1]);
  });

  it('Step 3: Verify that once the firm planned order has been created, the open quantity of the planned order is 0', async () => {
    const totalQty = await listPlannedOrders.getCellValueFromRow(ListPlannedOrdersColumn.Qty, plannedOrderRow1);
    const firmedQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Firmed, plannedOrderRow1))[0];
    expect(totalQty).toBe(firmedQty, LogMessage.value_notMatched(firmedQty, totalQty));
    const openQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Open, plannedOrderRow1))[0];
    expect(openQty).toBe('0', LogMessage.value_notMatched('0', openQty));
  });

  it('Step 4: Select two planned orders: RoutingID Electrical engine 120kW, DueDate 2-Jan-2019 and RoutingID Electrical engine 85kW, DueDate 3-Jan-2019 and verify their open quantities are 0 and 52, respectively', async () => {
    // Get planned order rows
    plannedOrderRow2 = await listPlannedOrders.getRowByRoutingAndDueDate(Routing.ElectricalEngine85kW, DueDate._3Jan2019);

    // Verify their open quantities are 0 and 52, respectively
    let openQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Open, plannedOrderRow1))[0];
    expect(openQty).toBe('0', LogMessage.value_notMatched('0', openQty));
    openQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Open, plannedOrderRow2))[0];
    expect(openQty).toBe(plannedOrder2Qty, LogMessage.value_notMatched(plannedOrder2Qty, openQty));
  });

  it('Step 5: Press Manage -> Convert to Firm. Verify only one firm planned order is created, for planned order Electrical engine 85kW, DueDate 3-Jan-2019. The new firm planned order has quantity 52.', async () => {
    // Get all firm planned order rows
    const workOrderRowsBeforeConvert = await listWorkOrders.getAllRows();
    const workOrdersBeforeConvert = await listWorkOrders.getCellValueFromRow(ListWorkOrdersColumn.WorkOrder, workOrderRowsBeforeConvert);

    // Convert the Planned Order to Firmed Planned Order
    await listPlannedOrders.createFirmPlannedOrder(ActionTriggerType.Button, [plannedOrderRow1, plannedOrderRow2]);

    // Verify only one firm planned order is created, for planned order Electrical engine 85kW, DueDate 3-Jan-2019
    const workOrderRowsAfterConvert = await listWorkOrders.getAllRows();
    const newWorkOrderRows = await asyncFilter(workOrderRowsAfterConvert, async (workOrderAfterConvert: ListRow) =>
      !(workOrdersBeforeConvert.includes(await listWorkOrders.getCellValueFromRow(ListWorkOrdersColumn.WorkOrder, workOrderAfterConvert))),
    );
    expect(newWorkOrderRows.length).toBe(1, LogMessage.value_notMatched(newWorkOrderRows.length.toString(), '1'));
    const newWorkOrder = await listWorkOrders.getCellValueFromRow(ListWorkOrdersColumn.WorkOrder, newWorkOrderRows[0]);
    expect(newWorkOrder).toBe(WorkOrder.ElectricalEngine85kW_1, LogMessage.value_notMatched(WorkOrder.ElectricalEngine85kW_1, newWorkOrder));

    // Verify new firm planned order has quantity 52
    const newWorkOrderQty = await listWorkOrders.getCellValueFromRow(ListWorkOrdersColumn.Qty, newWorkOrderRows[0]);
    expect(newWorkOrderQty).toBe(plannedOrder2Qty, LogMessage.value_notMatched(plannedOrder2Qty, newWorkOrderQty));
  });
});
