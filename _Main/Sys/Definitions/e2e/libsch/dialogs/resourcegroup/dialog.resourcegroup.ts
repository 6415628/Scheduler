import { DialogBase } from '../../../libappbase/dialogbase';
import { PanelCharacteristics, PanelSubtaskSequence, PanelCampaignType, PanelTimeHorizon } from './';

export class DialogResourceGroup extends DialogBase {
  public pnlCharacteristics = new PanelCharacteristics();
  public pnlSubtaskSequence = new PanelSubtaskSequence();
  public pnlCampaignTypes = new PanelCampaignType();
  public pnlTimeHorizons = new PanelTimeHorizon();

  public constructor() {
    super('DialogCreateEditResourceGroup', 'ButtonOk', 'ButtonCancel');
  }
}
