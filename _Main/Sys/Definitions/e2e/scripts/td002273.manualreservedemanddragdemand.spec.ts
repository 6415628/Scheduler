/**
 * @file        TD002273 - Reserve demand to compatible supply manually (drag from demand to supply)
 * @description Verify if a demand is able to reserve on a supply with drag and drop
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

describe('TD002273 - Reserve demand to compatible supply manually (drag from demand to supply)', () => {
  let appScheduler = AppScheduler.getInstance();
  let formSuppliesAndDemands = appScheduler.viewReserveMaterial.formSuppliesAndDemands;
  let listSupplies = formSuppliesAndDemands.listSupplies;
  let listDemands = formSuppliesAndDemands.listDemands;

  let rowDemandSource: ListRow;
  let rowDemandTarget: ListRow;
  let originalDemandOpenQty = 2;
  let rowSupply: ListRow;
  let originSupplyOpenQty = 48;

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

  it('Preparation - Go to Reserve Material view', async () => {
    // open material reservation view
    await appScheduler.viewReserveMaterial.switchTo();
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

  it('Step 2 - Toogle on filter in Demand and Supply list and verify result', async () => {
    // filter demand by checking "Hide Fully reserved" checkbox in demand list
    await formSuppliesAndDemands.checkFilter(FilterReserveMaterials.HideFullyReservedDemands, true);
    // filter supply by checking "Hide incompatible supplies" checkbox in supply list
    await formSuppliesAndDemands.checkFilter(FilterReserveMaterials.HideIncompatibleSupplies, true);
    // Verify is supplies list showed only compatible supplies
    await formSuppliesAndDemands.checkSuppliesDemandIsCompatible(false, LogMessageSch.supplyDemand_supplyNotCompatible());
  });

  it('Step 3 - Toogle off ReserveFullQuantity filter in abp', async () => {
    // uncheck "Reserve Full Quantity" checkbox (CheckboxReserveFullQuantity) in abp
    await appScheduler.abpManageMaterials.cbReserveFullQty.toggle(false);
    expect(await appScheduler.abpManageMaterials.cbReserveFullQty.isChecked()).toBe(false, LogMessageSch.checkbox_isChecked('Reserve Full Quantity'));
  });

  it(`Step 4 - Sort demand based on DueDate and select OrderNr ${OrderNr._10209} which should be first instance showed in demand list after sorted`, async () => {
    // Sort demands based on due dates and verify if first row OrderNr is 10209 and select
    let demandOrderNrColumn = await listDemands.getColumnByValue(ListDemandsColumn.DueDate);
    await demandOrderNrColumn.setSortDirection(SortDirection.ASC);
    expect(await demandOrderNrColumn.getSortDirection()).toBe(SortDirection.ASC, LogMessageSch.column_notSorted(ListDemandsColumn.DueDate, 'demand', 'ASC'));
    rowDemandSource = await listDemands.getDemandRow(OrderNr._10209);
    expect(await rowDemandSource.getIndex()).toBe(0, `OrderNr ${OrderNr._10209} should showed first in Supply list after sorted`);
  });

  it(`Step 5 - Drag OrderNr ${OrderNr._10209} to ANY supply and verify drag and drop tooltip`, async () => {
    // Drag OrderNr 10209 and drop to any supply then verify that it does not work because one of the operation of the demand in the frozen horizon
    const expPartialTooltip = 'operation is planned in the frozen period';
    let firstSupplyRow = await listSupplies.getRowByIndex(0);
    let errorHintMsg1 = await listSupplies.dropRowOnTargetRow(rowDemandSource, firstSupplyRow, true);
    expect(errorHintMsg1).toContain(expPartialTooltip, LogMessageSch.tooltip_notMatched(expPartialTooltip, errorHintMsg1));
  });

  it(`Step 6 - Select Order ${OrderNr._10099} and drop on SupplyID ${SupplyID._71}`, async () => {
    // Select OrderNr 10099 and do drag and drop to supplyID 71 (which should be first in supply list)
    rowDemandTarget = await listDemands.getDemandRow(OrderNr._10099);
    originalDemandOpenQty = Number(await listDemands.getCellValueFromRow(ListDemandsColumn.Open, rowDemandTarget));
    await rowDemandTarget.leftClick();
    rowSupply = await listSupplies.getSupplyRow(SupplyID._71);
    originSupplyOpenQty = Number(await listSupplies.getCellValueFromRow(ListSuppliesColumn.Open, rowSupply));
    let errorHintMsg2 = await listDemands.dropRowOnTargetRow(rowDemandTarget, rowSupply, true);
    expect(errorHintMsg2.length).toBe(0, LogMessageSch.list_dragAndDropNotAllowed(`OrderNr ${OrderNr._10099}`, `SupplyID ${SupplyID._71}`));
  });

  it(`Step 7 - Dialog Create Fulfillment is showed and enter ${originalDemandOpenQty} qty in dialog`, async () => {
    // Dialog will be show if a demand is allowed to drop on a supply
    let dlgCreateEditFulfillment = formSuppliesAndDemands.dlgCreateEditFulfillment;
    await dlgCreateEditFulfillment.waitUntilPresent();
    // Enter 2 into "Qauntity to reserve" number picker and click ok
    await dlgCreateEditFulfillment.editQtyToReserve(originalDemandOpenQty);
  });

  it(`Step 8 - Verify if SupplyID ${SupplyID._71} open quantity is reduced by ${originalDemandOpenQty}`, async () => {
    // Verify if open quantity of supply is decreased
    let remainedOpenQty = originSupplyOpenQty - originalDemandOpenQty;
    // uncheck "Hide incompatible supply" and find supply id 71 as after demand reserved it will not be visible in list
    await formSuppliesAndDemands.checkFilter(FilterReserveMaterials.HideIncompatibleSupplies, false);
    rowSupply = await listSupplies.getSupplyRow(SupplyID._71);
    expect(await listSupplies.getCellValueFromRow(ListSuppliesColumn.Open, rowSupply)).toBe(
      remainedOpenQty.toString(),
      `Open quantity of supply 71 should decreased by ${originalDemandOpenQty} units.`,
    );
  });

  it('Step 9 - Verify OrderNr 10099 have no open quantity as it is full reserved', async () => {
    // uncheck "Hide fully reserved" check box in demand list
    await formSuppliesAndDemands.checkFilter(FilterReserveMaterials.HideFullyReservedDemands, false);
    rowDemandTarget = await listDemands.getDemandRow(OrderNr._10099);
    expect(await listDemands.getCellValueFromRow(ListDemandsColumn.Open, rowDemandTarget)).toBe(
      '0',
      `Open quantity of OrderNr ${OrderNr._10099} should be 0 as it is fully reserved`,
    );
  });
});
