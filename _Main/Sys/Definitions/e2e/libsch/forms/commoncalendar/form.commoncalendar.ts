import { Form } from '../../../e2elib/lib/src/pageobjects/form.component';
import { ListBase } from '../../../libappbase/listbase';
import { PanelManageEventOccurence, PanelEventPattern } from './';

export class FormCommonCalendar extends Form {
  public listEventCategory = new ListEventCategory();
  public pnlEventPattern = new PanelEventPattern();
  public pnlEventAndOccurence = new PanelManageEventOccurence();

  public constructor() {
    super('LibCal_frmCommonCalendar');
  }
}

export class ListEventCategory extends ListBase {
  public constructor() {
    super('lstEventCategories');
  }
}

export enum ListEventCategoryColumn {
  Name = 'Name',
  NrOfEvents = 'NrOfEvents',
}
