import { DropDownStringListBase } from '../../libappbase/dropdownstringlistbase';
import { DialogBase } from '../../libappbase/dialogbase';
import { EditField } from '../../e2elib/lib/src/pageobjects/editfield.component';
import { DemoCategory, DemoScenario } from '../data/data.scenario';

export interface InputDemoScenarioDialogFields {
  demoCategory: DemoCategory;
  demoScenarioName: DemoScenario;
}

export class DialogCreateEditDemoScenario extends DialogBase {
  private readonly _ddsldemoCategory = new DropDownStringListBase('DropDownStringListDemoCategory');
  private readonly _efName = new EditField('EditFieldDemoScenarioName');

  public constructor() {
    super('DialogCreateEditDemoScenario', 'ButtonOk', 'ButtonCancel');
  }

  /**
   * Update dialog values
   *
   * @param values `InputDemoScenarioDialogFields` values of the dialog fields to be updated
   */
  public async updateDialogValues(values: InputDemoScenarioDialogFields): Promise<void> {
    await this._ddsldemoCategory.selectItem(values.demoCategory);
    await this._efName.sendInput(values.demoScenarioName);
  }
}
