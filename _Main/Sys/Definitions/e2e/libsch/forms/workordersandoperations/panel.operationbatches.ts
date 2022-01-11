import { ListBase } from '../../../libappbase/listbase';
import { PanelBase } from '../../../libappbase/panelbase';

export class PanelOperationBatches extends PanelBase {
  public listOperationBatches = new ListOperationBatches();

  public constructor() {
    super('PanelOperationBatches');
  }
}
export class ListOperationBatches extends ListBase {
  public constructor() {
    super('ListBatchInPanelOperationBatchesList');
  }
}

export enum ListOperationBatchesColumn {
  BatchId = 'BatchID',
  DueDate = 'DueDate',
  Start = 'Start',
  End = 'End',
  Practice = 'Practice',
  Size = 'Size',
  MaxBatchSize = 'MaxBatchSize',
  ReservedOpen = 'Reserved/Open',
}
