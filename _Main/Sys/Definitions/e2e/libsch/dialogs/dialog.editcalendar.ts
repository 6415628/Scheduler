import { DialogBase } from '../../libappbase/dialogbase';
import { DropDownListBase } from '../../libappbase/dropdownlistbase';
import { ListBase } from '../../libappbase/listbase';
import { ContextMenuBase } from '../../libappbase/contextmenubase';
import { ListRow } from '../../e2elib/lib/src/pageobjects/list/listrow.component';
import { WebMessageBox } from '../../libappbase/webmessagebox';
import { DialogEvent } from './event/dialog.event';
import { ListEventChildContextMenuItem, ListEventParentContextMenuItem } from '../lists/list.event';

export class DialogEditCalendar extends DialogBase {
  public ddlCalendar = new DropDownListBase('selCalendar');
  public listEvent = new ListEvent();

  public constructor() {
    super('LibCal_dlgEditCalendar', 'btnOK', 'btnOK'); // Note: There is no Cancel button for this dialog
  }
}

export class ListEvent extends ListBase {
  private readonly _cmParent = new ContextMenuBase('cmEventCategories');
  private readonly _cmChild = new ContextMenuBase('cmEventParticipations');
  private readonly _dlgEvent = new DialogEvent();
  private readonly _dlgConfirmation = new WebMessageBox();

  public constructor() {
    super('lstParticipations');
  }

  /**
   * To open Event dialog via "Create" / "Edit" context menu
   * @param eventRow [Optional] Target event row to edit
   * @returns Event Dialog
   */
  public async openDialogEvent(eventRow?: ListRow): Promise<DialogEvent> {
    if (eventRow) {
      await eventRow.rightClick(undefined, this._cmChild, ListEventChildContextMenuItem.EditEvent);
    } else {
      await this.rightClick(undefined, this._cmParent, ListEventParentContextMenuItem.CreateEvent);
    }
    await this._dlgEvent.waitUntilPresent();
    return this._dlgEvent;
  }

  /**
   * Delete Event
   * @param eventRow Target event row to delete
   */
  public async deleteEvent(eventRow: ListRow): Promise<void> {
    await eventRow.rightClick(undefined, this._cmChild, ListEventChildContextMenuItem.DeleteEvent);
    return this._dlgConfirmation.selectYes();
  }
}

export enum ListEventChildColumn {
  Name = 'Name',
  Info = 'Info',
  Initiator = 'Initiator',
  NrOfOccurrences = 'NrOfOccurrences',
}
