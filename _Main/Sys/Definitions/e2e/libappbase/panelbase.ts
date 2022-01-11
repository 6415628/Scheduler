/**
 * @file Panel component base class
 * @description Allow to call switchTo function to perform clickTab action in panel (tab type) and wait for all child component presented
 * @author      Adrian Foo (adrian.foo@3ds.com), Wong Jia Hui (jiahui.wong@3ds.com)
 * @copyright   Dassault Systèmes
 */
import { Panel } from '../e2elib/lib/src/pageobjects/panel.component';
import { QObject } from '../e2elib/lib/src/pageobjects/base/qobject.class';

export class PanelBase extends Panel {
  public constructor(panelComponentPath: string) {
    super(panelComponentPath);
  }

  /**
   * Switch to the tab and wait until all component in tab is present
   */
  public async switchTo(): Promise<void> {
    await this.clickTab();
    // Get all property name and check whether it is QObject type
    const allPropertyName = Object.getOwnPropertyNames(this);
    for (const propertyName of allPropertyName) {
      const property = Object.getOwnPropertyDescriptor(this, propertyName);
      // Call waitUntilPresent() if the property is QObject type
      if (property!.value instanceof QObject) {
        const childComponent = property!.value;
        await childComponent.waitUntilPresent();
      }
    }
  }
}
