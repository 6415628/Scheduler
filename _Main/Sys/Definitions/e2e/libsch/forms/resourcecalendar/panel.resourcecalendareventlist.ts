import { QConsole } from '../../../e2elib/lib/src/helper/qconsole';
import { ListRow } from '../../../e2elib/lib/src/pageobjects/list/listrow.component';
import { ContextMenuBase } from '../../../libappbase/contextmenubase';
import { ListBase } from '../../../libappbase/listbase';
import { PanelBase } from '../../../libappbase/panelbase';
import { WebMessageBox } from '../../../libappbase/webmessagebox';
import { DialogEditSubscription } from '../../dialogs/dialog.editsubscription';
import { ListEventChildContextMenuItem } from '../../lists/list.event';

export class PanelResourceCalendarEventList extends PanelBase {
  public listEvent = new ListEvent();
  public listOccurrence = new ListOccurrence();

  public constructor() {
    super('LibCal_frmResourceCalendars.pnlResourceCalendars.tabEventsAndOccurrences');
  }
}

export class ListEvent extends ListBase {
  private readonly _cmRCEventList = new ContextMenuBase('LibCal_frmResourceCalendars.pnlEventsAndOccurrences.cmEventParticipations');
  private readonly _dlgEditSubscription = new DialogEditSubscription();
  private readonly _dlgConfirmation = new WebMessageBox();

  public constructor() {
    super('LibCal_frmResourceCalendars.pnlEventsAndOccurrences.lstParticipations');
  }

  /**
   * Open edit subscription dialog via context menu
   * @param eventRow Target event row to edit
   * @returns edit subscription dialog
   */
  public async openEditSubscriptionDialog(eventRow: ListRow): Promise<DialogEditSubscription> {
    await eventRow.rightClick(undefined, this._cmRCEventList, ListEventChildContextMenuItem.EditSubscription);
    await this._dlgEditSubscription.waitUntilPresent();
    return this._dlgEditSubscription;
  }

  /**
   * Delete Event
   * @param eventRow Target event row to delete
   */
  public async deleteEvent(eventRow: ListRow): Promise<void> {
    await eventRow.rightClick(undefined, this._cmRCEventList, ListEventChildContextMenuItem.DeleteEvent);
    return this._dlgConfirmation.selectYes();
  }

  /**
   * Delete Subscription
   * @param eventRow Target event row to delete subscription
   */
  public async deleteSubscription(eventRow: ListRow): Promise<void> {
    await eventRow.rightClick(undefined, this._cmRCEventList, ListEventChildContextMenuItem.DeleteSubscription);
    await this._dlgConfirmation.selectYes();
    await QConsole.waitForStable();
  }
}

export class ListOccurrence extends ListBase {
  public constructor() {
    super('LibCal_frmResourceCalendars.pnlResourceCalendars.tabEventsAndOccurrences.pnlEventsAndOccurrences.pnlOccurrences.lstOccurrences');
  }
}

export enum ListResourceCalendarEventColumn {
  CalendarID = 'CalendarID',
  Name = 'Name',
  Info = 'Info',
  Initiator = 'Initiator',
  NrOfOccurrences = 'NrOfOccurrences',
}

export enum ListOccurenceColumn {
  Start = 'Start',
  End = 'End',
}
