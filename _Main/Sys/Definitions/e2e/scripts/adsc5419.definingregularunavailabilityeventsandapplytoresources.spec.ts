/**
 * @file        ADSC-5419
 * @description Defining regular unavailability events and apply to a group of resources
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { browser } from '../e2elib/node_modules/protractor/built';
import { LogMessage } from '../libappbase/logmessage';
import { getHtmlContent } from '../libappbase/utils';
import { AppScheduler } from '../libsch/appsch';
import {
  EventCategoryName,
  EventMonthlyRecurrencePatternEveryNrOfMonths,
  EventName,
  EventRecurrencePatternWeekOfMonth,
  EventRecurrenceType,
  EventWeeklyRecurrencePattern,
  EventYearlyRecurrenceDayOfMonth,
  EventYearlyRecurrenceMonth,
} from '../libsch/data/data.calendar';
import { ResourceName } from '../libsch/data/data.resource';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { GanttChartNodeColor } from '../libsch/data/data.schedule';
import { InputEventFields } from '../libsch/dialogs/event';
import { DialogEvent } from '../libsch/dialogs/event/dialog.event';
import { ListEventCategoryColumn } from '../libsch/forms/commoncalendar';
import { ListCalendarColumn, ListResourceCalendarEventColumn } from '../libsch/forms/resourcecalendar';
import { ListEventParentColumn } from '../libsch/lists/list.event';
import { LogMessageSch } from '../libsch/logmessagesch';

describe('ADSC-5419, Defining regular unavailability events and apply to a group of resources', () => {
  const appScheduler = AppScheduler.getInstance();

  const viewManageCalendars = appScheduler.viewManageCalendars;
  const formCommonCalendar = viewManageCalendars.formCommonCalendar;
  const listEventCategory = formCommonCalendar.listEventCategory;
  const pnlEventPattern = formCommonCalendar.pnlEventPattern;
  const gcCommonCalendar = pnlEventPattern.gcCommonCalendar;
  let dlgEvent: DialogEvent;
  const formResourceCalendar = viewManageCalendars.formResourceCalendar;
  const listCalendar = formResourceCalendar.listCalendar;
  const pnlRCEventList = formResourceCalendar.pnlRCEventList;
  const rcListEvent = pnlRCEventList.listEvent;
  const viewSchedule = appScheduler.viewSchedule;
  const formResourceSchedule = viewSchedule.formResourceSchedule;
  const pnlScheduleOverview = formResourceSchedule.pnlScheduleOverview;
  const gcResourceSchedule = pnlScheduleOverview.gcResourceSchedule;

  const eventMaintenance: InputEventFields = {
    name: EventName.Maintenance,
    recurrenceType: EventRecurrenceType.Monthly,
    isAllDay: true,
    isMonthlyPattern: true,
    monthlyPatternWeekOfMonth: EventRecurrencePatternWeekOfMonth.Second,
    monthlyPatternDayOfWeek: EventWeeklyRecurrencePattern.Monday,
    monthlyPatternEveryNrOfMonths: EventMonthlyRecurrencePatternEveryNrOfMonths._1,
  };
  const eventIndependenceDay: InputEventFields = {
    name: EventName.IndependenceDay,
    recurrenceType: EventRecurrenceType.Yearly,
    isAllDay: true,
    isYearlyDay: true,
    yearlyMonth: EventYearlyRecurrenceMonth.January,
    yearlyYearlyDayOfMonth: EventYearlyRecurrenceDayOfMonth._10,
  };
  const printingResources: string[] = [ResourceName._1101, ResourceName._1102, ResourceName._1103, ResourceName._1104];
  const casingResources: string[] = [ResourceName._1201, ResourceName._1202, ResourceName._1203, ResourceName._1204];
  const insertBottomResources: string[] = [ResourceName._1301, ResourceName._1302, ResourceName._1303, ResourceName._1304];

  const calendarStartDate = new Date(2016, 11, 25); // 25/12/2016
  const calendarEndDate = new Date(2017, 2, 5); // 05/03/2017
  const firstMaintenanceStartDate = new Date(2017, 0, 9); // 09/01/2017
  const firstMaintenanceEndDate = new Date(2017, 0, 10); // 10/01/2017
  const secondMaintenanceStartDate = new Date(2017, 1, 13); // 13/02/2017
  const secondMaintenanceEndDate = new Date(2017, 1, 14); // 14/02/2017
  const independenceDayStartDate = new Date(2017, 0, 10); // 10/01/2017
  const independenceDayEndDate = new Date(2017, 0, 11); // 11/01/2017

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
  });

  afterAll(async () => {
    await appScheduler.cleanUpDataset();
    await appScheduler.logout();
  });

  afterEach(async () => {
    await appScheduler.checkToastMessage();
  });

  it('Setup: Paperbags_Edit_Calendar dataset is loaded', async () => {
    await appScheduler.switchToDemoScenario(DemoCategory.TestDemo, DemoScenario.PaperbagsEditCalendar);
  });

  it('Step 1: Open view Data -> Manage Calendars', async () => {
    await viewManageCalendars.switchTo();
    expect(await formCommonCalendar.isVisible()).toBe(true, LogMessage.form_notVisible(await formCommonCalendar.getTitle()));
    expect(await formResourceCalendar.isVisible()).toBe(true, LogMessage.form_notVisible(await formResourceCalendar.getTitle()));
  });

  it("Step 2: Choose category as exception and right click on blank space in event patterns form and then click on 'Create event'.Verify that a dialog poped up.", async () => {
    // Select Exception in event category list
    const eventCategoryRow = await listEventCategory.getRowByCellValue(ListEventCategoryColumn.Name, EventCategoryName.Exception);
    await listEventCategory.selectRows([eventCategoryRow]);

    await pnlEventPattern.switchTo();
    dlgEvent = await gcCommonCalendar.openDialogEvent();
    expect(await dlgEvent.isVisible()).toBe(true, LogMessage.dialog_notVisible(await dlgEvent.getTitle()));
  });

  it('Step 3: Name it "Maintenance", select unavailable in type in order to make capacity 0, Recurence->Monthly, thick up "All day" check box. Fill in the recurrence pattern as it occurs the every second monday of each month.', async () => {
    await dlgEvent.pnlEvent.updateDialogValues(eventMaintenance);
  });

  it('Step 4. Go to Subscribers tab and select all printing and casing resources. Press "Ok".', async () => {
    await dlgEvent.pnlSubscriber.switchTo();
    // Select all printing and casing resources
    await dlgEvent.pnlSubscriber.listSubscriber.selectSubscribers(printingResources.concat(casingResources));

    // Press "Ok"
    const [isOKButtonClickable, btnDisabledTooltip] = await dlgEvent.btnOk.verifyIsButtonClickable();
    expect(isOKButtonClickable).toBe(true, LogMessage.btn_notClickable('OK', btnDisabledTooltip));
    await dlgEvent.clickOK();
  });

  it('Step 5: Create another new exception event for Independence day. Select recurrence as yearly. Fill in the recurrence pattern as it recurs every year on 10th of January.', async () => {
    dlgEvent = await gcCommonCalendar.openDialogEvent();
    await dlgEvent.pnlEvent.updateDialogValues(eventIndependenceDay);
  });

  it('Step 6: Go to Subscribers tab and select all resources. Press "Ok".', async () => {
    await dlgEvent.pnlSubscriber.switchTo();
    // Select all resources
    await dlgEvent.pnlSubscriber.btnSelectAll.click();

    // Press "Ok"
    const [isOKButtonClickable, btnDisabledTooltip] = await dlgEvent.btnOk.verifyIsButtonClickable();
    expect(isOKButtonClickable).toBe(true, LogMessage.btn_notClickable('OK', btnDisabledTooltip));
    await dlgEvent.clickOK();
  });

  it('Step 7: Verify that there are two recurred events in Event Patterns list.', async () => {
    // Get Children rows of Exception gantt chart row
    const nrOfEvent = await gcCommonCalendar.getChildrenRows(0);
    expect(nrOfEvent.length).toBe(2, LogMessage.value_notMatched('2', nrOfEvent.toString()));
  });

  it("Step 8: Go to one of the printing, casing and insert bottom resources and verify that maintenance is visible on casing and printing resources' event lists and independence day is visible all kind of resources' events lists.", async () => {
    await pnlRCEventList.switchTo();

    // Get one resource from each resource group
    const printingResource = printingResources[Math.floor(Math.random() * printingResources.length)];
    const casingResource = casingResources[Math.floor(Math.random() * casingResources.length)];
    const insertBottomResource = insertBottomResources[Math.floor(Math.random() * insertBottomResources.length)];
    // Select them in the Resource Calendar list
    const calendarRows = await listCalendar.getRowsByCellValuesFromOneColumn(ListCalendarColumn.CalendarID, [printingResource, casingResource, insertBottomResource]);
    await listCalendar.selectRows(calendarRows);

    // Verify that maintenance is visible on casing and printing resources
    const isMaintenancePrintingExisted = await rcListEvent.hasRow(
      [
        { columnID: ListResourceCalendarEventColumn.CalendarID, value: printingResource },
        { columnID: ListResourceCalendarEventColumn.Name, value: EventName.Maintenance },
      ],
      [[{ columnID: ListEventParentColumn.Category, value: EventCategoryName.Exception }]],
    );
    const isMaintenanceCasingExisted = await rcListEvent.hasRow(
      [
        { columnID: ListResourceCalendarEventColumn.CalendarID, value: casingResource },
        { columnID: ListResourceCalendarEventColumn.Name, value: EventName.Maintenance },
      ],
      [[{ columnID: ListEventParentColumn.Category, value: EventCategoryName.Exception }]],
    );
    expect(isMaintenancePrintingExisted).toBe(true, LogMessage.row_notFound(printingResource));
    expect(isMaintenanceCasingExisted).toBe(true, LogMessage.row_notFound(casingResource));

    // Verify that independence day is visible all kind of resources
    const isIndependenceDayPrintingExisted = await rcListEvent.hasRow(
      [
        { columnID: ListResourceCalendarEventColumn.CalendarID, value: printingResource },
        { columnID: ListResourceCalendarEventColumn.Name, value: EventName.IndependenceDay },
      ],
      [[{ columnID: ListEventParentColumn.Category, value: EventCategoryName.Exception }]],
    );
    const isIndependenceDayCasingExisted = await rcListEvent.hasRow(
      [
        { columnID: ListResourceCalendarEventColumn.CalendarID, value: casingResource },
        { columnID: ListResourceCalendarEventColumn.Name, value: EventName.IndependenceDay },
      ],
      [[{ columnID: ListEventParentColumn.Category, value: EventCategoryName.Exception }]],
    );
    const isIndependenceDayInsertBottomExisted = await rcListEvent.hasRow(
      [
        { columnID: ListResourceCalendarEventColumn.CalendarID, value: insertBottomResource },
        { columnID: ListResourceCalendarEventColumn.Name, value: EventName.IndependenceDay },
      ],
      [[{ columnID: ListEventParentColumn.Category, value: EventCategoryName.Exception }]],
    );
    expect(isIndependenceDayPrintingExisted).toBe(true, LogMessage.row_notFound(printingResource));
    expect(isIndependenceDayCasingExisted).toBe(true, LogMessage.row_notFound(casingResource));
    expect(isIndependenceDayInsertBottomExisted).toBe(true, LogMessage.row_notFound(insertBottomResource));
  });

  it('Step 9: Verify in the gantt chart that independence day recurres every year. (due to limitation, only displayed up to a period - in between the dotted black line)', async () => {
    await gcCommonCalendar.show(calendarStartDate, calendarEndDate);
    // FIX ME: RFC raised (CTAS-110946) to avoid calling browser sleep
    await browser.sleep(1000);

    // Verify only 1 independance day node exists in common calendar GC
    const independenceDayGCRow = (await gcCommonCalendar.getRowsByTitle(EventName.IndependenceDay))[0];
    const independenceDayNrOfNodes = await gcCommonCalendar.getAllNodes(independenceDayGCRow);
    expect(independenceDayNrOfNodes.length).toBe(1, LogMessageSch.ganttchart_numOfNodesNotMatched(EventName.IndependenceDay, 1, independenceDayNrOfNodes.length));

    // Verify the date is correct
    const independenceDayNodes = await gcCommonCalendar.getNodesBetweenDates(EventName.IndependenceDay, independenceDayStartDate, independenceDayEndDate, false);
    expect(independenceDayNodes.length).toBe(1, LogMessageSch.ganttchart_numOfNodesNotMatched(EventName.IndependenceDay, 1, independenceDayNodes.length));
  });

  it('Step 10: Verfiy in the gantt chart that maintenance recurres each month. (due to limitation, only displayed up to a period - in between the dotted black line)', async () => {
    // Verify only 2 maintenance exist in common calendar GC
    const maintenanceGCRow = (await gcCommonCalendar.getRowsByTitle(EventName.Maintenance))[0];
    const maintenanceNrOfNodes = await gcCommonCalendar.getAllNodes(maintenanceGCRow);
    expect(maintenanceNrOfNodes.length).toBe(2, LogMessageSch.ganttchart_numOfNodesNotMatched(EventName.Maintenance, 2, maintenanceNrOfNodes.length));

    // Verify the dates are correct
    const firstMaintenanceNodes = await gcCommonCalendar.getNodesBetweenDates(EventName.Maintenance, firstMaintenanceStartDate, firstMaintenanceEndDate, false);
    expect(firstMaintenanceNodes.length).toBe(1, LogMessageSch.ganttchart_numOfNodesNotMatched(EventName.Maintenance, 1, firstMaintenanceNodes.length));
    const secondMaintenanceNodes = await gcCommonCalendar.getNodesBetweenDates(EventName.Maintenance, secondMaintenanceStartDate, secondMaintenanceEndDate, false);
    expect(secondMaintenanceNodes.length).toBe(1, LogMessageSch.ganttchart_numOfNodesNotMatched(EventName.Maintenance, 1, secondMaintenanceNodes.length));
  });

  it('Step 11: Verify that calendars are closed in the resource schedule on the date when exceptional type of events are occured for all resources even though there are open shifts for the resources.', async () => {
    await viewSchedule.switchTo();
    expect(await formResourceSchedule.isVisible()).toBe(true, LogMessage.form_notVisible('Resource Schedule'));
    await pnlScheduleOverview.switchTo();

    await gcResourceSchedule.show(calendarStartDate, calendarEndDate);
    // FIX ME: RFC raised (CTAS-110946) to avoid calling browser sleep
    await browser.sleep(1000);

    const gcRows = await gcResourceSchedule.getAllRows();
    for (const gcRow of gcRows) {
      const gcRowTitle = getHtmlContent(await gcRow.getTitle())[0];

      if (insertBottomResources.includes(gcRowTitle)) {
        // Verify insert bottom resources are closed during independance day
        const gcNodesOnIndependenceDay = await gcResourceSchedule.getNodesBetweenDates(gcRowTitle, independenceDayStartDate, independenceDayEndDate, false);
        expect(gcNodesOnIndependenceDay.length).toBe(1, LogMessageSch.ganttchart_numOfNodesNotMatched(gcRowTitle, 1, gcNodesOnIndependenceDay.length));
        const independenceDayNodeColor = await gcNodesOnIndependenceDay[0].getBackgroundColor();
        expect(independenceDayNodeColor).toBe(GanttChartNodeColor.Unavailable, LogMessage.value_notMatched(GanttChartNodeColor.Unavailable, independenceDayNodeColor));
      } else if (printingResources.includes(gcRowTitle) || casingResources.includes(gcRowTitle)) {
        // Verify printing and casing resources are closed during maintenance and independance day
        const gcNodesOnIndependenceDay = await gcResourceSchedule.getNodesBetweenDates(gcRowTitle, independenceDayStartDate, independenceDayEndDate, false);
        expect(gcNodesOnIndependenceDay.length).toBe(0, 'No tasks should be scheduled on Independence Day');

        const gcNodesOnFirstMaintenance = await gcResourceSchedule.getNodesBetweenDates(gcRowTitle, firstMaintenanceStartDate, firstMaintenanceEndDate, false);
        expect(gcNodesOnFirstMaintenance.length).toBe(0, 'No tasks should be scheduled on first Maintenance');

        const gcNodesOnSecondMaintenance = await gcResourceSchedule.getNodesBetweenDates(gcRowTitle, secondMaintenanceStartDate, secondMaintenanceEndDate, false);
        expect(gcNodesOnSecondMaintenance.length).toBe(0, 'No tasks should be scheduled on second Maintenance');
      }
    }
  });
});
