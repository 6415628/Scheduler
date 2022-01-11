import { ActionBarPage } from '../../e2elib/lib/src/pageobjects/actionbarpage.component';
import { Label } from '../../e2elib/lib/src/pageobjects/label.component';
import { ButtonBase } from '../../libappbase/buttonbase';
import { AppScheduler } from '../appsch';

export class ActionBarPageFixed extends ActionBarPage {
  public btnUndo = new ButtonBase('btnStandardUndo');
  public readonly labelPlanDate = new Label('LabelPlanDate');
  private readonly _btnKPIDashboard = new ButtonBase('ButtonKPIDashboardScheduling');

  public constructor() {
    super('applicationFixedPageActionBarPageDef');
  }

  /**
   * Open left docked "KPI Dashboard" form if it is collapsed / minimized.
   * Wait until the form is stabled and then dock it.
   */
  public async openKPIDashboard(): Promise<void> {
    const formKPIDashboard = AppScheduler.getInstance().formKPIDashboard;
    await this._btnKPIDashboard.click();
    // Check if KPU Dashboard form is close
    if (formKPIDashboard.isOpen(false)) {
      await formKPIDashboard.restore();
    }
    await formKPIDashboard.waitUntilPresent();
    // Dock the form if it is not
    if (!(await formKPIDashboard.isdocked())) {
      await formKPIDashboard.dock();
    }
  }
}
