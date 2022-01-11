import { Form } from '../../../e2elib/lib/src/pageobjects/form.component';
import { ListBase } from '../../../libappbase/listbase';
import { PanelResourceCalendarEventList, PanelResourceCalendarEventGantt } from '.';
import { ContextMenuBase } from '../../../libappbase/contextmenubase';
import { ListRow } from '../../../e2elib/lib/src/pageobjects/list/listrow.component';
import { DialogEvent } from '../../dialogs/event/dialog.event';

export class FormResourceCalendar extends Form {
  public listCalendar = new ListCalendar();
  public pnlRCEventGantt = new PanelResourceCalendarEventGantt();
  public pnlRCEventList = new PanelResourceCalendarEventList();

  public constructor() {
    super('LibCal_frmResourceCalendars');
  }
}

export class ListCalendar extends ListBase {
  private readonly _cmResourceCalendars = new ContextMenuBase('cmResourceCalendars');
  private readonly _dlgEvent = new DialogEvent();

  public constructor() {
    super('lstResourceCalendars');
  }

  /**
   * To open Event dialog via "Create Event" context menu
   * @param targetRow Target calendar list row to create event
   * @returns Event Dialog
   */
  public async openDialogEvent(targetRow: ListRow): Promise<DialogEvent> {
    await targetRow.rightClick(undefined, this._cmResourceCalendars, ListCalendarContextMenuItem.CreateEvent);
    await this._dlgEvent.waitUntilPresent();
    return this._dlgEvent;
  }
}

export enum ListCalendarColumn {
  CalendarID = 'CalendarID',
}

export enum ListCalendarContextMenuItem {
  CreateEvent = 'menuCreateEvent',
  CreateSubscription = 'menuCreateSubscription',
}
