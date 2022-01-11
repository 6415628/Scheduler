import { ActionBarPage } from '../../e2elib/lib/src/pageobjects/actionbarpage.component';
import { ButtonBase } from '../../libappbase/buttonbase';
import { getHtmlContent } from '../../libappbase/utils';

export class ActionBarPageManageWorkOrders extends ActionBarPage {
  // View Buttons
  public btnManageOrders = new ButtonBase('ButtonManageOrdersView');

  // Action Buttons
  public btnConvertMPSPlannedOrder = new ButtonBase('ButtonConvertMPSPlannedOrder');
  public btnCreateWorkOrder = new ButtonBase('ButtonCreateWorkOrder');
  public btnEditWorkOrder = new ButtonBase('ButtonEditWorkOrder');
  public btnDeleteWorkOrder = new ButtonBase('ButtonDeleteWorkOrder');
  public btnSplitPlannedOrder = new ButtonBase('ButtonSplitPlannedOrder');
  public btnJoinPlannedOrder = new ButtonBase('ButtonJoinPlannedOrder');

  public constructor() {
    super('ActionBarPageManageWorkOrders');
  }

  /**
   * Get tooltip feedback text on Delete button in action bar when a planned firm order is selected
   *
   * @returns Tooltip text
   */
  public async getButtonManageOrdersTooltip(): Promise<string> {
    const tooltipInHtml = await this.btnManageOrders.getTooltip(1000, false);
    const tooltipArray = getHtmlContent(tooltipInHtml);
    const tooltip = tooltipArray[tooltipArray.length - 1];
    return tooltip;
  }
}
