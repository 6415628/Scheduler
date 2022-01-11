import { DialogBase } from '../../../libappbase/dialogbase';
import { PanelCharacteristics, PanelCalendarStrategy, PanelLeadTimeStrategy, PanelFrozenHorizon, PanelOnHoldPeriod } from '.';

export class DialogResource extends DialogBase {
  public pnlCharacteristics = new PanelCharacteristics();
  public pnlCalendarStrategy = new PanelCalendarStrategy();
  public pnlLeadTimeStrategy = new PanelLeadTimeStrategy();
  public pnlFrozenHorizon = new PanelFrozenHorizon();
  public pnlOnHoldPeriod = new PanelOnHoldPeriod();

  public constructor() {
    super('DialogCreateEditResource', 'ButtonOk', 'ButtonCancel');
  }
}
