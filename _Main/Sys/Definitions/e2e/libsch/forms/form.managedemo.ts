import { ContextMenu } from '../../e2elib/lib/src/pageobjects/contextmenu/contextmenu.component';
import { Form } from '../../e2elib/lib/src/pageobjects/form.component';
import { ListRow } from '../../e2elib/lib/src/pageobjects/list/listrow.component';
import { ListBase } from '../../libappbase/listbase';
import { LogMessage } from '../../libappbase/logmessage';
import { DialogCreateEditDemoScenario } from '../dialogs/dialog.createeditdemoscenario';

export class FormManageDemo extends Form {
  public listDemoCategory = new ListDemoCategory();
  public listDemoScenario = new ListDemoScenario();

  public constructor() {
    super('FormManageDemo');
  }
}

export class ListDemoCategory extends ListBase {
  // for later usage => private readonly _cm = new ContextMenu('listContextMenuDemoCategory');

  public constructor() {
    super('ListDemoCategory');
  }
}

export class ListDemoScenario extends ListBase {
  private readonly _cm = new ContextMenu('listContextMenuDemoScenario');
  private readonly _dlgCreateEditDemoScenario = new DialogCreateEditDemoScenario();

  public constructor() {
    super('ListDemoScenario');
  }

  /**
   * To open Demo Scenario dialog using "SaveAs" context menu
   * @param row Demo Scenario row to SaveAs demo scenario
   * @returns CreateEditDemoScenario Dialog
   */
  public async openDialogCreateEditDemoScenario(row: ListRow): Promise<DialogCreateEditDemoScenario> {
    await row.rightClick(undefined, this._cm, ListDemoScenarioContextMenuItem.SaveAs);
    await this._dlgCreateEditDemoScenario.waitUntilPresent();
    return this._dlgCreateEditDemoScenario;
  }

  /**
   * To Start Demo using "Start Demo" context menu
   * @param row Demo Scenario row to start demo scenario
   */
  public async startDemoScenario(row: ListRow): Promise<void> {
    await row.rightClick(undefined, this._cm, ListDemoScenarioContextMenuItem.StartDemo);
    await this.waitForScreenUpdate();
    const isDemoScenarioSelected = await this.getCellValueFromRow(ImgIsSelected.ColumnIndex, row, true);
    expect(isDemoScenarioSelected).toBe(ImgIsSelected.Selected, LogMessage.value_notMatched(ImgIsSelected.Selected, isDemoScenarioSelected));
  }
}

export enum ListDemoCategoryColumn {
  Name = 'Name',
}

export enum ListDemoScenarioColumn {
  Name = 'Name',
}

export enum ImgIsSelected {
  Selected = 'CHECK2',
  ColumnIndex = 1,
}

export enum ListDemoCategoryContextMenuItem {
  Create = 'MenuCreateDemoCategory',
  Rename = 'MenuRenameDemoCategory',
  Delete = 'MenuDeleteDemoCategory',
}

export enum ListDemoScenarioContextMenuItem {
  StartDemo = 'MenuStartDemo',
  Save = 'MenuSave',
  SaveAs = 'MenuSaveDemoAs',
  Rename = 'MenuRenameDemo',
  Delete = 'MenuDeleteDemo',
}
