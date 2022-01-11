import { ListRow } from '../../../e2elib/lib/src/pageobjects/list/listrow.component';
import { ListBase } from '../../../libappbase/listbase';
import { DialogCreateEditFulfillments } from '../../dialogs';

export class ListSupplyFulfillments extends ListBase {
  public _dlgCreateEditFulfillment = new DialogCreateEditFulfillments();

  public constructor() {
    super('ListSupplyFulfillments');
  }

  /**
   * Edit the fulfillment row by double click on it
   *
   * @param fulfillmentRow The fulfillment row to be edited
   *
   * @returns a popup dialog to edit fulfillment row
   */
  public async editSupplyFulfillmentRow(fulfillmentRow: ListRow): Promise<DialogCreateEditFulfillments> {
    await fulfillmentRow.doubleClick();
    await this._dlgCreateEditFulfillment.waitUntilPresent();

    return this._dlgCreateEditFulfillment;
  }

  /**
   * To get supply fulfillment row by pass-in demand id and scroll to demand row
   *
   * @param orderNr value of Order Nr
   * @returns `ListRow` supply fulfillment row
   */
  public async getSupplyFulfillmentRow(demandId: string): Promise<ListRow> {
    let columnID = ListSupplyFulfillmentColumn.DemandId;
    let row = await this.findRowByValue({ columnID, searchValue: demandId });
    return row;
  }
}

export enum ListSupplyFulfillmentColumn {
  DemandId = 'Demand ID',
  SupplyId = 'Supply ID',
  Quantity = 'Quantity',
}
