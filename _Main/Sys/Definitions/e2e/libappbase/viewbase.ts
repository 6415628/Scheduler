/**
 * @file View component base class
 * @description allow to swtich view, reset view.
 * @author      LIM Cheng Khoon (ChengKhoon.LIM@3ds.com), Adrian Foo (adrian.foo@3ds.com)
 * @copyright   Dassault Systèmes
 */
import { ViewManager } from '../e2elib/lib/src/ctl/viewmanager.class';

export abstract class ViewBase {
  /**
   * Display name of the view.
   *
   * @abstract
   */
  public abstract name: string;

  /**
   * Performs view switching process.
   *
   * @abstract
   */
  public abstract switchTo(): Promise<void>;

  /**
   * Resets the view.
   */
  public async reset(): Promise<void> {
    const viewManager = new ViewManager();

    await viewManager.openViewManager();
    await viewManager.resetView(this.name);
    await viewManager.closeViewManager();
  }
}
