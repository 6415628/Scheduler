import { EditField } from '../../e2elib/lib/src/pageobjects/editfield.component';
import { NumberPicker } from '../../e2elib/lib/src/pageobjects/numberpicker.component';
import { CheckboxBase } from '../../libappbase/checkboxbase';
import { DateTimeSelectorBase } from '../../libappbase/datetimeselectorbase';
import { DialogBase } from '../../libappbase/dialogbase';
import { DropDownListBase } from '../../libappbase/dropdownlistbase';
import { PanelBase } from '../../libappbase/panelbase';
import { Product, StockingPoint } from '../data/data.product';
import { Routing } from '../data/data.routing';
import { LogMessageSch } from '../logmessagesch';

export class DialogCreateEditInternalWorkOrder extends DialogBase {
  public pnlWorkOrder = new PanelWorkOrderDetails();
  public pnlRouting = new PanelRoutingDetails();

  public constructor() {
    super('DialogCreateEditInternalWorkOrder', 'btnOK', 'btnCancel');
  }
}

export class PanelWorkOrderDetails extends PanelBase {
  // Product Details field
  private readonly _ddlProduct = new DropDownListBase('ddlProduct');
  private readonly _ddlStockingPoint = new DropDownListBase('ddlProductStockingPoint');
  private readonly _ddlRouting = new DropDownListBase('ddlProductRouting');
  private readonly _efLotSize = new EditField('efRoutingLotSize');

  // Number of Lots or Quantity field
  private readonly _npNumberOfLots = new NumberPicker('npNumberOfLots');
  private readonly _npQuantity = new NumberPicker('npQuantity');

  // Order Details field
  private readonly _dtsDueDate = new DateTimeSelectorBase('dtsOrderDueDate');

  private readonly _cbOverrideWarning = new CheckboxBase('cbOverrideSoftPreconditions');

  public constructor() {
    super('PanelWorkOrderDetails');
  }

  /**
   * Update dialog values in Work Order panel
   *
   * @param values `InputWorkOrderFields` values of the Work Order to be updated
   *
   */
  public async updateDialogValues(values: InputWorkOrderFields): Promise<void> {
    // Product Details field
    if (values.product) {
      await this._ddlProduct.selectItem(values.product);
    }
    if (values.stockingPoint) {
      await this._ddlStockingPoint.selectItem(values.stockingPoint);
    }
    if (values.routing) {
      await this._ddlRouting.selectItem(values.routing);
    }
    if (values.lotSize) {
      await this._efLotSize.sendInput(values.lotSize.toString());
    }
    // Number of Lots or Quantity field
    if (values.numberOfLots) {
      await this._npNumberOfLots.sendInput(values.numberOfLots.toString());
    }
    if (values.quantity) {
      await this._npQuantity.sendInput(values.quantity.toString());
    }
    // Order Details field
    if (values.dueDate) {
      await this._dtsDueDate.setDate(values.dueDate);
    }

    if (values.isOverrideWarning !== undefined) {
      await this._cbOverrideWarning.toggle(values.isOverrideWarning);
    }
  }

  /**
   * Verify the field values in the dialog in Work Order panel with expected value
   *
   * @param values `InputWorkOrderFields` values of the Work Order to be verified
   *
   */
  public async verifyDialogValues(values: InputWorkOrderFields): Promise<string> {
    let feedbacks: string[] = [];
    let actual = '';
    let pushFeedback = (dialogField: string, expectedValue: string, actualValue: string): void => {
      if (expectedValue !== actual) {
        feedbacks.push(LogMessageSch.dlg_field_notMatched(dialogField, expectedValue, actualValue));
      }
    };
    // Product Details field
    if (values.product) {
      actual = await this._ddlProduct.getSelectedString();
      pushFeedback(await this._ddlProduct.getComponentLabel(), values.product, actual);
    }
    if (values.stockingPoint) {
      actual = await this._ddlStockingPoint.getSelectedString();
      pushFeedback(await this._ddlStockingPoint.getComponentLabel(), values.stockingPoint, actual);
    }
    if (values.routing) {
      actual = await this._ddlRouting.getSelectedString();
      pushFeedback(await this._ddlRouting.getComponentLabel(), values.routing, actual);
    }
    if (values.lotSize) {
      actual = await this._efLotSize.getText();
      pushFeedback(await this._efLotSize.getComponentLabel(), values.lotSize.toString(), actual);
    }
    // Number of Lots or Quantity field
    if (values.numberOfLots) {
      actual = await this._npNumberOfLots.getValue();
      pushFeedback(await this._npNumberOfLots.getComponentLabel(), values.numberOfLots.toString(), actual);
    }
    if (values.quantity) {
      actual = await this._npQuantity.getValue();
      pushFeedback(await this._npQuantity.getComponentLabel(), values.quantity.toString(), actual);
    }
    // Order Details field
    if (values.dueDate) {
      actual = (await this._dtsDueDate.getDate()).toString();
      pushFeedback(await this._dtsDueDate.getComponentLabel(), values.dueDate.toString(), actual);
    }

    if (values.isOverrideWarning !== undefined) {
      actual = (await this._cbOverrideWarning.isChecked()).toString();
      pushFeedback(await this._cbOverrideWarning.getComponentLabel(), values.isOverrideWarning.toString(), actual);
    }

    return feedbacks.join('. \n');
  }
}

export interface InputWorkOrderFields {
  product?: Product;
  stockingPoint?: StockingPoint;
  routing?: Routing;
  lotSize?: number;
  numberOfLots?: number;
  quantity?: number;
  dueDate?: Date;
  isOverrideWarning?: boolean;
}

export class PanelRoutingDetails extends PanelBase {
  public constructor() {
    super('PanelRoutingDetails');
  }
}
