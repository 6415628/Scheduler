/**
 * @file        TD002108
 * @description Join firm planned orders
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { WorkOrder } from '../libsch/data/data.workorder';
import { ToastGlobal } from '../libappbase/toastglobal';
import { QToastType } from '../e2elib/lib/src/pageobjects/toast/toastmessage.component';

describe('TD002108 , Join firm planned orders', () => {
  let appScheduler = AppScheduler.getInstance();
  let toast = ToastGlobal.getInstance();

  let listWorkOrders = appScheduler.viewManageOrders.formWorkOrders.listWorkOrders;

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

  it('Step 2: Select firm planned orders CogA-1-6, CogA-1-7 and CogA-1-11. Step 3: Right click in the work order form and call "Join" for the three selected work orders', async () => {
    // Select firm planned orders CogA-1-6, CogA-1-7 and CogA-1-11
    let cogA16Row = await listWorkOrders.getWorkOrder(WorkOrder.CogA_1_6);
    let cogA17Row = await listWorkOrders.getWorkOrder(WorkOrder.CogA_1_7);
    let cogA111Row = await listWorkOrders.getWorkOrder(WorkOrder.CogA_1_11);
    await listWorkOrders.selectRows([cogA16Row, cogA17Row, cogA111Row]);
    expect(await cogA16Row.isSelected()).toBe(true, `Expected: ${WorkOrder.CogA_1_6} should be selected.`);
    expect(await cogA17Row.isSelected()).toBe(true, `Expected: ${WorkOrder.CogA_1_7} should be selected.`);
    expect(await cogA111Row.isSelected()).toBe(true, `Expected: ${WorkOrder.CogA_1_11} should be selected.`);

    // Join CogA-1-6, CogA-1-7 and CogA-1-11
    await listWorkOrders.joinWorkOrders([cogA16Row, cogA17Row, cogA111Row]);
    // Verify success toast is popped up
    expect(await toast.verifyLastToastType(QToastType.SUCCESS)).toBe(true, 'Expected: Success toast box should be popped up after joining work orders.');
  });

  it('Step 3: After joining, firm planned order CogA-1-6 has a quantity of 10+20-30 = 70, and the due date is Jan 2nd, 2019. Firm planned orders CogA-1-7 and CogA-1-11 have been deleted.', async () => {
    // Verify CogA-1-6 quantity and due date.
    let cogA16Row = await listWorkOrders.getWorkOrder(WorkOrder.CogA_1_6);
    expect(await listWorkOrders.getQty(cogA16Row)).toBe('70', `Expected: Quantity of firm planned order ${WorkOrder.CogA_1_6} should be 70`);
    expect(await listWorkOrders.getDueDate(cogA16Row)).toBe('2-Jan-2019 0:00', `Expected: Due date of firm planned order ${WorkOrder.CogA_1_6} should be 2-Jan-2019 0:00`);

    // Verify CogA-1-7 and CogA-1-11 are deleted
    let isCogA17Deleted = !(await listWorkOrders.isWorkOrderExisted(WorkOrder.CogA_1_7));
    let isCogA111Deleted = !(await listWorkOrders.isWorkOrderExisted(WorkOrder.CogA_1_11));
    expect(isCogA17Deleted && isCogA111Deleted).toBe(true, `Expected: Firm planned orders ${WorkOrder.CogA_1_7} and ${WorkOrder.CogA_1_11} should be deleted.`);
  });
});
