import { ActionBarPage } from '../../e2elib/lib/src/pageobjects/actionbarpage.component';
import { ButtonBase } from '../../libappbase/buttonbase';
import { getHtmlContent } from '../../libappbase/utils';

export class ActionBarPageSchedule extends ActionBarPage {
  // View Buttons
  public btnOperationBatching = new ButtonBase('ButtonOperationBatching');
  public btnSchedule = new ButtonBase('ButtonScheduleView');

  // Action Buttons
  public btnPlanOnEarliest = new ButtonBase('ButtonPlanOnEarliestResource');
  public btnPlanOnSelected = new ButtonBase('ButtonPlanOnResource');
  public btnUnplan = new ButtonBase('ButtonUnplan');
  public btnMarkForRelease = new ButtonBase('ButtonMarkForRelease');
  public btnCancelRelease = new ButtonBase('ButtonCancelRelease');

  public constructor() {
    super('ActionBarPageSchedule');
  }

  /**
   * Get the tooltip of Mark for release button. Note: before using this method the work orders should be selected first.
   *
   * @returns the tooltip string
   */
  public async getButtonMarkForReleaseTooltip(): Promise<string> {
    const tooltipRaw = await this.btnMarkForRelease.getTooltip(1000, false);
    const tooltipArray = getHtmlContent(tooltipRaw);
    const tooltip = tooltipArray[tooltipArray.length - 1];
    return tooltip;
  }
}
