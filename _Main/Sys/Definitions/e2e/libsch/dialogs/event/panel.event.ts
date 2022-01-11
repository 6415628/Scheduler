import { DurationSelector } from '../../../e2elib/lib/src/pageobjects/durationselector.component';
import { EditField } from '../../../e2elib/lib/src/pageobjects/editfield.component';
import { RadioButton } from '../../../e2elib/lib/src/pageobjects/radiobutton.component';
import { ButtonBase } from '../../../libappbase/buttonbase';
import { CheckboxBase } from '../../../libappbase/checkboxbase';
import { DateTimeSelectorBase } from '../../../libappbase/datetimeselectorbase';
import { DropDownListBase } from '../../../libappbase/dropdownlistbase';
import { DropDownStringListBase } from '../../../libappbase/dropdownstringlistbase';
import { PanelBase } from '../../../libappbase/panelbase';
import {
  EventCapacity,
  EventCategoryName,
  EventMonthlyRecurrenceDay,
  EventMonthlyRecurrenceDayEveryNrOfMonths,
  EventMonthlyRecurrencePatternEveryNrOfMonths,
  EventName,
  EventRecurrencePatternWeekOfMonth,
  EventRecurrenceType,
  EventTime,
  EventTypeName,
  EventWeeklyRecurenceNr,
  EventWeeklyRecurrencePattern,
  EventYearlyRecurrenceDayOfMonth,
  EventYearlyRecurrenceEveryNrOfYears,
  EventYearlyRecurrenceMonth,
} from '../../data/data.calendar';

export interface InputEventFields {
  // General Fields
  name?: EventName;
  eventType?: EventTypeName;
  capacity?: EventCapacity;
  category?: EventCategoryName;
  recurrenceType?: EventRecurrenceType;
  startDate?: Date;
  startTime?: [EventTime, EventTime];
  isAllDay?: boolean;
  endDate?: Date;
  endTime?: [EventTime, EventTime];

  // Recurrence Pattern Fields
  // Recurrence Pattern -> Weekly
  recurrenceNrOfWeek?: EventWeeklyRecurenceNr;
  recurrenceWeekDays?: EventWeeklyRecurrencePattern[];
  // Recurrence Pattern -> Monthly
  isMonthlyDay?: boolean;
  monthlyDay?: EventMonthlyRecurrenceDay;
  monthlyDayEveryNrOfMonths?: EventMonthlyRecurrenceDayEveryNrOfMonths;
  isMonthlyPattern?: boolean;
  monthlyPatternWeekOfMonth?: EventRecurrencePatternWeekOfMonth;
  monthlyPatternDayOfWeek?: EventWeeklyRecurrencePattern;
  monthlyPatternEveryNrOfMonths?: EventMonthlyRecurrencePatternEveryNrOfMonths;
  // Recurrence Pattern -> Yearly
  yearlyEveryNrOfYears?: EventYearlyRecurrenceEveryNrOfYears;
  isYearlyDay?: boolean;
  yearlyMonth?: EventYearlyRecurrenceMonth;
  yearlyYearlyDayOfMonth?: EventYearlyRecurrenceDayOfMonth;
  isYearlyPattern?: boolean;
  yearlyPatternWeekOfMonth?: EventRecurrencePatternWeekOfMonth;
  yearlyPatternDayOfWeek?: EventWeeklyRecurrencePattern;
  yearlyPatternMonth?: EventYearlyRecurrenceMonth;
  // Recurrence Period Fields
  recurrencePeriodStart?: Date;
  recurrencePeriodEnd?: Date;
}

export class PanelEvent extends PanelBase {
  // Edit fields
  private readonly _efName = new EditField('edtName');
  private readonly _efCapacity = new EditField('edtCapacity');
  private readonly _efRecurNrOfWeeks = new EditField('edtEveryNrOfWeeks');
  private readonly _efMonthlyDay = new EditField('edtMonthlyDay');
  private readonly _efMonthlyDayEveryNrOfMonths = new EditField('edtMonthlyDayEveryNrOfMonths');
  private readonly _efMonthlyPatternEveryNrOfMonths = new EditField('edtMonthlyPatternEveryNrOfMonths');
  private readonly _efEveryNrOfYears = new EditField('edtEveryNrOfYears');

