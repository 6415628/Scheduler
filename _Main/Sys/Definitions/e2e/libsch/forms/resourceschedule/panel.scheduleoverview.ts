import { ContextMenuBase } from '../../../libappbase/contextmenubase';
import { PanelBase } from '../../../libappbase/panelbase';
import { AppScheduler } from '../../appsch';
import { GanttChartBase } from '../../../libappbase/ganttchartbase';
import { GanttChartNode } from '../../../e2elib/lib/src/pageobjects/ganttchart/ganttchartnode';
import { GanttChartNodeCompartment } from '../../../e2elib/lib/src/pageobjects/ganttchart/qgcnodecompartment';
import { ListBatchDetail } from '../form.batchdetail';
import { asyncEvery } from '../../../libappbase/utils';
import { GanttChartRow } from '../../../e2elib/lib/src/pageobjects/ganttchart/ganttchartrow';
import { DialogEditCalendar } from '../../dialogs/dialog.editcalendar';
import { promise } from '../../../e2elib/node_modules/@types/selenium-webdriver/';
import { protractor } from '../../../e2elib/node_modules/protractor';

export class PanelScheduleOverview extends PanelBase {
  public gcResourceSchedule = new GanttChartResourceSchedule();

  public constructor() {
    super('PanelScheduleOverview');
  }
}

export class GanttChartResourceSchedule extends GanttChartBase {
  private readonly _cm = new ContextMenuBase('GCContextMenuResourceSchedule');
  private readonly _dlgEditCalendar = new DialogEditCalendar();

  public constructor() {
    super('FormResourceSchedule', 'GanttChartResourceSchedule');
  }

  public async verifyTasksColor(taskNodes: GanttChartNode[], color: string): Promise<boolean> {
    return asyncEvery(taskNodes, async (taskNode: GanttChartNode) => {
      let compartments = await this.getNodeCompartments(taskNode);
      let taskNodeColor = await compartments[0].getBackgroundColor();
      return taskNodeColor === color;
    });
  }

  public async openBatchDetailList(node: GanttChartNode): Promise<ListBatchDetail> {
    await this.rightClickNode(node).then(async () => {
      await this._cm.selectMenuItem(GanttChartResourceScheduleContextMenuItem.BatchDetails);
    });
    const listBatchDetail = AppScheduler.getInstance().viewSchedule.formBatchDetail.listBatchDetail;
    await listBatchDetail.waitUntilPresent();
    return listBatchDetail;
  }

  /**
   * Click on the Resource GCRow and right click and choose Edit Calendar menu
   *
   * @param row target resource to edit its calendar
   * @returns DialogEditCalendar
   */
  public async openEditCalendarDialog(row: GanttChartRow): Promise<DialogEditCalendar> {
    await this.clickRow(row);
    await this.rightClickRow(row).then(async () => {
      await this._cm.selectMenuItem(GanttChartResourceScheduleContextMenuItem.EditCalendar);
    });
    await this._dlgEditCalendar.waitUntilPresent();
    return this._dlgEditCalendar;
  }

  /**
   * Retrieve Compartments of a node
   *
   * @param node target node to retrieve its components
   * @returns GanttChartNodeCompartment[]
   */
  public async getNodeCompartments(node: GanttChartNode): Promise<GanttChartNodeCompartment[]> {
    let compartments: GanttChartNodeCompartment[] = [];
    const numOfCompartment = await node.getNumCompartments();
    for (let i = 0; i < numOfCompartment; i++) {
      const compartment = (await node.getCompartment(i)) as GanttChartNodeCompartment;
      const compartmentStart = (await compartment.getStartDate()) as Date;
      const compartmentEnd = (await compartment.getEndDate()) as Date;
      if (compartmentStart.getTime() !== compartmentEnd.getTime()) {
        compartments.push(compartment);
      }
    }
    return compartments;
  }

  /**
   * Get the color of the Gantt chart nodes
   *
   * @param nodes Nodes to get its color
   * @param compartmentIndex The index of the compartment of the node
   */
  public async getNodesColor(nodes: GanttChartNode[], compartmentIndex: number = 0): Promise<string[]> {
    let colors: promise.Promise<string>[] = [];

    for (let node of nodes) {
      let color = this.getNodeCompartments(node)
        .then((compartments: GanttChartNodeCompartment[]) => compartments[compartmentIndex])
        .then((gcCompartment: GanttChartNodeCompartment | undefined) => {
          if (gcCompartment) {
            return gcCompartment.getBackgroundColor();
          }
          return node.getBackgroundColor();
        });

      colors.push(color);
    }

    return protractor.promise.all(colors);
  }
}

export enum GanttChartResourceScheduleContextMenuItem {
  Filter = 'MenuFilter',
  EditCalendar = 'MenuEditCalendar',
  FrozenHorizonInPanelScheduleOverview = 'MenuFrozenHorizonInPanelScheduleOverview',
  Reoptimize = 'MenuReoptimize',
  BatchResource = 'MenuBatchResource',
  BatchDetails = 'MenuBatchDetails',
}

export enum GanttChartResourceScheduleTooltip {
  OrderNr = 'OrderNr',
  Start = 'Start',
  End = 'End',
  ProcessDuration = 'Process Duration',
  SetupDuration = 'Setup Duration',
  MPSPlannedEnd = 'MPS Planned End',
}
