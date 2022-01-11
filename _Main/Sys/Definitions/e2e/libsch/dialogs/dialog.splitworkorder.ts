import { NumberPicker } from '../../e2elib/lib/src/pageobjects/numberpicker.component';
import { CheckboxBase } from '../../libappbase/checkboxbase';
import { DialogBase } from '../../libappbase/dialogbase';

export class DialogSplitInternalWorkOrder extends DialogBase {
  public nmpQty = new NumberPicker('NumberPickerQuantity');
  public nmpNrOfLots = new NumberPicker('NumberPickerNrOfLots');
  public cbOverrideWarning = new CheckboxBase('CheckBoxOverrideSoft');

  public constructor() {
    super('DialogSplitInternalWorkOrder', 'ButtonOk', 'ButtonCancel');
  }

  /**
   * Split the work order by enetring the values into the input fields and click Ok button
   *
   * @param nrOfLots value to be entered into the '# of Lots' number picker
   * @param qty value to be entered into the 'Quantity' number picker
   * @param override boolean value  to indicate whether to check the "Override warning" checkbox
   */
  public async splitWorkOrder(nrOfLots?: number, qty?: number, override: boolean = false): Promise<boolean> {
    if (nrOfLots) {
      await this.nmpNrOfLots.sendInput(nrOfLots.toString());
    }
    if (qty !== undefined) {
      await this.setQty(qty.toString());
    }
    if (override) {
      await this.cbOverrideWarning.toggle(true);
    }

    let isClicked = await this.clickOK();

    return isClicked;
  }

  /**
   * Set quantity for splitting a Work Order
   *
   * @param qty Desired Quantity
   *
   */
  public async setQty(qty: string): Promise<void> {
    await this.nmpQty.sendInput(qty);
  }
}
