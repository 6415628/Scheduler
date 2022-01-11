/**
 * @file        ADSC-23296
 * @description View and edit batch content in gantt chart
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { LogMessage } from '../libappbase/logmessage';
import { ResourceName } from '../libsch/data/data.resource';
import { maxDate } from '../libappbase/timeutils';
import { ExtractionType } from '../e2elib/lib/src/helper/enumhelper';
import { ImgIsPlanned, ListOperationBatchesColumn } from '../libsch/forms/workordersandoperations';
import { OperationBatch } from '../libsch/data/data.schedule';
import { getHtmlContent } from '../libappbase/utils';
import { OperationType } from '../libsch/data/data.workorder';
import { ListBatchDetail, ListBatchDetailColumn, ListBatchDetailContextMenuItem } from '../libsch/forms/form.batchdetail';
import { GanttChartNode } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartnode';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { LogMessageSch } from '../libsch/logmessagesch';
import { OrderNr } from '../libsch/data/data.order';

describe('ADSC-23296, View and edit batch content in gantt chart', () => {
  const appScheduler = AppScheduler.getInstance();

  const viewSchedule = appScheduler.viewSchedule;
  const formResourceSchedule = viewSchedule.formResourceSchedule;
  const ganttChartResourceSchedule = formResourceSchedule.pnlScheduleOverview.gcResourceSchedule;
  let listBatchDetail: ListBatchDetail;
  const pnlOperationBatches = viewSchedule.formWorkOrdersAndOperation.pnlOperationBatches;
  const listOperationBatches = pnlOperationBatches.listOperationBatches;
  const pnlOperations = viewSchedule.formWorkOrdersAndOperation.pnlOperations;
  const listOperations = pnlOperations.listOperations;
  let batch10Node: GanttChartNode;
  let newOperationRowInBatchDetails: ListRow;

  const workOrder10020 = OrderNr._10020;
  const reservedSize10 = '10';
  const openSize2 = '2';
  const reservedSize10Tooltip = OperationBatch.ReservedTooltip + reservedSize10;
  const openSize2Tooltip = OperationBatch.OpenTooltip + openSize2;
  const utilizationBeforeAddOperation = '83.3';
  const utilizationAfterAddOperation = '91.7';

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

  it('Step 1: Open view Schedule -> Schedule', async () => {
    await viewSchedule.switchTo();
    expect(await viewSchedule.formWorkOrdersAndOperation.isVisible()).toBe(true, LogMessage.form_notVisible('Work Orders and Operation'));
  });

  it('Step 2: In the gantt chart, right click on Batch 10 which is planned on BigPit1 and press "Batch Details" from the context menu', async () => {
    // Open Batch Details list for Batch 10
    const planDate = await appScheduler.getPlanDate();
    const rowsFound = await ganttChartResourceSchedule.getRowsByTitle(ResourceName.BigPit1);
    const bigPit1GcRow = rowsFound[0];
    batch10Node = (await bigPit1GcRow.getNodes(planDate, maxDate, ExtractionType.START, true))[0];
    listBatchDetail = await ganttChartResourceSchedule.openBatchDetailList(batch10Node);
    expect(await listBatchDetail.isVisible()).toBe(true, LogMessage.list_notVisible('Batch Details'));

    // Verify that batch utilization is shown correctly in the operation batches list
    await pnlOperationBatches.switchTo();
    const batch10Row = await listOperationBatches.getRowByCellValue(ListOperationBatchesColumn.BatchId, OperationBatch.Batch10);
    const batch10ReserveOpenCell = await batch10Row.getCell(ListOperationBatchesColumn.ReservedOpen);
    const reservedSizeTooltip = await batch10ReserveOpenCell.getTooltip(undefined, undefined, undefined, 0);
    expect(reservedSizeTooltip).toBe(reservedSize10Tooltip, LogMessage.value_notMatched(reservedSize10Tooltip, reservedSizeTooltip));
    const openSizeTooltip = await batch10ReserveOpenCell.getTooltip(undefined, undefined, undefined, 1);
    expect(openSizeTooltip).toBe(openSize2Tooltip, LogMessage.value_notMatched(openSize2Tooltip, openSizeTooltip));

    // Verify that batch utilization is shown correctly on the gantt chart node
    const batch10NodeText = getHtmlContent(await batch10Node.getLeftNodeText())[2];
    expect(batch10NodeText).toBe(utilizationBeforeAddOperation, LogMessage.value_notMatched(utilizationBeforeAddOperation, batch10NodeText));
  });

  it('Step 3: Drag heating operation of order 10020 from the operations list onto "Batch Details" list.', async () => {
    // Check stored filters 'Not in batch' and 'Allowed in batch' in Operations tab
    await pnlOperations.switchTo();
    await pnlOperations.cbNotInBatch.toggle(true);
    const cbNotInBatchIsChecked = await pnlOperations.cbNotInBatch.isChecked();
    expect(cbNotInBatchIsChecked).toBe(true, LogMessage.checkbox_notChecked('Not in batch'));
    await pnlOperations.cbCompatibleOperations.toggle(true);
    const cbCompatibleOperationsIsChecked = await pnlOperations.cbNotInBatch.isChecked();
    expect(cbCompatibleOperationsIsChecked).toBe(true, LogMessage.checkbox_notChecked('Allowed in batch'));

    // Drag 10020 operation and drop in onto Batch Details list
    const operationRow = await listOperations.getRowByOrderNrAndOperationType(workOrder10020, OperationType.Heating);
    await listBatchDetail.dropRowOnWhiteSpace(operationRow);

    // Verify in the batch details list that the heating operation of order 10020 is shown as the last operation in the batch.
    newOperationRowInBatchDetails = await listBatchDetail.getLastRow();
    const orderNr = await listBatchDetail.getCellValueFromRow(ListBatchDetailColumn.WorkOrderId, newOperationRowInBatchDetails);
    expect(orderNr).toBe(workOrder10020, LogMessage.value_notMatched(workOrder10020, orderNr));

    // Verify that batch utilization is shown correctly on the gantt chart node
    const batch10NodeText = getHtmlContent(await batch10Node.getLeftNodeText())[2];
    expect(batch10NodeText).toBe(utilizationAfterAddOperation, LogMessage.value_notMatched(utilizationAfterAddOperation, batch10NodeText));
  });

  it('Step 4: Drag operation 10020 up to a new position earlier in the batch.', async () => {
    // Drag 10020 operation and drop in onto first item in Batch Details list
    const firstOperationRowOnBatch = await listBatchDetail.getRowByIndex(0);
    await listBatchDetail.dropRowOnTargetRow(newOperationRowInBatchDetails, firstOperationRowOnBatch);

    // Verify in the batch details list that order 10020 is shown as the first operation in the batch.
    newOperationRowInBatchDetails = await listBatchDetail.getRowByCellValue(ListBatchDetailColumn.WorkOrderId, workOrder10020);
    let newOperationIndexInBatchDetails = await newOperationRowInBatchDetails.getIndex();
    expect(newOperationIndexInBatchDetails).toBe(0, LogMessageSch.batchDetail_indexNotMatched(workOrder10020, 0, newOperationIndexInBatchDetails));

    // Verify that the 'Move up/down' and 'Move to top/bottom' also work as expected
    // Function used for performing different sequencing in batch details
    const verifyOperationIndexInBatchDetails = async (menuItem: ListBatchDetailContextMenuItem, expectedIndex: number): Promise<void> => {
      await listBatchDetail.selectMenuItem(newOperationRowInBatchDetails, menuItem);
      newOperationRowInBatchDetails = await listBatchDetail.getRowByCellValue(ListBatchDetailColumn.WorkOrderId, workOrder10020);
      newOperationIndexInBatchDetails = await newOperationRowInBatchDetails.getIndex();
      expect(newOperationIndexInBatchDetails).toBe(
        expectedIndex,
        LogMessageSch.batchDetail_indexNotMatched(workOrder10020, expectedIndex, newOperationIndexInBatchDetails),
      );
    };
    // Move Down
    await verifyOperationIndexInBatchDetails(ListBatchDetailContextMenuItem.MoveDown, 1);
    // Move Up
    await verifyOperationIndexInBatchDetails(ListBatchDetailContextMenuItem.MoveUp, 0);
    // Move to Bottom
    await verifyOperationIndexInBatchDetails(ListBatchDetailContextMenuItem.MoveToBottom, 10);
    // Move to Top
    await verifyOperationIndexInBatchDetails(ListBatchDetailContextMenuItem.MoveToTop, 0);
  });

  it('Step 4: Right-click on the heating operation of order 10020 and select "Remove from batch".', async () => {
    // Remove 10020 operation from Batch Details list
    newOperationRowInBatchDetails = await listBatchDetail.getRowByCellValue(ListBatchDetailColumn.WorkOrderId, workOrder10020);
    await listBatchDetail.selectMenuItem(newOperationRowInBatchDetails, ListBatchDetailContextMenuItem.RemoveFromBatch);
    const isNewOperationExisted = await listBatchDetail.hasRow([{ columnID: ListBatchDetailColumn.WorkOrderId, value: workOrder10020 }]);
    expect(isNewOperationExisted).toBe(false, LogMessage.row_found([workOrder10020]));

    // Verify that batch utilization is shown correctly on the gantt chart node
    const batch10NodeText = getHtmlContent(await batch10Node.getLeftNodeText())[2];
    expect(batch10NodeText).toBe(utilizationBeforeAddOperation, LogMessage.value_notMatched(utilizationBeforeAddOperation, batch10NodeText));

    // Close the 'Batch Details' list
    await viewSchedule.formBatchDetail.close();
    expect(await listBatchDetail.isVisible()).toBe(false, LogMessage.list_isVisible('Batch Details'));

    // Verify that the heating operation of order 10020 is not planned
    const operationRow = await listOperations.getRowByOrderNrAndOperationType(workOrder10020, OperationType.Heating);
    const valueImgIsPlanned = await listOperations.getCellValueFromRow(ImgIsPlanned.ColumnIndex, operationRow, true);
    expect(valueImgIsPlanned).toBe(ImgIsPlanned.NotPlanned, LogMessageSch.workOrderOperation_scheduled(workOrder10020, OperationType.Printing));
  });
});
