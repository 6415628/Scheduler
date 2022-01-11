import { QConsole } from '../e2elib/lib/src/helper/qconsole';
import { QLogType } from '../e2elib/lib/src/main/qlogtype.enum';
import { QUtils } from '../e2elib/lib/src/main/qutils.class';
import { WebLogin } from '../e2elib/lib/src/pageobjects/weblogin.component';
import { WebLogout } from '../e2elib/lib/src/pageobjects/weblogout.component';
import { by, element } from '../e2elib/node_modules/protractor/built';

export class AppBase {
  /**
   * Performs application login action.
   *
   * @returns Promise object indicating the completion of login action
   */
  public async login(): Promise<void> {
    // Login
    let webLogin = new WebLogin();
    try {
      await webLogin.login();
      await QConsole.viewAutoSave(false);
      await QConsole.clearViewCache();
    } catch (err) {
      expect(err).toBeLogged(QLogType.ERROR);
      return;
    }
  }

  /**
   * Performs application logout action.
   *
   * @returns Promise object indicating the completion of logout action
   */
  public async logout(): Promise<void> {
    // Logout
    let webLogout = new WebLogout();
    await webLogout.logout();
  }

  /**
   * Checks for any unexpected toast messages.
   *
   * @returns Promise object indicating the completion of check
   */
  public async checkToastMessage(): Promise<void> {
    await QUtils.checkToastMessage();
  }

  /**
   * Get application title.
   *
   * @returns Application title string
   */
  public async getTitle(): Promise<string> {
    let title = element(by.css('section.experience')).element(by.css('.title'));
    return title.getText();
  }
}
