import { ContextMenuBase } from '../../../libappbase/contextmenubase';
import { ListRow } from '../../../e2elib/lib/src/pageobjects/list/listrow.component';
import { ListBase } from '../../../libappbase/listbase';
import { ActionTriggerType } from '../../../libappbase/utils';
import { AppScheduler } from '../../appsch';
import { KeyboardKey } from '../../../e2elib/lib/src/helper/enumhelper';
import { ListSupplyFulfillments } from './';
import { QUtils } from '../../../e2elib/lib/src/main/qutils.class';

export class ListSupplies extends ListBase {
  private readonly _cm = new ContextMenuBase('listContextMenuSupplies');

  public constructor() {
    super('ListAllSupplies');
  }

  /**
   * To get supply row by pass-in Supply ID and scroll to supply row
   *
   * @param supplyID value of Supply ID
   */
  public async getSupplyRow(supplyID: string): Promise<ListRow> {
    let columnID = ListSuppliesColumn.SupplyId;
    let row = await this.findRowByValue({columnID, searchValue: supplyID});
    return row;
  }

  /**
   * To remove reservation for a supply
   *
   * @param via The action type to remove reservation (e.g. context menu, button)
   * @param supply The supply rows (can be multiple rows selection)
   * @param waitTime [Default = 1000] The time to wait for list being updated
   */
  public async removeReservation(via: ActionTriggerType, supply: ListRow[], waitTime: number = 1000): Promise<void> {
    await this.selectRows(supply);
    switch (via) {
      case ActionTriggerType.Button:
        const appSch = AppScheduler.getInstance();
        const abpManageMaterials = appSch.abpManageMaterials;

        await abpManageMaterials.click();
        await abpManageMaterials.btnRemoveReservation.click();
        break;
      case ActionTriggerType.ContextMenu:
        await supply[0].rightClick(undefined, this._cm, ListSuppliesContextMenuItem.RemoveReservation);
        break;
      case ActionTriggerType.Key:
        await QUtils.keyBoardAction([KeyboardKey.DELETE]);
        break;
      default:
        break;
    }
    await this.waitForScreenUpdate(waitTime);
  }

  /**
   * Select a row and wait for "supply fulfillment" list to be updated
   *
   * @param row The row to be selected
   * @param waitTime Time to wait for "supply fulfillment" list to be updated
   */
  public async selectRow(row: ListRow, waitTime: number = 100): Promise<void> {
    await row.leftClick();
    await this.getListSupplyFulfillment().waitForScreenUpdate(waitTime);
  }

  /**
   * Select multiple rows and wait for "supply fulfillment" list to be updated
   *
   * @param rows The rows to be selected
   * @param waitTime Time to wait for "supply fulfillment" list to be updated
   */
  public async selectRows(rows: ListRow[], waitTime: number = 1000): Promise<void> {
    await super.selectRows(rows);
    await this.getListSupplyFulfillment().waitForScreenUpdate(waitTime);
  }

  private getListSupplyFulfillment(): ListSupplyFulfillments {
    return AppScheduler.getInstance().viewReserveMaterial.formSuppliesAndDemands.listSupplyFulfillment;
  }
}

export enum ListSuppliesColumn {
  SupplyId = 'Supply ID',
  StockingPoint = 'Stocking Point ID',
  ProductId = 'Product ID',
  AvailableFrom = 'Available From',
  Quantity = 'Quantity',
  Reserved = 'Reserved',
  Open = 'Open',
  ReservedOpen = 'Reserved/Open',
}

export enum ListSuppliesContextMenuItem {
  RemoveReservation = 'MenuRemoveSupplyReservations',
}
