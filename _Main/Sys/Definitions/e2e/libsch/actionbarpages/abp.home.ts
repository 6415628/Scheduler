import { ActionBarPage } from '../../e2elib/lib/src/pageobjects/actionbarpage.component';
import { ButtonBase } from '../../libappbase/buttonbase';
import { WebMessageBox } from '../../libappbase/webmessagebox';
import { DialogUserSettings } from '../dialogs/dialog.usersettings';

export class ActionBarPageHome extends ActionBarPage {
  public btnUserSettings = new ButtonBase('btnUserSettings');
  private readonly _btnResetBoard = new ButtonBase('btnResetGlobalView');
  private readonly _dlgUserSettings = new DialogUserSettings();
  private readonly _dlgConfirmation = new WebMessageBox();

  public constructor() {
    super('applicationHomeActionBarPageDef');
  }

  public async openUserSettingsDialog(): Promise<DialogUserSettings> {
    await this.click();
    await this.btnUserSettings.click();
    await this._dlgUserSettings.waitUntilPresent();
    return this._dlgUserSettings;
  }

  public async resetBoard(): Promise<void> {
    await this.click();
    await this._btnResetBoard.click();
    await this._dlgConfirmation.selectYes();
  }
}
