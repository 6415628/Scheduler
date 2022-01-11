/**
 * @file        ADSC-5325
 * @description Edit quantity of a firm planned order
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
import { ActionTriggerType } from '../libappbase/utils';
import { DialogCreateEditInternalWorkOrder, InputWorkOrderFields } from '../libsch/dialogs/dialog.workorder';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { QuantityStackBar, QuantityType } from '../libsch/data/data.manageorders';

describe('ADSC-5325, Edit quantity of a firm planned order', () => {
  const appScheduler = AppScheduler.getInstance();

  const viewManageOrders = appScheduler.viewManageOrders;
  const formMPSPlannedOrders = viewManageOrders.formMPSPlannedOrders;
  const listPlannedOrders = formMPSPlannedOrders.listPlannedOrders;
  const formWorkOrders = viewManageOrders.formWorkOrders;
  const listWorkOrders = formWorkOrders.listWorkOrders;
  let dlgWorkOrder: DialogCreateEditInternalWorkOrder;
  let workOrderRow: ListRow;
  let plannedOrderRow: ListRow;

  const firmedQtyBeforeEdit = 120;
  const openQtyAfterEdit = 10;
  const firmedQtyAfterEdit = firmedQtyBeforeEdit - openQtyAfterEdit;
  const workOrderBeforeEdit: InputWorkOrderFields = {
    routing: Routing.ElectricalEngine85kW,
    lotSize: 0,
    quantity: firmedQtyBeforeEdit,
  };
  const workOrderAfterEdit: InputWorkOrderFields = {
    quantity: firmedQtyAfterEdit,
  };
  const firmedTooltipAfterEdit = QuantityStackBar.FirmedTooltip + firmedQtyAfterEdit.toString();
  const openTooltipAfterEdit = QuantityStackBar.OpenTooltip + openQtyAfterEdit.toString();

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

  it('Step 2: Select the planned order for Electrical engine 85kW due on 02-JAN-2019 and convert to firm planned order', async () => {
    // Get planned order row
    plannedOrderRow = await listPlannedOrders.getRowByRoutingAndDueDate(Routing.ElectricalEngine85kW, DueDate._2Jan2019);

    // Verify total quantity = open quantity = 120 and firmed quantity is 0
    const totalQty = await listPlannedOrders.getCellValueFromRow(ListPlannedOrdersColumn.Qty, plannedOrderRow);
    expect(totalQty).toBe(firmedQtyBeforeEdit.toString(), LogMessage.value_notMatched(firmedQtyBeforeEdit.toString(), totalQty));
    let openQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Open, plannedOrderRow))[0];
    expect(openQty).toBe(totalQty, LogMessage.value_notMatched(totalQty, openQty));
    let firmedQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Firmed, plannedOrderRow))[0];
    expect(firmedQty).toBe('0', LogMessage.value_notMatched('0', firmedQty));

    // Convert the Planned Order to Firmed Planned Order
    await listPlannedOrders.createFirmPlannedOrder(ActionTriggerType.ContextMenu, [plannedOrderRow]);

    // Verify total quantity is equal to firmed quantity and open quantity is 0
    firmedQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Firmed, plannedOrderRow))[0];
    expect(totalQty).toBe(firmedQty, LogMessage.value_notMatched(firmedQty, totalQty));
    openQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Open, plannedOrderRow))[0];
    expect(openQty).toBe('0', LogMessage.value_notMatched('0', openQty));
  });

  it('Step 3: Open edit dialog for Electrical engine 85kW-1 work order and verify it has no lot size defined', async () => {
    // Get work order row
    workOrderRow = await listWorkOrders.getWorkOrder(WorkOrder.ElectricalEngine85kW_1);

    // Open Work Order Dialog
    dlgWorkOrder = await listWorkOrders.openWorkOrderDialog(ActionTriggerType.Button, workOrderRow);
    expect(await dlgWorkOrder.isVisible()).toBe(true, LogMessage.dialog_isVisible('Work Order'));

    // Verify lot size = 0 and quantity = totalQty = 120
    const feedback = await dlgWorkOrder.pnlWorkOrder.verifyDialogValues(workOrderBeforeEdit);
    expect(feedback.length).toBe(0, feedback);
  });

  it('Step 4: Reduce the quantity of the firm planned order in the dialog by 10 and click OK button', async () => {
    // Reduce the quantity of the firm planned order in the dialog by 10
    await dlgWorkOrder.pnlWorkOrder.updateDialogValues(workOrderAfterEdit);
    await dlgWorkOrder.clickOK();

    // Open Work Order Dialog and Verify quantity = totalQty - 10 = 110
    dlgWorkOrder = await listWorkOrders.openWorkOrderDialog(ActionTriggerType.ContextMenu, workOrderRow);
    const feedback = await dlgWorkOrder.pnlWorkOrder.verifyDialogValues(workOrderAfterEdit);
    expect(feedback.length).toBe(0, feedback);

    await dlgWorkOrder.clickCancel();
  });

  it('Step 5: OpenQuantity of the related PlannedOrder has increased by 10', async () => {
    // Verify open quantity = 10 and firmed quantity = totalQty - 10 = 110
    const openQtyTooltip = await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Open, plannedOrderRow);
    const openQty = openQtyTooltip[0];
    expect(openQty).toBe(openQtyAfterEdit.toString(), LogMessage.value_notMatched(openQtyAfterEdit.toString(), openQty));
    const firmedQtyTooltip = await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Firmed, plannedOrderRow);
    const firmedQty = firmedQtyTooltip[0];
    expect(firmedQty).toBe(firmedQtyAfterEdit.toString(), LogMessage.value_notMatched(firmedQtyAfterEdit.toString(), firmedQty));

    // Verify tooltip of Firmed/Open Quantity displaying expected value as above
    const openTooltip = openQtyTooltip[1];
    expect(openTooltip).toBe(openTooltipAfterEdit, LogMessage.value_notMatched(openTooltipAfterEdit, openTooltip));
    const firmedTooltip = firmedQtyTooltip[1];
    expect(firmedTooltip).toBe(firmedTooltipAfterEdit, LogMessage.value_notMatched(firmedTooltipAfterEdit, firmedTooltip));
  });
});
