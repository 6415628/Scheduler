import { ViewBase } from '../../libappbase/viewbase';
import { FormWorkOrders } from '../forms/form.workorders';
import { AppScheduler } from '../appsch';
import { FormMPSPlannedOrders, ListPlannedOrders, ListPlannedOrdersColumn } from '../forms/form.mpsplannedorder';
import { FormProductAdherence, ListProducts, ListProductsColumn } from '../forms/form.productadherence';
import { QuantityStackBar, QuantityType } from '../data/data.manageorders';
import { ListRow } from '../../e2elib/lib/src/pageobjects/list/listrow.component';
import { FormAdherenceToMPS } from '../forms/form.adherencetomps';
export class ViewManageOrders extends ViewBase {
  public readonly name = 'Manage Orders';

  public formWorkOrders = new FormWorkOrders();
  public formMPSPlannedOrders = new FormMPSPlannedOrders();
  public formProductAdherence = new FormProductAdherence();
  public formAdherenceToMPS = new FormAdherenceToMPS();

  /**
   * Get Firmed/Open/Excess Quantity value and tooltip from inline chart column
   *
   * @param list which list: Planned Order or Product
   * @param qtyType which quantity type: Firmed, Open or Excess
   * @param row product row to get the inline chart value
   * @returns A tuple of string (value of specified quantity type) and string (tooltip)
   */
  public async getFirmedOpenExcessQty(list: ListPlannedOrders | ListProducts, qtyType: QuantityType, row: ListRow): Promise<[string, string]> {
    let value = '';
    let tooltip = '';
    let cell = list instanceof ListProducts ? await row.getCell(ListProductsColumn.AdherenceToMPS) : await row.getCell(ListPlannedOrdersColumn.FirmedQuantityAbsolute);
    const chartValue = await list.getInlineChartValue(cell);
    switch (qtyType) {
      case QuantityType.Firmed:
        value = <string>chartValue.get(QuantityStackBar.FirmedKey);
        tooltip = await cell.getTooltip(undefined, undefined, undefined, QuantityStackBar.FirmedKey);
        break;
      case QuantityType.Open:
        value = <string>chartValue.get(QuantityStackBar.OpenKey);
        tooltip = await cell.getTooltip(undefined, undefined, undefined, QuantityStackBar.OpenKey);
        break;
      case QuantityType.Excess:
        value = <string>chartValue.get(QuantityStackBar.ExcessKey);
        tooltip = await cell.getTooltip(undefined, undefined, undefined, QuantityStackBar.ExcessKey);
        break;
      default:
        break;
    }
    return [value, tooltip];
  }

  public async switchTo(): Promise<void> {
    let appScheduler = AppScheduler.getInstance();

    // Go to "Manage Work Orders" action bar page
    await appScheduler.abpManageWorkOrders.click();

    // Click on "Manage Orders" button
    await appScheduler.abpManageWorkOrders.btnManageOrders.click();

    // Wait until all forms are present.
    await this.formWorkOrders.waitUntilPresent();
    await this.formMPSPlannedOrders.waitUntilPresent();
    await this.formProductAdherence.waitUntilPresent();
  }
}
