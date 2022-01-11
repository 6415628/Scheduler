import { Form } from '../../e2elib/lib/src/pageobjects/form.component';
import { NumberPicker } from '../../e2elib/lib/src/pageobjects/numberpicker.component';
import { DurationSelector } from '../../e2elib/lib/src/pageobjects/durationselector.component';
import { DropDownStringListBase } from '../../libappbase/dropdownstringlistbase';
import { EditField } from '../../e2elib/lib/src/pageobjects/editfield.component';
import { ButtonBase } from '../../libappbase/buttonbase';
import { PanelBase } from '../../libappbase/panelbase';

export class FormIntegrationConfiguration extends Form {
  public nmpSanityCheckLimit = new NumberPicker('NumberPickerSanityCheckLimit');
  public pnlMPSIntegration = new PanelMPSIntegration();
  private readonly btnApply = new ButtonBase('ButtonApplyIntegration');

  public constructor() {
    super('FormIntegrationConfiguration');
  }

  /**
   * Set some new values for MPS Integration
   * The method sets new Sanity Check Limit, MPS Plan Horizon and MPS Source
   *
   * @param sanityCheckLimit : string - Sanity Check Limit
   * @param mpsPlanHorizon : string - MPS Plan Horizon
   * @param mpsSource : string - MPS Source
   */
  public async setMPSIntegrationValues(sanityCheckLimit: string, mpsPlanHorizon: string, mpsSource: string): Promise<void> {
    await this.nmpSanityCheckLimit .sendInput(sanityCheckLimit);
    await this.pnlMPSIntegration.setMPSIntegrationValues(mpsPlanHorizon, mpsSource);
    // Click Apply button after setting new values above
    await this.btnApply.click();
  }

  /**
   * Update export path for execution run in auto test environment ONLY
   *
   * @param mpsExportPath : string - MPS Export Path
   */
  public async setMPSExportPath(mpsExportPath: string): Promise<void> {
    await this.pnlMPSIntegration.efMPSExportPath.sendInput(mpsExportPath);
    await this.btnApply.click();
  }
}

export class PanelMPSIntegration extends PanelBase {
  public dsMPSPlanHorizon = new DurationSelector('DurationSelectorMPSPlanHorizon');
  public ddslMPSSource = new DropDownStringListBase('DropDownStringListMPSSource');
  public efMPSExportPath = new EditField('EditFieldMPSExportPath');

  public constructor() {
    super('PanelMPSIntegration');
  }

  /**
   * Sets values for MPS Integration.
   *
   * @param mpsPlanHorizon string - MPS Plan Horizon
   * @param mpsSource string - MPS Source
   */
  public async setMPSIntegrationValues(mpsPlanHorizon: string, mpsSource: string): Promise<void> {
    await this.dsMPSPlanHorizon.setDay(mpsPlanHorizon);
    await this.ddslMPSSource.selectItem(mpsSource);
  }
}
