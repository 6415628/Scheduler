/**
 * @file        ADSC-5457
 * @description Selecting one or more demands and reserving compatible supplies automatically
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { LogMessage } from '../libappbase/logmessage';
import { StockingPoint } from '../libsch/data/data.product';
import { ImgFrozen, ListDemandFulfillmentsColumn, ListDemandsColumn, ReservedOpenStackBar, ReserveUnreserveDemandPrecondition } from '../libsch/forms/suppliesanddemands';
import { DemandID } from '../libsch/data/data.reservematerial';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { ActionTriggerType } from '../libappbase/utils';
import { ButtonType, ToastGlobal } from '../libappbase/toastglobal';
import { QToastType } from '../e2elib/lib/src/pageobjects/toast/toastmessage.component';
import { LogMessageSch } from '../libsch/logmessagesch';
import { QConsole } from '../e2elib/lib/src/helper/qconsole';
import { OrderNr } from '../libsch/data/data.order';

describe('ADSC-5457, Selecting one or more demands and reserving compatible supplies automatically', () => {
  const appScheduler = AppScheduler.getInstance();

  const viewReserveMaterial = appScheduler.viewReserveMaterial;
  const formSuppliesAndDemands = viewReserveMaterial.formSuppliesAndDemands;
  const ddslStockingPoint = formSuppliesAndDemands.ddslStockingPoint;
  const listDemands = formSuppliesAndDemands.listDemands;
  const listDemandFulfillments = formSuppliesAndDemands.listDemandFulfillments;

  let demand10061Row: ListRow;
  let demand10067Row: ListRow;
  let demand10071Row: ListRow;
  let toast = ToastGlobal.getInstance();

  const slab = StockingPoint.Slab;
  const sheet = StockingPoint.Sheet;
  const _10061 = OrderNr._10061;
  const _10067 = OrderNr._10067;
  const _10071 = OrderNr._10071;
  const _0 = '0';
  const _1 = '1';
  const _2 = '2';
  const expectOpenTooltipBeforeReserve = ReservedOpenStackBar.OpenTooltip + _1;
  const expectOpenTooltipAfterReserve = ReservedOpenStackBar.OpenTooltip + _0;
  const expectReserveTooltipBeforeReserve = ReservedOpenStackBar.ReservedTooltip + _0;
  const expectReserveTooltipAfterReserve = ReservedOpenStackBar.ReservedTooltip + _1;
  const expectReservePreconMsg = ReserveUnreserveDemandPrecondition.DemandReserveMsg;

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
    await appScheduler.switchToDemoScenario(DemoCategory.SalesDemo, DemoScenario.AluminumHotRolling);
  });

  afterAll(async () => {
    await appScheduler.viewReserveMaterial.reset();
    await appScheduler.cleanUpDataset();
    await appScheduler.logout();
  });

  afterEach(async () => {
    await appScheduler.checkToastMessage();
  });

  it('Step 1: Step 1: Open view Manage Materials -> Reserve Material', async () => {
    await viewReserveMaterial.switchTo();
    expect(await viewReserveMaterial.formSuppliesAndDemands.isVisible()).toBe(true, LogMessage.form_notVisible('Supplies and Demands'));
  });

  it('Step 2: Go to demands form and filter demands by stocking point "Slab"', async () => {
    await ddslStockingPoint.selectItem(slab);
    const stockingPoint = await ddslStockingPoint.getSelectedString();
    expect(stockingPoint).toBe(slab, LogMessage.value_notMatched(slab, stockingPoint));
  });

  it('Step 3: Sort demands ascending by QuantityReserved firstly and by OrderNr secondly.', async () => {
    await listDemands.sortColumn(ListDemandsColumn.Reserved);
    await listDemands.sortColumn(ListDemandsColumn.OrderNr, undefined, undefined, true);
  });

  it('Step 4: Select OrderNr 10061 and 10067. Verify that OrderNr 10061 in frozen horizon and they have openQuantity=2.', async () => {
    demand10061Row = await listDemands.getDemandRow(_10061);
    demand10067Row = await listDemands.getDemandRow(_10067);

    const is10061FrozenHorizon = await listDemands.getCellValueFromRow(ImgFrozen.ColumnIndex, demand10061Row, true);
    expect(is10061FrozenHorizon).toBe(ImgFrozen.Frozen, LogMessage.value_notMatched(ImgFrozen.Frozen, is10061FrozenHorizon));

    const openQty10061 = await listDemands.getCellValueFromRow(ListDemandsColumn.Open, demand10061Row);
    expect(openQty10061).toBe(_1, LogMessage.value_notMatched(_1, openQty10061));
    const openQty10067 = await listDemands.getCellValueFromRow(ListDemandsColumn.Open, demand10067Row);
    expect(openQty10067).toBe(_1, LogMessage.value_notMatched(_1, openQty10067));
  });

  it('Step 5: Verify both demands have openQuantity = 1 and reserveQuantity = 0 in Reserved/Open column', async () => {
    const demand10061Cell = await demand10061Row.getCell(ListDemandsColumn.ReservedOpen);
    const demand10067Cell = await demand10067Row.getCell(ListDemandsColumn.ReservedOpen);
    const demand10061ChartValue = await listDemands.getInlineChartValue(demand10061Cell);
    const demand10067ChartValue = await listDemands.getInlineChartValue(demand10067Cell);

    // Verify Open Quantity value in Reserved/Open column
    const openQty10061 = <string>demand10061ChartValue.get(ReservedOpenStackBar.QuantityOpenKey);
    const openQty10067 = <string>demand10067ChartValue.get(ReservedOpenStackBar.QuantityOpenKey);
    expect(openQty10061).toBe(_1, LogMessage.value_notMatched(_1, openQty10061));
    expect(openQty10067).toBe(_1, LogMessage.value_notMatched(_1, openQty10067));

    // Verify Open Quantity tooltip in Reserved/Open column
    const openSizeTooltip10061 = await demand10061Cell.getTooltip(undefined, undefined, undefined, ReservedOpenStackBar.QuantityOpenKey);
    const openSizeTooltip10067 = await demand10067Cell.getTooltip(undefined, undefined, undefined, ReservedOpenStackBar.QuantityOpenKey);
    expect(openSizeTooltip10061).toBe(expectOpenTooltipBeforeReserve, LogMessage.value_notMatched(expectOpenTooltipBeforeReserve, openSizeTooltip10061));
    expect(openSizeTooltip10067).toBe(expectOpenTooltipBeforeReserve, LogMessage.value_notMatched(expectOpenTooltipBeforeReserve, openSizeTooltip10067));

    // Verify Reserve Quantity value in Reserved/Open column
    const reserveQty10061 = <string>demand10061ChartValue.get(ReservedOpenStackBar.QuantityReservedKey);
    expect(reserveQty10061).toBe(_0, LogMessage.value_notMatched(_0, reserveQty10061));
    const reserveQty10067 = <string>demand10067ChartValue.get(ReservedOpenStackBar.QuantityReservedKey);
    expect(reserveQty10067).toBe(_0, LogMessage.value_notMatched(_0, reserveQty10067));

    // Verify Reserve Quantity tooltip in Reserved/Open column
    const reserveSizeTooltip10061 = await demand10061Cell.getTooltip(undefined, undefined, undefined, ReservedOpenStackBar.QuantityReservedKey);
    const reserveSizeTooltip10067 = await demand10067Cell.getTooltip(undefined, undefined, undefined, ReservedOpenStackBar.QuantityReservedKey);
    expect(reserveSizeTooltip10061).toBe(expectReserveTooltipBeforeReserve, LogMessage.value_notMatched(expectReserveTooltipBeforeReserve, reserveSizeTooltip10061));
    expect(reserveSizeTooltip10067).toBe(expectReserveTooltipBeforeReserve, LogMessage.value_notMatched(expectReserveTooltipBeforeReserve, reserveSizeTooltip10067));
  });

  it("Step 6: Click on action button 'Reserve material'. Verify that a warning message poped up to warn user that one or more demands fall within frozen horizon. Verify that their open quantites are fulfilled.", async () => {
    await listDemands.reserveMaterial(ActionTriggerType.Button, [demand10061Row, demand10067Row]);
    // Verify warning toast is popped up
    const isSoftPrecon = await toast.verifyLastToastType(QToastType.WARNING);
    expect(isSoftPrecon).toBe(true, LogMessageSch.toast_notWarning('reserve material for frozen horizon demands'));

    // Verify toast message
    const reservePreconMsg = await toast.getLastToastMessage();
    expect(reservePreconMsg).toBe(expectReservePreconMsg, LogMessage.value_notMatched(expectReservePreconMsg, reservePreconMsg));

    await toast.clickToastButton(ButtonType.Yes);
    await QConsole.waitForScreenUpdate();

    // Verify that their open quantites are fulfilled
    await listDemands.searchList(ListDemandsColumn.OrderNr, _10067);
    demand10067Row = await listDemands.getRowByValue([{ columnID: ListDemandsColumn.OrderNr, value: _10067 }]);
    demand10061Row = await listDemands.getRowByCellValue(ListDemandsColumn.OrderNr, _10061);
    await listDemands.selectRows([demand10067Row, demand10061Row]);
    await QConsole.waitForScreenUpdate();
    const openQty10061 = await listDemands.getCellValueFromRow(ListDemandsColumn.Open, demand10061Row);
    expect(openQty10061).toBe(_0, LogMessage.value_notMatched(_0, openQty10061));
    const openQty10067 = await listDemands.getCellValueFromRow(ListDemandsColumn.Open, demand10067Row);
    expect(openQty10067).toBe(_0, LogMessage.value_notMatched(_0, openQty10067));
  });

  it('Step 7: Verify both demands have reservedQuantity in Reserved/Open column and fulfillments are visible in demand fulfillments form.', async () => {
    const demand10061Cell = await demand10061Row.getCell(ListDemandsColumn.ReservedOpen);
    const demand10067Cell = await demand10067Row.getCell(ListDemandsColumn.ReservedOpen);

    const demand10061ChartValue = await listDemands.getInlineChartValue(demand10061Cell);
    const demand10067ChartValue = await listDemands.getInlineChartValue(demand10067Cell);

    // Verify Open Quantity value in Reserved/Open column
    const openQty10061 = <string>demand10061ChartValue.get(ReservedOpenStackBar.QuantityOpenKey);
    const openQty10067 = <string>demand10067ChartValue.get(ReservedOpenStackBar.QuantityOpenKey);
    expect(openQty10061).toBe(_0, LogMessage.value_notMatched(_0, openQty10061));
    expect(openQty10067).toBe(_0, LogMessage.value_notMatched(_0, openQty10067));

    // Verify Open Quantity tooltip in Reserved/Open column
    const openSizeTooltip10061 = await demand10061Cell.getTooltip(undefined, undefined, undefined, ReservedOpenStackBar.QuantityOpenKey);
    const openSizeTooltip10067 = await demand10067Cell.getTooltip(undefined, undefined, undefined, ReservedOpenStackBar.QuantityOpenKey);
    expect(openSizeTooltip10061).toBe(expectOpenTooltipAfterReserve, LogMessage.value_notMatched(expectOpenTooltipAfterReserve, openSizeTooltip10061));
    expect(openSizeTooltip10067).toBe(expectOpenTooltipAfterReserve, LogMessage.value_notMatched(expectOpenTooltipAfterReserve, openSizeTooltip10067));

    // Verify Reserve Quantity value in Reserved/Open column
    const reserveQty10061 = <string>demand10061ChartValue.get(ReservedOpenStackBar.QuantityReservedKey);
    const reserveQty10067 = <string>demand10067ChartValue.get(ReservedOpenStackBar.QuantityReservedKey);
    expect(reserveQty10061).toBe(_1, LogMessage.value_notMatched(_1, reserveQty10061));
    expect(reserveQty10067).toBe(_1, LogMessage.value_notMatched(_1, reserveQty10067));

    // Verify Reserve Quantity tooltip in Reserved/Open column
    const reserveSizeTooltip10061 = await demand10061Cell.getTooltip(undefined, undefined, undefined, ReservedOpenStackBar.QuantityReservedKey);
    const reserveSizeTooltip10067 = await demand10067Cell.getTooltip(undefined, undefined, undefined, ReservedOpenStackBar.QuantityReservedKey);
    expect(reserveSizeTooltip10061).toBe(expectReserveTooltipAfterReserve, LogMessage.value_notMatched(expectReserveTooltipAfterReserve, reserveSizeTooltip10061));
    expect(reserveSizeTooltip10067).toBe(expectReserveTooltipAfterReserve, LogMessage.value_notMatched(expectReserveTooltipAfterReserve, reserveSizeTooltip10067));

    // Verify fulfillment is created
    const demandFulfillmentRowCount = await listDemandFulfillments.getRowCount();
    expect(demandFulfillmentRowCount).toBe(2, LogMessage.value_notMatched('2', demandFulfillmentRowCount.toString()));
    const is10061FulfillmentExist = await listDemandFulfillments.hasRow([{ value: DemandID.PU_10061, columnID: ListDemandFulfillmentsColumn.DemandID }]);
    const is10067FulfillmentExist = await listDemandFulfillments.hasRow([{ value: DemandID.PU_10067, columnID: ListDemandFulfillmentsColumn.DemandID }]);
    expect(is10061FulfillmentExist).toBe(true, LogMessage.row_notFound(DemandID.PU_10061));
    expect(is10067FulfillmentExist).toBe(true, LogMessage.row_notFound(DemandID.PU_10067));
  });

  it('Step 8: Select stocking point=SHEET and OrderNr=10071 from the list again. Verify that it has open quantity 2.', async () => {
    await ddslStockingPoint.selectItem(sheet);
    const stockingPoint = await ddslStockingPoint.getSelectedString();
    expect(stockingPoint).toBe(sheet, LogMessage.value_notMatched(sheet, stockingPoint));

    // Verify that OrderNr=10071 has open quantity 2
    demand10071Row = await listDemands.getDemandRow(_10071);
    const openQty10071 = await listDemands.getCellValueFromRow(ListDemandsColumn.Open, demand10071Row);
    expect(openQty10071).toBe(_2, LogMessage.value_notMatched(_2, openQty10071));
  });

  it("Step 9: Right click on the demand and press 'Reserve materials for selected demand automatically' from the context menu.", async () => {
    await listDemands.reserveMaterial(ActionTriggerType.ContextMenu, [demand10071Row]);
  });

  it('Step 10: Verify that its open quantity is fulfilled and fulfillment is visible in demand fulfillments form.', async () => {
    // Verify that its open quantity is fulfilled
    demand10071Row = await listDemands.getDemandRow(_10071);
    const openQty10071 = await listDemands.getCellValueFromRow(ListDemandsColumn.Open, demand10071Row);
    expect(openQty10071).toBe(_0, LogMessage.value_notMatched(_0, openQty10071));

    // Verify fulfillment is created
    const demandFulfillmentRowCount = await listDemandFulfillments.getRowCount();
    expect(demandFulfillmentRowCount).toBe(1, LogMessage.value_notMatched('1', demandFulfillmentRowCount.toString()));
    const is10071FulfillmentExist = await listDemandFulfillments.hasRow([{ value: DemandID.PU_10071, columnID: ListDemandFulfillmentsColumn.DemandID }]);
    expect(is10071FulfillmentExist).toBe(true, LogMessage.row_notFound(DemandID.PU_10071));
  });
});