  // Radio button
  private readonly _rbEventType = new RadioButton('rbgEventTypeWithCapacity');

  // Buttons
  private readonly _btnNoRecurrence = new ButtonBase('btnNoRecurrence');
  private readonly _btnWeekly = new ButtonBase('btnWeekly');
  private readonly _btnMonthly = new ButtonBase('btnMonthly');
  private readonly _btnYearly = new ButtonBase('btnYearly');

  // Recurrence Pattern Weekly Buttons
  private readonly _btnMonday = new ButtonBase('btnMonday');
  private readonly _btnTuesday = new ButtonBase('btnTuesday');
  private readonly _btnWednesday = new ButtonBase('btnWednesday');
  private readonly _btnThursday = new ButtonBase('btnThursday');
  private readonly _btnFriday = new ButtonBase('btnFriday');
  private readonly _btnSaturday = new ButtonBase('btnSaturday');
  private readonly _btnSunday = new ButtonBase('btnSunday');

  // Checkboxes
  private readonly _cbIsAllDay = new CheckboxBase('ckbIsAllDay');
  private readonly _cbEndOfPeriod = new CheckboxBase('ckbEndOfPeriod');
  private readonly _cbMonthlyDay = new CheckboxBase('ckbMonthlyDay');
  private readonly _cbMonthlyPattern = new CheckboxBase('ckbMonthlyPattern');
  private readonly _cbYearlyDay = new CheckboxBase('ckbYearlyDay');
  private readonly _cbYearlyPattern = new CheckboxBase('ckbYearlyPattern');

  // Drop down list
  private readonly _ddlCategory = new DropDownListBase('ddlCategory');

  // Drop down string list
  private readonly _ddslMonthlyPatternWeekOfMonth = new DropDownStringListBase('ssMonthlyPatternWeekOfMonth');
  private readonly _ddslMonthlyPatternDayOfWeek = new DropDownStringListBase('ssMonthlyPatternDayOfWeek');
  private readonly _ddslYearlyMonth = new DropDownStringListBase('ssYearlyMonth');
  private readonly _ddslYearlyDayOfMonth = new DropDownStringListBase('ssYearlyDayOfMonth');
  private readonly _ddslYearlyPatternWeekOfMonth = new DropDownStringListBase('ssYearlyPatternWeekOfMonth');
  private readonly _ddslYearlyPatternDayOfWeek = new DropDownStringListBase('ssYearlyPatternDayOfWeek');
  private readonly _ddslYearlyPatternMonth = new DropDownStringListBase('ssYearlyPatternMonth');

  // Duration selector
  private readonly _dsStartTimeOfDay = new DurationSelector('durStartTimeOfDay');
  private readonly _dsEndTimeOfDay = new DurationSelector('durEndTimeOfDay');

  // Date time selector
  private readonly _dtsStartDate = new DateTimeSelectorBase('dsStartDate');
  private readonly _dtsEndDate = new DateTimeSelectorBase('dsEndDate');
  private readonly _dtsStartOfPeriod = new DateTimeSelectorBase('dtStartOfPeriod');
  private readonly _dtsEndOfPeriod = new DateTimeSelectorBase('dtEndOfPeriod');

  public constructor() {
    super('tabEvent');
  }

  /**
   * [Private] To get reccurenceType button based on pass-in ReccurenceType value
   * @param recurranceType Target recurrence type button name to retrieve
   * @reutrn RecurranceType button
   */
  private async getRecurrenceTypeButton(recurranceType: EventRecurrenceType): Promise<ButtonBase | undefined> {
    switch (recurranceType) {
      case EventRecurrenceType.None:
        return this._btnNoRecurrence;
      case EventRecurrenceType.Weekly:
        return this._btnWeekly;
      case EventRecurrenceType.Monthly:
        return this._btnMonthly;
      case EventRecurrenceType.Yearly:
        return this._btnYearly;
      default:
        return undefined;
    }
  }

