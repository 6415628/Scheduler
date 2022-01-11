import { Button } from '../e2elib/lib/src/pageobjects/button/button.component';
import { Form } from '../e2elib/lib/src/pageobjects/form.component';
import { Label } from '../e2elib/lib/src/pageobjects/label.component';

/**
 * front end service message box action form.
 */
export class WebMessageBox extends Form {
  private readonly _btnYes = new Button('btnAction8');
  private readonly _btnNo = new Button('btnAction9');
  private readonly _lblMessage = new Label('lblMessage');

  public constructor() {
    super('frmFrontEndServiceMessageBoxAction');
  }

  /**
   * Get WebMessageBox message
   * @returns message string
   */
  public async getMessage(): Promise<string> {
    return this._lblMessage.getText();
  }

  /**
   * clicks on yes button
   */
  public async selectYes(): Promise<void> {
    await this._btnYes.click();
    await this.waitUntilHidden();
  }

  /**
   * clicks on no button
   */
  public async selectNo(): Promise<void> {
    await this._btnNo.click();
    await this.waitUntilHidden();
  }
}
