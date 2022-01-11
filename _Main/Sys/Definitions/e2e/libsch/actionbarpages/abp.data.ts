import { ActionBarPage } from '../../e2elib/lib/src/pageobjects/actionbarpage.component';
import { ButtonBase } from '../../libappbase/buttonbase';
import { ToastGlobal } from '../../libappbase/toastglobal';

export class ActionBarPageData extends ActionBarPage {
  // View Buttons
  public btnManageCalendarsView = new ButtonBase('ButtonManageCalendarsView');
  public btnConfigureIntegration = new ButtonBase('ButtonConfigureIntegrationView');
  public btnConfigureProduction = new ButtonBase('ButtonConfigureProductionEnvironmentView');

  // Action Buttons
  public btnPublishSchedule = new ButtonBase('ButtonPublishSchedule');
  public btnImportData = new ButtonBase('ButtonImportData', 'ContextMenuImportData');
  public btnImportSettings = new ButtonBase('ButtonImportSettings', 'ContextMenuImportSettings');

  public constructor() {
    super('applicationDataActionBarPageDef');
  }

  public async publishSchedule(): Promise<ToastGlobal> {
    await this.click();
    await this.btnPublishSchedule.click();

    return ToastGlobal.getInstance();
  }
}

export enum ButtonImportDataContextMenuItem {
  ERP = 'MenuImportFromERP',
  MPS = 'MenuImportFromMPS',
  MES = 'MenuImportFromMES',
}

export enum ButtonImportSettingsContextMenuItem {
  IntegrationConfiguration = 'MenuImportIntegrationSettings',
}

export enum PublishScheduleToastMessage {
  Success = 'Schedule published successfully.',
}
