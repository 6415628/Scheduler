import { Form } from '../../e2elib/lib/src/pageobjects/form.component';
import { ListBase } from '../../libappbase/listbase';
import { ContextMenu } from '../../e2elib/lib/src/pageobjects/contextmenu/contextmenu.component';
import { ListRow } from '../../e2elib/lib/src/pageobjects/list/listrow.component';
import { ActionTriggerType } from '../../libappbase/utils';
import { AppScheduler } from '../appsch';
export class FormMPSPlannedOrders extends Form {
  public listPlannedOrders = new ListPlannedOrders();

  public constructor() {
    super('FormMPSPlannedOrders');
  }
}

export class ListPlannedOrders extends ListBase {
  private readonly _cm = new ContextMenu('listContextMenuPlannedOrders');

  public constructor() {
    super('ListPlannedOrders');
  }

  /**
   * Get row by specifying Routing and DueDate value
   *
   * @param routing Routing value of Planned Order
   * @param dueDate DueDate value of Planned Order
   * @returns Planned Order Row
   */
  public async getRowByRoutingAndDueDate(routing: string, duedate: string): Promise<ListRow> {
    return this.getRowByValue([
      { columnID: ListPlannedOrdersColumn.Routing, value: routing },
      { columnID: ListPlannedOrdersColumn.PeriodEnd, value: duedate },
    ]);
  }

  /**
   * Create Firm Planned Order
   *
   * @param rows MPS planned orders rows to be converted to firm
   */
  public async createFirmPlannedOrder(via: ActionTriggerType, rows: ListRow[], shouldSelect: boolean = true): Promise<void> {
    if (shouldSelect) {
      await this.selectRows(rows);
    }
    switch (via) {
      case ActionTriggerType.Button:
        const appSch = AppScheduler.getInstance();
        const abpManageWorkOrders = appSch.abpManageWorkOrders;
        await abpManageWorkOrders.click();
        await abpManageWorkOrders.waitForScreenUpdate(1000);
        await abpManageWorkOrders.btnConvertMPSPlannedOrder.click();
        break;
      case ActionTriggerType.ContextMenu:
        await rows[0].rightClick(undefined, this._cm, ListWorkOrdersContextMenuItem.CreateFirmPlannedOrders);
        break;
      default:
        break;
    }
  }
}

export enum ListPlannedOrdersColumn {
  Routing = 'Routing',
  PeriodStart = 'Period Start',
  PeriodEnd = 'Period End',
  Qty = 'Qty',
  FirmedQuantityAbsolute = 'Firmed Quantity (absolute)',
  Open = 'Open',
}

export enum ListWorkOrdersContextMenuItem {
  CreateFirmPlannedOrders = 'MenuCreateFirmPlannedOrders',
}
