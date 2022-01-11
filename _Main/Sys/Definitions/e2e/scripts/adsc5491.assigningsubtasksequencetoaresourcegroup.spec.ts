/**
 * @file        ADSC-5491
 * @description Assigning subtask sequence to a resource group
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { LogMessage } from '../libappbase/logmessage';
import { ResourceGroupName, ResourceName } from '../libsch/data/data.resource';
import { ActionTriggerType, asyncFilter } from '../libappbase/utils';
import { GanttChartNode } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartnode';
import { DialogResourceGroup, ListAssignSubtaskColumn, ListAvailableSubtaskColumn } from '../libsch/dialogs/resourcegroup';
import { ListResourceGroupParentColumn } from '../libsch/forms/form.productionenvironment';
import { LogMessageSch } from '../libsch/logmessagesch';
import { GanttChartRow } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartrow';
import { FormTitle } from '../libsch/data/data.form';
import { FormResourceSchedule } from '../libsch/forms/resourceschedule';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { SubtaskName } from '../libsch/data/data.configureproduction';
import { GanttChartSubtaskColor } from '../libsch/data/data.schedule';
import { GanttChartNodeCompartment } from '../e2elib/lib/src/pageobjects/ganttchart/qgcnodecompartment';

describe('ADSC-5491, Assigning subtask sequence to a resource group', () => {
  const appScheduler = AppScheduler.getInstance();

  const viewConfigureProduction = appScheduler.viewConfigureProduction;
  const formProductionEnvironment = viewConfigureProduction.formProductionEnvironment;
  const listResourceGroup = formProductionEnvironment.listResourceGroup;
  let heatingResourceGroupRow: ListRow;
  let dlgResourceGroup: DialogResourceGroup = new DialogResourceGroup();
  const pnlSubtaskSequence = dlgResourceGroup.pnlSubtaskSequence;
  const listAvailableSubtask = pnlSubtaskSequence.listAvailableSubtask;
  const listAssignSubtask = pnlSubtaskSequence.listAssignSubtask;
  const abpConfigure = appScheduler.abpConfigure;
  const formResourceSchedule = new FormResourceSchedule();
  const gcResourceSchedule = formResourceSchedule.pnlScheduleOverview.gcResourceSchedule;
  let gcSmallPit5ResourceRow: GanttChartRow;
  let smallPit5Nodes: GanttChartNode[];
  const batch9 = 'Batch 9';

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
    await appScheduler.switchToDemoScenario(DemoCategory.SalesDemo, DemoScenario.AluminumHotRolling);
  });

  afterAll(async () => {
    await viewConfigureProduction.reset();
    await appScheduler.cleanUpDataset();
    await appScheduler.logout();
  });

  afterEach(async () => {
    await appScheduler.checkToastMessage();
  });

  it('Step 1: Open view Data -> Configure Production', async () => {
    await viewConfigureProduction.switchTo();
    expect(await formProductionEnvironment.isVisible()).toBe(true, LogMessage.form_notVisible('Production Environment'));
    expect(await listResourceGroup.isVisible()).toBe(true, LogMessage.list_notVisible('Resource Groups'));
  });

  it('Step 2: Edit Heating resource group. Go to Subtask Sequence tab. Verify that there are 3 subtasks assigned to that resource group.', async () => {
    // Edit Heating resource group
    heatingResourceGroupRow = await listResourceGroup.getRowByCellValue(ListResourceGroupParentColumn.Name, ResourceGroupName.Heating);
    dlgResourceGroup = await listResourceGroup.openDialogResourceGroup(ActionTriggerType.ContextMenu, heatingResourceGroupRow);
    expect(await dlgResourceGroup.isVisible()).toBe(true, LogMessage.dialog_notVisible('Resource Group'));

    // Verify that there are 3 subtasks assigned to that resource group
    await pnlSubtaskSequence.switchTo();
    const numOfAssignSubtask = await listAssignSubtask.getRowCount();
    expect(numOfAssignSubtask).toBe(3, LogMessageSch.list_numOfRowsNotMatched('Assigned Subtask', 3, numOfAssignSubtask));

    await dlgResourceGroup.clickOK();
  });

  it('Step 3: Open Resource schedule form as well: go to Configure -> Forms and double click on Resource schedule. Verify that those 3 subtasks are visible in the gantt chart.', async () => {
    // Open Resource schedule form
    await abpConfigure.click();
    const dlgForms = await abpConfigure.openDialogForms();
    await dlgForms.listForms.openForm(FormTitle.ResourceSchedule);
    await dlgForms.clickOK();
    expect(await formResourceSchedule.isVisible()).toBe(true, LogMessage.form_notVisible(FormTitle.ResourceSchedule));

    // Verify 3 subtasks are visible in the gantt chart
    gcSmallPit5ResourceRow = (await gcResourceSchedule.getRowsByTitle(ResourceName.SmallPit5))[0];
    smallPit5Nodes = await gcResourceSchedule.getAllNodes(gcSmallPit5ResourceRow);
    smallPit5Nodes = await asyncFilter(smallPit5Nodes, async (node: GanttChartNode) => (await node.getLeftNodeText()).length > 0);
    expect(smallPit5Nodes.length).toBe(1, LogMessageSch.ganttchart_numOfNodesNotMatched(ResourceName.SmallPit5, 1, smallPit5Nodes.length));
    const nodeCompartments = await gcResourceSchedule.getNodeCompartments(smallPit5Nodes[0]);
    expect(nodeCompartments.length).toBe(3, LogMessageSch.ganttchart_numOfSubtaskNotMatched(batch9, ResourceName.SmallPit5, 3, nodeCompartments.length));
  });

  it('Step 4: go back to Edit resource group and the tab Subtask Sequence and delete NoBufferAction subtask form the sequence.', async () => {
    // Edit Heating resource group
    dlgResourceGroup = await listResourceGroup.openDialogResourceGroup(ActionTriggerType.ContextMenu, heatingResourceGroupRow);
    await pnlSubtaskSequence.switchTo();

    // Delete NoBufferAction subtask
    const noBufferActionAssignedSubtaskRow = await listAssignSubtask.getRowByCellValue(ListAssignSubtaskColumn.Name, SubtaskName.NoBufferAction);
    await listAssignSubtask.deleteAssignedSubtask(noBufferActionAssignedSubtaskRow);
    const numOfAssignSubtask = await listAssignSubtask.getRowCount();
    expect(numOfAssignSubtask).toBe(2, LogMessageSch.list_numOfRowsNotMatched('Assigned Subtask', 2, numOfAssignSubtask));

    await dlgResourceGroup.clickOK();
  });

  it('Step 5: Verify that brown part is deleted from heating resources in the Gantt chart.', async () => {
    // Verify 2 subtasks are visible in the gantt chart
    const nodeCompartments = await gcResourceSchedule.getNodeCompartments(smallPit5Nodes[0]);
    expect(nodeCompartments.length).toBe(2, LogMessageSch.ganttchart_numOfSubtaskNotMatched(batch9, ResourceName.SmallPit5, 2, nodeCompartments.length));

    // Verify no subtask is brown
    for (const compartment of nodeCompartments) {
      const compartmentColor = await compartment.getBackgroundColor();
      expect(compartmentColor).not.toBe(GanttChartSubtaskColor.Brown_NoBufferAction, LogMessage.value_isMatched(GanttChartSubtaskColor.Brown_NoBufferAction, compartmentColor));
    }
  });

  it('Step 6: Add NoBufferAction subtask to sequence again. Verify that brown part is added to heating resources.', async () => {
    dlgResourceGroup = await listResourceGroup.openDialogResourceGroup(ActionTriggerType.ContextMenu, heatingResourceGroupRow);
    await pnlSubtaskSequence.switchTo();

    // Add NoBufferAction subtask
    const noBufferActionAssignSubtaskRow = await listAvailableSubtask.getRowByCellValue(ListAvailableSubtaskColumn.Name, SubtaskName.NoBufferAction);
    await listAssignSubtask.dropRowOnWhiteSpace(noBufferActionAssignSubtaskRow);
    const numOfAssignSubtask = await listAssignSubtask.getRowCount();
    expect(numOfAssignSubtask).toBe(3, LogMessageSch.list_numOfRowsNotMatched('Assigned Subtask', 3, numOfAssignSubtask));

    await dlgResourceGroup.clickOK();

    // Verify that brown part is added to heating resources
    const nodeCompartments = await gcResourceSchedule.getNodeCompartments(smallPit5Nodes[0]);
    expect(nodeCompartments.length).toBe(3, LogMessageSch.ganttchart_numOfSubtaskNotMatched(batch9, ResourceName.SmallPit5, 3, nodeCompartments.length));

    // Verify last subtask is brown
    const lastCompartment = nodeCompartments[nodeCompartments.length - 1];
    const lastCompartmentColor = await lastCompartment.getBackgroundColor();
    expect(lastCompartmentColor).toBe(GanttChartSubtaskColor.Brown_NoBufferAction, LogMessage.value_notMatched(GanttChartSubtaskColor.Brown_NoBufferAction, lastCompartmentColor));
  });

  it('Step 7: Edit hot rolling resource group. In the Subtask Sequence tab, verify that there are 2 subtasks in the subtask sequence. Delete setup subtask', async () => {
    // Edit HotRolling resource group
    const hotRollingResourceGroupRow = await listResourceGroup.getRowByCellValue(ListResourceGroupParentColumn.Name, ResourceGroupName.HotRolling);
    dlgResourceGroup = await listResourceGroup.openDialogResourceGroup(ActionTriggerType.ContextMenu, hotRollingResourceGroupRow);
    await pnlSubtaskSequence.switchTo();

    // Verify that there are 2 subtasks in the subtask sequence
    let numOfAssignSubtask = await listAssignSubtask.getRowCount();
    expect(numOfAssignSubtask).toBe(2, LogMessageSch.list_numOfRowsNotMatched('Assigned Subtask', 2, numOfAssignSubtask));
    const setupAssignedSubtaskRow = await listAssignSubtask.getRowByCellValue(ListAssignSubtaskColumn.Name, SubtaskName.Setup);

    // Delete Setup subtask
    await listAssignSubtask.deleteAssignedSubtask(setupAssignedSubtaskRow);
    numOfAssignSubtask = await listAssignSubtask.getRowCount();
    expect(numOfAssignSubtask).toBe(1, LogMessageSch.list_numOfRowsNotMatched('Assigned Subtask', 1, numOfAssignSubtask));

    await dlgResourceGroup.clickOK();
  });

  it('Step 8: Verify that yellow part is deleted from hot rolling resource in the gantt chart', async () => {
    // Verify 1 subtask is visible for all HM nodes in the gantt chart
    const gcHMResourceRow = (await gcResourceSchedule.getRowsByTitle(ResourceName.HM))[0];
    let hmNodes = await gcResourceSchedule.getAllNodes(gcHMResourceRow);
    hmNodes = await asyncFilter(hmNodes, async (node: GanttChartNode) => node !== undefined && (await node.getLeftNodeText()).length > 0);
    for (const hmNode of hmNodes) {
      const numOfCompartment = await gcResourceSchedule.getNodeCompartments(hmNode);
      expect(numOfCompartment.length).toBe(1, 'All HM nodes should have 1 subtask');
      // Verify the subtask node color is not yellow
      const compartment = await hmNode.getCompartment(0);
      const compartmentColor = await (<GanttChartNodeCompartment>compartment).getBackgroundColor();
      expect(compartmentColor).not.toBe(GanttChartSubtaskColor.Yellow_Setup, LogMessage.value_isMatched(GanttChartSubtaskColor.Yellow_Setup, compartmentColor));
      expect(compartmentColor).toBe(
        GanttChartSubtaskColor.Blue_FeedbackProcess || GanttChartSubtaskColor.Green_Process,
        LogMessage.value_isMatched(`${GanttChartSubtaskColor.Green_Process} or ${GanttChartSubtaskColor.Blue_FeedbackProcess}`, compartmentColor),
      );
    }
  });
});
