import { ActionBarPage } from '../../e2elib/lib/src/pageobjects/actionbarpage.component';
import { ButtonBase } from '../../libappbase/buttonbase';

export class ActionBarPageListResourceGroup extends ActionBarPage {
  // Buttons
  public btnCreate = new ButtonBase('ButtonCreateResource_ResourceGroup', 'ContextMenuCreateResource_ResourceGroup');
  public btnEdit = new ButtonBase('ButtonEditResource_ResourceGroup', 'ContextMenuEditResource_ResourceGroup');

  public constructor() {
    super('listActionBarPageResourceGroup');
  }
}

export enum ButtonCreateResourceContextMenuItem {
  ResourceGroup = 'MenuCreateResourceGroup',
  Resource = 'MenuCreateResource',
}

export enum ButtonEditResourceContextMenuItem {
  Edit = 'MenuEditResource_ResourceGroup',
  BatchEdit = 'MenuBatchEditResource',
}
