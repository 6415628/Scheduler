import { EditField } from '../../../e2elib/lib/src/pageobjects/editfield.component';
import { PanelBase } from '../../../libappbase/panelbase';
import { ResourceID, ResourceMaxBatchSize, ResourceName } from '../../data/data.resource';
import { NumberPicker } from '../../../e2elib/lib/src/pageobjects/numberpicker.component';

export interface InputResourceCharacteristicsFields {
  resourceID?: ResourceID;
  resourceName?: ResourceName;
  maxBatchSize?: ResourceMaxBatchSize;
}

export class PanelCharacteristics extends PanelBase {
  // Edit fields
  private readonly _efResourceID = new EditField('EditFieldResourceID');
  private readonly _efResourceName = new EditField('EditFieldResourceName');

  // Number picker
  private readonly _npMaxBatchSize = new NumberPicker('NumberPickerMaxBatchSize');

  public constructor() {
    super('PanelCharacteristics');
  }

  /**
   * Update dialog values in Characteristics panel
   *
   * @param values `InputCharacteristicsType` values of the characteristics to be updated
   *
   */
  public async updateDialogValues(values: InputResourceCharacteristicsFields): Promise<void> {
    if (values.resourceID) {
      await this._efResourceID.sendInput(values.resourceID);
    }
    if (values.resourceName) {
      await this._efResourceName.sendInput(values.resourceName);
    }
    if (values.maxBatchSize) {
      await this._npMaxBatchSize.sendInput(values.maxBatchSize);
    }
  }
}
