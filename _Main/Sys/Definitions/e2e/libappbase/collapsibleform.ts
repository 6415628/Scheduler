/**
 * @file Collapsible form component base class (e.g. side panel)
 * @description Component extended from CollapsibleForm with additional methods
 * @author      Adrian Foo (adrian.foo@3ds.com), Wong Jia Hui (jiahui.wong@3ds.com)
 * @copyright   Dassault Systèmes
 */
import { Form } from '../e2elib/lib/src/pageobjects/form.component';

export class CollapsibleForm extends Form {
  /**
   * @override To include checking whether the form is not collapse before execute collapse action
   */
  public async collapse(): Promise<void> {
    const isFormCollapse = await this.isCollapse();

    if (!isFormCollapse) {
      await super.collapse();
    }
  }

  /**
   * @override To include checking whether the form is docked before execute the dock action
   */
  public async dock(): Promise<void> {
    const isOpen = await this.isOpen();
    const isDocked = await this.isdocked();

    if (isOpen && !isDocked) {
      await super.dock();
    }
  }

  /**
   * @override
   */
  public async isFocused(): Promise<boolean> {
    try {
      const isFocused = await super.isFocused();
      return isFocused;
    } catch {
      return false;
    }
  }

  /**
   * @override To include checking whether the form is collapse before execute restore action
   */
  public async restore(): Promise<void> {
    const isFormCollapse = await this.isCollapse();
    const isFocused = await this.isFocused();

    if (isFormCollapse || !isFocused) {
      await super.restore();
    }
    await this.waitUntilPresent();
  }
}
