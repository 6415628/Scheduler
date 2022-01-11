/**
 * @file        ADSC-5330
 * @description Delete a firm planned order
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
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { ListWorkOrdersColumn } from '../libsch/forms/form.workorders';
import { ActionTriggerType } from '../libappbase/utils';
import { QuantityType } from '../libsch/data/data.manageorders';

describe('ADSC-5330, Delete a firm planned order', () => {
  const appScheduler = AppScheduler.getInstance();

  const viewManageOrders = appScheduler.viewManageOrders;
  const formMPSPlannedOrders = viewManageOrders.formMPSPlannedOrders;
  const listPlannedOrders = formMPSPlannedOrders.listPlannedOrders;
  const formWorkOrders = viewManageOrders.formWorkOrders;
  const listWorkOrders = formWorkOrders.listWorkOrders;
  let workOrderRow: ListRow;
  let plannedOrderRow: ListRow;

  const firmedQtyBeforeDelete = 40;
  const openQtyBeforeDelete = 0;
  const workOrderQty = 15;
  const firmedQtyAfterDelete = firmedQtyBeforeDelete - workOrderQty;
  const openQtyAfterDelete = openQtyBeforeDelete + workOrderQty;

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

  it('Step 1: Open view Manage Work Order -> Manage Orders', async () => {
    await viewManageOrders.switchTo();
    expect(await formMPSPlannedOrders.isVisible()).toBe(true, LogMessage.form_notVisible('MPS Planned Order'));
    expect(await formWorkOrders.isVisible()).toBe(true, LogMessage.form_notVisible('Work Order'));
  });

  it(`Step 2: Select the planned order for CogB-2 due on 02-JAN-2019 and check its quantity and firmed = ${firmedQtyBeforeDelete} and open = ${openQtyBeforeDelete}`, async () => {
    // Get planned order row
    plannedOrderRow = await listPlannedOrders.getRowByRoutingAndDueDate(Routing.CogB2, DueDate._2Jan2019);

    // Verify total quantity = firmed quantity = 40 and open quantity = 0
    const totalQty = await listPlannedOrders.getCellValueFromRow(ListPlannedOrdersColumn.Qty, plannedOrderRow);
    expect(totalQty).toBe(firmedQtyBeforeDelete.toString(), LogMessage.value_notMatched(firmedQtyBeforeDelete.toString(), totalQty));
    const firmedQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Firmed, plannedOrderRow))[0];
    expect(totalQty).toBe(firmedQty, LogMessage.value_notMatched(firmedQty, totalQty));
    const openQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Open, plannedOrderRow))[0];
    expect(openQty).toBe(openQtyBeforeDelete.toString(), LogMessage.value_notMatched(openQtyBeforeDelete.toString(), openQty));
  });

  it(`Step 3: Select work order CogB-2-2 due on 02-JAN-2019 and verify its quantity = ${workOrderQty}`, async () => {
    // Get work order row and select it
    workOrderRow = await listWorkOrders.getWorkOrder(WorkOrder.CogB_2_2);
    await listWorkOrders.selectRows([workOrderRow]);

    // Verify work order CogB-2-2 has qty = 15
    const qty = await listWorkOrders.getCellValueFromRow(ListWorkOrdersColumn.Qty, workOrderRow);
    expect(qty).toBe(workOrderQty.toString(), LogMessage.value_notMatched(workOrderQty.toString(), qty));
  });

  it('Step 4: Verify Action button "Delete" is enabled. Click on action button "Delete"', async () => {
    // Verify Action button "Delete" is enabled
    const [isEnabled, tooltip] = await appScheduler.abpManageWorkOrders.btnDeleteWorkOrder.verifyIsButtonClickable();
    expect(isEnabled).toBe(true, LogMessage.btn_notClickable('"Delete" Action Bar', tooltip));

    await listWorkOrders.deleteWorkOrder(ActionTriggerType.Button, [workOrderRow]);

    // Verify work order CogB-2-2 is deleted
    const isWorkOrderExisted = await listWorkOrders.isWorkOrderExisted(WorkOrder.CogB_2_2);
    expect(isWorkOrderExisted).toBe(false, LogMessage.row_found([`Work Order: ${WorkOrder.CogB_2_2}`]));
  });

  it(`Step 5: OpenQuantity of the related PlannedOrder has increased by ${workOrderQty}`, async () => {
    // Verify open quantity = 15 and firmed quantity = totalQty - 15 = 25
    const openQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Open, plannedOrderRow))[0];
    expect(openQty).toBe(openQtyAfterDelete.toString(), LogMessage.value_notMatched(openQtyAfterDelete.toString(), openQty));
    const firmedQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Firmed, plannedOrderRow))[0];
    expect(firmedQty).toBe(firmedQtyAfterDelete.toString(), LogMessage.value_notMatched(firmedQtyAfterDelete.toString(), firmedQty));
  });
});
