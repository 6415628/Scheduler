/**
 * @file        ADSC-5396
 * @description Review fulfillment level of MPS planned orders
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { LogMessage } from '../libappbase/logmessage';
import { ListPlannedOrdersColumn } from '../libsch/forms/form.mpsplannedorder';
import { Routing } from '../libsch/data/data.routing';
import { DueDate } from '../libsch/data/data.workorder';
import { ActionTriggerType } from '../libappbase/utils';
import { DialogCreateEditInternalWorkOrder, InputWorkOrderFields } from '../libsch/dialogs/dialog.workorder';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { DialogUserSettings, InputUserSettingsFields } from '../libsch/dialogs/dialog.usersettings';
import { Locale } from '../libsch/data/data.usersettings';
import { Product } from '../libsch/data/data.product';
import { ListProductsColumn } from '../libsch/forms/form.productadherence';
import { QuantityStackBar, QuantityType } from '../libsch/data/data.manageorders';

describe('ADSC-5396, Review fulfillment level of MPS planned orders', () => {
  const appScheduler = AppScheduler.getInstance();
  let dlgUserSettings: DialogUserSettings;
  const viewManageOrders = appScheduler.viewManageOrders;
  const formMPSPlannedOrders = viewManageOrders.formMPSPlannedOrders;
  const listPlannedOrders = formMPSPlannedOrders.listPlannedOrders;
  const formWorkOrders = viewManageOrders.formWorkOrders;
  const listWorkOrders = formWorkOrders.listWorkOrders;
  const formProductAdherence = viewManageOrders.formProductAdherence;
  const listProducts = formProductAdherence.listProducts;
  let dlgWorkOrder: DialogCreateEditInternalWorkOrder;
  let plannedOrderRow: ListRow;
  let plannedOrderRows: ListRow[];

  const usersettings: InputUserSettingsFields = {
    locale: Locale.EnglishWorld,
  };
  const _0 = '0';
  const _120KwQty = 64;
  const newWorkOrder120Kw: InputWorkOrderFields = {
    product: Product.EE120kW,
    routing: Routing.ElectricalEngine120kW,
    dueDate: new Date(2019, 0, 2),
    quantity: _120KwQty,
  };
  const _85KwQty = 100;
  const newWorkOrder85Kw: InputWorkOrderFields = {
    product: Product.EE85kW,
    routing: Routing.ElectricalEngine85kW,
    dueDate: new Date(2019, 0, 2),
    quantity: _85KwQty,
  };

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
    await appScheduler.switchToDemoScenario(DemoCategory.TestDemo, DemoScenario.MpScIntegrationWithExistingMPSData);

    // Change Locale = English (World) to get the exact amount of Qty for MPS Planned Order
    // FIXME: after completing ADSC-24804, this section can be removed (no need User Setting as a workaround)
    dlgUserSettings = await appScheduler.abpHome.openUserSettingsDialog();
    await dlgUserSettings.updateDialogValues(usersettings);
  });

  afterAll(async () => {
    // Reset User Settings
    dlgUserSettings = await appScheduler.abpHome.openUserSettingsDialog();
    await dlgUserSettings.resetUserSettings();

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

  xit('Step 2: In the MPS planned order list, verify that bar charts in column Fulfillment are red (no fulfillments yet).', async () => {
    // Verify that bar charts in column Fulfillment are red
    // FIXME: CTAS-111411, due to lack of functionality from E2ELib this verification is not possible at the moment.
  });

  xit('Step 3: Verify that the length of the bar (segment) corresponds to the actual quantities.', async () => {
    // Verify that the length of the bar (segment) corresponds to the actual quantities.
    // FIXME: CTAS-111410, due to lack of functionality from E2ELib this verification is not possible at the moment.
  });

  it('Step 4: Verify that hovering the mouse above the barchart column displays the numerical value of the bar (segment) in a tooltip.', async () => {
    // Get all planned order rows
    plannedOrderRows = await listPlannedOrders.getAllRows();

    for (const plannedOrder of plannedOrderRows) {
      // Skip verification if row is empty
      const totalQty = await listPlannedOrders.getCellValueFromRow(ListPlannedOrdersColumn.Qty, plannedOrder);
      if (totalQty !== '') {
        // Verify total quantity = open quantity
        const openQtyTooltip = await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Open, plannedOrder);
        const openQty = openQtyTooltip[0];
        expect(openQty).toBe(totalQty, LogMessage.value_notMatched(totalQty, openQty));
        // Verify open tooltip
        const openTooltip = openQtyTooltip[1];
        expect(openTooltip).toBe(QuantityStackBar.OpenTooltip + openQty, LogMessage.tooltip_notMatched(QuantityStackBar.OpenTooltip + openQty, openTooltip));

        // Verify firmed quantity = 0
        const firmedQtyTooltip = await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Firmed, plannedOrder);
        const firmedQty = firmedQtyTooltip[0];
        expect(firmedQty).toBe(_0, LogMessage.value_notMatched(_0, firmedQty));
        // Verify firmed tooltip
        const firmedTooltip = firmedQtyTooltip[1];
        expect(firmedTooltip).toBe(QuantityStackBar.FirmedTooltip + firmedQty, LogMessage.tooltip_notMatched(QuantityStackBar.FirmedTooltip + firmedQty, firmedTooltip));

        // Verify excess quantity = 0
        const excessQtyTooltip = await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Excess, plannedOrder);
        const excessQty = excessQtyTooltip[0];
        expect(excessQty).toBe(_0, LogMessage.value_notMatched(_0, excessQty));
        // Verify excess tooltip
        const excessTooltip = excessQtyTooltip[1];
        expect(excessTooltip).toBe(QuantityStackBar.ExcessTooltip + excessQty, LogMessage.tooltip_notMatched(QuantityStackBar.ExcessTooltip + excessQty, excessTooltip));
      }
    }
  });

  it('Step 5: Select planned order with routing = "Electrical engine 120kW" and MPS period end = 2-Jan-2019 and create firm planned order from the contex menu', async () => {
    // Get planned order row
    plannedOrderRow = await listPlannedOrders.getRowByRoutingAndDueDate(Routing.ElectricalEngine120kW, DueDate._2Jan2019);

    // Convert the Planned Order to Firmed Planned Order
    await listPlannedOrders.createFirmPlannedOrder(ActionTriggerType.ContextMenu, [plannedOrderRow]);

    // Verify total quantity is equal to firmed quantity and open quantity is 0
    const totalQty = await listPlannedOrders.getCellValueFromRow(ListPlannedOrdersColumn.Qty, plannedOrderRow);
    const firmedQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Firmed, plannedOrderRow))[0];
    expect(totalQty).toBe(firmedQty, LogMessage.value_notMatched(firmedQty, totalQty));
    const openQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Open, plannedOrderRow))[0];
    expect(openQty).toBe(_0, LogMessage.value_notMatched(_0, openQty));

    // Verify the bar color has turned to green
    // FIXME: CTAS-111411, due to lack of functionality from E2ELib this verification is not possible at the moment.
  });

  it('Step 6: Click on "Create" button in Manage tab and create new firm planned order for same product, routing and due date with planned order with routing = "Electrical engine 120kW" and MPS period end = 2-Jan-2019', async () => {
    // Open create Work Order
    dlgWorkOrder = await listWorkOrders.openWorkOrderDialog(ActionTriggerType.Button);

    await dlgWorkOrder.pnlWorkOrder.updateDialogValues(newWorkOrder120Kw);
    await dlgWorkOrder.clickOK();

    //  Verify that planned order with routing = 'Electrical engine 120kW' and MPS period end = 2-Jan-2019 is now overfulfilled.
    const excessQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Excess, plannedOrderRow))[0];
    expect(excessQty).toBe(_120KwQty.toString(), LogMessage.value_notMatched(_120KwQty.toString(), excessQty));
    const firmedQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Excess, plannedOrderRow))[0];
    expect(firmedQty).toBe(_120KwQty.toString(), LogMessage.value_notMatched(_120KwQty.toString(), firmedQty));

    // Verify orange part is added at the top of the bar chart
    // FIXME: CTAS-111411, due to lack of functionality from E2ELib this verification is not possible at the moment.
  });

  it('Step 7: Click on "Create" button in Manage tab again and create new firm planned order with routing = "Electrical engine 85kW" and MPS period end = 2-Jan-2019. Quantity of new firm planned order should be less than 120.', async () => {
    // Open create Work Order
    dlgWorkOrder = await listWorkOrders.openWorkOrderDialog(ActionTriggerType.Button);

    await dlgWorkOrder.pnlWorkOrder.updateDialogValues(newWorkOrder85Kw);
    await dlgWorkOrder.clickOK();

    plannedOrderRow = await listPlannedOrders.getRowByRoutingAndDueDate(Routing.ElectricalEngine85kW, DueDate._2Jan2019);

    // Verify that planned order with routing = 'Electrical engine 120kW' and MPS period end = 2-Jan-2019 is partially fulfilled.
    const excessQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Excess, plannedOrderRow))[0];
    expect(excessQty).toBe(_0, LogMessage.value_notMatched(_0, excessQty));
    const firmedQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Firmed, plannedOrderRow))[0];
    expect(firmedQty).toBe(_85KwQty.toString(), LogMessage.value_notMatched(_85KwQty.toString(), firmedQty));
    const openQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Open, plannedOrderRow))[0];
    const totalQty = +(await listPlannedOrders.getCellValueFromRow(ListPlannedOrdersColumn.Qty, plannedOrderRow));
    expect(openQty).toBe((totalQty - _85KwQty).toString(), LogMessage.value_notMatched((totalQty - _85KwQty).toString(), openQty));

    // Verify bar still consist of red part
    // FIXME: CTAS-111411, due to lack of functionality from E2ELib this verification is not possible at the moment.
  });

  xit('Step 8: Verify that length of bar charts differ table based on quantity of the order in MPS planned orders.', async () => {
    // FIXME: CTAS-111410, due to lack of functionality from E2ELib this verification is not possible at the moment.
  });

  it('Step 9: Verify that there is not any adherence to MPS for Electrical Engine 115kW', async () => {
    const productRow = await listProducts.getRowByCellValue(ListProductsColumn.Product, Product.EE115kW);
    const qty = await listProducts.getCellValueFromRow(ListProductsColumn.Qty, productRow);
    expect(qty).toBe(_0, LogMessage.value_notMatched(_0, qty));
  });
});
