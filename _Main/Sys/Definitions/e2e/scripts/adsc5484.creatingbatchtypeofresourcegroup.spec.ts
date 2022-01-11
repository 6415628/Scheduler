/**
 * @file        ADSC-5484
 * @description Creating batch type of resource group
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { LogMessage } from '../libappbase/logmessage';
import { ResourceGroupName, ResourceID, ResourceMaxBatchSize, ResourceName, ResourceType } from '../libsch/data/data.resource';
import { ListOperationColumn } from '../libsch/forms/workordersandoperations';
import { ActionTriggerType, asyncFilter } from '../libappbase/utils';
import { OperationType } from '../libsch/data/data.workorder';
import { ListBatchDetailColumn } from '../libsch/forms/form.batchdetail';
import { GanttChartNode } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartnode';
import { DialogResourceGroup, InputResourceGroupCharacteristicsFields } from '../libsch/dialogs/resourcegroup';
import { ListResourceGroupParentColumn } from '../libsch/forms/form.productionenvironment';
import { DialogResource, InputResourceCharacteristicsFields } from '../libsch/dialogs/resource';
import { LogMessageSch } from '../libsch/logmessagesch';
import { GanttChartRow } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartrow';
import { OrderNr } from '../libsch/data/data.order';

describe('ADSC-5484, Creating batch type of resource group', () => {
  const appScheduler = AppScheduler.getInstance();

  const viewConfigureProduction = appScheduler.viewConfigureProduction;
  const formProductionEnvironment = viewConfigureProduction.formProductionEnvironment;
  const listResourceGroup = formProductionEnvironment.listResourceGroup;
  let dlgResourceGroup: DialogResourceGroup;
  let dlgResource: DialogResource;
  const viewSchedule = appScheduler.viewSchedule;
  const formWorkOrdersAndOperation = viewSchedule.formWorkOrdersAndOperation;
  const pnlOperations = formWorkOrdersAndOperation.pnlOperations;
  const listOperations = pnlOperations.listOperations;
  const cbAllowedOperation = pnlOperations.cbAllowedOperation;
  const formResourceSchedule = viewSchedule.formResourceSchedule;
  const gcResourceSchedule = formResourceSchedule.pnlScheduleOverview.gcResourceSchedule;
  let heater1Nodes: GanttChartNode[];
  let gcHeater1Row: GanttChartRow;

  const resourceGroupCharacteristics: InputResourceGroupCharacteristicsFields = {
    name: ResourceGroupName.Heating2,
    operationType: OperationType.Heating,
    resourceType: ResourceType.BatchResource,
  };
  const resourceCharacteristics: InputResourceCharacteristicsFields = {
    resourceID: ResourceID.Heater1,
    maxBatchSize: ResourceMaxBatchSize._10,
  };
  const _10001 = OrderNr._10001;
  const _10011 = OrderNr._10011;
  const filter10001 = `${ListOperationColumn.OrderNrFilter} = ${_10001}`;
  const filter10011 = `${ListOperationColumn.OrderNrFilter} = ${_10011}`;
  const filterTerms = `${filter10001} ${filter10011}`;

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

  it('Step 1: Open view Data -> Configure Production', async () => {
    await viewConfigureProduction.switchTo();
    expect(await formProductionEnvironment.isVisible()).toBe(true, LogMessage.form_notVisible('Production Environment'));
  });

  it('Step 2: Right click on somewhere in the form and use context menu item Create new resource group. Verify that a form is popped up', async () => {
    dlgResourceGroup = await listResourceGroup.openDialogResourceGroup(ActionTriggerType.ContextMenu);
    expect(await dlgResourceGroup.isVisible()).toBe(true, LogMessage.dialog_notVisible('Resource Group'));
  });

  it('Step 3: In the form, enter Heating2 for name and Heating for operation type. Select resource type as BatchResource. Press OK.', async () => {
    await dlgResourceGroup.pnlCharacteristics.updateDialogValues(resourceGroupCharacteristics);
    await dlgResourceGroup.clickOK();
  });

  it('Step 4: Verify that new resource group Heating2 is visible in the resources list.', async () => {
    const hasHeating2Row = await listResourceGroup.hasRow([
      { columnID: ListResourceGroupParentColumn.Name, value: <string>resourceGroupCharacteristics.name },
      { columnID: ListResourceGroupParentColumn.Type, value: <string>resourceGroupCharacteristics.operationType },
    ]);
    expect(hasHeating2Row).toBe(true, LogMessage.row_notFound(<string>resourceGroupCharacteristics.name));
  });

  it('Step 5: Highlight Heating2 resource group. Right click on it. Create new resource from context menu. Give resource ID Heater1 and a Max batch size of 10. Press Ok.', async () => {
    const newResourceGroupRow = await listResourceGroup.getRowByCellValue(ListResourceGroupParentColumn.Name, <string>resourceGroupCharacteristics.name);
    dlgResource = await listResourceGroup.openDialogResource(ActionTriggerType.ContextMenu, newResourceGroupRow);
    await dlgResource.pnlCharacteristics.updateDialogValues(resourceCharacteristics);
    await dlgResource.clickOK();
  });

  it('Step 6: Go to scheduling view. Plan heating operations of orders 10001 and 10011 on Heater1.', async () => {
    await viewSchedule.switchTo();
    expect(await formResourceSchedule.isVisible()).toBe(true, LogMessage.form_notVisible('Resource Schedule'));
    expect(await formWorkOrdersAndOperation.isVisible()).toBe(true, LogMessage.form_notVisible('Work Orders and Operations'));

    // Filter heating operations of orders 10001 and 10011
    await pnlOperations.switchTo();
    let dialogFilterManager = await listOperations.openFilterDialogOnColumn(ListOperationColumn.OrderNr);
    await dialogFilterManager.filter(filterTerms);

    // Select Heater1 resource and toggle on "Allowed on resource" checkbox
    gcHeater1Row = (await gcResourceSchedule.getRowsByTitle(ResourceName.Heater1))[0];
    await gcResourceSchedule.clickRow(gcHeater1Row);
    await cbAllowedOperation.toggle(true);

    // Verify 10001 and 10011 are existed in operation list
    const heatingOperations = await listOperations.getAllRows();
    expect(heatingOperations.length).toBe(2, LogMessageSch.list_numOfRowsNotMatched('Operation', 2, heatingOperations.length));

    // Verify no operations are planned on Heater1
    heater1Nodes = await gcResourceSchedule.getAllNodes(gcHeater1Row);
    expect(heater1Nodes.length).toBe(0, LogMessageSch.ganttchart_numOfNodesNotMatched(ResourceName.Heater1, 0, heater1Nodes.length));

    // Plan heating operations of orders 10001 and 10011 on Heater1
    await listOperations.planOnSelected(ActionTriggerType.ContextMenu, heatingOperations);
  });

  it('Step 7: Verify that operations are planned as batched without any problem and they are visible in Gantt chart.', async () => {
    // Verify operations are planned on Heater1
    heater1Nodes = await gcResourceSchedule.getAllNodes(gcHeater1Row);
    heater1Nodes = await asyncFilter(heater1Nodes, async (node: GanttChartNode) => (await node.getLeftNodeText()).length > 0);
    expect(heater1Nodes.length).toBe(1, LogMessageSch.ganttchart_numOfNodesNotMatched(ResourceName.Heater1, 1, heater1Nodes.length));

    const listBatchDetail = await gcResourceSchedule.openBatchDetailList(heater1Nodes[0]);
    const rowCount = await listBatchDetail.getRowCount();
    expect(rowCount).toBe(2, LogMessageSch.list_numOfRowsNotMatched('Batch Detail', 2, rowCount));
    const has10001Row = await listBatchDetail.hasRow([{ columnID: ListBatchDetailColumn.WorkOrderId, value: _10001 }]);
    expect(has10001Row).toBe(true, LogMessage.row_notFound(_10001));
    const has10011Row = await listBatchDetail.hasRow([{ columnID: ListBatchDetailColumn.WorkOrderId, value: _10011 }]);
    expect(has10011Row).toBe(true, LogMessage.row_notFound(_10011));
  });
});
