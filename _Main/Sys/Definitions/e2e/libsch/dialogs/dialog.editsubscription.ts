import { DialogBase } from '../../libappbase/dialogbase';
import { CheckboxBase } from '../../libappbase/checkboxbase';
import { DateTimeSelectorBase } from '../../libappbase/datetimeselectorbase';

export class DialogEditSubscription extends DialogBase {
  private readonly _cbAllOccurrences = new CheckboxBase('ckbAllOccurrences');
  private readonly _cbPeriodOfTime = new CheckboxBase('ckbPeriodOfTime');
  private readonly _cbEndOfPeriod = new CheckboxBase('ckbEndOfPeriod');

  private readonly _dtsPeriodStart = new DateTimeSelectorBase('dsStartOfPeriod');
  private readonly _dtsPeriodEnd = new DateTimeSelectorBase('dsEndOfPeriod');

  public constructor() {
    super('LibCal_dlgSubscription', 'btnOk', 'btnCancel');
  }

  public async updateDialog(values: InputEditSubscriptionFields): Promise<void> {
    if (values.isAllOccurrences !== undefined) {
      await this._cbAllOccurrences.toggle(values.isAllOccurrences);
    }
    if (values.isPeriodOfTime !== undefined) {
      await this._cbPeriodOfTime.toggle(values.isPeriodOfTime);
    }
    if (values.periodStart) {
      await this._dtsPeriodStart.setDate(values.periodStart);
    }
    if (values.periodEnd) {
      await this._cbEndOfPeriod.toggle(true);
      await this._dtsPeriodEnd.setDate(values.periodEnd);
    }
  }
}

export interface InputEditSubscriptionFields {
  isAllOccurrences?: boolean;
  isPeriodOfTime?: boolean;
  isEndOfPeriod?: boolean;
  periodStart?: Date;
  periodEnd?: Date;
}
