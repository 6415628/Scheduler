import { DialogBase } from '../../libappbase/dialogbase';
import { NumberPicker } from '../../e2elib/lib/src/pageobjects/numberpicker.component';

export class DialogCreateEditFulfillments extends DialogBase {
  public nmp = new NumberPicker('NumberPickerQuantityToReserve');

  public constructor() {
    super('DialogCreateEditFulfillment', 'ButtonOk', 'ButtonCancel');
  }

  public async editQtyToReserve(targetNumber: number): Promise<void> {
    await this.nmp.sendInput(targetNumber.toString());

    let canClickOK = await this.btnOk.isClickable();
    if (canClickOK) {
      await this.clickOK();
    } else {
      await this.clickCancel();
    }
  }
}
