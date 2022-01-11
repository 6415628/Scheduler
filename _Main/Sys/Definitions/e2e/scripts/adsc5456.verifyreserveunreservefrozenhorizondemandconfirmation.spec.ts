/**
 * @file        ADSC-5456
 * @description Verify soft precondition for reserve/unreserve demand fulfillment in frozen horizon
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { LogMessage } from '../libappbase/logmessage';
import { StockingPoint } from '../libsch/data/data.product';
import { ImgFrozen, ListDemandFulfillmentsColumn, ListDemandsColumn, ReserveUnreserveDemandPrecondition } from '../libsch/forms/suppliesanddemands';
import { DemandID } from '../libsch/data/data.reservematerial';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { ActionTriggerType } from '../libappbase/utils';
import { ButtonType, ToastGlobal } from '../libappbase/toastglobal';
import { QToastType } from '../e2elib/lib/src/pageobjects/toast/toastmessage.component';
import { LogMessageSch } from '../libsch/logmessagesch';
import { OrderNr } from '../libsch/data/data.order';

describe('ADSC-5456, Verify soft precondition for reserve/unreserve demand fulfillment in frozen horizon', () => {
  const appScheduler = AppScheduler.getInstance();

  const viewReserveMaterial = appScheduler.viewReserveMaterial;
  const formSuppliesAndDemands = viewReserveMaterial.formSuppliesAndDemands;
  const ddslStockingPoint = formSuppliesAndDemands.ddslStockingPoint;
  const listDemands = formSuppliesAndDemands.listDemands;
  const listDemandFulfillments = formSuppliesAndDemands.listDemandFulfillments;

  let demandRow: ListRow;
  let toast = ToastGlobal.getInstance();

  const slab = StockingPoint.Slab;
  const _10371 = OrderNr._10371;
  const expectOpenQtyBeforeReserve = '1';
  const expectOpenQtyAfterReserve = '0';
  const expectReservePreconMsg = ReserveUnreserveDemandPrecondition.DemandReserveMsg;
  const expectUnreservePreconMsg = ReserveUnreserveDemandPrecondition.DemandUnreserveMsg;

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
    await appScheduler.switchToDemoScenario(DemoCategory.SalesDemo, DemoScenario.AluminumHotRolling);
  });

  afterAll(async () => {
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
    await ddslStockingPoint.selectItem(StockingPoint.Slab);
    const stockingPoint = await ddslStockingPoint.getSelectedString();
    expect(stockingPoint).toBe(slab, LogMessage.value_notMatched(slab, stockingPoint));
  });

  it('Step 3: Select OrderNr=10371. Verify that open quantity=1 and demand is in frozen horizon.', async () => {
    demandRow = await listDemands.getDemandRow(_10371);

    const openQty = await listDemands.getCellValueFromRow(ListDemandsColumn.Open, demandRow);
    expect(openQty).toBe(expectOpenQtyBeforeReserve, LogMessage.value_notMatched(expectOpenQtyBeforeReserve, openQty));

    const isFrozenHorizon = await listDemands.getCellValueFromRow(ImgFrozen.ColumnIndex, demandRow, true);
    expect(isFrozenHorizon).toBe(ImgFrozen.Frozen, LogMessage.value_notMatched(ImgFrozen.Frozen, isFrozenHorizon));
  });

  it('Step 4: Right click on the selected demand. Verify that a confirmation message poped up to warn user that operations of demand fall within the frozen horizon. Press yes.', async () => {
    await listDemands.reserveMaterial(ActionTriggerType.ContextMenu, [demandRow]);

    // Verify warning toast is popped up
    const isSoftPrecon = await toast.verifyLastToastType(QToastType.WARNING);
    expect(isSoftPrecon).toBe(true, LogMessageSch.toast_notWarning('reserve material for frozen horizon demands'));

    // Verify toast message
    const reservePreconMsg = await toast.getLastToastMessage();
    expect(reservePreconMsg).toBe(expectReservePreconMsg, LogMessage.value_notMatched(expectReservePreconMsg, reservePreconMsg));

    await toast.clickToastButton(ButtonType.Yes);
  });

  it('Step 5: Verify that OpenQuantity decreased to 0 and fulfillment is visible in demand fulfillments form.', async () => {
    // Verify OpenQuantity
    const openQty = await listDemands.getCellValueFromRow(ListDemandsColumn.Open, demandRow);
    expect(openQty).toBe(expectOpenQtyAfterReserve, LogMessage.value_notMatched(expectOpenQtyAfterReserve, openQty));

    // Verify fulfillment is created
    const demandFulfillmentRowCount = await listDemandFulfillments.getRowCount();
    expect(demandFulfillmentRowCount).toBe(1, LogMessage.value_notMatched('1', demandFulfillmentRowCount.toString()));
    const isDemandFulfillmentExist = await listDemandFulfillments.hasRow([{ value: DemandID.PU_10371, columnID: ListDemandFulfillmentsColumn.DemandID }]);
    expect(isDemandFulfillmentExist).toBe(true, LogMessage.row_notFound(DemandID.PU_10371));
  });

  it('Step 6: Delete the material reservation that is created in step 4. Verify that same warning message poped up for user to confirm delete action. Press yes.', async () => {
    await listDemands.removeReservationVia(ActionTriggerType.ContextMenu, [demandRow]);

    // Verify warning toast is popped up
    const isSoftPrecon = await toast.verifyLastToastType(QToastType.WARNING);
    expect(isSoftPrecon).toBe(true, LogMessageSch.toast_notWarning('unreserve for frozen horizon demands'));

    // Verify toast message
    const unreservePreconMsg = await toast.getLastToastMessage();
    expect(unreservePreconMsg).toBe(expectUnreservePreconMsg, LogMessage.value_notMatched(expectUnreservePreconMsg, unreservePreconMsg));
    await toast.clickToastButton(ButtonType.Yes);
  });

  it('Step 7: Verify that fulfillment is deleted.', async () => {
    // Verify fulfillment is deleted
    const demandFulfillmentRowCount = await listDemandFulfillments.getRowCount();
    expect(demandFulfillmentRowCount).toBe(0, LogMessage.value_notMatched('0', demandFulfillmentRowCount.toString()));
    const isDemandFulfillmentExist = await listDemandFulfillments.hasRow([{ value: DemandID.PU_10371, columnID: ListDemandFulfillmentsColumn.DemandID }]);
    expect(isDemandFulfillmentExist).toBe(false, LogMessage.row_found([DemandID.PU_10371]));
  });
});
