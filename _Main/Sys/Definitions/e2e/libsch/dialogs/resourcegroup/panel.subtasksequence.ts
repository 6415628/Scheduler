import { ListRow } from '../../../e2elib/lib/src/pageobjects/list/listrow.component';
import { ContextMenuBase } from '../../../libappbase/contextmenubase';
import { ListBase } from '../../../libappbase/listbase';
import { PanelBase } from '../../../libappbase/panelbase';

export class PanelSubtaskSequence extends PanelBase {
  public listAvailableSubtask = new ListAvailableSubtask();
  public listAssignSubtask = new ListAssignSubtask();

  public constructor() {
    super('PanelSubtaskSequence');
  }
}

export class ListAvailableSubtask extends ListBase {
  public constructor() {
    super('ListSubtaskType');
  }
}

export class ListAssignSubtask extends ListBase {
  private readonly _cmSubtaskTypeOnResourceGroup = new ContextMenuBase('cmSubtaskTypeOnResourceGroup');
  public constructor() {
    super('ListSubtaskTypeOnResourceGroup');
  }

  public async deleteAssignedSubtask(row: ListRow): Promise<void> {
    await row.rightClick(undefined, this._cmSubtaskTypeOnResourceGroup, ListAssignSubtaskContextMenu.Delete);
  }
}

export enum ListAvailableSubtaskColumn {
  Index = 'Index',
  Name = 'Name',
  IsSupportedInDataDriven = 'Is supported in data-driven time constraints mode',
}

export enum ListAssignSubtaskColumn {
  IsSupportedSubtaskType = 'IsSupportedSubtaskType',
  SequenceNr = 'Sequence Nr',
  Name = 'Name',
}

export enum ListAssignSubtaskContextMenu {
  Delete = 'Delete',
}
