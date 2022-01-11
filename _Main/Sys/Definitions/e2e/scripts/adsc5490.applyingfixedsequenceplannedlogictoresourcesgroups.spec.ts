/**
 * @file        ADSC-5490
 * @description Applying fixed sequence planned logic to resources groups
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { GanttChartRow } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartrow';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { LogMessage } from '../libappbase/logmessage';
import { ActionTriggerType, asyncEvery } from '../libappbase/utils';
import { ButtonImportDataContextMenuItem } from '../libsch/actionbarpages/abp.data';
import { AppScheduler } from '../libsch/appsch';
import { SubtaskName } from '../libsch/data/data.configureproduction';
import { OrderNr } from '../libsch/data/data.order';
import { ResourceGroupName, ResourceName } from '../libsch/data/data.resource';
import { DialogResourceGroup, InputResourceGroupCharacteristicsFields, ListAssignSubtaskColumn, ListAvailableSubtaskColumn } from '../libsch/dialogs/resourcegroup';
import { ListResourceGroupParentColumn } from '../libsch/forms/form.productionenvironment';
import { ImgIsPlanned, ListOperationColumn } from '../libsch/forms/workordersandoperations';
import { LogMessageSch } from '../libsch/logmessagesch';

describe('ADSC-5490, Applying fixed sequence planned logic to resources groups', () => {
  const appScheduler = AppScheduler.getInstance();

  const abpData = appScheduler.abpData;
  const viewConfigureProduction = appScheduler.viewConfigureProduction;
  const formProductionEnvironment = viewConfigureProduction.formProductionEnvironment;
  const listResourceGroup = formProductionEnvironment.listResourceGroup;
  let dlgResourceGroup: DialogResourceGroup = new DialogResourceGroup();
  const pnlCharacteristics = dlgResourceGroup.pnlCharacteristics;
  const pnlSubtaskSequence = dlgResourceGroup.pnlSubtaskSequence;
  const listAvailableSubtask = pnlSubtaskSequence.listAvailableSubtask;
  const listAssignSubtask = pnlSubtaskSequence.listAssignSubtask;
  const viewSchedule = appScheduler.viewSchedule;
  const formWorkOrdersAndOperation = viewSchedule.formWorkOrdersAndOperation;
  const pnlOperations = formWorkOrdersAndOperation.pnlOperations;
  const listOperations = pnlOperations.listOperations;
  const formResourceSchedule = viewSchedule.formResourceSchedule;
  const pnlScheduleOverview = formResourceSchedule.pnlScheduleOverview;
  const gcResourceSchedule = pnlScheduleOverview.gcResourceSchedule;

  const characteristicsFixedSequencePlanLogicOff: InputResourceGroupCharacteristicsFields = {
    hasFixedSequencePlanLogic: false,
  };
  const characteristicsFixedSequencePlanLogicOn: InputResourceGroupCharacteristicsFields = {
    hasFixedSequencePlanLogic: true,
  };
  const noBufferWait = SubtaskName.NoBufferWait;
  const _10064 = OrderNr._10064;
  const _10065 = OrderNr._10065;
  const filter10064 = `${ListOperationColumn.OrderNrFilter} = ${_10064}`;
  const filter10065 = `${ListOperationColumn.OrderNrFilter} = ${_10065}`;
  const filterTerms = `${filter10064} ${filter10065}`;
  const SC1 = ResourceName.Sc1;
  const WE = ResourceName.We;
  let gcRowSC1: GanttChartRow;
  let gcRowWE: GanttChartRow;
  let originalFirstNodeText: string;
  let originalSecondNodeText: string;

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
  });

  afterAll(async () => {
    await viewSchedule.reset();
    await appScheduler.cleanUpDataset();
    await appScheduler.logout();
  });

  afterEach(async () => {
    await appScheduler.checkToastMessage();
  });

  it('Setup: Import ERP data', async () => {
    await abpData.click();
    await abpData.btnImportData.clickDropdown(ButtonImportDataContextMenuItem.ERP);
  });

  it('Step 1: In the web client, go to view Data -> Configure Production. Verify that a form with list of resources is popped up.', async () => {
    await viewConfigureProduction.switchTo();
    expect(await formProductionEnvironment.isVisible()).toBe(true, LogMessage.form_notVisible(await formProductionEnvironment.getTitle()));
    expect(await listResourceGroup.isVisible()).toBe(true, LogMessage.list_notVisible('Resource Groups'));
  });

  it('Step 2: Edit Scalping resource group. Verify that checkbox Has fixed-sequence plan logic is unchecked . Check it. Go to tab Subtask Sequence and add NoBufferWait to Assigned Subtasks. Hit OK.', async () => {
    // Edit Scalping resource group
    const scalpingResourceGroupRow = await listResourceGroup.getRowByCellValue(ListResourceGroupParentColumn.Name, ResourceGroupName.Scalping);
    dlgResourceGroup = await listResourceGroup.openDialogResourceGroup(ActionTriggerType.ContextMenu, scalpingResourceGroupRow);
    expect(await dlgResourceGroup.isVisible()).toBe(true, LogMessage.dialog_notVisible(await dlgResourceGroup.getTitle()));

    // Verify that Has fixed-sequence plan logic checkbox is toggled off
    const feedback = await pnlCharacteristics.verifyDialogPanelValues(characteristicsFixedSequencePlanLogicOff);
    expect(feedback.length).toBe(0, feedback);

    // Toggle on Has fixed-sequence plan logic checkbox
    await pnlCharacteristics.updateDialogValues(characteristicsFixedSequencePlanLogicOn);

    // Go to tab Subtask Sequence and add NoBufferWait to Assigned Subtasks
    await pnlSubtaskSequence.switchTo();

    // Add NoBufferWait subtask
    const noBufferWaitAssignSubtaskRow = await listAvailableSubtask.getRowByCellValue(ListAvailableSubtaskColumn.Name, noBufferWait);
    await listAssignSubtask.dropRowOnWhiteSpace(noBufferWaitAssignSubtaskRow);
    const isNoBufferExist = await listAssignSubtask.hasRow([{ value: noBufferWait, columnID: ListAssignSubtaskColumn.Name }]);
    expect(isNoBufferExist).toBe(true, LogMessageSch.row_notFound(noBufferWait));

    await dlgResourceGroup.clickOK();
  });

  it('Step 3: Edit Welding resource group. Verify that checkbox Has fixed-sequence plan logic is unchecked. Check it and hit OK.', async () => {
    // Edit Welding resource group
    const weldingResourceGroupRow = await listResourceGroup.getRowByCellValue(ListResourceGroupParentColumn.Name, ResourceGroupName.Welding);
    dlgResourceGroup = await listResourceGroup.openDialogResourceGroup(ActionTriggerType.ContextMenu, weldingResourceGroupRow);

    // Verify that Has fixed-sequence plan logic checkbox is toggled off
    const feedback = await pnlCharacteristics.verifyDialogPanelValues(characteristicsFixedSequencePlanLogicOff);
    expect(feedback.length).toBe(0, feedback);

    // Toggle on Has fixed-sequence plan logic checkbox
    await pnlCharacteristics.updateDialogValues(characteristicsFixedSequencePlanLogicOn);

    await dlgResourceGroup.clickOK();
  });

  it('Step 4: Go to scheduling view. Plan all operations of orders 10064 and 10065.', async () => {
    await viewSchedule.switchTo();
    expect(await formWorkOrdersAndOperation.isVisible()).toBe(true, LogMessage.form_notVisible(await formWorkOrdersAndOperation.getTitle()));
    expect(await formResourceSchedule.isVisible()).toBe(true, LogMessage.form_notVisible(await formResourceSchedule.getTitle()));

    // Filter heating operations of orders 10064 and 10065
    await pnlOperations.switchTo();
    let dialogFilterManager = await listOperations.openFilterDialogOnColumn(ListOperationColumn.OrderNr);
    await dialogFilterManager.filter(filterTerms);

    // Verify all operations are not planned yet
    const operationRows = await listOperations.getAllRows();
    const isAllNotPlanned = await asyncEvery(
      operationRows,
      async (row: ListRow) => (await listOperations.getCellValueFromRow(ImgIsPlanned.ColumnIndex, row, true)) === ImgIsPlanned.NotPlanned,
    );
    expect(isAllNotPlanned).toBe(true, 'All operations should not be planned');

    // Plan all operations of orders 10064 and 10065
    await listOperations.planOnEarliest(ActionTriggerType.ContextMenu, operationRows);

    // Verify all operations are planned now
    const isAllPlanned = await asyncEvery(
      operationRows,
      async (row: ListRow) => (await listOperations.getCellValueFromRow(ImgIsPlanned.ColumnIndex, row, true)) === ImgIsPlanned.Planned,
    );
    expect(isAllPlanned).toBe(true, 'All operations should be planned');
  });

  it('Step 5: Switch the order of the scheduled scalping tasks. Verify that the welding tasks are re-scheduled as well.', async () => {
    await pnlScheduleOverview.switchTo();

    // Get all the nodes on SC1
    gcRowSC1 = (await gcResourceSchedule.getRowsByTitle(SC1))[0];
    let allSC1Nodes = await gcResourceSchedule.getAllNodes(gcRowSC1);
    expect(allSC1Nodes.length).toBe(2, LogMessageSch.ganttchart_numOfNodesNotMatched(SC1, 2, allSC1Nodes.length));

    // Verify the sequence of nodes on SC1
    let firstSC1NodeText = await gcResourceSchedule.getNodeText(allSC1Nodes[0]);
    // FIXME: ADSC-24635, the bellow part should be fixed after 2021 Refresh3 release
    if (firstSC1NodeText === _10065) {
      originalFirstNodeText = _10065;
      originalSecondNodeText = _10064;
    } else {
      originalFirstNodeText = _10064;
      originalSecondNodeText = _10065;
    }
    expect(firstSC1NodeText).toBe(originalFirstNodeText, LogMessage.value_notMatched(originalFirstNodeText, firstSC1NodeText));
    let secondSC1NodeText = await gcResourceSchedule.getNodeText(allSC1Nodes[1]);
    expect(secondSC1NodeText).toBe(originalSecondNodeText, LogMessage.value_notMatched(originalSecondNodeText, secondSC1NodeText));

    // Get all the nodes on WE
    gcRowWE = (await gcResourceSchedule.getRowsByTitle(WE))[0];
    let allWENodes = await gcResourceSchedule.getAllNodes(gcRowWE);
    expect(allWENodes.length).toBe(2, LogMessageSch.ganttchart_numOfNodesNotMatched(WE, 2, allWENodes.length));

    // Verify the sequence of nodes on WE
    let firstWENodeText = await gcResourceSchedule.getNodeText(allWENodes[0]);
    expect(firstWENodeText).toBe(originalFirstNodeText, LogMessage.value_notMatched(originalFirstNodeText, firstWENodeText));
    let secondWENodeText = await gcResourceSchedule.getNodeText(allWENodes[1]);
    expect(secondWENodeText).toBe(originalSecondNodeText, LogMessage.value_notMatched(originalSecondNodeText, secondWENodeText));

    // Switch the order of the scheduled scalping tasks.
    await gcResourceSchedule.dropNode(allSC1Nodes[1], allSC1Nodes[0]);

    // Verify that the Scalping tasks are re-scheduled
    allSC1Nodes = await gcResourceSchedule.getAllNodes(gcRowSC1);
    firstSC1NodeText = await gcResourceSchedule.getNodeText(allSC1Nodes[0]);
    expect(firstSC1NodeText).toBe(originalSecondNodeText, LogMessage.value_notMatched(originalSecondNodeText, firstSC1NodeText));
    secondSC1NodeText = await gcResourceSchedule.getNodeText(allSC1Nodes[1]);
    expect(secondSC1NodeText).toBe(originalFirstNodeText, LogMessage.value_notMatched(originalFirstNodeText, secondSC1NodeText));

    // Verify that the Welding tasks are re-scheduled as well
    allWENodes = await gcResourceSchedule.getAllNodes(gcRowWE);
    firstWENodeText = await gcResourceSchedule.getNodeText(allWENodes[0]);
    expect(firstWENodeText).toBe(originalSecondNodeText, LogMessage.value_notMatched(originalSecondNodeText, firstWENodeText));
    secondWENodeText = await gcResourceSchedule.getNodeText(allWENodes[1]);
    expect(secondWENodeText).toBe(originalFirstNodeText, LogMessage.value_notMatched(originalFirstNodeText, secondWENodeText));
  });

  it('Step 6: Switch the order of the scheduled welding tasks. Verify that the scalping tasks are re-scheduled as well.', async () => {
    let allSC1Nodes = await gcResourceSchedule.getAllNodes(gcRowSC1);
    let allWENodes = await gcResourceSchedule.getAllNodes(gcRowWE);

    // Switch the order of the scheduled Welding tasks.
    await gcResourceSchedule.dropNode(allWENodes[1], allWENodes[0]);

    // Verify that the Welding tasks are re-scheduled
    allWENodes = await gcResourceSchedule.getAllNodes(gcRowWE);
    const firstWENodeText = await gcResourceSchedule.getNodeText(allWENodes[0]);
    expect(firstWENodeText).toBe(originalFirstNodeText, LogMessage.value_notMatched(originalFirstNodeText, firstWENodeText));
    const secondWENodeText = await gcResourceSchedule.getNodeText(allWENodes[1]);
    expect(secondWENodeText).toBe(originalSecondNodeText, LogMessage.value_notMatched(originalSecondNodeText, secondWENodeText));

    // Verify that the Scalping tasks are re-scheduled as well
    allSC1Nodes = await gcResourceSchedule.getAllNodes(gcRowSC1);
    const firstSC1NodeText = await gcResourceSchedule.getNodeText(allSC1Nodes[0]);
    expect(firstSC1NodeText).toBe(originalFirstNodeText, LogMessage.value_notMatched(originalFirstNodeText, firstSC1NodeText));
    const secondSC1NodeText = await gcResourceSchedule.getNodeText(allSC1Nodes[1]);
    expect(secondSC1NodeText).toBe(originalSecondNodeText, LogMessage.value_notMatched(originalSecondNodeText, secondSC1NodeText));
  });
});
