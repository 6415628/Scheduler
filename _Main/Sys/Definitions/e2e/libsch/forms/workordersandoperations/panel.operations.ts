import { ListRow } from '../../../e2elib/lib/src/pageobjects/list/listrow.component';
import { browser } from '../../../e2elib/node_modules/protractor/built';
import { CheckboxBase } from '../../../libappbase/checkboxbase';
import { ContextMenuBase } from '../../../libappbase/contextmenubase';
import { FilterManager } from '../../../libappbase/filtermanager';
import { ListBase } from '../../../libappbase/listbase';
import { PanelBase } from '../../../libappbase/panelbase';
import { ToastGlobal } from '../../../libappbase/toastglobal';
import { ActionTriggerType } from '../../../libappbase/utils';
import { AppScheduler } from '../../appsch';

export class PanelOperations extends PanelBase {
  public listOperations = new ListOperations();
  public cbAllowedOperation = new CheckboxBase('CheckboxAllowedOperations');
  public cbUnplanned = new CheckboxBase('CheckboxUnplannedOperations');
  public cbNotInBatch = new CheckboxBase('CheckboxFilterNotInBatch');
  public cbCompatibleOperations = new CheckboxBase('CheckboxFilterCompatibleOperations');

  public constructor() {
    super('PanelOperations');
  }
}

export class ListOperations extends ListBase {
  public static abpList = 'ListActionBarPageOperations';
  public readonly contextMenuOperations = new ContextMenuBase('ListContextMenuOperations');

  public constructor() {
    super('ListOperationsInPanelOperations');
  }

  /**
   * Unplans the given row from the gantt chart
   * @param row row to be unplanned
   */
  public async unplan(row: ListRow): Promise<void> {
    await this.scrollToRow(row);
    await row.leftClick();
    await this.clickUnplanBtn();
  }

  /**
   * Unplans the given row from the gantt chart
   * @param rows rows to be unplanned
   */
  public async unplanFrozenOperation(rows: ListRow[]): Promise<ToastGlobal> {
    await this.selectRows(rows);
    await this.clickUnplanBtn();

    await browser.wait(() => ToastGlobal.getInstance().element.isDisplayed(), 2000, 'No toast displayed');
    return ToastGlobal.getInstance();
  }

  /**
   * Plan on Selected via "Plan on Selected" context menu / Button
   *
   * @param via Plan on Selected via button or context menu
   * @param rows Target operation row(s) to be planned on selected resource
   * @param shouldSelect indicator whether rows are required to be selected before planning
   */
  public async planOnSelected(via: ActionTriggerType, rows: ListRow[], shouldSelect: boolean = true): Promise<void> {
    const abpSchedule = AppScheduler.getInstance().abpSchedule;
    if (shouldSelect) {
      await this.selectRows(rows);
    }
    switch (via) {
      case ActionTriggerType.Button:
        await abpSchedule.click();
        await abpSchedule.btnPlanOnSelected.click();
        break;
      case ActionTriggerType.ContextMenu:
        await rows[rows.length - 1].rightClick(undefined, this.contextMenuOperations, ListOperationContextMenuItem.PlanOnSelectedResource);
        break;
      default:
        break;
    }
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
    let dialog = await super.openFilterDialogOnColumn(columnName, this.contextMenuOperations);
    return dialog;
  }

  /**
   * Get row based on order nr and operation type
   *
   * @param orderNr The order number
   * @param operation The operation type
   *
   * @returns `ListRow` row
   */
  public async getRowByOrderNrAndOperationType(orderNr: string, operation: string): Promise<ListRow> {
    return this.getRowByValue([
      { columnID: ListOperationColumn.OrderNr, value: orderNr },
      { columnID: ListOperationColumn.OperationType, value: operation },
    ]);
  }

  /**
   * Click unplan button
   */
  public async clickUnplanBtn(): Promise<void> {
    let appSch = AppScheduler.getInstance();
    let btnUnplan = appSch.abpSchedule.btnUnplan;
    await btnUnplan.click();
  }

  /**
   * Reserve Material via "Reserve Material" context menu / Button
   *
   * @param via Reserve Material via button or context menu
   * @param demandRows Target unit Demand row(s) to be reserved
   */
  public async reserveMaterial(via: ActionTriggerType, demandRows: ListRow[]): Promise<void> {
    const abpManageMaterials = AppScheduler.getInstance().abpManageMaterials;
    await this.selectRows(demandRows);

    switch (via) {
      case ActionTriggerType.Button:
        await abpManageMaterials.click();
        await abpManageMaterials.btnReserveMaterial.click();
        break;

      case ActionTriggerType.ContextMenu:
        let lastrowindex = demandRows.length - 1;
        await demandRows[lastrowindex].rightClick(undefined, this.contextMenuOperations, ListOperationContextMenuItem.ReserveMaterial);
        break;

      default:
        break;
    }
  }

  /**
   * Plan on Earliest via "Plan on Earliest" context menu / Button
   *
   * @param via Plan on Earliest via button or context menu
   * @param rows Target operation row(s) to be planned on earliest
   * @param shouldSelect indicator whether rows are required to be selected before planning
   */
  public async planOnEarliest(via: ActionTriggerType, rows: ListRow[], shouldSelect: boolean = true): Promise<void> {
    const abpSchedule = AppScheduler.getInstance().abpSchedule;
    if (shouldSelect) {
      await this.selectRows(rows);
    }
    switch (via) {
      case ActionTriggerType.Button:
        await abpSchedule.click();
        await abpSchedule.btnPlanOnEarliest.click();
        break;
      case ActionTriggerType.ContextMenu:
        await rows[rows.length - 1].rightClick(undefined, this.contextMenuOperations, ListOperationContextMenuItem.PlanOnEarliestResource);
        break;
      default:
        break;
    }
  }
}

export enum ListOperationColumn {
  MaterialStatus = 'MaterialStatus',
  OperationType = 'Operation Type',
  OrderNr = 'OrderNr',
  ProductId = 'ProductID',
  DueDate = 'DueDate',
  AllowedResource = 'AllowedResource',
  EarliestStart = 'EarliestStart',
  Start = 'Start',
  End = 'End',
  Practice = 'Practice',
  Width = 'Width',
  // For Filter
  OrderNrFilter = 'PlanUnit_SC.Order_SC.OrderNr',
  OperationTypeFilter = 'Type',
}

export enum MaterialStatus {
  HasBeenReserved = 'BOX',
  NeedToBeReserved = 'BOX_WHITE',
  ColumnIndex = 0,
}

export enum ImgIsPlanned {
  PlannedInFrozen = 'SNOWFLAKE',
  Planned = 'GANTTCHART',
  Finished = 'NAVIGATE_CHECK_GREEN',
  NotPlanned = 'EMPTY',
  ColumnIndex = 1,
}

export enum ListOperationContextMenuItem {
  VisualizeTimeConstraint = 'MenuVisualizeTimeConstraint',
  ReserveMaterial = 'MenuReserveMaterialsForOperation',
  PlanOnEarliestResource = 'MenuPlanOnEarliestResource',
  PlanOnSelectedResource = 'MenuPlanOnSelectedResource',
  Unplan = 'MenuUnplan',
  AddToBatch = 'MenuAddToBatch',
}

export enum OperationPrecondition {
  ReserveMaterialWithinFrozenPeriod = 'One or more of the operations fall within the frozen period. Are you sure you want to reserve material?\n\nDo you wish to proceed?',
  ScheduleNotCommonPractice = 'Selected operations do not have a practice in common.',
}
