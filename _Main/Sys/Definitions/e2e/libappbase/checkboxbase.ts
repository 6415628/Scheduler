import { Checkbox } from '../e2elib/lib/src/pageobjects/checkbox.component';

export class CheckboxBase extends Checkbox {
  /**
   * Toggle the checkbox on/off
   *
   * @param expectedState true = ON / false = OFF
   */
  public async toggle(expectedState: boolean): Promise<void> {
    const currentState = await this.isChecked();

    if (currentState !== expectedState) {
      await this.click();
    }
  }
}
