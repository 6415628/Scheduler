/**
 * @file        TD002280
 * @description TD002280 - Selecting one or more supplies and removing all their material reservations
 * @author      Kwa Lay Yean
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { SortDirection } from '../e2elib/lib/src/helper/enumhelper';
import { ListDemandsColumn, ListSuppliesColumn } from '../libsch/forms/suppliesanddemands';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { SupplyID } from '../libsch/data/data.reservematerial';
import { StockingPoint } from '../libsch/data/data.product';
import { LogMessageSch } from '../libsch/logmessagesch';
import { ActionTriggerType } from '../libappbase/utils';

describe('TD002280 - Selecting one or more supplies and removing all their material reservations', () => {
  let appScheduler = AppScheduler.getInstance();
  let formSuppliesAndDemands = appScheduler.viewReserveMaterial.formSuppliesAndDemands;
  let listSupplies = formSuppliesAndDemands.listSupplies;
  let listDemands = formSuppliesAndDemands.listDemands;
  let listSupplyFulfillment = formSuppliesAndDemands.listSupplyFulfillment;

  let rowSupply1: ListRow;
  let rowSupply2: ListRow;
  let expSupplyReservedQty = 0;
  let expTotalRows = 0;
  let actTotalRows = 0;

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

  it('SETUP - Go to "Manage Materials" action bar > Open "Reserve Material" view.', async () => {
    // open material reservation view
    await appScheduler.viewReserveMaterial.switchTo();
    expect(await formSuppliesAndDemands.isVisible()).toBe(true, LogMessageSch.form_notVisible('Supplies and Demands'));
  });

  it(`Step 1 - Filter demand and supply by SP ${StockingPoint.Slab}`, async () => {
    await formSuppliesAndDemands.ddslStockingPoint.selectItem(StockingPoint.Slab);
    // verify is all rows in supply and demand list have stocking point "SLAB" value
    const allRowsSupply = await listSupplies.getAllRows();
    const allRowsDemand = await listDemands.getAllRows();
    let isSupplyFilteredBySP = await listSupplies.rowHasValidValue(allRowsSupply, ListSuppliesColumn.StockingPoint, [StockingPoint.Slab]);
    let isDemandFilteredBySP = await listDemands.rowHasValidValue(allRowsDemand, ListDemandsColumn.StockingPoint, [StockingPoint.Slab]);
    expect(isDemandFilteredBySP && isSupplyFilteredBySP).toBe(
      true,
      LogMessageSch.column_allValuesNotMatched(ListSuppliesColumn.StockingPoint, StockingPoint.Slab, ['Demand', 'Supply']),
    );
  });

  it('Step 2 - Sort supply based on availability, reserved quantity', async () => {
    // Sort supplys based on their availability (Available From) and reserved quantity (Reserved)
    let supplyAvailableFromColumn = await listSupplies.getColumnByValue(ListSuppliesColumn.AvailableFrom);
    let supplyReservedColumn = await listSupplies.getColumnByValue(ListSuppliesColumn.Reserved);

    await supplyAvailableFromColumn.setSortDirection(SortDirection.ASC);
    await supplyReservedColumn.setSortDirection(SortDirection.DESC, true);

    expect(await supplyAvailableFromColumn.getSortDirection()).toBe(SortDirection.ASC, LogMessageSch.column_notSorted(ListSuppliesColumn.AvailableFrom, 'supply', 'ASC'));
    expect(await supplyReservedColumn.getSortDirection()).toBe(SortDirection.DESC, LogMessageSch.column_notSorted(ListSuppliesColumn.Reserved, 'supply', 'DESC'));
  });

  it(`Step 3 - Select SupplyID ${SupplyID._26} and verify in the supply fulfillment form that this supply is reserved for some demands`, async () => {
    rowSupply1 = await listSupplies.getSupplyRow(SupplyID._26);
    await rowSupply1.leftClick();
    actTotalRows = await listSupplyFulfillment.getRowCount();
    expect(actTotalRows).toBeGreaterThan(0, 'There is no demand reserved for the supply');
  });

  it('Step 4 - Click on action button "Remove reservation"', async () => {
    rowSupply1 = await listSupplies.getSupplyRow(SupplyID._26);
    await listSupplies.removeReservation(ActionTriggerType.Button, [rowSupply1]);

    // Need to re-assign again as the focus move to action bar and no longer in list
    rowSupply1 = await listSupplies.getSupplyRow(SupplyID._26);
    const { Quantity: expSupplyOpenQty, Open: actualSupplyOpenQty, Reserved: actualSupplyReserveQty } = await listSupplies.getCellValuesFromRow(rowSupply1, ListSuppliesColumn);

    expect(actualSupplyOpenQty).toBe(expSupplyOpenQty.toString(), LogMessageSch.supplyDemand_openQtyNotMatch(SupplyID._26, expSupplyOpenQty));
    expect(actualSupplyReserveQty).toBe(expSupplyReservedQty.toString(), LogMessageSch.supplyDemand_reserveQtyNotMatch(SupplyID._26, expSupplyReservedQty.toString()));
  });

  it(`Step 5 - Select SupplyID ${SupplyID._30} and verify in the supply fulfillment form that this supply is reserved for some demands`, async () => {
    rowSupply1 = await listSupplies.getSupplyRow(SupplyID._30);
    await listSupplies.selectRow(rowSupply1);

    actTotalRows = await listSupplyFulfillment.getRowCount();
    expect(actTotalRows).toBeGreaterThan(0, 'There is no demand reserved for the supply');
  });

  it('Step 6 - Click on action button "Remove reservation"', async () => {
    rowSupply1 = await listSupplies.getSupplyRow(SupplyID._30);
    await listSupplies.removeReservation(ActionTriggerType.ContextMenu, [rowSupply1]);

    // Need to re-assign again as the focus move to action bar and no longer in list
    rowSupply1 = await listSupplies.getSupplyRow(SupplyID._30);
    const { Open: actualSupplyOpenQty, Quantity: expSupplyOpenQty, Reserved: actualSupplyReserveQty } = await listSupplies.getCellValuesFromRow(rowSupply1, ListSuppliesColumn);

    expect(actualSupplyOpenQty).toBe(expSupplyOpenQty.toString(), LogMessageSch.supplyDemand_openQtyNotMatch(SupplyID._30, expSupplyOpenQty));
    expect(actualSupplyReserveQty).toBe(expSupplyReservedQty.toString(), LogMessageSch.supplyDemand_reserveQtyNotMatch(SupplyID._30, expSupplyReservedQty.toString()));
  });

  it(`Step 7 - Select SupplyID ${SupplyID._27} and ${SupplyID._44}. Verify in the supply fulfillment form that these supplies are reserved for 10 demands`, async () => {
    rowSupply1 = await listSupplies.getSupplyRow(SupplyID._27);
    rowSupply2 = await listSupplies.getSupplyRow(SupplyID._44);
    await listSupplies.selectRows([rowSupply1, rowSupply2]);

    expTotalRows = 10;
    actTotalRows = await listSupplyFulfillment.getRowCount();
    expect(actTotalRows).toBe(
      expTotalRows,
      LogMessageSch.supplyFulfilment_totalRowNotMatch([SupplyID._27, SupplyID._44], expTotalRows.toString(), actTotalRows.toString()),
    );
  });

  it('Step 8 - Press "Delete" key button', async () => {
    rowSupply1 = await listSupplies.getSupplyRow(SupplyID._27);
    rowSupply2 = await listSupplies.getSupplyRow(SupplyID._44);

    await listSupplies.removeReservation(ActionTriggerType.Key, [rowSupply1, rowSupply2]);

    // Need to re-assign again as the focus move to action bar and no longer in list
    rowSupply1 = await listSupplies.getSupplyRow(SupplyID._27);
    rowSupply2 = await listSupplies.getSupplyRow(SupplyID._44);
    const { Quantity: expSupplyOpenQty1, Open: actualSupplyOpenQty1 } = await listSupplies.getCellValuesFromRow(rowSupply1, ListSuppliesColumn);
    const { Quantity: expSupplyOpenQty2, Open: actualSupplyOpenQty2 } = await listSupplies.getCellValuesFromRow(rowSupply2, ListSuppliesColumn);

    expect(actualSupplyOpenQty1).toBe(expSupplyOpenQty1.toString(), LogMessageSch.supplyDemand_openQtyNotMatch(SupplyID._27, expSupplyOpenQty1));
    expect(actualSupplyOpenQty2).toBe(expSupplyOpenQty2.toString(), LogMessageSch.supplyDemand_openQtyNotMatch(SupplyID._44, expSupplyOpenQty2));

    await listSupplies.selectRows([rowSupply1, rowSupply2]);
    expTotalRows = 0;
    actTotalRows = await listSupplyFulfillment.getRowCount();
    expect(actTotalRows).toBe(
      expTotalRows,
      LogMessageSch.supplyFulfilment_totalRowNotMatch([SupplyID._27, SupplyID._44], expTotalRows.toString(), actTotalRows.toString()),
    );
  });
});
