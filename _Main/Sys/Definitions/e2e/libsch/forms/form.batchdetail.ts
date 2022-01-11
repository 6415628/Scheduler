import { Form } from '../../e2elib/lib/src/pageobjects/form.component';
import { ListRow } from '../../e2elib/lib/src/pageobjects/list/listrow.component';
import { ContextMenuBase } from '../../libappbase/contextmenubase';
import { ListBase } from '../../libappbase/listbase';

export class FormBatchDetail extends Form {
  public listBatchDetail = new ListBatchDetail();

  public constructor() {
    super('FormBatchDetail');
  }
}

export class ListBatchDetail extends ListBase {
  private readonly _cm = new ContextMenuBase('listContextMenuBatchDetail');

  public constructor() {
    super('ListBatchDetail');
  }

  public async selectMenuItem(row: ListRow, menuItem: ListBatchDetailContextMenuItem): Promise<void> {
    await row.rightClick(undefined, this._cm, menuItem);
  }
}

export enum ListBatchDetailColumn {
  WorkOrderId = 'WorkOrderId',
}

export enum ListBatchDetailContextMenuItem {
  Filter = 'MenuFilter',
  Sorting = 'MenuSorting',
  MoveToTop = 'MenuMoveBatchElementsToTop',
  MoveUp = 'MenuMoveBatchElementsUp',
  MoveDown = 'MenuMoveBatchElementsDown',
  MoveToBottom = 'MenuMoveBatchElementsBottom',
  RemoveFromBatch = 'MenuRemoveBatchElement',
}
