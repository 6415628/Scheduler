import { DurationSelector } from '../../../e2elib/lib/src/pageobjects/durationselector.component';
import { CheckboxBase } from '../../../libappbase/checkboxbase';
import { PanelBase } from '../../../libappbase/panelbase';
import { OnHoldPeriod } from '../../data/data.configureproduction';
import { LogMessageSch } from '../../logmessagesch';

export interface InputResourceGroupTimeHorizonFields {
  setOnHoldPeriodForResourceGroup?: boolean;
  onHoldPeriod?: [OnHoldPeriod, OnHoldPeriod];
}
export class PanelTimeHorizon extends PanelBase {
  private readonly _cbSetOnHoldPeriodForResourceGroup = new CheckboxBase('CheckBoxSetOnHoldPeriodForResourceGroup');
  private readonly _dsOnHoldPeriod = new DurationSelector('DurationSelectorOnHoldPeriod');

  public constructor() {
    super('PanelTimeHorizon');
  }

  /**
   * Update dialog values in Time Horizon panel
   *
   * @param values `InputTimeHorizonType` values of the Time Horizon to be updated
   *
   */
  public async updatePanelValues(values: InputResourceGroupTimeHorizonFields): Promise<void> {
    if (values.setOnHoldPeriodForResourceGroup !== undefined) {
      await this._cbSetOnHoldPeriodForResourceGroup.toggle(values.setOnHoldPeriodForResourceGroup);
    }
    if (values.onHoldPeriod) {
      await this._dsOnHoldPeriod.setHour(values.onHoldPeriod[0]);
      await this._dsOnHoldPeriod.setMinute(values.onHoldPeriod[1]);
    }
  }

  /**
   * Verify the dialog values in Time Horizon panel with expected value
   *
   * @param values `InputResourceGroupTimeHorizonFields` values of the Characteristics to be verified
   *
   */
  public async verifyPanelValues(values: InputResourceGroupTimeHorizonFields): Promise<string> {
    let feedbacks: string[] = [];
    let actual = '';
    let pushFeedback = (dlgField: string, expectedValue: string, actualValue: string): void => {
      if (expectedValue !== actual) {
        feedbacks.push(LogMessageSch.dlg_field_notMatched(dlgField, expectedValue, actualValue));
      }
    };
    if (values.setOnHoldPeriodForResourceGroup !== undefined) {
      actual = (await this._cbSetOnHoldPeriodForResourceGroup.isChecked()).toString();
      pushFeedback(await this._cbSetOnHoldPeriodForResourceGroup.getComponentLabel(), values.setOnHoldPeriodForResourceGroup.toString(), actual);
    }
    if (values.onHoldPeriod) {
      actual = [await this._dsOnHoldPeriod.getHour(), await this._dsOnHoldPeriod.getMinute()].toString();
      pushFeedback(await this._dsOnHoldPeriod.getComponentLabel(), values.onHoldPeriod.toString(), actual);
    }

    return feedbacks.join('. \n');
  }
}
