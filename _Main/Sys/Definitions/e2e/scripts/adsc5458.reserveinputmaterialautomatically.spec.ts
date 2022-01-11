/**
 * @file        ADSC-5458
 * @description Selecting one or more operations and reserving input material automatically
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { LogMessage } from '../libappbase/logmessage';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { ActionTriggerType } from '../libappbase/utils';
import { ButtonType, ToastGlobal } from '../libappbase/toastglobal';
import { QToastType } from '../e2elib/lib/src/pageobjects/toast/toastmessage.component';
import { LogMessageSch } from '../libsch/logmessagesch';
import { ImgIsPlanned, ListOperationColumn, MaterialStatus, OperationPrecondition } from '../libsch/forms/workordersandoperations';
import { OperationType } from '../libsch/data/data.workorder';
import { OrderNr } from '../libsch/data/data.order';

describe('ADSC-5458, Selecting one or more operations and reserving input material automatically', () => {
  const appScheduler = AppScheduler.getInstance();

  const viewSchedule = appScheduler.viewSchedule;
  const formWorkOrdersAndOperation = viewSchedule.formWorkOrdersAndOperation;
  const pnlOperations = formWorkOrdersAndOperation.pnlOperations;
  const listOperations = pnlOperations.listOperations;
  let rowScalping10003: ListRow;
  let rowScalping10006: ListRow;
  let rowScalping10099: ListRow;

  let toast = ToastGlobal.getInstance();

  const _10003 = OrderNr._10003;
  const _10006 = OrderNr._10006;
  const _10099 = OrderNr._10099;
  const scalping = OperationType.Scalping;
  const welding = OperationType.Welding;
  const filter10003 = `${ListOperationColumn.OrderNrFilter} = ${_10003}`;
  const filter10006 = `${ListOperationColumn.OrderNrFilter} = ${_10006}`;
  const filter10099 = `${ListOperationColumn.OrderNrFilter} = ${_10099}`;
  const filterTerms = `${filter10003} ${filter10006} ${filter10099}`;
  const expectReservePreconMsg = OperationPrecondition.ReserveMaterialWithinFrozenPeriod;

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
    await appScheduler.switchToDemoScenario(DemoCategory.SalesDemo, DemoScenario.AluminumHotRolling);
  });

  afterAll(async () => {
    await viewSchedule.reset();
    await appScheduler.cleanUpDataset();
    await appScheduler.logout();
  });

  afterEach(async () => {
    await appScheduler.checkToastMessage();
  });

  it('Step 1: Step 1: Open view Schedule -> Schedule', async () => {
    await viewSchedule.switchTo();
    expect(await formWorkOrdersAndOperation.isVisible()).toBe(true, LogMessage.form_notVisible('Word Orders and Operations'));
  });

  it('Step 2: In the operations list, select Scalping operation of Order Nr 10006 and OrderNr 10003', async () => {
    await pnlOperations.switchTo();
    expect(await listOperations.isVisible()).toBe(true, LogMessage.list_notVisible('Operations'));

    let dialogFilterManager = await listOperations.openFilterDialogOnColumn(ListOperationColumn.OrderNr);
    await dialogFilterManager.filter(filterTerms);

    // Verify Scalping operation for 10006 and 10003 need material to be reserved
    rowScalping10003 = await listOperations.getRowByOrderNrAndOperationType(_10003, scalping);
    const materialStatus10003 = await listOperations.getCellValueFromRow(MaterialStatus.ColumnIndex, rowScalping10003, true);
    expect(materialStatus10003).toBe(
      MaterialStatus.NeedToBeReserved,
      LogMessage.cell_incorrectValue(MaterialStatus.NeedToBeReserved, materialStatus10003, ListOperationColumn.MaterialStatus, `${scalping} operation of OrderNr ${_10003}`),
    );
    rowScalping10006 = await listOperations.getRowByOrderNrAndOperationType(_10006, scalping);
    const materialStatus10006 = await listOperations.getCellValueFromRow(MaterialStatus.ColumnIndex, rowScalping10006, true);
    expect(materialStatus10006).toBe(
      MaterialStatus.NeedToBeReserved,
      LogMessage.cell_incorrectValue(MaterialStatus.NeedToBeReserved, materialStatus10006, ListOperationColumn.MaterialStatus, `${scalping} operation of OrderNr ${_10006}`),
    );
  });

  it('Step 3: In operation list, verify that OrderNr 10006 is already planned and in frozen horizon.', async () => {
    const isFinished = await listOperations.getCellValueFromRow(ImgIsPlanned.ColumnIndex, rowScalping10006, true);
    expect(isFinished).toBe(ImgIsPlanned.Finished, LogMessage.value_notMatched(ImgIsPlanned.Finished, isFinished));
  });

  it("Step 4: Click on action button 'Reserve Material'. Verify that it prompted a warning message for planner to confirm material reservation since one or more operations fall within frozen horizon. Press yes.", async () => {
    await listOperations.reserveMaterial(ActionTriggerType.Button, [rowScalping10003, rowScalping10006]);
    // Verify warning toast is popped up
    const isSoftPrecon = await toast.verifyLastToastType(QToastType.WARNING);
    expect(isSoftPrecon).toBe(true, LogMessageSch.toast_notWarning('reserve material for frozen horizon demands'));

    // Verify toast message
    const reservePreconMsg = await toast.getLastToastMessage();
    expect(reservePreconMsg).toBe(expectReservePreconMsg, LogMessage.value_notMatched(expectReservePreconMsg, reservePreconMsg));

    await toast.clickToastButton(ButtonType.Yes);
  });

  it("Step 5: In operation list, verify that material statuses are switched to 'Material has been reserved'.", async () => {
    const materialStatus10003 = await listOperations.getCellValueFromRow(MaterialStatus.ColumnIndex, rowScalping10003, true);
    expect(materialStatus10003).toBe(
      MaterialStatus.HasBeenReserved,
      LogMessage.cell_incorrectValue(MaterialStatus.HasBeenReserved, materialStatus10003, ListOperationColumn.MaterialStatus, `${scalping} operation of OrderNr ${_10003}`),
    );
    const materialStatus10006 = await listOperations.getCellValueFromRow(MaterialStatus.ColumnIndex, rowScalping10006, true);
    expect(materialStatus10006).toBe(
      MaterialStatus.HasBeenReserved,
      LogMessage.cell_incorrectValue(MaterialStatus.HasBeenReserved, materialStatus10006, ListOperationColumn.MaterialStatus, `${scalping} operation of OrderNr ${_10006}`),
    );
  });

  it('Step 6: In operation list, select Welding operations of OrderNr 10099. Verify that it is not planned yet and needs material reservation.', async () => {
    rowScalping10099 = await listOperations.getRowByOrderNrAndOperationType(_10099, welding);
    // Verify it is not planned yet
    const isNotPlanned = await listOperations.getCellValueFromRow(ImgIsPlanned.ColumnIndex, rowScalping10099, true);
    expect(isNotPlanned).toBe(ImgIsPlanned.NotPlanned, LogMessage.value_notMatched(ImgIsPlanned.NotPlanned, isNotPlanned));
    // Verify it needs material reservation
    const materialStatus10099 = await listOperations.getCellValueFromRow(MaterialStatus.ColumnIndex, rowScalping10099, true);
    expect(materialStatus10099).toBe(
      MaterialStatus.NeedToBeReserved,
      LogMessage.cell_incorrectValue(MaterialStatus.NeedToBeReserved, materialStatus10099, ListOperationColumn.MaterialStatus, `${welding} operations of OrderNr ${_10099}`),
    );
  });

  it("Step 7: Right click on the operation and press 'Reserve materials automatically' from the context menu.", async () => {
    await listOperations.reserveMaterial(ActionTriggerType.ContextMenu, [rowScalping10099]);
  });

  it("Step 8: In operation list, verify that its material is reserved automatically and its status switched to 'Material has been reserved'.", async () => {
    // Verify that its material is reserved automatically
    const materialStatus10099 = await listOperations.getCellValueFromRow(MaterialStatus.ColumnIndex, rowScalping10099, true);
    expect(materialStatus10099).toBe(
      MaterialStatus.HasBeenReserved,
      LogMessage.cell_incorrectValue(MaterialStatus.HasBeenReserved, materialStatus10099, ListOperationColumn.MaterialStatus, `${welding} operations of OrderNr ${_10099}`),
    );
  });
});
