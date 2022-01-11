import { DropDownList } from '../e2elib/lib/src/pageobjects/dropdownlist.component';
import { by } from '../e2elib/node_modules/protractor/built';

export class DropDownListBase extends DropDownList {
  /**
   * Select the string item in dropdown
   *
   * @param selectionItem item in value (value name or index)
   * @example await selectItem('Sales demo metals');
   */
  public async selectItem(selectionItem: string | number): Promise<void> {
    let errorMessage = '';
    let curentValue = await this.getSelectedString();
    if (curentValue !== selectionItem) {
      try {
        // search item from origin selected item to bottom, it might throw error if the target item is not bottom of origin selected item
        await super.selectItem(selectionItem);
      } catch (err) {
        // if error catched, search item from origin selected item to top
        try {
          await super.selectItem(selectionItem, false);
        } catch (err2) {
          // if error catched, log error message
          errorMessage = `error when finding '${selectionItem}' in drop down ${this.componentName}. ${err2.message}`;
          throw new Error(errorMessage);
        }
      }
    }
  }

  /**
   * Count the number of elements in the DropDown
   *
   * @returns number that indicates the number of elements inside the DropDown
   */
  public async getDropDownItemsCount(): Promise<number> {
    let count = await this.element.all(by.css('.selectionItemContainer .selectionItem ')).count();
    return count;
  }
}
