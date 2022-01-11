import { DialogBase } from '../../../libappbase/dialogbase';
import { PanelEvent, PanelSubscriber } from './';

export class DialogEvent extends DialogBase {
  public pnlEvent = new PanelEvent();
  public pnlSubscriber = new PanelSubscriber();

  public constructor() {
    super('LibCal_dlgEvent', 'LibCal_dlgEvent.btnOK', 'LibCal_dlgEvent.btnCancel');
  }
}
