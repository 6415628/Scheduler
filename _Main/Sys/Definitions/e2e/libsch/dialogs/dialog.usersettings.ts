import { ButtonBase } from '../../libappbase/buttonbase';
import { DialogBase } from '../../libappbase/dialogbase';
import { DropDownListBase } from '../../libappbase/dropdownlistbase';
import { DropDownStringListBase } from '../../libappbase/dropdownstringlistbase';
import { ColorScheme, Language, Locale, Representation } from '../data/data.usersettings';

export class DialogUserSettings extends DialogBase {
  private readonly _ddlRepresentation = new DropDownListBase('DropDownListRepresentation');
  private readonly _ddlColorSchemes = new DropDownListBase('DropDownListColorSchemes');
  private readonly _ddslLanguage = new DropDownStringListBase('DropDownStringListLanguage');
  private readonly _ddslLocale = new DropDownStringListBase('DropDownStringListLocale');

  private readonly _btnReset = new ButtonBase('ButtonReset');

  public constructor() {
    super('frmUserSettings', 'ButtonOK', 'ButtonCancel');
  }

  /**
   * Update dialog values in User Settings
   *
   * @param values `InputUserSettingsFields` values of the User Settings to be updated
   *
   */
  public async updateDialogValues(values: InputUserSettingsFields): Promise<void> {
    if (values.representation) {
      await this._ddlRepresentation.selectItem(values.representation);
    }
    if (values.colorScheme) {
      await this._ddlColorSchemes.selectItem(values.colorScheme);
    }
    if (values.language) {
      await this._ddslLanguage.selectItem(values.language);
    }
    if (values.locale) {
      await this._ddslLocale.selectItem(values.locale);
    }

    await this.btnOk.click();
  }

  /**
   * Reset User Settings
   */
  public async resetUserSettings(): Promise<void> {
    await this._btnReset.click();
  }
}

export interface InputUserSettingsFields {
  representation?: Representation;
  colorScheme?: ColorScheme;
  language?: Language;
  locale?: Locale;
}
