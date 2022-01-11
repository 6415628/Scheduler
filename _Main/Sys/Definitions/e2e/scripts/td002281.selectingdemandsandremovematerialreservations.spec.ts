/**
 * @file        TD002281
 * @description Selecting one or more demands and removing all their material reservations
 * @author      Jayden Chew (jayden.chew@3ds.com)
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { LogMessage } from '../libappbase/logmessage';
import { ListDemandsColumn, ListDemandFulfillmentsColumn } from '../libsch/forms/suppliesanddemands';
import { StockingPoint } from '../libsch/data/data.product';
import { SortDirection } from '../e2elib/lib/src/helper/enumhelper';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { DemandID, Quantity, SupplyID } from '../libsch/data/data.reservematerial';
import { ActionTriggerType } from '../libappbase/utils';
import { OrderNr } from '../libsch/data/data.order';

describe('TD002281 - Selecting one or more demands and removing all their material reservations', () => {
  type ReservationMap = { demand: string; supplyFulfillment: string; demandFulfillment: string }[];

  const appScheduler = AppScheduler.getInstance();

  const formSuppliesAndDemands = appScheduler.viewReserveMaterial.formSuppliesAndDemands;
  const listDemands = appScheduler.viewReserveMaterial.formSuppliesAndDemands.listDemands;
  const listDemandFulfillments = formSuppliesAndDemands.listDemandFulfillments;
  const listSupplies = appScheduler.viewReserveMaterial.formSuppliesAndDemands.listSupplies;
  const listSupplyFulfillments = formSuppliesAndDemands.listSupplyFulfillment;

  const expectedOpenQty = Quantity._0;

  /**
   * Get demand strings for description
   * @param map reservation map
   */
  const getDemandStr = (map: ReservationMap): string => map.map((value: { demand: string }) => value.demand).join(', ');

  const demandsToBeDeletedViaBtn: ReservationMap = [
    { demand: OrderNr._10062, supplyFulfillment: SupplyID._58, demandFulfillment: DemandID.PU_10062 },
    { demand: OrderNr._10068, supplyFulfillment: SupplyID._59, demandFulfillment: DemandID.PU_10068 },
  ];

  const demandsToBeDeletedViaCM: ReservationMap = [
    { demand: OrderNr._10070, supplyFulfillment: SupplyID._60, demandFulfillment: DemandID.PU_10070 },
    { demand: OrderNr._10178, supplyFulfillment: SupplyID._60, demandFulfillment: DemandID.PU_10178 },
  ];

  const demandsToBeDeletedViaKey: ReservationMap = [{ demand: OrderNr._10065, supplyFulfillment: SupplyID._58, demandFulfillment: DemandID.PU_10065 }];

  const verifyRemoveReservation = async (reservationMaps: ReservationMap): Promise<void> => {
    for (const { demand, supplyFulfillment, demandFulfillment } of reservationMaps) {
      // verify quantity
      const demandRowsSelected = await listDemands.getDemandRow(demand);
      await demandRowsSelected.leftClick();

      const openQuantity = await listDemands.getCellValueFromRow(ListDemandsColumn.Open, demandRowsSelected);
      const quantity = await listDemands.getCellValueFromRow(ListDemandsColumn.Quantity, demandRowsSelected);
      expect(openQuantity).toBe(quantity, LogMessage.value_notMatched(openQuantity, quantity));

      // verify all the supplies that were assigned to selected demands are removed.
      const rowsSelectedSupply = await listSupplies.getSupplyRow(supplyFulfillment);
      await rowsSelectedSupply.leftClick();
      let rowSelectedSupplyFulfillment: undefined | ListRow;
      try {
        rowSelectedSupplyFulfillment = await listSupplyFulfillments.getSupplyFulfillmentRow(demandFulfillment);
      } catch {
        // do nothing
      }
      expect(rowSelectedSupplyFulfillment).toBeUndefined('There should be no supplies that reserved to selected demands');
    }
  };

  const verifyDemandAndFulfillment = async (map: ReservationMap): Promise<void> => {
    for (const { demand, supplyFulfillment } of map) {
      const demandRowSelected = await listDemands.getDemandRow(demand);
      await demandRowSelected.leftClick();

      const openQuantity = await listDemands.getCellValueFromRow(ListDemandsColumn.Open, demandRowSelected);
      expect(openQuantity).toBe(expectedOpenQty, `${LogMessage.value_notMatched(expectedOpenQty, openQuantity)} with Demand Order Nr:${demand}.`);

      const rowdemandfulfillment = await listDemandFulfillments.getRowByIndex(0);
      const supplyId = await listDemandFulfillments.getCellValueFromRow(ListDemandFulfillmentsColumn.SupplyID, rowdemandfulfillment);
      expect(supplyId).toBe(supplyFulfillment, `${LogMessage.value_notMatched(supplyFulfillment, supplyId)} with Demand Order Nr:${demand}.`);
    }
  };

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

  it('Setup - Material reservation view is loaded.', async () => {
    await appScheduler.viewReserveMaterial.switchTo();
    expect(await formSuppliesAndDemands.isVisible()).toBe(true, LogMessage.form_notVisible('Supplies and Demands'));
  });

  it(`Step 1 - Go to demands form and filter demands by stocking point ${StockingPoint.Sheet}.`, async () => {
    await formSuppliesAndDemands.ddslStockingPoint.selectItem(StockingPoint.Sheet);
    const allRowsDemand = await listDemands.getAllRows();
    const isDemandFilteredBySP = await formSuppliesAndDemands.listDemands.rowHasValidValue(allRowsDemand, ListDemandsColumn.StockingPoint, [StockingPoint.Sheet]);
    expect(isDemandFilteredBySP).toBe(true, `All rows in Demand and Supply list should have Stocking Point ID ${StockingPoint.Sheet}`);
  });

  it('Step 2 - Sort demands ascending by QuantityOpen firstly and earliest due date secondly', async () => {
    const sortDirection = SortDirection.ASC;
    const quantityOpenColumn = await listDemands.getColumnByValue(ListDemandsColumn.Open);
    await quantityOpenColumn.setSortDirection(sortDirection);
    expect(await quantityOpenColumn.getSortDirection()).toBe(sortDirection, `Demand list should sort by ${ListDemandsColumn.Open} in ascending order`);

    const dueDateColumn = await listDemands.getColumnByValue(ListDemandsColumn.DueDate);
    await dueDateColumn.setSortDirection(sortDirection, true);
    expect(await dueDateColumn.getSortDirection()).toBe(sortDirection, `Demand list should sort by ${ListDemandsColumn.DueDate} in ascending order`);

    const orderNrColumn = await listDemands.getColumnByValue(ListDemandsColumn.OrderNr);
    await orderNrColumn.setSortDirection(sortDirection, true);
    expect(await orderNrColumn.getSortDirection()).toBe(sortDirection, `Demand list should sort by ${ListDemandsColumn.OrderNr} in ascending order`);
  });

  it(`Step 3 - Select ${getDemandStr(
    demandsToBeDeletedViaBtn,
  )} and verify their open quantities are ${expectedOpenQty} and there are supplies reserved to selected demands`, async () => {
    await verifyDemandAndFulfillment(demandsToBeDeletedViaBtn);
  });

  it(`Step 4 - Remove reservation on ${getDemandStr(demandsToBeDeletedViaBtn)} via button`, async () => {
    let demandRows: ListRow[] = [];
    for (const [index, { demand }] of demandsToBeDeletedViaBtn.entries()) {
      const demandRowsSelected = await listDemands.getDemandRow(demand);
      const modifier = index === 0 ? undefined : { control: true };
      await demandRowsSelected.leftClick(modifier);
      demandRows.push(demandRowsSelected);
    }
    await listDemands.removeReservationVia(ActionTriggerType.Button, demandRows);
  });

  it(`Step 5 - Verify ${getDemandStr(demandsToBeDeletedViaBtn)} had removed reservation`, async () => {
    await verifyRemoveReservation(demandsToBeDeletedViaBtn);
  });

  it(`Step 6 - Select ${getDemandStr(
    demandsToBeDeletedViaCM,
  )} and verify their open quantities are ${expectedOpenQty} and there are supplies reserved to selected demands`, async () => {
    await verifyDemandAndFulfillment(demandsToBeDeletedViaCM);
  });

  it(`Step 7 - Remove Reservation on ${getDemandStr(demandsToBeDeletedViaCM)} via context menu`, async () => {
    let demandRows: ListRow[] = [];
    for (const [index, { demand }] of demandsToBeDeletedViaCM.entries()) {
      const demandRow = await listDemands.getDemandRow(demand);
      const modifier = index === 0 ? undefined : { control: true };
      await demandRow.leftClick(modifier);
      demandRows.push(demandRow);
    }
    await listDemands.removeReservationVia(ActionTriggerType.ContextMenu, demandRows);
  });

  it(`Step 8 - Verify ${getDemandStr(demandsToBeDeletedViaCM)} had removed reservation`, async () => {
    await verifyRemoveReservation(demandsToBeDeletedViaCM);
  });

  it(`Step 9 - select OrderNr=${getDemandStr(demandsToBeDeletedViaKey)}. Verify that ${SupplyID._58} assigned to it.`, async () => {
    await verifyDemandAndFulfillment(demandsToBeDeletedViaKey);
  });

  it(`Step 10 - Remove Reservation on ${getDemandStr(demandsToBeDeletedViaKey)} via Key DELETE`, async () => {
    let demandRows: ListRow[] = [];
    for (const [index, { demand }] of demandsToBeDeletedViaKey.entries()) {
      const demandRow = await listDemands.getDemandRow(demand);
      const modifier = index === 0 ? undefined : { control: true };
      await demandRow.leftClick(modifier);
      demandRows.push(demandRow);
    }
    await listDemands.removeReservationVia(ActionTriggerType.Key, demandRows);
  });

  it(`Step 11 - Verify ${getDemandStr(demandsToBeDeletedViaKey)} had removed reservation`, async () => {
    await verifyRemoveReservation(demandsToBeDeletedViaKey);
  });
});
