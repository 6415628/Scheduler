import { GanttChartBase } from '../../../libappbase/ganttchartbase';
import { PanelBase } from '../../../libappbase/panelbase';

export class PanelResourceCalendarEventGantt extends PanelBase {
  public gcResourceCalendar = new GanttChartResourceCalendar();

  public constructor() {
    super('LibCal_frmResourceCalendars.pnlResourceCalendars.tabGanttChart');
  }

}

export class GanttChartResourceCalendar extends GanttChartBase {
  public constructor() {
    super('LibCal_frmResourceCalendars', 'gcResourceCalendar');
  }
}
