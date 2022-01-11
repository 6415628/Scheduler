import { ActionBarPage } from '../../e2elib/lib/src/pageobjects/actionbarpage.component';
import { ButtonBase } from '../../libappbase/buttonbase';

export class ActionBarPageGanttChartResourceSchedule extends ActionBarPage {
  // Buttons
  public btnFreeze = new ButtonBase('ButtonFreezeInPanelScheduleOverview');
  public btnUnfreeze = new ButtonBase('ButtonUnfreezeInPanelScheduleOverview', 'ContextMenuUnfreezeInPanelScheduleOverview');

  public constructor() {
    super('GCActionBarPageResourceSchedule');
  }
}

export enum ButtonUnfreezeContextMenuItem {
  UnfreezeSelectedRecources = 'MenuUnfreezeOnSelectedResourceInPanelScheduleOverview',
  UnfreezeAllResources = 'MenuUnfreezeOnAllResourcesInPanelScheduleOverview',
}
