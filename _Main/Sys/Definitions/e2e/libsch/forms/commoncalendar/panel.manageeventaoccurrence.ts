import { ListRow } from '../../../e2elib/lib/src/pageobjects/list/listrow.component';
import { ContextMenuBase } from '../../../libappbase/contextmenubase';
import { ListBase } from '../../../libappbase/listbase';
import { PanelBase } from '../../../libappbase/panelbase';
import { WebMessageBox } from '../../../libappbase/webmessagebox';
import { DialogEvent } from '../../dialogs/event/dialog.event';
import { ListEventWithoutSubscriptionContextMenuItem } from '../../lists/list.event';

export class PanelManageEventOccurence extends PanelBase {
  public listEvent = new ListEvent();
  public listOccurence = new ListOccurrence();

  public constructor() {
    super('LibCal_frmCommonCalendar.pnlCommonCalendar.tabEventsAndOccurrences');
  }

  /**
   * @override
   */
  public async switchTo(): Promise<void> {
    await super.switchTo();
    await this.listEvent.waitUntilPresent();
    await this.listOccurence.waitUntilPresent();
  }
}

export class ListEvent extends ListBase {
  private readonly _cmEvent = new ContextMenuBase('LibCal_frmCommonCalendar.pnlEventsAndOccurrences.cmEventParticipationsWithoutSubscription');
  private readonly _dlgConfirmation = new WebMessageBox();
  private readonly _dlgEvent = new DialogEvent();

  public constructor() {
    super('LibCal_frmCommonCalendar.pnlEventsAndOccurrences.lstParticipations');
  }

  /**
   * To delete an event
   * @param eventRow Target event row to delete
   */
  public async deleteEvent(eventRow: ListRow): Promise<void> {
    await eventRow.rightClick(undefined, this._cmEvent, ListEventWithoutSubscriptionContextMenuItem.DeleteEvent);
    await this._dlgConfirmation.selectYes();
  }

  /**
   * To open Event dialog via "Create" / "Edit" context menu
   * @param eventRow [Optional] Target event row to edit
   * @returns Event Dialog
   */
  public async openDialogEvent(eventRow?: ListRow): Promise<DialogEvent> {
    if (eventRow) {
      await eventRow.rightClick(undefined, this._cmEvent, ListEventWithoutSubscriptionContextMenuItem.EditEvent);
    } else {
      await this.rightClick(undefined, this._cmEvent, ListEventWithoutSubscriptionContextMenuItem.CreateEvent);
    }
    await this._dlgEvent.waitUntilPresent();
    return this._dlgEvent;
  }
}

export class ListOccurrence extends ListBase {
  public constructor() {
    super('LibCal_frmCommonCalendar.pnlCommonCalendar.tabEventsAndOccurrences.pnlEventsAndOccurrences.pnlOccurrences.lstOccurrences');
  }
}

export enum ListEventColumn {
  Name = 'Name',
  Info = 'Info',
  NrOfOccurrences = 'NrOfOccurrences',
}
