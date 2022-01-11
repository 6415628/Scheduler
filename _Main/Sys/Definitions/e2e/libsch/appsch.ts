import { AppBase } from '../libappbase/appbase';
import {
  ActionBarPageDevelop,
  ActionBarPageSchedule,
  ActionBarPageData,
  ActionBarPageManageWorkOrders,
  ActionBarPageFixed,
  ActionBarPageGanttChartResourceSchedule,
  ActionBarPageManageMaterials,
  ActionBarPageHome,
  ActionBarPageListResourceGroup,
  ActionBarPageConfigure,
} from './actionbarpages';
import { ViewIntegration, ViewManageOrders, ViewReserveMaterial, ViewSchedule, ViewManageCalendars, ViewConfigureProduction, ViewOperationBatching } from './views';
import { convertDateToUTC } from '../libappbase/timeutils';
import { FormKPIDashboard } from './forms/form.kpidashboard';

export class AppScheduler extends AppBase {
  private static _appScheduler: AppScheduler;

  // Action Bar Pages
  public abpHome = new ActionBarPageHome();
  public abpData = new ActionBarPageData();
  public abpManageWorkOrders = new ActionBarPageManageWorkOrders();
  public abpManageMaterials = new ActionBarPageManageMaterials();
  public abpSchedule = new ActionBarPageSchedule();
  public abpDevelop = new ActionBarPageDevelop();
  public abpConfigure = new ActionBarPageConfigure();
  public abpGanttChartResourceSchedule = new ActionBarPageGanttChartResourceSchedule();
  public abpListResourceGroup = new ActionBarPageListResourceGroup();
  public abpFixed = new ActionBarPageFixed();

  // Views
  // Data
  public viewManageCalendars = new ViewManageCalendars();
  public viewIntegration = new ViewIntegration();
  public viewConfigureProduction = new ViewConfigureProduction();
  // Manage Materials
  public viewReserveMaterial = new ViewReserveMaterial();
  // Manage Work Orders
  public viewManageOrders = new ViewManageOrders();
  // Schedule
  public viewOperationBatching = new ViewOperationBatching();
  public viewSchedule = new ViewSchedule();

  // Forms (docked left)
  public formKPIDashboard = new FormKPIDashboard();

  /**
   * Returns the singleton instance of AppScheduler.
   *
   * @returns singleton instance of AppScheduler
   */
  public static getInstance(): AppScheduler {
    if (this._appScheduler === undefined) {
      this._appScheduler = new AppScheduler();
    }

    return this._appScheduler;
  }

  public async switchToDemoScenario(demoCategory: string, demoScenario: string): Promise<void> {
    await this.abpDevelop.click();
    const dlgImportDemoScenario = await this.abpDevelop.openImportDatasetDialog();
    await dlgImportDemoScenario.importDemo(demoCategory, demoScenario);
  }

  public async cleanUpDataset(): Promise<void> {
    await this.abpDevelop.click();
    await this.abpDevelop.cleanUpDataset();
  }

  /**
   * Get the planning date from the fixed action bar page
   *
   * @param isUTC Indicate whether the return date should be in UTC
   */
  public async getPlanDate(isUTC: boolean = true): Promise<Date> {
    let dateStr = await this.abpFixed.labelPlanDate.getText();
    let date = new Date(dateStr);

    if (isUTC) {
      return convertDateToUTC(date);
    }

    return date;
  }
}
