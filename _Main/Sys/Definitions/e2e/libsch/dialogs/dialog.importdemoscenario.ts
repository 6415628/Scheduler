import { browser } from '../../e2elib/node_modules/protractor';
import { DropDownStringListBase } from '../../libappbase/dropdownstringlistbase';
import { DialogBase } from '../../libappbase/dialogbase';
import { ButtonBase } from '../../libappbase/buttonbase';

export class DialogImportDemoScenario extends DialogBase {
  public ddsldemoCategory: DropDownStringListBase;
  public ddsldemoScenario: DropDownStringListBase;
  public btnApply: ButtonBase;

  public constructor() {
    super('DialogImportDemoScenario', 'ButtonOk', 'ButtonCancel');
    this.ddsldemoCategory = new DropDownStringListBase('DropDownStringListDemoCategories');
    this.ddsldemoScenario = new DropDownStringListBase('DropDownStringListDemoScenarios');
    this.btnApply = new ButtonBase('ButtonApply');
  }

  public async importDemo(demoCategory: string, demoScenario: string): Promise<void> {
    await this.ddsldemoCategory.selectItem(demoCategory);
    // Wait until Demo Scenario dropdown items are populated completely
    await browser.wait(async () => (await this.ddsldemoScenario.getDropDownItemsCount()) > 0, 3000, 'data for Demo Scenario dropdown is not populated within 3 seconds');
    await this.ddsldemoScenario.selectItem(demoScenario);
    await this.btnOk.click();
    await this.waitUntilHidden(20000);
  }
}
