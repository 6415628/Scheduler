import { DurationSelector } from '../../../e2elib/lib/src/pageobjects/durationselector.component';
import { CheckboxBase } from '../../../libappbase/checkboxbase';
import { PanelBase } from '../../../libappbase/panelbase';
import { OnHoldPeriod } from '../../data/data.configureproduction';
import { LogMessageSch } from '../../logmessagesch';

export interface InputResourceOnHoldPeriodFields {
  setOnHoldPeriodOnResource?: boolean;
  onHoldPeriod?: [OnHoldPeriod, OnHoldPeriod];
}
export class PanelOnHoldPeriod extends PanelBase {
  private readonly _cbSetOnHoldPeriodOnResource = new CheckboxBase('CheckboxOnHoldPeriodOnResource');
  private readonly _dsOnHoldPeriod = new DurationSelector('DurationSelectorOnHoldPeriodOnResource');

  public constructor() {
    super('PanelOnHoldPeriod');
  }

  /**
   * Update dialog values in On Hold Period panel
   *
   * @param values `InputOnHoldPeriodType` values of the On Hold Period to be updated
   *
   */
  public async updatePanelValues(values: InputResourceOnHoldPeriodFields): Promise<void> {
    if (values.setOnHoldPeriodOnResource !== undefined) {
      await this._cbSetOnHoldPeriodOnResource.toggle(values.setOnHoldPeriodOnResource);
    }
    if (values.onHoldPeriod) {
      await this._dsOnHoldPeriod.setHour(values.onHoldPeriod[0]);
      await this._dsOnHoldPeriod.setMinute(values.onHoldPeriod[1]);
    }
  }

  /**
   * Verify dialog values in On Hold Period panel with expected value
   *
   * @param values `InputResourceOnHoldPeriodFields` values of the Characteristics to be verified
   *
   */
  public async verifyPanelValues(values: InputResourceOnHoldPeriodFields): Promise<string> {
    let feedbacks: string[] = [];
    let actual = '';
    let pushFeedback = (dlgField: string, expectedValue: string, actualValue: string): void => {
      if (expectedValue !== actual) {
        feedbacks.push(LogMessageSch.dlg_field_notMatched(dlgField, expectedValue, actualValue));
      }
    };
    if (values.setOnHoldPeriodOnResource !== undefined) {
      actual = (await this._cbSetOnHoldPeriodOnResource.isChecked()).toString();
      pushFeedback(await this._cbSetOnHoldPeriodOnResource.getComponentLabel(), values.setOnHoldPeriodOnResource.toString(), actual);
    }
    if (values.onHoldPeriod) {
      actual = [await this._dsOnHoldPeriod.getHour(), await this._dsOnHoldPeriod.getMinute()].toString();
      pushFeedback(await this._dsOnHoldPeriod.getComponentLabel(), values.onHoldPeriod.toString(), actual);
    }

    return feedbacks.join('. \n');
  }
}
