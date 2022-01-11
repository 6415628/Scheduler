import { KeyboardKey } from '../../../e2elib/lib/src/helper/enumhelper';
import { QConsole } from '../../../e2elib/lib/src/helper/qconsole';
import { QUtils } from '../../../e2elib/lib/src/main/qutils.class';
import { ListRow } from '../../../e2elib/lib/src/pageobjects/list/listrow.component';
import { ContextMenuBase } from '../../../libappbase/contextmenubase';
import { ColumnIDValueMap, ListBase } from '../../../libappbase/listbase';
import { ActionTriggerType } from '../../../libappbase/utils';
import { AppScheduler } from '../../appsch';

export class ListDemands extends ListBase {
  private readonly _cm = new ContextMenuBase('listContextMenuDemands');

  public constructor() {
    super('ListAllDemands');
  }

  /**
   * To get demand row by pass-in Order Nr and scroll to demand row
   *
   * @param orderNr value of Order Nr
   * @returns `ListRow` demand row
   */
  public async getDemandRow(orderNr: string): Promise<ListRow> {
    return this.findRowByValue({ columnID: ListDemandsColumn.OrderNr, searchValue: orderNr });
  }

  /**
   * Remove Reservation via "Remove Reservation" context menu / Button / "Delete" keyboard
   *
   * @param via Delete via button or context menu or "Delete" keyboard.
   * @param demandRows Target unit Demand row(s) to be delete
   */
  public async removeReservationVia(via: ActionTriggerType, demandRows: ListRow[]): Promise<void> {
    let modifiers: { control: true } | undefined;
    await this.focus();
    for (let [index, row] of demandRows.entries()) {
      modifiers = index !== 0 ? { control: true } : undefined;
      await row.leftClick(modifiers);
    }

    switch (via) {
      case ActionTriggerType.Button:
        await AppScheduler.getInstance().abpManageMaterials.btnRemoveReservation.click();
        break;

      case ActionTriggerType.ContextMenu:
        let lastrowindex = demandRows.length - 1;
        await demandRows[lastrowindex].rightClick(undefined, this._cm, ListDemandsContextMenuItem.RemoveReservation);
        break;

      case ActionTriggerType.Key:
        await QUtils.keyBoardAction([KeyboardKey.DELETE]);
        break;

      default:
        break;
    }
  }

  /**
   * Reserve Material via "Reserve Material" context menu / Button
   *
   * @param via Reserve Material via button or context menu
   * @param demandRows Target unit Demand row(s) to be reserved
   */
  public async reserveMaterial(via: ActionTriggerType, demandRows: ListRow[]): Promise<void> {
    await this.selectRows(demandRows);

    switch (via) {
      case ActionTriggerType.Button:
        await AppScheduler.getInstance().abpManageMaterials.btnReserveMaterial.click();
        break;

      case ActionTriggerType.ContextMenu:
        let lastrowindex = demandRows.length - 1;
        await demandRows[lastrowindex].rightClick(undefined, this._cm, ListDemandsContextMenuItem.ReserveMaterials);
        break;

      default:
        break;
    }
    await QConsole.waitForStable();
  }

  /**
   * Check whether a row exist in demand list
   *
   * @param orderNr value of Order Nr
   * @returns `boolean` if row exists or not
   */
  public async isDemandRowExist(orderNr: string): Promise<boolean> {
    let columnID = ListDemandsColumn.OrderNr;
    let targetColumnMap: ColumnIDValueMap[] = [{ columnID, value: orderNr }];
    let hasRow = await this.hasRow(targetColumnMap);
    return hasRow;
  }
}

export enum ListDemandsColumn {
  OrderNr = 'Order Nr',
  StockingPoint = 'Stocking Point ID',
  ProductID = 'Product ID',
  DueDate = 'Due Date',
  Quantity = 'Quantity',
  Reserved = 'Reserved',
  Open = 'Open',
  ReservedOpen = 'Reserved/Open',
}

export enum ReservationStatus {
  FullyReservedByUpstream = 'CHECK2',
  FullyReserved = 'CHECK',
  PartiallyReserved = 'MIXEDCHECKBOX',
  PlannedWithoutReserved = 'WARNING',
  ColumnIndex = 5,
}

export enum ImgFrozen {
  Frozen = 'SNOWFLAKE',
  NotFrozen = '',
  ColumnIndex = 10,
}

export enum ReservedOpenStackBar {
  QuantityReservedKey = 'Quantity Reserved',
  QuantityOpenKey = 'Quantity Open',
  ReservedTooltip = 'Quantity Reserved: ',
  OpenTooltip = 'Quantity Open: ',
}

export enum ListDemandsContextMenuItem {
  ReserveMaterials = 'MenuReserveMaterialsForDemand',
  RemoveReservation = 'MenuRemoveDemandReservations',
}

export enum ReserveUnreserveDemandPrecondition {
  DemandReserveMsg = "One or more of the demands' operation fall within the frozen period. Are you sure you want to reserve material?\n\nDo you wish to proceed?",
  DemandUnreserveMsg = "One or more of the demands' operation falls within the frozen period. Are you sure you want to unreserve?\n\nDo you wish to proceed?",
}
