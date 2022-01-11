/**
 * @file        TD002122
 * @description Split and re-join firm planned order
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { DialogSplitInternalWorkOrder } from '../libsch/dialogs/dialog.splitworkorder';
import { ToastGlobal } from '../libappbase/toastglobal';
import { WorkOrder } from '../libsch/data/data.workorder';
import { QToastType } from '../e2elib/lib/src/pageobjects/toast/toastmessage.component';

describe('TD002122 , Split and re-join firm planned order', () => {
  let appScheduler = AppScheduler.getInstance();
  let toast = ToastGlobal.getInstance();
  let listWorkOrders = appScheduler.viewManageOrders.formWorkOrders.listWorkOrders;
  let dlgSplitWorkOrder: DialogSplitInternalWorkOrder;
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
    // await appScheduler.checkToastMessage();
  });

  it('Step 1: Go to Manage Work Orders action bar, open view Manage Orders.', async () => {
    await appScheduler.viewManageOrders.switchTo();
    expect(await appScheduler.viewManageOrders.formWorkOrders.isVisible()).toBe(true, 'Expected: Form Work Orders should be visible');
  });

  it('Step 2: Select firm planned order CogB-1-1 and select Split. In the po-up dialog, enter 10 in the split quantity field and press OK.', async () => {
    // Select firm planned orders CogB-1-1
    let cogB11Row = await listWorkOrders.getWorkOrder(WorkOrder.CogB_1_1);
    // Select Split on CogB-1-1
    dlgSplitWorkOrder = await listWorkOrders.openSplitWorkOrderDialog(cogB11Row);
    expect(await dlgSplitWorkOrder.isVisible()).toBe(true, 'Expected: Split Work Order Dialog should be visible.');
    // In the po-up dialog, enter 10 in the split quantity field
    await dlgSplitWorkOrder.splitWorkOrder(undefined, 10, false);
  });

  it('Step 3: In the work order list, verify that the quantity of firm planned order CogB-1-1 has been changed to 20, and that a new firm planned order CogB-1-2 has been created with quantity 10', async () => {
    // verify that the quantity of firm planned order CogB-1-1 has been changed to 20.
    let cogB11Row = await listWorkOrders.getWorkOrder(WorkOrder.CogB_1_1);
    expect(await listWorkOrders.getQty(cogB11Row)).toBe('20', `Expected: Quantity of firm planned order ${WorkOrder.CogB_1_1} should be 20`);
    // verify that the quantity of new firm planned order CogB-1-2 is 10.
    let cogB12Row = await listWorkOrders.getWorkOrder(WorkOrder.CogB_1_2);
    expect(await listWorkOrders.getQty(cogB12Row)).toBe('10', `Expected: Quantity of firm planned order ${WorkOrder.CogB_1_2} should be 10`);
  });

  it('Step 4: select both firm planned orders CogB-1-1 and CogB-1-2 and select Join. Verify the quantity of firm planned order CogB-1-1 is 30, and CogB-1-2 has been deleted.', async () => {
    // Select firm planned orders CogB-1-1 and CogB-1-2
    let cogB11Row = await listWorkOrders.getWorkOrder(WorkOrder.CogB_1_1);
    let cogB12Row = await listWorkOrders.getWorkOrder(WorkOrder.CogB_1_2);
    await listWorkOrders.selectRows([cogB11Row, cogB12Row]);
    // Join CogB-1-1 and CogB-1-2
    await listWorkOrders.joinWorkOrders([cogB11Row, cogB12Row]);
    // Verify success toast is popped up
    expect(await toast.verifyLastToastType(QToastType.SUCCESS)).toBe(true, 'Expected: Success toast box should be popped up after joining work orders.');

    // WORKAROUND: after joining CogB-1-1 and CogB-1-2, the joined one will be named CogB-1-1 or CogB-1-2 randomly so the if statement is necessary below
    let existedWorkOrder = WorkOrder.CogB_1_1;
    let removedWorkOrder = WorkOrder.CogB_1_2;
    if (await listWorkOrders.isWorkOrderExisted(WorkOrder.CogB_1_2)) {
      existedWorkOrder = WorkOrder.CogB_1_2;
      removedWorkOrder = WorkOrder.CogB_1_1;
    }
    // Verify the quantity of joined firm planned order is 30
    const row = await listWorkOrders.getWorkOrder(existedWorkOrder);
    expect(await listWorkOrders.getQty(row)).toBe('30', `Expected: Quantity of firm planned order ${existedWorkOrder} should be 30`);
    // Verify the other one is removed
    expect(await listWorkOrders.isWorkOrderExisted(removedWorkOrder)).toBe(false, `Expected: ${removedWorkOrder} should not be existed.`);
  });
});
