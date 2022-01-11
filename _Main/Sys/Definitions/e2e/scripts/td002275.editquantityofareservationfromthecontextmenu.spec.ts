/**
 * @file        TD002275
 * @description TD002275 - Edit quantity of a reservation from the context menu
 * @author      Kwa Lay Yean
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { SortDirection } from '../e2elib/lib/src/helper/enumhelper';
import { FilterReserveMaterials, ListDemandsColumn, ListSupplyFulfillmentColumn, ListSuppliesColumn, ReservationStatus } from '../libsch/forms/suppliesanddemands';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { SupplyID, DemandID } from '../libsch/data/data.reservematerial';
import { StockingPoint } from '../libsch/data/data.product';
import { LogMessageSch } from '../libsch/logmessagesch';
import { OrderNr } from '../libsch/data/data.order';

describe('TD002275 - Edit quantity of a reservation from the context menu', () => {
  const appScheduler = AppScheduler.getInstance();
  const formSuppliesAndDemands = appScheduler.viewReserveMaterial.formSuppliesAndDemands;
  const listSupplies = formSuppliesAndDemands.listSupplies;
  const listDemands = formSuppliesAndDemands.listDemands;
  const listSupplyFulfillment = formSuppliesAndDemands.listSupplyFulfillment;

  let rowSupply: ListRow;
  let rowSupplyFulfillment: ListRow;
  let rowDemandCanBeDroppedOn: ListRow;
  let originalDemandOpenQty = 0;
  let reduceReserveQty = 1;

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

  it(`Step 1 - Filter demand and supply by SP ${StockingPoint.Sheet}`, async () => {
    await formSuppliesAndDemands.ddslStockingPoint.selectItem(StockingPoint.Sheet);
    // verify is all rows in supply and demand list have stocking point "SHEET" value
    const allRowsSupply = await listSupplies.getAllRows();
    const allRowsDemand = await listDemands.getAllRows();
    let isSupplyFilteredBySP = await listSupplies.rowHasValidValue(allRowsSupply, ListSuppliesColumn.StockingPoint, [StockingPoint.Sheet]);
    let isDemandFilteredBySP = await listDemands.rowHasValidValue(allRowsDemand, ListDemandsColumn.StockingPoint, [StockingPoint.Sheet]);
    expect(isDemandFilteredBySP && isSupplyFilteredBySP).toBe(
      true,
      LogMessageSch.column_allValuesNotMatched(ListSuppliesColumn.StockingPoint, StockingPoint.Sheet, ['Demand', 'Supply']),
    );
  });

  it('Step 2 - Toggle on filter in demand list and verify filtered result', async () => {
    // filter demand by checking "Hide Fully reserved" and "Hide incompatible demands" checkbox in demand list
    await formSuppliesAndDemands.checkFilter(FilterReserveMaterials.HideFullyReservedDemands, true);
    await formSuppliesAndDemands.checkFilter(FilterReserveMaterials.HideIncompatibleDemands, true);
    // Verify is demands list showed only compatible demands
    await formSuppliesAndDemands.checkSuppliesDemandIsCompatible(true, LogMessageSch.supplyDemand_demandNotCompatible());
  });

  it('Step 3 - Toggle on ReserveFullQuantity filter in abp', async () => {
    // check "Reserve Full Quantity" checkbox (CheckboxReserveFullQuantity) in abp
    await appScheduler.abpManageMaterials.cbReserveFullQty.toggle(true);
    const isCheckboxChecked = await appScheduler.abpManageMaterials.cbReserveFullQty.isChecked();
    expect(isCheckboxChecked).toBe(true, LogMessageSch.checkbox_notChecked('Reserve Full Quantity'));
  });

  it(`Step 4 - Sort supply based on availability, product ID and select SupplyID ${SupplyID._62}`, async () => {
    // Sort supplys based on their availability (Available From) and ProductID (Product ID)
    const supplyAvailableFromColumn = await listSupplies.getColumnByValue(ListSuppliesColumn.AvailableFrom);
    const supplyProductIDColumn = await listSupplies.getColumnByValue(ListSuppliesColumn.ProductId);

    await supplyAvailableFromColumn.setSortDirection(SortDirection.ASC);
    await supplyProductIDColumn.setSortDirection(SortDirection.ASC, true);

    expect(await supplyAvailableFromColumn.getSortDirection()).toBe(SortDirection.ASC, LogMessageSch.column_notSorted(ListSuppliesColumn.AvailableFrom, 'supply', 'ASC'));

    expect(await supplyProductIDColumn.getSortDirection()).toBe(SortDirection.ASC, LogMessageSch.column_notSorted(ListSuppliesColumn.ProductId, 'supply', 'ASC'));
    // Select SupplyID 62 in supply list and drag and drop on OrderNr 10181 in demand list
    rowSupply = await listSupplies.getSupplyRow(SupplyID._62);
    await rowSupply.leftClick();
  });

  it(`Step 5 - Drag SupplyID ${SupplyID._62} in supply list then drop on OrderNr ${OrderNr._10181} in demand list`, async () => {
    // drag SupplyID 62 in supply list and drop on OrderNr 10181 in demand list
    rowDemandCanBeDroppedOn = await listDemands.getDemandRow(OrderNr._10181);
    originalDemandOpenQty = Number(await listDemands.getCellValueFromRow(ListDemandsColumn.Open, rowDemandCanBeDroppedOn));
    const errorHintMsg = await listDemands.dropRowOnTargetRow(rowSupply, rowDemandCanBeDroppedOn, true);
    expect(errorHintMsg.length).toBe(0, LogMessageSch.list_dragAndDropNotAllowed(`SupplyID ${SupplyID._62}`, `OrderNr ${OrderNr._10181}`));
    expect(await listDemands.isDemandRowExist(OrderNr._10181)).toBe(false, 'Fully reserved demand should not be displayed in the Demand list');
  });

  it(`Step 6 - Select SupplyID ${SupplyID._62} and edit quantity of reservation by double click on supply fulfillment ${DemandID.PU_10181}`, async () => {
    await rowSupply.leftClick();
    rowSupplyFulfillment = await listSupplyFulfillment.getSupplyFulfillmentRow(DemandID.PU_10181);

    const dlgCreateEditFulfillment = await listSupplyFulfillment.editSupplyFulfillmentRow(rowSupplyFulfillment);
    // Input 1 into "Quantity to reserve" number picker and click ok
    await dlgCreateEditFulfillment.editQtyToReserve(reduceReserveQty);

    const expectedfulfillmentQty = originalDemandOpenQty - reduceReserveQty;
    const actualFulfilmentQty = Number(await listSupplyFulfillment.getCellValueFromRow(ListSupplyFulfillmentColumn.Quantity, rowSupplyFulfillment));

    expect(actualFulfilmentQty).toBe(expectedfulfillmentQty, `Quantity reserved for ${DemandID.PU_10181} should be ${expectedfulfillmentQty}`);
  });

  it(`Step 7 - Verify OrderNr ${OrderNr._10181} is visible in demand list again with partial reserved warning image`, async () => {
    rowDemandCanBeDroppedOn = await listDemands.getDemandRow(OrderNr._10181);
    const isDemandRowExist = await listDemands.isDemandRowExist(OrderNr._10181);
    const reservationStatusImgAttrb = await listDemands.getCellValueFromRow(ReservationStatus.ColumnIndex, rowDemandCanBeDroppedOn, true);

    expect(isDemandRowExist).toBe(true, 'Partially reserved demand should be displayed in the Demand list');
    // Verify order is partially reserved
    expect(reservationStatusImgAttrb).toBe(ReservationStatus.PartiallyReserved, 'There should be partial reserved warning image for partially reserved demand');
  });
});
