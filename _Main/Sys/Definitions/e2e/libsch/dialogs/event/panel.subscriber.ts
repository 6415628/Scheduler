import { ButtonBase } from '../../../libappbase/buttonbase';
import { ListBase } from '../../../libappbase/listbase';
import { PanelBase } from '../../../libappbase/panelbase';

export class PanelSubscriber extends PanelBase {
  public btnSelectAll = new ButtonBase('btnSelectAll');
  public btnDeselectAll = new ButtonBase('btnDeselectAll');
  public listSubscriber = new ListSubscriber();

  public constructor() {
    super('tabSubscribers');
  }
}

export class ListSubscriber extends ListBase {
  public constructor() {
    super('lstSubscribers');
  }

  public async selectSubscribers(calendarIDs: string[]): Promise<void> {
    const rows = await this.getRowsByCellValuesFromOneColumn(ListSubscriberColumn.CalendarID, calendarIDs);
    for (const row of rows) {
      await this.toggleRowCheckbox(row, true);
    }
  }
}

export enum ListSubscriberColumn {
  CalendarID = 'CalendarID',
}
