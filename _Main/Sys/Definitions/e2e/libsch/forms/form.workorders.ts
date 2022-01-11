import { Form } from '../../e2elib/lib/src/pageobjects/form.component';
import { ListBase } from '../../libappbase/listbase';
import { ListRow } from '../../e2elib/lib/src/pageobjects/list/listrow.component';
import { DialogSplitInternalWorkOrder } from '../dialogs/dialog.splitworkorder';
import { ActionTriggerType } from '../../libappbase/utils';
import { AppScheduler } from '../appsch';
import { ToastGlobal } from '../../libappbase/toastglobal';
import { DialogCreateEditInternalWorkOrder } from '../dialogs/dialog.workorder';
import { ContextMenuBase } from '../../libappbase/contextmenubase';
import { QConsole } from '../../e2elib/lib/src/helper/qconsole';

export class FormWorkOrders extends Form {
  public listWorkOrders = new ListWorkOrders();

  public constructor() {
    super('FormWorkOrders');
  }
}

export class ListWorkOrders extends ListBase {
  private readonly _cm = new ContextMenuBase('ListContextMenuWorkOrders');
  private readonly _dlgSplitInternalWorkOrder = new DialogSplitInternalWorkOrder();
  private readonly _dlgWorkOrder = new DialogCreateEditInternalWorkOrder();

  public constructor() {
    super('ListWorkOrdersInFormWorkOrders');
  }

  /**
   * Cancel released work orders.
   *
   * @param workOrderRows The name of the work orders
   */
  public async cancelReleasedWorkOrder(via: ActionTriggerType, workOrderRows: ListRow[]): Promise<ToastGlobal> {
    await this.selectRows(workOrderRows);
    await QConsole.waitForScreenUpdate();
    switch (via) {
      case ActionTriggerType.Button:
        const appSch = AppScheduler.getInstance();
        const abpSchedule = appSch.abpSchedule;
        await abpSchedule.click();
        await abpSchedule.waitForScreenUpdate(1000);
        await abpSchedule.btnCancelRelease.click();
        break;
      case ActionTriggerType.ContextMenu:
        await workOrderRows[0].rightClick(undefined, this._cm, ListWorkOrdersContextMenuItem.CancelRelease);
        break;
      default:
        break;
    }
    await QConsole.waitForScreenUpdate();
    return ToastGlobal.getInstance();
  }

  /**
   * Get the due date of work order row
   *
   * @param workOrderRow The row of the work order
   *
   * @returns due date in `string`
   */
  public async getDueDate(workOrderRow: ListRow): Promise<string> {
    return (await workOrderRow.getCell(ListWorkOrdersColumn.Due)).getValue();
  }

  /**
   * To verify if pass-in menu item in context menu is clickable
   *
   * @param menuItemName Name of target menu item
   * @param workOrderRows work order rows
   * @return a tuple of combination of boolean and string, where boolean indicate whether the menuItem is clickable and string inidcate the disabled tooltip
   */
  public async verifyIsMenuItemClickable(menuItemName: string, workOrderRows: ListRow[]): Promise<[boolean, string]> {
    await this.selectRows(workOrderRows);
    await workOrderRows[0].rightClick();
    const [isClickable, tooltip] = await this._cm.verifyIsMenuItemClickable(menuItemName);
    await this._cm.dismiss();
    return [isClickable, tooltip];
  }

  /**
   * Get the quantity of work order row
   *
   * @param workOrderRow The row of the work order
   *
   * @returns quantity in `string`
   */
  public async getQty(workOrderRow: ListRow): Promise<string> {
    return (await workOrderRow.getCell(ListWorkOrdersColumn.Qty)).getValue();
  }

  /**
   * Get work order row based on name of work orders
   *
   * @param workOrder The name of the work order
   *
   * @returns `ListRow` row
   */
  public async getWorkOrder(workOrder: string): Promise<ListRow> {
    return this.getRowByValue([{ columnID: ListWorkOrdersColumn.WorkOrder, value: workOrder }]);
  }

  /**
   * Check work order is existed by value from the list
   *
   * @param workOrder Work order column value
   *
   * @returns boolean to indicate whether a work order row is existed in the list
   */
  public async isWorkOrderExisted(workOrder: string): Promise<boolean> {
    return this.hasRow([{ columnID: ListWorkOrdersColumn.WorkOrder, value: workOrder }]);
  }

  /**
   * Check Work Order is planned based on the image attribute on ImgDeliveryStatus column
   *
   * @param workOrderRow Work order row to be checked
   *
   * @returns boolean to indicate whether the work order is planned
   */
  public async isWorkOrderPlanned(workOrderRow: ListRow): Promise<boolean> {
    let imgAttribtue = await this.getCellValueFromRow(ImgDeliveryStatus.ColumnIndex, workOrderRow, true);
    return imgAttribtue === ImgDeliveryStatus.Planned;
  }

  /**
   * Split work orders. Note: before using this method the work orders should be selected first.
   *
   * @param workOrderRows The rows of the work orders
   */
  public async joinWorkOrders(workOrderRows: ListRow[]): Promise<void> {
    await workOrderRows[0].rightClick(undefined, this._cm, ListWorkOrdersContextMenuItem.Join);
  }

