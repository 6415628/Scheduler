import { DialogBase } from '../../libappbase/dialogbase';
import { ListBase } from '../../libappbase/listbase';

export class DialogForm extends DialogBase {
  public listForms = new ListForms();

  public constructor() {
    super('frmFormList', 'btnOk', ''); // Note: There is no Cancel button for this dialog
  }
}

export class ListForms extends ListBase {
  public constructor() {
    super('lstForms');
  }

  public async openForm(formTitle: string): Promise<void> {
    await this.searchList(ListFormsColumn.Title, formTitle);
    const formRow = (await this.getInboundSelectedRows())[0];
    await formRow.doubleClick();
  }
}

export enum ListFormsColumn {
  Title = 'Title',
  Name = 'Name',
  Namespace = 'Namespace',
}

export enum ListFormsContextMenuItem {
  Open = 'mnOpen',
  OpenDockLeft = 'mnOpenLeft',
  OpenDockRight = 'mnOpenRight',
  OpenPopup = 'mnOpenPopup',
  OpenModal = 'mnOpenModal',
}
