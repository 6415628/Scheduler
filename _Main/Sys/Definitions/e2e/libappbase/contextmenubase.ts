/**
 * @file Context Menu component base class
 * @description Allow to check whether Menu Item in Context menu is clickable.
 * @author      Wong Jia Hui (jiahui.wong@3ds.com)
 * @copyright   Dassault Systèmes
 */
import { ContextMenu } from '../e2elib/lib/src/pageobjects/contextmenu/contextmenu.component';

export class ContextMenuBase extends ContextMenu {
  /**
   * To check if a menu item in context menu is able to click
   *
   * @param menuItemName Name of target menu item
   * @param waitTime [Default = 1000] miliseconds of how long it should wait for Menu Item in context menu to be clickable.
   * @return boolean to indicate whether pass-in menu item is clickable
   */
  public async isMenuItemClickable(menuItemName: string | string[], waitTime: number = 1000): Promise<boolean> {
    await this.waitForScreenUpdate(waitTime);

    return !(await this.isDisabled(menuItemName));
  }

  /**
   * To verify if pass-in menu item in context menu is clickable
   *
   * @param menuItemName Name of target menu item
   * @return An array of combination of boolean and string, where boolean indicate whether the menuItem is clickable and string inidcate the disabled tooltip
   */
  public async verifyIsMenuItemClickable(menuItemName: string | string[]): Promise<[boolean, string]> {
    let contextMenuDisabledTooltip = '';
    let isClickable = await this.isMenuItemClickable(menuItemName);
    if (!isClickable) {
      contextMenuDisabledTooltip = await this.getToolTip(menuItemName);
    }
    return [isClickable, contextMenuDisabledTooltip];
  }
}
