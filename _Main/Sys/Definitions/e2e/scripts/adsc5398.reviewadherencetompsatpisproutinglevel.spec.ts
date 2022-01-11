/**
 * @file        ADSC-5398
 * @description Review adherence to MPS at PISP or Routing level
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
import { ActionTriggerType, asyncEvery, asyncFilter, asyncMap } from '../libappbase/utils';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { QuantityType } from '../libsch/data/data.manageorders';
import { DialogCreateEditInternalWorkOrder, InputWorkOrderFields } from '../libsch/dialogs/dialog.workorder';
import { ListProductsColumn, ListRoutingsColumn } from '../libsch/forms/form.productadherence';
import { Product } from '../libsch/data/data.product';
import { ChartAdherenceAbsoluteLegendGroupItem } from '../libsch/forms/form.adherencetomps';

describe('ADSC-5398, Review adherence to MPS at PISP or Routing level', () => {
  const appScheduler = AppScheduler.getInstance();

  const viewManageOrders = appScheduler.viewManageOrders;
  const formMPSPlannedOrders = viewManageOrders.formMPSPlannedOrders;
  const listPlannedOrders = formMPSPlannedOrders.listPlannedOrders;
  const formWorkOrders = viewManageOrders.formWorkOrders;
  const listWorkOrders = formWorkOrders.listWorkOrders;
  const formProductAdherence = viewManageOrders.formProductAdherence;
  const listProducts = formProductAdherence.listProducts;
  const listRouting = formProductAdherence.listRouting;
  const formAdherenceToMPS = viewManageOrders.formAdherenceToMPS;
  const pnlAdherenceAbsolute = formAdherenceToMPS.pnlAdherenceAbsolute;
  const chartAdherenceAbsolute = pnlAdherenceAbsolute.chartAdherenceAbsolute;
  let dlgWorkOrder: DialogCreateEditInternalWorkOrder;
  let plannedOrderRows: ListRow[];
  let productRow: ListRow;
  let firmedQtyOfFulfilledPlannedOrders: string[];
  let openQtyOfFulfilledPlannedOrders: string[];
  let firmedQtyOfEE120kW: string;

  const newWorkOrderQty = 60;
  const newWorkOrder120Kw: InputWorkOrderFields = {
    routing: Routing.ElectricalEngine120kW,
    dueDate: new Date(2019, 0, 2),
    quantity: newWorkOrderQty,
  };
  const _0 = '0';

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
    await appScheduler.switchToDemoScenario(DemoCategory.TestDemo, DemoScenario.MpScIntegrationWithExistingMPSData);
  });

  afterAll(async () => {
    await viewManageOrders.reset();
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
    expect(await formProductAdherence.isVisible()).toBe(true, LogMessage.form_notVisible('Product Adherence'));
    expect(await formAdherenceToMPS.isVisible()).toBe(true, LogMessage.form_notVisible('Adherence to MPS'));
  });

  it('Step 2: In the MPS planned order list, verify that bar charts in column Fulfillment are red (no fulfillments yet).', async () => {
    // FIXME: CTAS-111411, due to lack of functionality from E2ELib this verification is not possible at the moment.
  });

  it('Step 3: Verify that Quantity = Quantity Open for all planned orders', async () => {
    // Show Open Column in the MPS Planned Order list
    await listPlannedOrders.configureColumns('listActionBarPagePlannedOrders', ListPlannedOrdersColumn.Open);

    // Get all planned order rows
    plannedOrderRows = await listPlannedOrders.getAllRows();
    // Filter out the last row which is empty
    plannedOrderRows = await asyncFilter(plannedOrderRows, async (row: ListRow) => (await listPlannedOrders.getCellValueFromRow(ListPlannedOrdersColumn.Qty, row)) !== '');

    // Verify that Quantity = Quantity Open for all planned orders
    const isQtyEqualToOpenForAll = await asyncEvery(
      plannedOrderRows,
      async (row: ListRow) =>
        (await listPlannedOrders.getCellValueFromRow(ListPlannedOrdersColumn.Qty, row)) === (await listPlannedOrders.getCellValueFromRow(ListPlannedOrdersColumn.Open, row)),
    );
    expect(isQtyEqualToOpenForAll).toBe(true, 'All MPS planned orders should have Qty = Open quantity');
  });

  it('Step 4: Verify that the lengths of the bars correspond to the actual quantites.', async () => {
    // FIXME: CTAS-111410, due to lack of functionality from E2ELib this verification is not possible at the moment.
  });

  it('Step 5: Verify that hovering the mouse above the barchart column displays the numerical value of the bar(segment) in a tooltip.', async () => {
    for (const plannedOrder of plannedOrderRows) {
      // Verify total quantity = open quantity
      const totalQty = await listPlannedOrders.getCellValueFromRow(ListPlannedOrdersColumn.Qty, plannedOrder);
      const openQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Open, plannedOrder))[0];
      expect(openQty).toBe(totalQty, LogMessage.value_notMatched(totalQty, openQty));

      // Verify firmed quantity = 0
      const firmedQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Firmed, plannedOrder))[0];
      expect(firmedQty).toBe(_0, LogMessage.value_notMatched(_0, firmedQty));

      // Verify excess quantity = 0
      const excessQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Excess, plannedOrder))[0];
      expect(excessQty).toBe(_0, LogMessage.value_notMatched(_0, excessQty));
    }
  });

  it('Step 6: Select planned orders with MPS period end= 5-Jan-2019 and 6-Jan-2019 for routing "Electrical Engine 120kW" and select planned orders with MPS period end= 3-Jan-2019 and 4-Jan-2019 for routing "Electrical Engine 85kW"', async () => {
    // Get planned order rows
    const plannedOrderRow1 = await listPlannedOrders.getRowByRoutingAndDueDate(Routing.ElectricalEngine120kW, DueDate._5Jan2019);
    const plannedOrderRow2 = await listPlannedOrders.getRowByRoutingAndDueDate(Routing.ElectricalEngine120kW, DueDate._6Jan2019);
    const plannedOrderRow3 = await listPlannedOrders.getRowByRoutingAndDueDate(Routing.ElectricalEngine85kW, DueDate._3Jan2019);
    const plannedOrderRow4 = await listPlannedOrders.getRowByRoutingAndDueDate(Routing.ElectricalEngine85kW, DueDate._4Jan2019);

    // Select the rows
    plannedOrderRows = [plannedOrderRow1, plannedOrderRow2, plannedOrderRow3, plannedOrderRow4];
    await listPlannedOrders.selectRows(plannedOrderRows);

    // Verify rows are selected
    const isAllSelected = await asyncEvery(plannedOrderRows, async (row: ListRow) => row.isSelected());
    expect(isAllSelected).toBe(
      true,
      `Planned orders with MPS period end= ${DueDate._5Jan2019} and ${DueDate._6Jan2019} for routing "${Routing.ElectricalEngine120kW}" and MPS period end= ${DueDate._3Jan2019} and ${DueDate._4Jan2019} for routing "${Routing.ElectricalEngine85kW}" should be selected.`,
    );
  });

  it('Step 7: Create firm planned order from the contex menu. Verify that open quantities are zero and bar charts turned to just green for all of the selected orders.', async () => {
    await listPlannedOrders.createFirmPlannedOrder(ActionTriggerType.ContextMenu, plannedOrderRows, false);

    // Verify that open quantities are zero
    const isAllSelected0Open = await asyncEvery(plannedOrderRows, async (row: ListRow) => (await listPlannedOrders.getCellValueFromRow(ListPlannedOrdersColumn.Open, row)) === _0);
    expect(isAllSelected0Open).toBe(
      true,
      `Planned orders with MPS period end= ${DueDate._5Jan2019} and ${DueDate._6Jan2019} for routing "${Routing.ElectricalEngine120kW}" and MPS period end= ${DueDate._3Jan2019} and ${DueDate._4Jan2019} for routing "${Routing.ElectricalEngine85kW}" should have Open = 0.`,
    );

    // Verify bar charts turned to just green for all of the selected orders.
    // FIXME: CTAS-111411, due to lack of functionality from E2ELib this verification is not possible at the moment.

    // Get Firmed Quantity of the planned orders
    firmedQtyOfFulfilledPlannedOrders = await asyncMap(
      plannedOrderRows,
      async (row: ListRow) => (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Firmed, row))[0],
    );
    // Get Open Quantity of the planned orders
    openQtyOfFulfilledPlannedOrders = await asyncMap(plannedOrderRows, async (row: ListRow) => listPlannedOrders.getCellValueFromRow(ListPlannedOrdersColumn.Open, row));
    // Get Adherence to MPS firmed quantity for EE120kW Product
    productRow = await listProducts.getRowByCellValue(ListProductsColumn.Product, Product.EE120kW);
    firmedQtyOfEE120kW = (await viewManageOrders.getFirmedOpenExcessQty(listProducts, QuantityType.Firmed, productRow))[0];
  });

  it('Step 8: Click on "Create" button in Manage tab and create new firm planned order with quantity of 60 for same product, routing and due date with planned order with routing = "Electrical engine 120kW" and MPS period end = 2-Jan-2019.', async () => {
    const plannedOrderRow = await listPlannedOrders.getRowByRoutingAndDueDate(Routing.ElectricalEngine120kW, DueDate._2Jan2019);
    // Verify total quantity = open quantity
    const totalQty = await listPlannedOrders.getCellValueFromRow(ListPlannedOrdersColumn.Qty, plannedOrderRow);
    let openQty = await listPlannedOrders.getCellValueFromRow(ListPlannedOrdersColumn.Open, plannedOrderRow);
    expect(openQty).toBe(totalQty, LogMessage.value_notMatched(totalQty, openQty));

    // Create Work Order
    dlgWorkOrder = await listWorkOrders.openWorkOrderDialog(ActionTriggerType.Button);
    await dlgWorkOrder.pnlWorkOrder.updateDialogValues(newWorkOrder120Kw);
    await dlgWorkOrder.clickOK();

    // Verify Open = Qty - 60
    const expectedOpenQty = (Number(totalQty) - newWorkOrder120Kw.quantity!).toString();
    openQty = await listPlannedOrders.getCellValueFromRow(ListPlannedOrdersColumn.Open, plannedOrderRow);
    expect(expectedOpenQty).toBe(openQty, LogMessage.value_notMatched(openQty, expectedOpenQty));
  });

  it('Step 9: Verify that open quantities and bar charts of existing firm planned orders (step 5) with routing "Electrical Engine 120kW" are not affected. On the other hand, adherence to MPS at PISP/routing level is increased.', async () => {
    // Verify open and firmed quantities of existing firm planned orders (step 5) are not affected
    for (let i = 0; i < plannedOrderRows.length; i++) {
      const plannedOrder = plannedOrderRows[i];
      // Verify firmed quantity
      const firmedQty = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Firmed, plannedOrder))[0];
      expect(firmedQty).toBe(firmedQtyOfFulfilledPlannedOrders[i], LogMessage.value_notMatched(_0, firmedQtyOfFulfilledPlannedOrders[i]));
      // Verify open quantity
      const openQty = await listPlannedOrders.getCellValueFromRow(ListPlannedOrdersColumn.Open, plannedOrder);
      expect(openQty).toBe(openQtyOfFulfilledPlannedOrders[i], LogMessage.value_notMatched(openQtyOfFulfilledPlannedOrders[i], openQty));
    }

    // Verify adherence to MPS at PISP/routing level is increased by 60
    const expectedFirmedQtyOfEE120kW = (Number(firmedQtyOfEE120kW) + newWorkOrder120Kw.quantity!).toString();
    firmedQtyOfEE120kW = (await viewManageOrders.getFirmedOpenExcessQty(listProducts, QuantityType.Firmed, productRow))[0];
    expect(firmedQtyOfEE120kW).toBe(expectedFirmedQtyOfEE120kW, LogMessage.value_notMatched(expectedFirmedQtyOfEE120kW, firmedQtyOfEE120kW));
  });

  it('Step 10: Go to Product adherence table. Verify that aggregation of the MPS planned orders can be seen in the adherence to MPS bar chart for each routing. Verify that bar charts include red part if quantity is larger than fulfilled quantity and quantities are correct.', async () => {
    // Select all Product rows
    const productRows = await listProducts.getAllRows();
    for (const row of productRows) {
      // Select each product row
      await listProducts.selectRows([row]);
      await listProducts.waitForDataReady();
      await listRouting.waitForDataReady();
      // Get routing rows and verify total, open and firmed quantity are reflected correctly in the Adherence to MPS Chart
      const routingRows = await listRouting.getAllRows();
      if (routingRows.length > 0) {
        const chartXLabels = await chartAdherenceAbsolute.getXAxisLabels();
        const routing = await listRouting.getCellValueFromRow(ListRoutingsColumn.Routing, routingRows[0]);
        // Iterate through X labels and verify total, open and firmed quantity are shown correctly in the chart based on MPS Planned Order list
        for (const chartXLabel of chartXLabels) {
          const qty = await pnlAdherenceAbsolute.getQuantityFromChartTooltip(ChartAdherenceAbsoluteLegendGroupItem.MPSPlan, chartXLabel);
          if (Number(qty) > 0) {
            const plannedOrderRow = await listPlannedOrders.getRowByRoutingAndDueDate(routing, `${chartXLabel[2]}-Jan-2019 0:00`);

            const expectedQty = await listPlannedOrders.getCellValueFromRow(ListPlannedOrdersColumn.Qty, plannedOrderRow);
            expect(qty).toBe(expectedQty, LogMessage.value_notMatched(expectedQty, qty));

            const expectedOpen = await listPlannedOrders.getCellValueFromRow(ListPlannedOrdersColumn.Open, plannedOrderRow);
            const open = await pnlAdherenceAbsolute.getQuantityFromChartTooltip(ChartAdherenceAbsoluteLegendGroupItem.UnderFulfillment, chartXLabel);
            expect(open).toBe(expectedOpen, LogMessage.value_notMatched(expectedQty, open));

            const expectedFirmed = (await viewManageOrders.getFirmedOpenExcessQty(listPlannedOrders, QuantityType.Firmed, plannedOrderRow))[0];
            const firmed = await pnlAdherenceAbsolute.getQuantityFromChartTooltip(ChartAdherenceAbsoluteLegendGroupItem.Fulfillment, chartXLabel);
            expect(firmed).toBe(expectedFirmed, LogMessage.value_notMatched(expectedFirmed, firmed));

            // Verify that bar charts include red part if quantity is larger than fulfilled quantity
            // Bar chart color is always accesible regardless of the its length so above verification is not valid
            // Getting the bar chart length is not feasible since e2elib is using third party to draw the bar chart so Core side is responsible to cover this verification
          }
        }
      } else {
        // Verify EE115kW product has no routing
        const product = await listProducts.getCellValueFromRow(ListProductsColumn.Product, row);
        expect(product).toBe(Product.EE115kW, LogMessage.value_notMatched(Product.EE115kW, product));
      }
    }
  });
});
