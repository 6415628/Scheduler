import { ListBase } from '../../../libappbase/listbase';
import { PanelBase } from '../../../libappbase/panelbase';

export class PanelResourceSequenceDetails extends PanelBase {
  public listTask = new ListTask();
  public listResource = new ListResource();

  public constructor() {
    super('PanelResourceSequenceDetails');
  }
}

export class ListTask extends ListBase {
  public static abpList = 'listActionBarPageTasks';

  public constructor() {
    super('ListTasks');
  }

  /**
   * Check task is existed by value from the list
   *
   * @param orderNr OrderNr column value
   *
   * @returns boolean to indicate whether a task row is existed in the list
   */
  public async isTaskExisted(orderNr: string): Promise<boolean> {
    return this.hasRow([{ columnID: ListTaskColumn.OrderNr, value: orderNr }]);
  }
}

export class ListResource extends ListBase {
  public constructor() {
    super('ListResources');
  }

  public async selectResource(rowIndex: number): Promise<void> {
    await (await this.getRowByIndex(rowIndex)).leftClick();
  }
}

export enum ListResourceColumn {
  Name = 'Name',
}

export enum ListTaskColumn {
  OrderNr = 'OrderNr',
  Start = 'Start',
  End = 'End',
  ProcessDuration = 'ProcessDuration',
  SetupDuration = 'SetupDuration',
  MpsPlannedEnd = 'MPS Planned End',
  BatchSize = 'BatchSize',
  MaxBatchSize = 'MaxBatchSize',
  PossiblePractices = 'PossiblePractices',
  BatchId = 'BatchID',
}
