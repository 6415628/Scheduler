import { ActionBarPage } from '../../e2elib/lib/src/pageobjects/actionbarpage.component';
import { ButtonBase } from '../../libappbase/buttonbase';
import { WebMessageBox } from '../../libappbase/webmessagebox';
import { DialogImportDemoScenario } from '../dialogs';
import { FormManageDemo } from '../forms/form.managedemo';

export class ActionBarPageDevelop extends ActionBarPage {
  private readonly _btnStartDemo = new ButtonBase('btnDevelopDemoStart');
  private readonly _btnManageDemo = new ButtonBase('ButtonManageDemoView');
  private readonly _btnResetAll = new ButtonBase('ButtonResetAll');
  private readonly _dlgQuestion = new WebMessageBox();
  private readonly _dlgImportDemoScenario = new DialogImportDemoScenario();
  private readonly _formManageDemo = new FormManageDemo();

  public constructor() {
    super('applicationDevelopmentActionBarPageDef');
  }

  public async openImportDatasetDialog(): Promise<DialogImportDemoScenario> {
    await this._btnStartDemo.click();
    await this._dlgImportDemoScenario.waitUntilPresent();
    return this._dlgImportDemoScenario;
  }

  public async openManageDemoForm(): Promise<FormManageDemo> {
    await this.click();
    await this._btnManageDemo.click();
    await this._formManageDemo.waitUntilPresent();
    return this._formManageDemo;
  }

  public async cleanUpDataset(): Promise<void> {
    await this._btnResetAll.click();
    await this._dlgQuestion.selectYes();
  }
}
