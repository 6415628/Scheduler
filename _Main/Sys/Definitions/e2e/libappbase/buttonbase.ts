/**
 * @file        Button component base class
 * @description allow to check is button clickable and get tooltip value
 * @author      Wong Jia Hui (jiahui.wong@3ds.com)
 * @copyright   Dassault Systèmes
 */
import { QUtils } from '../e2elib/lib/src/main/qutils.class';
import { Button } from '../e2elib/lib/src/pageobjects/button/button.component';
import { ContextMenuBase } from './contextmenubase';
import { LogMessage } from './logmessage';

export class ButtonBase extends Button {
  public contextMenu: ContextMenuBase;

  public constructor(buttonComponentPath: string, contextMenuComponentPath?: string) {
    super(buttonComponentPath);
    if (contextMenuComponentPath) {
      this.contextMenu = new ContextMenuBase(contextMenuComponentPath);
    }
  }

  public async clickDropdown(): Promise<void>;

  /**
   * Perform click on button contains dropdown
   *
   * @param menuPath [Optional] Menu name of the menu in contextmenu
   *
   * @return A tuple of boolean and string, where boolean indicate whether the context menu is clickable and string inidcate the disabled tooltip
   */
  public async clickDropdown(menuPath: string | string[]): Promise<[boolean, string]>;

  public async clickDropdown(menuPath?: string | string[]): Promise<void | [boolean, string]> {
    if (this.contextMenu) {
      await this.waitForScreenUpdate(2000); // Wait for 2 second to prevent button state not finish updated
      await super.clickDropdown();
      await this.contextMenu.waitUntilPresent();
      const isContextMenuVisible = await this.contextMenu.isVisible();
      expect(isContextMenuVisible).toBe(true, LogMessage.contextMenu_notVisible());

      if (menuPath) {
        let [isMenuItemClickable, menuItemTooltip] = await this.contextMenu.verifyIsMenuItemClickable(menuPath);

        if (isMenuItemClickable) {
          await this.contextMenu.selectMenuItem(menuPath);
        }
        return [isMenuItemClickable, menuItemTooltip];
      }
    }
  }

  /**
   * Get button tooltip message
   *
   * @param waitTime [Optional] miliseconds of how long it should wait for Button to be updates.
   * @param isEscapeHTMLCharacter [Optional] boolean to indicate whether to escape HTML character on returned tooltip. Default = true
   * @returns button tooltip string
   */
  public async getTooltip(waitTime?: number, isEscapeHTMLCharacter?: boolean): Promise<string> {
    await this.waitForScreenUpdate(waitTime);
    return QUtils.getTooltip(this.tooltipElement, true, isEscapeHTMLCharacter);
  }

  /**
   * To check if a button is able to click
   *
   * @param waitTime [Default = 1000] miliseconds of how long it should wait for Ok Button to be clickable.
   * @returns boolean to indicate whether the button can be click
   */
  public async isClickable(waitTime: number = 1000): Promise<boolean> {
    await this.waitForScreenUpdate(waitTime);
    return !(await this.isDisabled());
  }

  /**
   * To verify if button is clickable
   * @param waitTime [Optional] miliseconds of how long it should wait for Button to be updates.
   * @param isEscapeHTMLCharacter [Optional] boolean to indicate whether to escape HTML character on returned tooltip. Default = true
   * @return A tuple of boolean and string, where boolean indicate whether the button is clickable and string indicate the disabled tooltip
   */
  public async verifyIsButtonClickable(waitTime?: number, isEscapeHTMLCharacter?: boolean): Promise<[boolean, string]> {
    let btnDisabledTooltip = '';
    let isOkbuttonClicked = await this.isClickable(waitTime);
    if (!isOkbuttonClicked) {
      btnDisabledTooltip = await this.getTooltip(waitTime, isEscapeHTMLCharacter);
    }
    return [isOkbuttonClicked, btnDisabledTooltip];
  }
}

export interface Modifiers {
  alt?: boolean;
  shift?: boolean;
  control?: boolean;
  meta?: boolean;
}