  /**
   * [Private] To get Weekly Resource Pattern buttons based on pass-in day value
   * @param days Target day button names to retrieve
   * @return weekly day buttons
   */
  private getResourcePatternWeeklyButtons(days: EventWeeklyRecurrencePattern[]): ButtonBase[] {
    let btns: ButtonBase[] = [];
    for (const day of days) {
      switch (day) {
        case EventWeeklyRecurrencePattern.Monday:
          btns.push(this._btnMonday);
          break;
        case EventWeeklyRecurrencePattern.Tuesday:
          btns.push(this._btnTuesday);
          break;
        case EventWeeklyRecurrencePattern.Wednesday:
          btns.push(this._btnWednesday);
          break;
        case EventWeeklyRecurrencePattern.Thursday:
          btns.push(this._btnThursday);
          break;
        case EventWeeklyRecurrencePattern.Friday:
          btns.push(this._btnFriday);
          break;
        case EventWeeklyRecurrencePattern.Saturday:
          btns.push(this._btnSaturday);
          break;
        case EventWeeklyRecurrencePattern.Sunday:
          btns.push(this._btnSunday);
          break;
        default:
          break;
      }
    }
    return btns;
  }

  /**
   * Update dialog values in Event panel
   *
   * @param values `InputEventType` values of the event to be updated
   *
   */
  public async updateDialogValues(values: InputEventFields): Promise<void> {
    // General Fields
    if (values.name) {
      await this._efName.sendInput(values.name);
    }
    if (values.eventType) {
      await this._rbEventType.checkOnRadioButton(values.eventType);
    }
    if (values.capacity) {
      await this._efCapacity.sendInput(values.capacity.toString());
    }
    if (values.category) {
      await this._ddlCategory.selectItem(values.category);
    }
    if (values.recurrenceType) {
      await this.selectRecurrenceType(values.recurrenceType);
    }
    if (values.startDate) {
      await this._dtsStartDate.setDate(values.startDate);
    }
    if (values.startTime) {
      await this._dsStartTimeOfDay.setHour(values.startTime[0]);
      await this._dsStartTimeOfDay.setMinute(values.startTime[1]);
    }
    if (values.isAllDay !== undefined) {
      await this._cbIsAllDay.toggle(values.isAllDay);
    }
    if (values.endDate) {
      await this._dtsEndDate.setDate(values.endDate);
    }
    if (values.endTime) {
      await this._dsEndTimeOfDay.setHour(values.endTime[0]);
      await this._dsEndTimeOfDay.setMinute(values.endTime[1]);
    }

    // Recurrence Pattern Fields
    // Recurrence Pattern -> Weekly
    if (values.recurrenceNrOfWeek) {
      await this._efRecurNrOfWeeks.sendInput(values.recurrenceNrOfWeek.toString());
    }
    if (values.recurrenceWeekDays) {
      await this.toggleOnResourcePatternWeeklyButton(values.recurrenceWeekDays);
    }
    // Recurrence Pattern -> Monthly
    if (values.isMonthlyDay !== undefined) {
      await this._cbMonthlyDay.toggle(values.isMonthlyDay);
    }
    if (values.monthlyDay) {
      await this._efMonthlyDay.sendInput(values.monthlyDay);
    }
    if (values.monthlyDayEveryNrOfMonths) {
      await this._efMonthlyDayEveryNrOfMonths.sendInput(values.monthlyDayEveryNrOfMonths);
    }
    if (values.isMonthlyPattern !== undefined) {
      await this._cbMonthlyPattern.toggle(values.isMonthlyPattern);
    }
    if (values.monthlyPatternWeekOfMonth) {
      await this._ddslMonthlyPatternWeekOfMonth.selectItem(values.monthlyPatternWeekOfMonth);
    }
    if (values.monthlyPatternDayOfWeek) {
      await this._ddslMonthlyPatternDayOfWeek.selectItem(values.monthlyPatternDayOfWeek);
    }
    if (values.monthlyPatternEveryNrOfMonths) {
      await this._efMonthlyPatternEveryNrOfMonths.sendInput(values.monthlyPatternEveryNrOfMonths);
    }
    // Recurrence Pattern -> Yearly
    if (values.yearlyEveryNrOfYears) {
      await this._efEveryNrOfYears.sendInput(values.yearlyEveryNrOfYears);
    }
    if (values.isYearlyDay !== undefined) {
      await this._cbYearlyDay.toggle(values.isYearlyDay);
    }
    if (values.yearlyMonth) {
      await this._ddslYearlyMonth.selectItem(values.yearlyMonth);
    }
    if (values.yearlyYearlyDayOfMonth) {
      await this._ddslYearlyDayOfMonth.selectItem(values.yearlyYearlyDayOfMonth);
    }
    if (values.isYearlyPattern !== undefined) {
      await this._cbYearlyPattern.toggle(values.isYearlyPattern);
    }
    if (values.yearlyPatternWeekOfMonth) {
      await this._ddslYearlyPatternWeekOfMonth.selectItem(values.yearlyPatternWeekOfMonth);
    }
    if (values.yearlyPatternDayOfWeek) {
      await this._ddslYearlyPatternDayOfWeek.selectItem(values.yearlyPatternDayOfWeek);
    }
    if (values.yearlyPatternMonth) {
      await this._ddslYearlyPatternMonth.selectItem(values.yearlyPatternMonth);
    }

    // Recurrence Period Fields
    if (values.recurrencePeriodStart) {
      await this._dtsStartOfPeriod.setDate(values.recurrencePeriodStart);
    }
    if (values.recurrencePeriodEnd) {
      await this._cbEndOfPeriod.toggle(true);
      await this._dtsEndOfPeriod.setDate(values.recurrencePeriodEnd);
    }
  }

