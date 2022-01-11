/**
 * @file        ADSC-23013
 * @description Create a new batch for one or more operations
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { QToastType } from '../e2elib/lib/src/pageobjects/toast/toastmessage.component';
import { LogMessage } from '../libappbase/logmessage';
import { ButtonType } from '../libappbase/toastglobal';
import { ActionTriggerType, asyncEvery } from '../libappbase/utils';
import { AppScheduler } from '../libsch/appsch';
import { OrderNr } from '../libsch/data/data.order';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { OperationBatch } from '../libsch/data/data.schedule';
import { OperationType, Practice } from '../libsch/data/data.workorder';
import {
  CreateBatchPrecondition,
  ImgIsBatchHasCommonPracticeColumn,
  ImgIsPlannedListBatchOperationColumn,
  ListBatchInPanelBatchListChildColumn,
  ListBatchInPanelBatchListParentColumn,
  ListBatchOperationColumn,
} from '../libsch/forms/form.operationsandbatches';
import { ListOperationColumn } from '../libsch/forms/workordersandoperations';
import { LogMessageSch } from '../libsch/logmessagesch';

describe('ADSC-23013, Create a new batch for one or more operations', () => {
  const appScheduler = AppScheduler.getInstance();

  const viewOperationBatching = appScheduler.viewOperationBatching;
  const formOperationsAndBatches = viewOperationBatching.formOperationsAndBatches;
  const listBatchOperation = formOperationsAndBatches.listBatchOperation;
  const cbNotInBatch = formOperationsAndBatches.cbNotInBatch;
  const cbShowCompatibleOperations = formOperationsAndBatches.cbShowCompatibleOperations;
  const listBatchInPanelBatchList = formOperationsAndBatches.listBatchInPanelBatchList;
  const cbShowCompatibleBatches = formOperationsAndBatches.cbShowCompatibleBatches;
  const cbFilterAvailableSpace = formOperationsAndBatches.cbFilterAvailableSpace;

  let numOfBatches: number;
  const _10099 = OrderNr._10099;
  const _10270 = OrderNr._10270;
  const _10246 = OrderNr._10246;
  const _10294 = OrderNr._10294;
  const _10342 = OrderNr._10342;
  const _10023 = OrderNr._10023;
  const _10054 = OrderNr._10054;
  const _10003 = OrderNr._10003;
  const filter10023 = `${ListOperationColumn.OrderNrFilter} = ${_10023}`;
  const filter10054 = `${ListOperationColumn.OrderNrFilter} = ${_10054}`;
  const filter10003 = `${ListOperationColumn.OrderNrFilter} = ${_10003}`;
  const filterTerms = `${filter10023} ${filter10054} ${filter10003}`;
  const orderNrOperationCol = ListBatchOperationColumn.OrderNr;
  const batchIDCol = ListBatchInPanelBatchListParentColumn.BatchID;
  const practiceCol = ListBatchInPanelBatchListParentColumn.Practice;
  const sizeCol = ListBatchInPanelBatchListParentColumn.Size;
  const orderNrBatchCol = ListBatchInPanelBatchListChildColumn.OrderNr;

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
    await appScheduler.switchToDemoScenario(DemoCategory.SalesDemo, DemoScenario.AluminumHotRolling);
  });

  afterAll(async () => {
    await viewOperationBatching.reset();
    await appScheduler.cleanUpDataset();
    await appScheduler.logout();
  });

  afterEach(async () => {
    await appScheduler.checkToastMessage();
  });

  it('Step 1: Open view Schedule -> Operation Batching', async () => {
    await viewOperationBatching.switchTo();
    expect(await formOperationsAndBatches.isVisible()).toBe(true, LogMessage.form_notVisible('Operations and Batches'));
  });

  it('Step 2: Filter for non-batched heating operations in Operation List', async () => {
    // Verify all filters are toggled off
    expect(await cbNotInBatch.isChecked()).toBe(false, LogMessage.checkbox_isChecked('Not in batch'));
    expect(await cbShowCompatibleBatches.isChecked()).toBe(false, LogMessage.checkbox_isChecked('Show compatible batches'));
    expect(await cbShowCompatibleOperations.isChecked()).toBe(false, LogMessage.checkbox_isChecked('Show compatible operations'));
    expect(await cbFilterAvailableSpace.isChecked()).toBe(false, LogMessage.checkbox_isChecked('Filter Available Space'));

    // Toggle on 'Not in batch' filter
    await cbNotInBatch.toggle(true);
    expect(await cbNotInBatch.isChecked()).toBe(true, LogMessage.checkbox_notChecked('Not in batch'));

    // Verify all operations are not in batch
    const allOperationsRow = await listBatchOperation.getAllRows();
    const isAllOperationsNotInBatch = await asyncEvery(
      allOperationsRow,
      async (row: ListRow) =>
        (await listBatchOperation.getCellValueFromRow(ImgIsPlannedListBatchOperationColumn.ColumnIndex, row, true)) === ImgIsPlannedListBatchOperationColumn.NotPlanned &&
        (await listBatchOperation.getCellValueFromRow(ListBatchOperationColumn.OperationType, row)) === OperationType.Heating,
    );
    expect(isAllOperationsNotInBatch).toBe(true, `All operations should be ${OperationType.Heating} and have empty image for ImgIsPlanned column`);
  });

  it('Step 3: Select OrderNr 10099 and create a batch from its context menu', async () => {
    // Check how many batches are in Batch list
    numOfBatches = await listBatchInPanelBatchList.getRowCount();

    // Create new batch
    const operation10099Row = await listBatchOperation.getRowByCellValue(orderNrOperationCol, _10099);
    await listBatchOperation.createBatch([operation10099Row], ActionTriggerType.ContextMenu);

    // Verify new batch is created with practice A
    const newBatchID = `Batch ${numOfBatches + 1}`;
    const newBatchCreatedRow = await listBatchInPanelBatchList.getRowByValue([
      { columnID: batchIDCol, value: newBatchID },
      { columnID: practiceCol, value: Practice.A },
      { columnID: sizeCol, value: '1' },
    ]);

    // Verify Heating operation of order nr 10099 is visible in the operations in batch list.
    const isOperation10099InNewBatch = await listBatchInPanelBatchList.hasRow([{ columnID: orderNrBatchCol, value: _10099 }], [[{ columnID: batchIDCol, value: newBatchID }]]);
    expect(isOperation10099InNewBatch).toBe(true, LogMessage.row_notFound(`${orderNrBatchCol}: ${_10099}`));
    await newBatchCreatedRow.collapseRow();
  });

  it('Step 4: Select some heating operations with practice B (Order Nr: 10270, 10246, 10294, 10342) and create a batch via button.', async () => {
    // Selec some heating operations with practice B
    const operationsToBeInNewBatchRows = await listBatchOperation.getRowsByCellValuesFromOneColumn(orderNrOperationCol, [_10270, _10246, _10294, _10342]);
    // Create new batch
    await listBatchOperation.createBatch(operationsToBeInNewBatchRows, ActionTriggerType.Button);

    // Verify new batch is created with practice B
    const newBatchID = `Batch ${numOfBatches + 2}`;
    const newBatchCreatedRow = await listBatchInPanelBatchList.getRowByValue([
      { columnID: batchIDCol, value: newBatchID },
      { columnID: practiceCol, value: Practice.B },
      { columnID: sizeCol, value: '4' },
    ]);

    // Verify the selected heating operations are visible in the operations in batch list.
    const isOperation10270InNewBatch = await listBatchInPanelBatchList.hasRow([{ columnID: orderNrBatchCol, value: _10270 }], [[{ columnID: batchIDCol, value: newBatchID }]]);
    const isOperation10246InNewBatch = await listBatchInPanelBatchList.hasRow([{ columnID: orderNrBatchCol, value: _10246 }], [[{ columnID: batchIDCol, value: newBatchID }]]);
    const isOperation10294InNewBatch = await listBatchInPanelBatchList.hasRow([{ columnID: orderNrBatchCol, value: _10294 }], [[{ columnID: batchIDCol, value: newBatchID }]]);
    const isOperation10342InNewBatch = await listBatchInPanelBatchList.hasRow([{ columnID: orderNrBatchCol, value: _10342 }], [[{ columnID: batchIDCol, value: newBatchID }]]);
    expect(isOperation10270InNewBatch).toBe(true, LogMessage.row_notFound(`${orderNrBatchCol}: ${_10270}`));
    expect(isOperation10246InNewBatch).toBe(true, LogMessage.row_notFound(`${orderNrBatchCol}: ${_10246}`));
    expect(isOperation10294InNewBatch).toBe(true, LogMessage.row_notFound(`${orderNrBatchCol}: ${_10294}`));
    expect(isOperation10342InNewBatch).toBe(true, LogMessage.row_notFound(`${orderNrBatchCol}: ${_10342}`));
    await newBatchCreatedRow.collapseRow();
  });

  it('Step 5: Select heating operations of order nr: 10023 and 10054 and right click to open their context menu. Click No in toast message and verify no new batch created', async () => {
    // Filter operation row with OrderNr: 10023, 10054 and 10003
    let dialogFilterManager = await listBatchOperation.openFilterDialogOnColumn(orderNrOperationCol);
    await dialogFilterManager.filter(filterTerms);

    // Select operations of OrderNr: 10023 and 10054
    const operationsToBeInNewBatchRows = await listBatchOperation.getRowsByCellValuesFromOneColumn(orderNrOperationCol, [_10023, _10054]);
    const toast = await listBatchOperation.createBatch(operationsToBeInNewBatchRows, ActionTriggerType.ContextMenu);

    // Verify warning toast is popped up since selected operations have different Practice
    const isSoftPrecon = await toast.verifyLastToastType(QToastType.WARNING);
    expect(isSoftPrecon).toBe(true, LogMessageSch.toast_notWarning('Create Batch for operations with different Practice'));

    // Verify toast message
    const createBatchPreconMsg = await toast.getLastToastMessage();
    expect(createBatchPreconMsg).toBe(CreateBatchPrecondition.DifferentPractice, LogMessage.value_notMatched(CreateBatchPrecondition.DifferentPractice, createBatchPreconMsg));

    // Press no and verify no new batch created
    await toast.clickToastButton(ButtonType.No);
    const newBatchID = `Batch ${numOfBatches + 3}`;
    let isNewBatchCreated = await listBatchInPanelBatchList.hasRow([{ columnID: batchIDCol, value: newBatchID }]);
    expect(isNewBatchCreated).toBe(false, LogMessage.row_found([`${batchIDCol}: ${newBatchID}`]));
  });

  it('Step 6: Perform the create batch action again and click Yes in toast message this time and verify new batch has been created with different practice constraint', async () => {
    const operationsToBeInNewBatchRows = await listBatchOperation.getRowsByCellValuesFromOneColumn(orderNrOperationCol, [_10023, _10054]);
    const newBatchID = `Batch ${numOfBatches + 3}`;
    // Perform the create batch action again and press yes this time
    const toast = await listBatchOperation.createBatch(operationsToBeInNewBatchRows, ActionTriggerType.ContextMenu);
    await toast.clickToastButton(ButtonType.Yes);

    // Verify new batch has been created with different practice constraint
    await listBatchInPanelBatchList.waitForScreenUpdate();
    const newBatchCreatedRow = await listBatchInPanelBatchList.getRowByValue([
      { columnID: batchIDCol, value: newBatchID },
      { columnID: practiceCol, value: '' },
      { columnID: sizeCol, value: '2' },
    ]);
    const isNewBatchHasNoCommonPractice = await listBatchInPanelBatchList.getCellValueFromRow(ImgIsBatchHasCommonPracticeColumn.ColumnIndex, newBatchCreatedRow, true);
    expect(isNewBatchHasNoCommonPractice).toBe(
      ImgIsBatchHasCommonPracticeColumn.NoCommonPractice,
      LogMessage.value_notMatched(ImgIsBatchHasCommonPracticeColumn.NoCommonPractice, isNewBatchHasNoCommonPractice),
    );

    // Verify the selected heating operations are visible in the operations in batch list.
    const isOperation10023InNewBatch = await listBatchInPanelBatchList.hasRow([{ columnID: orderNrBatchCol, value: _10023 }], [[{ columnID: batchIDCol, value: newBatchID }]]);
    const isOperation10054InNewBatch = await listBatchInPanelBatchList.hasRow([{ columnID: orderNrBatchCol, value: _10054 }], [[{ columnID: batchIDCol, value: newBatchID }]]);
    expect(isOperation10023InNewBatch).toBe(true, LogMessage.row_notFound(`${orderNrBatchCol}: ${_10023}`));
    expect(isOperation10054InNewBatch).toBe(true, LogMessage.row_notFound(`${orderNrBatchCol}: ${_10054}`));
    await newBatchCreatedRow.collapseRow();
  });

  it('Step 7: Highlight heating operation of order nr 10003. Activate stored filter compatible batch by checking the checkbox of the filter.', async () => {
    // Select OrderNr 10003
    const operation10003Row = await listBatchOperation.getRowByCellValue(orderNrOperationCol, _10003);
    await listBatchOperation.selectRows([operation10003Row]);

    // Toggle on 'Show compatible batches' filter
    await cbShowCompatibleBatches.toggle(true);
    expect(await cbShowCompatibleBatches.isChecked()).toBe(true, LogMessage.checkbox_notChecked('Show compatible batches'));

    // Verify only batches with practice C will be visible in batches list.
    const allBatchRows = await listBatchInPanelBatchList.getAllRows();
    const isAllBatchesPracticeC = await asyncEvery(allBatchRows, async (row: ListRow) => (await listBatchInPanelBatchList.getCellValueFromRow(practiceCol, row)) === Practice.C);
    expect(isAllBatchesPracticeC).toBe(true, `All batches should have ${Practice.C}.`);
  });

  it('Step 8: Activate stored filter for batches with available space as well. The batches which dont have available space is left out and only batch 3 is left.', async () => {
    // Toggle on 'Filter Available Space' filter
    await cbFilterAvailableSpace.toggle(true);
    expect(await cbFilterAvailableSpace.isChecked()).toBe(true, LogMessage.checkbox_notChecked('Filter Available Space'));

    // Verify only batch 3 is visible in batches list.
    const batchRows = await listBatchInPanelBatchList.getAllRows();
    expect(batchRows.length).toBe(1, LogMessage.value_notMatched('1', batchRows.length.toString()));
    const batchID = await listBatchInPanelBatchList.getCellValueFromRow(batchIDCol, batchRows[0]);
    expect(batchID).toBe(OperationBatch.Batch3, LogMessage.value_notMatched(OperationBatch.Batch3, batchID));
  });

  it('Step 9: Highlight batch 14 and activate stored filter show compatible operations. Verify only heating operations with practice D are visible in the operations list', async () => {
    // Reset Operation Batching View to clear operation list filter and all checkboxes
    await viewOperationBatching.reset();

    // Select batch 14
    const batch14Row = await listBatchInPanelBatchList.getRowByCellValue(batchIDCol, OperationBatch.Batch14);
    await listBatchInPanelBatchList.selectRows([batch14Row]);

    // Toggle on 'Not in batch' filter
    await cbNotInBatch.toggle(true);
    expect(await cbNotInBatch.isChecked()).toBe(true, LogMessage.checkbox_notChecked('Not in batch'));

    // Toggle on 'Show compatible operations' filter
    await cbShowCompatibleOperations.toggle(true);
    expect(await cbShowCompatibleOperations.isChecked()).toBe(true, LogMessage.checkbox_notChecked('Show compatible operations'));

    // Verify only heating operations with practice D are visible in the operations list
    const allOperationsRow = await listBatchOperation.getAllRows();
    const isAllOperationsNotInBatch = await asyncEvery(
      allOperationsRow,
      async (row: ListRow) => (await listBatchOperation.getCellValueFromRow(ListBatchOperationColumn.Practice, row)) === Practice.D,
    );
    expect(isAllOperationsNotInBatch).toBe(true, `All operations should have ${Practice.D}.`);
  });
});
