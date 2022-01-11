import { Form } from '../../e2elib/lib/src/pageobjects/form.component';
import { ListRow } from '../../e2elib/lib/src/pageobjects/list/listrow.component';
import { ContextMenuBase } from '../../libappbase/contextmenubase';
import { ListBase } from '../../libappbase/listbase';
import { ActionTriggerType } from '../../libappbase/utils';
import { ButtonCreateResourceContextMenuItem, ButtonEditResourceContextMenuItem } from '../actionbarpages/abp.listresourcegroup';
import { AppScheduler } from '../appsch';
import { DialogResource } from '../dialogs/resource';
import { DialogResourceGroup } from '../dialogs/resourcegroup';

export class FormProductionEnvironment extends Form {
  public listResourceGroup = new ListResourceGroup();

  public constructor() {
    super('FormProductionEnvironment');
  }
}

export class ListResourceGroup extends ListBase {
  private readonly _cmResourceGroup = new ContextMenuBase('listContextMenuResourceGroup');
  private readonly _dlgResourceGroup = new DialogResourceGroup();
  private readonly _dlgResource = new DialogResource();

  public constructor() {
    super('ListResourceGroup');
  }

  /**
   * To open Resource Group dialog using "Create" / "Edit" context menu or action bar page button
   * @param via Perform action via button or context menu
   * @param row [Optional] Target list row to edit
   * @returns ResourceGroup Dialog
   */
  public async openDialogResourceGroup(via: ActionTriggerType, row?: ListRow): Promise<DialogResourceGroup> {
    switch (via) {
      case ActionTriggerType.Button:
        const appSch = AppScheduler.getInstance();
        const abpListResourceGroup = appSch.abpListResourceGroup;
        if (row) {
          await this.selectRows([row]);
          await abpListResourceGroup.btnEdit.clickDropdown(ButtonEditResourceContextMenuItem.Edit);
        } else {
          await this.focus();
          await abpListResourceGroup.btnCreate.clickDropdown(ButtonCreateResourceContextMenuItem.ResourceGroup);
        }
        break;
      case ActionTriggerType.ContextMenu:
        if (row) {
          await row.rightClick(undefined, this._cmResourceGroup, ListResourceGroupContextMenuItem.Edit);
        } else {
          await this.rightClick(undefined, this._cmResourceGroup, ListResourceGroupContextMenuItem.CreateResourceGroup);
        }
        break;
      default:
        break;
    }
    await this._dlgResourceGroup.waitUntilPresent();
    return this._dlgResourceGroup;
  }

  /**
   * To open Resource dialog using "Create" / "Edit" context menu or action bar page button
   * @param via Perform action via button or context menu
   * @param row resource group row to create resource or resource row to edit
   * @returns Resource Dialog
   */
  public async openDialogResource(via: ActionTriggerType, row: ListRow): Promise<DialogResource> {
    // Detect if open dialog is for edit or create by checking if a row is resource group or group
    const isEdit = await row.getParentRow();
    switch (via) {
      case ActionTriggerType.Button:
        const appSch = AppScheduler.getInstance();
        const abpListResourceGroup = appSch.abpListResourceGroup;
        await this.selectRows([row]);
        if (isEdit) {
          await abpListResourceGroup.btnEdit.clickDropdown(ButtonEditResourceContextMenuItem.Edit);
        } else {
          await abpListResourceGroup.btnCreate.clickDropdown(ButtonCreateResourceContextMenuItem.Resource);
        }
        break;
      case ActionTriggerType.ContextMenu:
        if (isEdit) {
          await row.rightClick(undefined, this._cmResourceGroup, ListResourceGroupContextMenuItem.Edit);
        } else {
          await row.rightClick(undefined, this._cmResourceGroup, ListResourceGroupContextMenuItem.CreateResource);
        }
        break;
      default:
        break;
    }
    await this._dlgResource.waitUntilPresent();
    return this._dlgResource;
  }
}

export enum ListResourceGroupParentColumn {
  Name = 'Name',
  Type = 'Type',
  HasOnlySuppotedSubtasks = 'HasOnlySuppotedSubtasks',
}

export enum ListResourceGroupChildColumn {
  Name = 'Name',
  Type = 'Type',
  ResourceID = 'ResourceID',
}

export enum ListResourceGroupContextMenuItem {
  CreateResourceGroup = 'MenuCreateNewResourceGroup',
  CreateResource = 'MenuCreateNewResource',
  Edit = 'MenuEditResourceGroup_Resource',
  EditMultipleResources = 'MenuBatchEditResources',
  Delete = 'MenuDeleteResourceGroup_Resource',
  MoveUp = 'MenuMoveUp',
  MoveDownh = 'MenuMoveDown',
}
