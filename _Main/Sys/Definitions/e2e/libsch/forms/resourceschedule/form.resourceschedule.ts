import { Form } from '../../../e2elib/lib/src/pageobjects/form.component';
import { PanelResourceSequenceDetails, PanelScheduleOverview } from './';

export class FormResourceSchedule extends Form {
  public pnlResourceSequenceDetails = new PanelResourceSequenceDetails();
  public pnlScheduleOverview = new PanelScheduleOverview();

  public constructor() {
    super('FormResourceSchedule');
  }
}
