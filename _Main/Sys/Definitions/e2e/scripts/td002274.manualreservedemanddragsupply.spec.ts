/**
 * @file        TD002274 - Reserve demand to compatible supply manually (drag from demand to supply)
 * @description Verify if a supply is able to reserve on a demand with drag and drop
 * @author      Wong Jia Hui (jiahui.wong@3ds.com)
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { SortDirection } from '../e2elib/lib/src/helper/enumhelper';
import { FilterReserveMaterials, ListDemandsColumn, ListSuppliesColumn } from '../libsch/forms/suppliesanddemands';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { SupplyID } from '../libsch/data/data.reservematerial';
import { StockingPoint } from '../libsch/data/data.product';
import { LogMessageSch } from '../libsch/logmessagesch';
import { OrderNr } from '../libsch/data/data.order';

describe('TD002274 - Reserve demand to compatible supply manually (drag from supply to demand)', () => {
  let appScheduler = AppScheduler.getInstance();
  let formSuppliesAndDemands = appScheduler.viewReserveMaterial.formSuppliesAndDemands;
  let listSupplies = formSuppliesAndDemands.listSupplies;
  let listDemands = formSuppliesAndDemands.listDemands;

  let rowSupply: ListRow;
  let rowDemandCannotBeDroppedOn: ListRow;
  let rowDemandCanBeDroppedOn: ListRow;
  let originalDemandOpenQty = 0;
  let originSupplyOpenQty = 0;

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
    // await appScheduler.checkToastMessage();
  });

  it('Preparation - Go to Reserve Material view', async () => {
    // open material reservation view
    await appScheduler.viewReserveMaterial.switchTo();
  });

  it(`Step 1 - Filter demand and supply by SP ${StockingPoint.Slab}`, async () => {
    await formSuppliesAndDemands.ddslStockingPoint.selectItem(StockingPoint.Slab);
    // verify is all rows in supply and demand list have stocking point "SHEET" value
    const allRowsSupply = await listSupplies.getAllRows();
    const allRowsDemand = await listDemands.getAllRows();
    let isSupplyFilteredBySP = await listSupplies.rowHasValidValue(allRowsSupply, ListSuppliesColumn.StockingPoint, [StockingPoint.Slab]);
    let isDemandFilteredBySP = await listDemands.rowHasValidValue(allRowsDemand, ListDemandsColumn.StockingPoint, [StockingPoint.Slab]);
    expect(isDemandFilteredBySP && isSupplyFilteredBySP).toBe(
      true,
      LogMessageSch.column_allValuesNotMatched(ListSuppliesColumn.StockingPoint, StockingPoint.Slab, ['Demand', 'Supply']),
    );
  });

  it('Step 2 - Toogle on filter in demand list and verify filtered result', async () => {
    // filter demand by checking "Hide Fully reserved" and "Hide incompatible demands" checkbox in demand list
    await formSuppliesAndDemands.checkFilter(FilterReserveMaterials.HideFullyReservedDemands, true);
    await formSuppliesAndDemands.checkFilter(FilterReserveMaterials.HideIncompatibleDemands, true);
    // Verify is demands list showed only compatible demands
    await formSuppliesAndDemands.checkSuppliesDemandIsCompatible(true, LogMessageSch.supplyDemand_demandNotCompatible());
  });

  it('Step 3 - Toogle on ReserveFullQuantity filter in abp', async () => {
    // check "Reserve Full Quantity" checkbox (CheckboxReserveFullQuantity) in abp
    await appScheduler.abpManageMaterials.cbReserveFullQty.toggle(true);
    expect(await appScheduler.abpManageMaterials.cbReserveFullQty.isChecked()).toBe(true, LogMessageSch.checkbox_notChecked('Reserve Full Quantity'));
  });

  it(`Step 4 - Sort supply based on availability and select SupplyID ${SupplyID._23}`, async () => {
    // Sort supplys based on their availability (Available From)
    let supplyAvailableFromColumn = await listSupplies.getColumnByValue(ListSuppliesColumn.AvailableFrom);
    await supplyAvailableFromColumn.setSortDirection(SortDirection.ASC);
    expect(await supplyAvailableFromColumn.getSortDirection()).toBe(SortDirection.ASC, LogMessageSch.column_notSorted(ListSuppliesColumn.AvailableFrom, 'supply', 'ASC'));
    // Select SupplyID 23 in supply list and drag and drop on OrderNr 10149 in demand list
    rowSupply = await listSupplies.getSupplyRow(SupplyID._23);
    originSupplyOpenQty = Number(await listSupplies.getCellValueFromRow(ListSuppliesColumn.Open, rowSupply));
    await rowSupply.leftClick();
  });

  it(`Step 5 - Drag SupplyID ${SupplyID._23} then drop on OrderNr${OrderNr._10149} and verify drag and drop is not work`, async () => {
    const expPartialTooltip = 'operation is planned in the frozen period';
    rowDemandCannotBeDroppedOn = await listDemands.getDemandRow(OrderNr._10149);
    // Verify supply id 23 is not allowed drop on order nr 10149
    let errorHintMsg = await listDemands.dropRowOnTargetRow(rowSupply, rowDemandCannotBeDroppedOn, true);
    expect(errorHintMsg).toContain(expPartialTooltip, LogMessageSch.tooltip_notMatched(expPartialTooltip, errorHintMsg));
  });

  it(`Step 6 - Drag SupplyID ${SupplyID._23} then drop on OrderNr${OrderNr._10093}`, async () => {
    // drag SupplyID 23 in supply list and drop on OrderNr 10099 in demand list
    rowDemandCanBeDroppedOn = await listDemands.getDemandRow(OrderNr._10093);
    originalDemandOpenQty = Number(await listDemands.getCellValueFromRow(ListDemandsColumn.Open, rowDemandCanBeDroppedOn));
    let errorHintMsg = await listDemands.dropRowOnTargetRow(rowSupply, rowDemandCanBeDroppedOn, true);
    expect(errorHintMsg.length).toBe(0, LogMessageSch.list_dragAndDropNotAllowed(`SupplyID ${SupplyID._23}`, `OrderNr ${OrderNr._10093}`));
  });

  it(`Step 7 - Verify SupplyID ${SupplyID._23} open quantity is reduced by ${originSupplyOpenQty}`, async () => {
    // Check if supply's open quantity is decrease after demand reserved
    let remainedOpenQty = originSupplyOpenQty - originalDemandOpenQty;
    expect(await listSupplies.getCellValueFromRow(ListSuppliesColumn.Open, rowSupply)).toBe(
      remainedOpenQty.toString(),
      `Open quantity of SupplyID ${SupplyID._23} should decreased by ${originalDemandOpenQty} units`,
    );
  });

  it(`Step 8 - Verify OrderNr${OrderNr._10093} have no open quantity as it is full reserved`, async () => {
    // uncheck "Hide fully reserved" check box in demand list
    await formSuppliesAndDemands.checkFilter(FilterReserveMaterials.HideFullyReservedDemands, false);
    rowDemandCanBeDroppedOn = await listDemands.getDemandRow(OrderNr._10093);
    expect(await listDemands.getCellValueFromRow(ListDemandsColumn.Open, rowDemandCanBeDroppedOn)).toBe(
      '0',
      `Open quantity of OrderNr ${rowDemandCanBeDroppedOn} should be 0 as it is fully reserved`,
    );
  });
});
