/**
 * @file        TD002158
 * @description Verify that scheduled firm planned orders cannot be deleted
 * @author      Umar Adkhamov (umar.adkhamov@3ds.com)
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { ListWorkOrdersColumn, ListWorkOrdersContextMenuItem } from '../libsch/forms/form.workorders';
import { WorkOrder } from '../libsch/data/data.workorder';
import { LogMessage } from '../libappbase/logmessage';

describe('TD002158 - Verify that scheduled firm planned orders cannot be deleted', () => {
  let appScheduler = AppScheduler.getInstance();
  let listWorkOrders = appScheduler.viewManageOrders.formWorkOrders.listWorkOrders;
  let workOrderName = WorkOrder.CogA_2_1;
  let workOrderDate = '3-Jan-2019 0:00';
  let expectedTooltip = `Work order ${workOrderName} has operations planned.`;
  let workOrderRow: ListRow;

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

  it('Step 1 - Go to Manage Work Orders action bar and open view "Manage Orders"', async () => {
    await appScheduler.viewManageOrders.switchTo();
    expect(await appScheduler.viewManageOrders.formWorkOrders.isVisible()).toBe(true, LogMessage.form_notVisible('Work Orders'));
  });

  it(`Step 2 - Select firm planned orders ${workOrderName}`, async () => {
    // Select firm planned order CogA-2-1 on 3-Jan-2019
    workOrderRow = await listWorkOrders.getRowByValue([
      { columnID: ListWorkOrdersColumn.WorkOrder, value: workOrderName },
      { columnID: ListWorkOrdersColumn.Due, value: workOrderDate },
    ]);
    await listWorkOrders.selectRows([workOrderRow]);
    expect(await workOrderRow.isSelected()).toBe(true, `Work order "${workOrderName}" should be selected.`);

    // Verify that the workorder is planned
    expect(await listWorkOrders.isWorkOrderPlanned(workOrderRow)).toBe(true, `Work order "${workOrderName}" should be planned.`);
  });

  it(`Step 3 - Verify "Delete" context menu item is disabled for planned order ${workOrderName} and displays correct tooltip text`, async () => {
    const [isClickable, tooltip] = await listWorkOrders.verifyIsMenuItemClickable(ListWorkOrdersContextMenuItem.MenuDelete, [workOrderRow]);
    // Verify Delete menu item is disabled
    expect(isClickable).toBe(false, LogMessage.menu_isEnabled('Delete'));
    // Verify Delete menu item displays correct tooltip
    expect(tooltip).toBe(expectedTooltip, LogMessage.tooltip_notMatched(expectedTooltip, tooltip));
  });

  it('Step 4 - Verify "Delete" button in action bar is disabled and displays correct tooltip text.', async () => {
    const [isClickable, tooltip] = await appScheduler.abpManageWorkOrders.btnDeleteWorkOrder.verifyIsButtonClickable();
    // Verify Delete button is disabled
    expect(isClickable).toBe(false, LogMessage.btn_isEnabled('Delete Action Bar'));
    // Verify Delete button displays correct tooltip
    expect(tooltip).toBe(expectedTooltip, LogMessage.tooltip_notMatched(expectedTooltip, tooltip));
  });
});
