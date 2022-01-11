import { ActionBarPage } from '../../e2elib/lib/src/pageobjects/actionbarpage.component';
import { ButtonBase } from '../../libappbase/buttonbase';
import { DialogForm } from '../dialogs/dialog.forms';

export class ActionBarPageConfigure extends ActionBarPage {
  private readonly _btnForm = new ButtonBase('btnForms');
  private readonly _dlgForm = new DialogForm();

  public constructor() {
    super('applicationConfigureActionBarPageDef');
  }

  public async openDialogForms(): Promise<DialogForm> {
    await this._btnForm.click();
    await this._dlgForm.waitUntilPresent();
    return this._dlgForm;
  }
}
