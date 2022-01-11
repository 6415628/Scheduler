import { Toast } from '../e2elib/lib/src/pageobjects/toast/toast';
import { QToastType } from '../e2elib/lib/src/pageobjects/toast/toastmessage.component';
import { browser } from '../e2elib/node_modules/protractor/built';

export class ToastGlobal extends Toast {
  private static _toast: ToastGlobal;

  /**
   * Returns the singleton instance of Toast.
   *
   * @returns singleton instance of Toast
   */
  public static getInstance(): ToastGlobal {
    if (this._toast === undefined) {
      this._toast = new ToastGlobal();
    }
    return this._toast;
  }

  /**
   * Click on toast button
   *
   * @param value type of button to click (using ButtonType enum)
   */
  public async clickToastButton(value: ButtonType): Promise<void> {
    await this.getToastMessageBox().clickToastButton(value);
  }

  /**
   * Close the last toast message box
   *
   */
  public async closeLastToast(): Promise<void> {
    await this.waitForToast();
    await this.getToastMessageBox().close();
  }

  /**
   * Get the message of last toast box
   *
   */
  public async getLastToastMessage(): Promise<string> {
    await this.waitForToast();
    return this.getToastMessageBox().getMessage();
  }

  /**
   * Check whether the type of last toast box is same as pass-in type
   *
   * @param toastType expected type of the toast message box
   * @param waitTime [Default = 10] the duration (in seconds) to wait for the toast message box to show up
   * @returns true if the last toast type is same as pass-in toast type, false otherwise
   */
  public async verifyLastToastType(toastType: QToastType, waitTime?: number): Promise<boolean> {
    await this.waitForToast(waitTime);
    return (await this.getToastMessageBox().getType()) === toastType;
  }

  /**
   * Wait for toast message box to show up
   *
   * @param durationInSecond the duration to wait for the toast message box to show up
   */
  public async waitForToast(durationInSecond: number = 10): Promise<void> {
    await browser.wait(async () => (await this.toastMessageBoxCount()) > 0, durationInSecond * 1000, `No toast message box shows up within ${durationInSecond} seconds`);
  }
}

export enum ButtonType {
  Yes = 'Yes',
  No = 'No',
}