  /**
   * Mark for release work orders.
   *
   * @param workOrderRows The name of the work orders
   */
  public async markWorkOrderAsRelease(via: ActionTriggerType, workOrderRows: ListRow[]): Promise<void> {
    await this.selectRows(workOrderRows);
    switch (via) {
      case ActionTriggerType.Button:
        const appSch = AppScheduler.getInstance();
        const abpSchedule = appSch.abpSchedule;

        await abpSchedule.click();
        await abpSchedule.btnMarkForRelease.click();
        break;
      case ActionTriggerType.ContextMenu:
        await workOrderRows[0].rightClick(undefined, this._cm, ListWorkOrdersContextMenuItem.MarkForRelease);
        break;
      default:
        break;
    }
  }

  /**
   * Open "Split work order" dialog by rightlick on the row and select "split" in the context menu
   *
   * @param workOrderRow The row of the work order
   *
   * @returns Dialog to split internal work order
   */
  public async openSplitWorkOrderDialog(workOrderRow: ListRow): Promise<DialogSplitInternalWorkOrder> {
    await workOrderRow.rightClick(undefined, this._cm, ListWorkOrdersContextMenuItem.Split);
    await this._dlgSplitInternalWorkOrder.waitUntilPresent();
    return this._dlgSplitInternalWorkOrder;
  }

  /**
   * To open Work Order dialog using "Create" / "Edit" context menu or action bar page button
   * @param via Perform action via button or context menu
   * @param row [Optional] Target gantt chart row to edit
   * @returns WorkOrder Dialog
   */
  public async openWorkOrderDialog(via: ActionTriggerType, row?: ListRow): Promise<DialogCreateEditInternalWorkOrder> {
    switch (via) {
      case ActionTriggerType.Button:
        const appSch = AppScheduler.getInstance();
        const abpManageWorkOrders = appSch.abpManageWorkOrders;
        await abpManageWorkOrders.click();
        if (row) {
          await this.selectRows([row]);
          await abpManageWorkOrders.btnEditWorkOrder.click();
        } else {
          await this.focus();
          await abpManageWorkOrders.btnCreateWorkOrder.click();
        }
        break;
      case ActionTriggerType.ContextMenu:
        if (row) {
          await row.rightClick(undefined, this._cm, ListWorkOrdersContextMenuItem.MenuEdit);
        } else {
          await this.rightClick(undefined, this._cm, ListWorkOrdersContextMenuItem.MenuCreate);
        }
        break;
      default:
        break;
    }
    await this._dlgWorkOrder.waitUntilPresent();
    return this._dlgWorkOrder;
  }

  /**
   * To delete work order(s) using "Delete" context menu or action bar page button
   * @param via Perform action via button or context menu
   * @param rows Target work order rows to delete
   */
  public async deleteWorkOrder(via: ActionTriggerType, rows: ListRow[]): Promise<void> {
    await this.selectRows(rows);
    switch (via) {
      case ActionTriggerType.Button:
        await AppScheduler.getInstance().abpManageWorkOrders.btnDeleteWorkOrder.click();
        break;
      case ActionTriggerType.ContextMenu:
        await rows[0].rightClick(undefined, this._cm, ListWorkOrdersContextMenuItem.MenuDelete);
        break;
      default:
        break;
    }
  }
}

export enum ListWorkOrdersColumn {
  WorkOrder = 'Work order',
  Qty = 'Qty',
  Due = 'Due',
  ProductCol = 'Product',
  RoutingCol = 'Routing',
}

export enum ImgLifecycleState {
  BeenReleasedToExternal = 'DOCUMENT_CHECKS',
  CreatedButNotReleased = 'DOCUMENT_EDIT',
  CconfirmOwnedByExternal = 'DOCUMENT_CHECK',
  MarkedForReleased = 'DOCUMENT_OUT',
  ColumnIndex = 1,
}

export enum ImgDeliveryStatus {
  Planned = 'GANTTCHART',
  Late = 'ALARMCLOCK',
  NotPlanned = 'EMPTY',
  ColumnIndex = 2,
}

export enum ImgReleasedBy {
  MarkedByUser = 'ARROW_UP_RED',
  MarkedAutomatically = 'SNOWFLAKE',
  NotMarked = 'EMPTY',
  ColumnIndex = 3,
}

export enum ListWorkOrdersContextMenuItem {
  Join = 'MenuJoinPlannedOrder',
  Split = 'MenuSplitPlannedOrder',
  MenuCreate = 'MenuCreate',
  MenuEdit = 'MenuEdit',
  MenuDelete = 'MenuDelete',
  MarkForRelease = 'MenuMarkForRelease',
  CancelRelease = 'MenuCancelRelease',
}

export enum WorkOrderPrecondition {
  WorkOrderAlreadyReleased = 'Selected work order(s) are already released.',
  WorkOrderAlreadyMarkedForRelease = 'Selected work order(s) already marked for release.',
}
