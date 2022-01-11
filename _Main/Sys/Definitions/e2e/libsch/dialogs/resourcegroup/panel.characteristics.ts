import { EditField } from '../../../e2elib/lib/src/pageobjects/editfield.component';
import { CheckboxBase } from '../../../libappbase/checkboxbase';
import { PanelBase } from '../../../libappbase/panelbase';
import { ResourceGroupName, ResourceType } from '../../data/data.resource';
import { OperationType } from '../../data/data.workorder';
import { DropDownStringListBase } from '../../../libappbase/dropdownstringlistbase';
import { LogMessageSch } from '../../logmessagesch';

export interface InputResourceGroupCharacteristicsFields {
  name?: ResourceGroupName;
  operationType?: OperationType;
  resourceType?: ResourceType;
  hasPractice?: boolean;
  isBottleneck?: boolean;
  hasFixedSequencePlanLogic?: boolean;
  planRelatedOperations?: boolean;
}

export class PanelCharacteristics extends PanelBase {
  // Edit fields
  private readonly _efName = new EditField('EditFieldName');
  private readonly _efOperationType = new EditField('EditFieldOperationType');
  private readonly _ddslResourceType = new DropDownStringListBase('DropDownStringListResourceType');

  // Checkboxes
  private readonly _cbHasPractice = new CheckboxBase('CheckboxHasPractice');
  private readonly _cbIsBottleneck = new CheckboxBase('CheckboxIsBottleneck');
  private readonly _cbHasFixedSequencePlanLogic = new CheckboxBase('CheckboxHasFixedSequencePlanLogic');
  private readonly _cbPlanRelatedOperations = new CheckboxBase('CheckboxPlanRelatedOperations');

  public constructor() {
    super('PanelCharacteristics');
  }

  /**
   * Update dialog values in Characteristics panel
   *
   * @param values `InputCharacteristicsType` values of the characteristics to be updated
   *
   */
  public async updateDialogValues(values: InputResourceGroupCharacteristicsFields): Promise<void> {
    if (values.name) {
      await this._efName.sendInput(values.name);
    }
    if (values.operationType) {
      await this._efOperationType.sendInput(values.operationType);
    }
    if (values.resourceType) {
      await this._ddslResourceType.selectItem(values.resourceType);
    }
    if (values.hasPractice !== undefined) {
      await this._cbHasPractice.toggle(values.hasPractice);
    }
    if (values.isBottleneck !== undefined) {
      await this._cbIsBottleneck.toggle(values.isBottleneck);
    }
    if (values.hasFixedSequencePlanLogic !== undefined) {
      await this._cbHasFixedSequencePlanLogic.toggle(values.hasFixedSequencePlanLogic);
    }
    if (values.planRelatedOperations !== undefined) {
      await this._cbPlanRelatedOperations.toggle(values.planRelatedOperations);
    }
  }

  /**
   * Verify the field values in Resource Group dialog in Characteristics panel with expected value
   *
   * @param values `InputResourceGroupCharacteristicsFields` values of the Characteristics to be verified
   *
   */
  public async verifyDialogPanelValues(values: InputResourceGroupCharacteristicsFields): Promise<string> {
    let feedbacks: string[] = [];
    let actual = '';
    let pushFeedback = (dlgField: string, expectedValue: string, actualValue: string): void => {
      if (expectedValue !== actual) {
        feedbacks.push(LogMessageSch.dlg_field_notMatched(dlgField, expectedValue, actualValue));
      }
    };
    if (values.name) {
      actual = await this._efName.getText();
      pushFeedback(await this._efName.getComponentLabel(), values.name, actual);
    }
    if (values.operationType) {
      actual = await this._efOperationType.getText();
      pushFeedback(await this._efOperationType.getComponentLabel(), values.operationType, actual);
    }
    if (values.resourceType) {
      actual = await this._ddslResourceType.getSelectedString();
      pushFeedback(await this._ddslResourceType.getComponentLabel(), values.resourceType, actual);
    }
    if (values.hasPractice !== undefined) {
      actual = (await this._cbHasPractice.isChecked()).toString();
      pushFeedback(await this._cbHasPractice.getComponentLabel(), values.hasPractice.toString(), actual);
    }
    if (values.isBottleneck !== undefined) {
      actual = (await this._cbIsBottleneck.isChecked()).toString();
      pushFeedback(await this._cbIsBottleneck.getComponentLabel(), values.isBottleneck.toString(), actual);
    }
    if (values.hasFixedSequencePlanLogic !== undefined) {
      actual = (await this._cbHasFixedSequencePlanLogic.isChecked()).toString();
      pushFeedback(await this._cbHasFixedSequencePlanLogic.getComponentLabel(), values.hasFixedSequencePlanLogic.toString(), actual);
    }
    if (values.planRelatedOperations !== undefined) {
      actual = (await this._cbPlanRelatedOperations.isChecked()).toString();
      pushFeedback(await this._cbPlanRelatedOperations.getComponentLabel(), values.planRelatedOperations.toString(), actual);
    }

    return feedbacks.join('. \n');
  }
}
