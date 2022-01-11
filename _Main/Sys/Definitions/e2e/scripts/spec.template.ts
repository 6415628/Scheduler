/**
 * @file        TDXXXX
 * @description Template for E2E test script
 * @author      Clark Kent (kent.clark@3ds.com)
 * @copyright   Dassault Systèmes
 */
import { QLogType } from '../e2elib/lib/src/main/qlogtype.enum';
import { qCustomMatcher } from '../e2elib/lib/src/main/qmatchers.const';
import { QUtils } from '../e2elib/lib/src/main/qutils.class';
import { WebLogin } from '../e2elib/lib/src/pageobjects/weblogin.component';
import { WebLogout } from '../e2elib/lib/src/pageobjects/weblogout.component';

describe('Enter your description here', () => {
  let webLogin: WebLogin;
  let weblogout: WebLogout;
  let qutils = new QUtils();

  beforeAll(async () => {
    jasmine.addMatchers(qCustomMatcher);
    webLogin = new WebLogin();
    try {
      await webLogin.login();
    } catch (err) {
      expect(err).toBeLogged(QLogType.ERROR);
    }
  });

  afterAll(async () => {
    weblogout = new WebLogout();
    await weblogout.logout();
  });

  afterEach(async () => {
    await qutils.checkToastMessage();
  });

  it('Step 1 - xxx', () => {
    // TODO
  });
});
