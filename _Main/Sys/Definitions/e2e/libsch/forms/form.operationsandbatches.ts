import { QConsole } from '../../e2elib/lib/src/helper/qconsole';
import { Form } from '../../e2elib/lib/src/pageobjects/form.component';
import { ListRow } from '../../e2elib/lib/src/pageobjects/list/listrow.component';
import { ButtonBase } from '../../libappbase/buttonbase';
import { CheckboxBase } from '../../libappbase/checkboxbase';
import { ContextMenuBase } from '../../libappbase/contextmenubase';
import { FilterManager } from '../../libappbase/filtermanager';
import { ListBase } from '../../libappbase/listbase';
import { ToastGlobal } from '../../libappbase/toastglobal';
import { ActionTriggerType } from '../../libappbase/utils';
import { AppScheduler } from '../appsch';

export class FormOperationsAndBatches extends Form {
  // Operation Panel
  public btnCreateBatch = new ButtonBase('ButtonCreateBatch');
  public cbNotInBatch = new CheckboxBase('CheckboxFilterNotInBatch');
  public cbShowCompatibleOperations = new CheckboxBase('CheckboxFilterCompatibleOperations');
  public listBatchOperation = new ListBatchOperation();

  // Batch Panel
  public cbShowCompatibleBatches = new CheckboxBase('CheckboxFilterCompatibleBatches');
  public cbFilterAvailableSpace = new CheckboxBase('CheckboxFilterAvailableSpace');
  public listBatchInPanelBatchList = new ListBatchInPanelBatchList();

  public constructor() {
    super('FormOperationsAndBatches');
  }
}

export class ListBatchOperation extends ListBase {
  private readonly _cmOperations = new ContextMenuBase('ListContextMenuOperations');

  public constructor() {
    super('ListBatchOperation');
  }

  public async createBatch(rows: ListRow[], via: ActionTriggerType): Promise<ToastGlobal> {
    await this.selectRows(rows);
    switch (via) {
      case ActionTriggerType.Button:
        const btnCreateBatch = AppScheduler.getInstance().viewOperationBatching.formOperationsAndBatches.btnCreateBatch;
        await btnCreateBatch.click();
        break;
      case ActionTriggerType.ContextMenu:
        await rows[0].rightClick(undefined, this._cmOperations, ListBatchOperationContextMenuItem.CreateBatch);
        break;
      default:
        break;
    }
    await QConsole.waitForScreenUpdate();
    return ToastGlobal.getInstance();
  }

  /**
   * Trigger filter dialog on column
   *
   * @param columnName Target column name
   * @param contextMenu Context menu triggered
   *
   * @returns `FilterManager` the filter dialog
   */
  public async openFilterDialogOnColumn(columnName: string): Promise<FilterManager> {
    let dialog = await super.openFilterDialogOnColumn(columnName, this._cmOperations);
    return dialog;
  }
}

export enum ListBatchOperationColumn {
  OperationType = 'Operation Type',
  OrderNr = 'OrderNr',
  PlanUnitId = 'PlanUnitId',
  ProductId = 'ProductId',
  DueDate = 'DueDate',
  Start = 'Start',
  End = 'End',
  Practice = 'Practice',
}

export enum ImgIsPlannedListBatchOperationColumn {
  Finished = 'NAVIGATE_CHECK_GREEN',
  PlannedInFrozen = 'SNOWFLAKE',
  Planned = 'GANTTCHART',
  InBatchButNotPlanned = 'CUBES_GREEN',
  NotPlanned = 'EMPTY',
  ColumnIndex = 0,
}

export enum ListBatchOperationContextMenuItem {
  VisualizeTimeConstraint = 'MenuVisualizeTimeConstraint',
  CreateBatch = 'MenuCreateBatch',
}

export class ListBatchInPanelBatchList extends ListBase {
  public constructor() {
    super('ListBatchInPanelBatchList');
  }
}

export enum ListBatchInPanelBatchListParentColumn {
  BatchID = 'BatchID',
  DueDate = 'DueDate',
  Practice = 'Practice',
  Size = 'Size',
  MaxBatchSize = 'MaxBatchSize',
  ReservedOpen = 'ReservedOpen',
}

export enum ImgIsBatchHasCommonPracticeColumn {
  NoCommonPractice = 'CONSTRAINTVIOLATIONS',
  CommonPractice = 'EMPTY',
  ColumnIndex = 0,
}

export enum ListBatchInPanelBatchListChildColumn {
  SequenceNr = 'SequenceNr',
  OrderNr = 'OrderNr',
  OperationID = 'OperationID',
  Start = 'Start',
  End = 'End',
  Practice = 'Practice',
}

export enum ListBatchInPanelBatchListParentContextMenuItem {
  EditBatchPractice = 'MenuEditBatchPractice',
  ClearManualPractice = 'MenuClearManualPractice',
  Delete = 'MenuRemoveBatch',
}

export enum CreateBatchPrecondition {
  DifferentPractice = 'Selected operations cannot be batched because:\n\nSelected operations do not have a practice in common.\n\nDo you wish to proceed?',
}
