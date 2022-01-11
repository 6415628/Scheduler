import { GanttChartRow } from '../../../e2elib/lib/src/pageobjects/ganttchart/ganttchartrow';
import { ContextMenuBase } from '../../../libappbase/contextmenubase';
import { GanttChartBase } from '../../../libappbase/ganttchartbase';
import { PanelBase } from '../../../libappbase/panelbase';
import { DialogEvent } from '../../dialogs/event/dialog.event';

export class PanelEventPattern extends PanelBase {
  public gcCommonCalendar = new GanttChartCommonCalendar();

  public constructor() {
    super('LibCal_frmCommonCalendar.pnlCommonCalendar.tabGanttChart');
  }

  /**
   * @override
   */
  public async switchTo(): Promise<void> {
    await super.switchTo();
    await this.gcCommonCalendar.waitUntilPresent();
  }
}

export class GanttChartCommonCalendar extends GanttChartBase {
  private readonly _cmRowWithoutSubscription = new ContextMenuBase('LibCal_frmCommonCalendar.gcCalendar.cmRowWithoutSubscription');
  private readonly _dlgEvent = new DialogEvent();

  public constructor() {
    super('LibCal_frmCommonCalendar', 'gcCalendar');
  }

  /**
   * To open Event dialog via "Create" / "Edit" context menu
   * @param targetRow [Optional] Target gantt chart row to edit
   * @returns Event Dialog
   */
  public async openDialogEvent(targetRow?: GanttChartRow): Promise<DialogEvent> {
    if (targetRow) {
      await this.rightClickRow(targetRow).then(async () => {
        await this._cmRowWithoutSubscription.selectMenuItem(GanttChartCommonCalendarWithoutSubscriptionContextMenuItem.CreateEvent);
      });
    } else {
      targetRow = <GanttChartRow> await this.getRow(0);
      await this.rightClickRow(targetRow).then(async () => {
        await this._cmRowWithoutSubscription.selectMenuItem(GanttChartCommonCalendarWithoutSubscriptionContextMenuItem.CreateEvent);
      });
    }
    await this._dlgEvent.waitUntilPresent();
    return this._dlgEvent;
  }
}

export enum GanttChartCommonCalendarContextMenuItem {
  CreateEvent = 'mnuRowCreateEvent',
  EditEvent = 'mnuRowEditEvent',
  DeleteEvent = 'mnuRowDeleteEvent',
}

export enum GanttChartCommonCalendarWithoutSubscriptionContextMenuItem {
  CreateEvent = 'mnuRowCreateEventWS',
  EditEvent = 'mnuRowEditEventWS',
  DeleteEvent = 'mnuRowDeleteEventWS',
}
