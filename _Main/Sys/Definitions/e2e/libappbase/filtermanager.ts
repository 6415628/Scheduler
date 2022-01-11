import { Filters } from '../e2elib/lib/src/ctl/filters.class';

export class FilterManager extends Filters {
  /**
   * Set filter terms in dialog filter manager
   *
   * @param filterValue Value to be filtered
   */
  public async filter(filterValue: string): Promise<void> {
    await this.editFieldFilter.sendInput(filterValue);
    await this.buttonSetFilter.click();
    await this.buttonClose.click();
  }
}