  /**
   * To select recurrence type by click ingon button with matched pass-in recurrenceType name
   * @param recurranceType name of target recurrence button
   */
  private async selectRecurrenceType(recurranceType: EventRecurrenceType): Promise<void> {
    let button = await this.getRecurrenceTypeButton(recurranceType);
    if (button) {
      await button.click();
    }
  }

  /**
   * To toggle on resource pattern weekly buttons by click on button with matched pass-in week days
   * @param weekDays days to be toggled on
   */
  public async toggleOnResourcePatternWeeklyButton(weekDays: EventWeeklyRecurrencePattern[]): Promise<void> {
    const toggledWeeklyButtons = this.getResourcePatternWeeklyButtons(weekDays);
    const allWeeklyButtons = [this._btnMonday, this._btnTuesday, this._btnWednesday, this._btnThursday, this._btnFriday, this._btnSaturday, this._btnSunday];
    for (const btn of allWeeklyButtons) {
      // if among weekdays and not toggled => click to select
      // if not among weekdays and toggled => clich to unselect
      if ((toggledWeeklyButtons.includes(btn) && !(await btn.isToggled())) || (!toggledWeeklyButtons.includes(btn) && (await btn.isToggled()))) {
        await btn.click();
      }
    }
  }

  /**
   * To verify is recurrance type button that match with pass-in recurraceType is clicked
   * @param recurranceType Expected recurrence type button name is clicked
   * @returns boolean to indicate whether pass-in recurrenceType button is clicked
   */
  public async verifyIsRecurrenceTypeSelected(recurranceType: EventRecurrenceType): Promise<boolean> {
    let button = await this.getRecurrenceTypeButton(recurranceType);
    if (button) {
      return button.isToggled();
    }
    return false;
  }
}
