/**
 * @file Dialog form component base class
 * @description Intialize dialog form by passing in DialogForm name and OK / Cancel button name.
 *              Allow to check whether Ok button is clickable and perform click action of OK / Cancel button.
 * @author      Wong Jia Hui (jiahui.wong@3ds.com)
 * @copyright   Dassault Systèmes
 */
import { Form } from '../e2elib/lib/src/pageobjects/form.component';
import { ButtonBase } from './buttonbase';

export class DialogBase extends Form {
  // Buttons
  public btnOk: ButtonBase;
  public btnCancel: ButtonBase;

  /**
   * To initialize dialog by pass-in dialog name
   *
   * @param dialogName Name of dialog to initialize
   * @param btnOkName Button name of positive action to save changes
   * @param btnCancelName Button name of negative action to cancel changes
   */
  public constructor(dialogName: string, btnOkName: string, btnCancelName: string) {
    super(dialogName);

    // Initialize ok and cancel button in a dialog
    this.btnOk = new ButtonBase(btnOkName);
    this.btnCancel = new ButtonBase(btnCancelName);
  }

  /**
   * Perform click action on Ok button if it is clickable
   *
   * @param waitTime [Optional] miliseconds of how long it should wait for Ok Button to be clickable.
   * @return boolean to indicate whether click action is performed
   */
  public async clickOK(waitTime?: number): Promise<boolean> {
    let canClickOk = await this.btnOk.isClickable(waitTime);
    if (canClickOk) {
      await this.btnOk.click();
      await this.waitUntilHidden();
    }
    return canClickOk;
  }

  /**
   * Perform click action on Cancel button
   */
  public async clickCancel(): Promise<void> {
    await this.btnCancel.click();
    await this.waitUntilHidden();
  }
}
