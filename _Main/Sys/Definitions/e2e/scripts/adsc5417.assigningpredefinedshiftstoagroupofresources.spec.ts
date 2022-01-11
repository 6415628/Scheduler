/**
 * @file        ADSC-5417
 * @description Assigning predefined shifts to a group of resources
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { GanttChartRow } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartrow';
import { browser } from '../e2elib/node_modules/protractor/built';
import { LogMessage } from '../libappbase/logmessage';
import { AppScheduler } from '../libsch/appsch';
import { EventCategoryName, EventName } from '../libsch/data/data.calendar';
import { ResourceName } from '../libsch/data/data.resource';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { DialogEvent } from '../libsch/dialogs/event/dialog.event';
import { ListEventCategoryColumn, ListEventColumn } from '../libsch/forms/commoncalendar';
import { ListCalendarColumn, ListResourceCalendarEventColumn } from '../libsch/forms/resourcecalendar';
import { ListEventParentColumn } from '../libsch/lists/list.event';
import { LogMessageSch } from '../libsch/logmessagesch';

describe('ADSC-5417, Assigning predefined shifts to a group of resources', () => {
  const appScheduler = AppScheduler.getInstance();

  const viewManageCalendars = appScheduler.viewManageCalendars;
  const formCommonCalendar = viewManageCalendars.formCommonCalendar;
  const listEventCategory = formCommonCalendar.listEventCategory;
  const pnlEventAndOccurence = formCommonCalendar.pnlEventAndOccurence;
  const ccListEvent = pnlEventAndOccurence.listEvent;
  let dlgEvent: DialogEvent;
  const formResourceCalendar = viewManageCalendars.formResourceCalendar;
  const listCalendar = formResourceCalendar.listCalendar;
  const pnlRCEventList = formResourceCalendar.pnlRCEventList;
  const rcListEvent = pnlRCEventList.listEvent;
  const viewSchedule = appScheduler.viewSchedule;
  const formResourceSchedule = viewSchedule.formResourceSchedule;
  const pnlScheduleOverview = formResourceSchedule.pnlScheduleOverview;
  const gcResourceSchedule = pnlScheduleOverview.gcResourceSchedule;
  let gcRow: GanttChartRow;

  const insertBotttomResources: string[] = [ResourceName._1301, ResourceName._1302, ResourceName._1303, ResourceName._1304];

  const firstThursdayPlanningHorizon = new Date(2017, 0, 5);
  const firstSaturdayPlanningHorizon = new Date(2017, 0, 7);
  const firstMondayPlanningHorizon = new Date(2017, 0, 9);
  const firstTuesdayPlanningHorizon = new Date(2017, 0, 10);

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

  it('Step 2: In the Event patterns list, verify that there are three shifts, one for printing resources, one for casing resources and one for insert bottom (Always available).', async () => {
    // Select Shift in event category list
    const eventCategoryRow = await listEventCategory.getRowByCellValue(ListEventCategoryColumn.Name, EventCategoryName.Shift);
    await listEventCategory.selectRows([eventCategoryRow]);

    // Verify that there are three shifts
    await pnlEventAndOccurence.switchTo();
    const ccListEventCount = await ccListEvent.getRowCount();
    // There should be 4 rows (3 shifts + 1 header)
    expect(ccListEventCount).toBe(4, LogMessageSch.list_numOfRowsNotMatched('Events', 4, ccListEventCount));

    const isAlwaysAvailableExisted = await ccListEvent.hasRow(
      [{ columnID: ListEventColumn.Name, value: EventName.AlwaysAvailable }],
      [[{ columnID: ListEventParentColumn.Category, value: EventCategoryName.Shift }]],
    );
    expect(isAlwaysAvailableExisted).toBe(true, LogMessage.row_notFound(EventName.AlwaysAvailable));

    const isCasingShiftExisted = await ccListEvent.hasRow(
      [{ columnID: ListEventColumn.Name, value: EventName.CasingShift }],
      [[{ columnID: ListEventParentColumn.Category, value: EventCategoryName.Shift }]],
    );
    expect(isCasingShiftExisted).toBe(true, LogMessage.row_notFound(EventName.CasingShift));

    const isPrintingShiftExisted = await ccListEvent.hasRow(
      [{ columnID: ListEventColumn.Name, value: EventName.PrintingShift }],
      [[{ columnID: ListEventParentColumn.Category, value: EventCategoryName.Shift }]],
    );
    expect(isPrintingShiftExisted).toBe(true, LogMessage.row_notFound(EventName.PrintingShift));
  });

  it('Step 3: Edit casing shift in order to apply the shift pattern on Insert bottom resources.', async () => {
    // Open Edit Shift Dialog for casing shift
    const casingShiftRow = await ccListEvent.getRowByValueInHierarchy(
      [{ columnID: ListEventColumn.Name, value: EventName.CasingShift }],
      [[{ columnID: ListEventParentColumn.Category, value: EventCategoryName.Shift }]],
    );
    dlgEvent = await ccListEvent.openDialogEvent(casingShiftRow);
    expect(await dlgEvent.isVisible()).toBe(true, LogMessage.dialog_notVisible(await dlgEvent.getTitle()));
  });

  it('Step 4: Go to Subscribers tab in the dialog and select all insert bottom resources.', async () => {
    // Select Insert Bottom resourses in subscribers list
    await dlgEvent.pnlSubscriber.switchTo();
    await dlgEvent.pnlSubscriber.listSubscriber.selectSubscribers(insertBotttomResources);

    const [isOKButtonClickable, btnDisabledTooltip] = await dlgEvent.btnOk.verifyIsButtonClickable();
    expect(isOKButtonClickable).toBe(true, LogMessage.btn_notClickable('OK', btnDisabledTooltip));
    await dlgEvent.clickOK();
  });

  it('Step 5: Verify in the resource schedule casing shift is applied to insert bottom resources as well.', async () => {
    // Open Schedule View
    await viewSchedule.switchTo();
    expect(await formResourceSchedule.isVisible()).toBe(true, LogMessage.form_notVisible(await formResourceSchedule.getTitle()));
    await pnlScheduleOverview.switchTo();
    // Show 5-1-2017 to 10-1-2017 in the gantt chart (to make visible the first weekend for verfication)
    await gcResourceSchedule.show(firstThursdayPlanningHorizon, firstTuesdayPlanningHorizon);
    // FIX ME: RFC raised (CTAS-110946) to avoid calling browser sleep
    await browser.sleep(1000);

    // Verify casing shift is applied to insert bottom resources
    for (const insertBotttomResource of insertBotttomResources) {
      gcRow = (await gcResourceSchedule.getRowsByTitle(insertBotttomResource))[0];
      const weekendNodes = await gcRow.getNodes(firstSaturdayPlanningHorizon, firstTuesdayPlanningHorizon);
      expect(weekendNodes.length).toBe(0, 'No tasks should be scheduled on weekend');
    }
  });

  it('Step 6: Verify that casing shift is visible in insert bottom resources calendar by Editing calendar of one of the insert bottom resources in resource schedule form.', async () => {
    const randomIndex = Math.floor(Math.random() * insertBotttomResources.length);
    gcRow = (await gcResourceSchedule.getRowsByTitle(insertBotttomResources[randomIndex]))[0];

    const dlgEditCalendar = await gcResourceSchedule.openEditCalendarDialog(gcRow);
    expect(await dlgEditCalendar.isVisible()).toBe(true, LogMessage.dialog_notVisible(await dlgEditCalendar.getTitle()));

    const isCasingShiftExisted = await dlgEditCalendar.listEvent.hasRow(
      [{ columnID: ListEventColumn.Name, value: EventName.CasingShift }],
      [[{ columnID: ListEventParentColumn.Category, value: EventCategoryName.Shift }]],
    );
    expect(isCasingShiftExisted).toBe(true, LogMessage.row_notFound(EventName.CasingShift));
  });

  it('Step 7: Delete always available shift since all resources have their shifts now.', async () => {
    await viewManageCalendars.switchTo();
    // Select Shift in event category list
    const eventCategoryRow = await listEventCategory.getRowByCellValue(ListEventCategoryColumn.Name, EventCategoryName.Shift);
    await listEventCategory.selectRows([eventCategoryRow]);

    // Delete the existing shifts
    await pnlEventAndOccurence.switchTo();
    const eventRow = await ccListEvent.getRowByValueInHierarchy(
      [{ columnID: ListEventColumn.Name, value: EventName.AlwaysAvailable }],
      [[{ columnID: ListEventParentColumn.Category, value: EventCategoryName.Shift }]],
    );
    await ccListEvent.deleteEvent(eventRow);

    // Verify it is no longer existed in list
    const isAlwaysAvailableExisted = await ccListEvent.hasRow(
      [{ columnID: ListEventColumn.Name, value: EventName.AlwaysAvailable }],
      [[{ columnID: ListEventParentColumn.Category, value: EventCategoryName.Shift }]],
    );
    expect(isAlwaysAvailableExisted).toBe(false, LogMessage.row_found([EventName.AlwaysAvailable]));
  });

  it("Step 8: Go to 1303's calendar and delete the casing shift", async () => {
    // Select 1303 resource in Calendars list
    const calendarRow = await listCalendar.getRowByCellValue(ListCalendarColumn.CalendarID, ResourceName._1303);
    await listCalendar.selectRows([calendarRow]);

    // Switch to Resource Calendar Events list
    await pnlRCEventList.switchTo();

    const rc1303 = await rcListEvent.getRowByValueInHierarchy(
      [{ columnID: ListResourceCalendarEventColumn.CalendarID, value: ResourceName._1303 }],
      [[{ columnID: ListEventParentColumn.Category, value: EventCategoryName.Shift }]],
    );

    await rcListEvent.deleteSubscription(rc1303);

    // Verify it is no longer existed in list
    const isCasingShift1303Existed = await rcListEvent.hasRow(
      [
        { columnID: ListResourceCalendarEventColumn.CalendarID, value: ResourceName._1303 },
        { columnID: ListResourceCalendarEventColumn.Name, value: EventName.CasingShift },
      ],
      [[{ columnID: ListEventParentColumn.Category, value: EventCategoryName.Shift }]],
    );
    expect(isCasingShift1303Existed).toBe(false, LogMessage.row_found([ResourceName._1303]));
  });

  it('Step 9: Go to event patterns list and edit printing shift', async () => {
    // Open Edit Shift Dialog for printing shift
    const printingShiftRow = await ccListEvent.getRowByValueInHierarchy(
      [{ columnID: ListEventColumn.Name, value: EventName.PrintingShift }],
      [[{ columnID: ListEventParentColumn.Category, value: EventCategoryName.Shift }]],
    );
    dlgEvent = await ccListEvent.openDialogEvent(printingShiftRow);
    expect(await dlgEvent.isVisible()).toBe(true, LogMessage.dialog_notVisible(await dlgEvent.getTitle()));
  });

  it('Step 10: Go to Subscribers tab and select 1303 for printing shift. Press "Ok"', async () => {
    // Select Insert Bottom resourses in subscribers list
    await dlgEvent.pnlSubscriber.switchTo();
    await dlgEvent.pnlSubscriber.listSubscriber.selectSubscribers([ResourceName._1303]);

    const [isOKButtonClickable, btnDisabledTooltip] = await dlgEvent.btnOk.verifyIsButtonClickable();
    expect(isOKButtonClickable).toBe(true, LogMessage.btn_notClickable('OK', btnDisabledTooltip));
    await dlgEvent.clickOK();
  });

  it("Step 11: Verify that printing shift is visible in 1303's resource calendar.", async () => {
    const isPrintingShift1303Existed = await rcListEvent.hasRow(
      [
        { columnID: ListResourceCalendarEventColumn.CalendarID, value: ResourceName._1303 },
        { columnID: ListResourceCalendarEventColumn.Name, value: EventName.PrintingShift },
      ],
      [[{ columnID: ListEventParentColumn.Category, value: EventCategoryName.Shift }]],
    );
    expect(isPrintingShift1303Existed).toBe(true, LogMessage.row_notFound(ResourceName._1303));
  });

  it('Step 12: Verify in the resource schedule that printing shift applied to resource 1303 whereas other insert bottom resources are stayed in the casing shift.', async () => {
    await viewSchedule.switchTo();
    // Show 5-1-2017 to 10-1-2017 in the gantt chart (to make visible the first weekend for verfication)
    await gcResourceSchedule.show(firstMondayPlanningHorizon, firstTuesdayPlanningHorizon);
    // FIX ME: RFC raised (CTAS-110946) to avoid calling browser sleep
    await browser.sleep(1000);

    // Verify printing shift applied to resource 1303 whereas other insert bottom resources are stayed in the casing shift.
    for (const insertBotttomResource of insertBotttomResources) {
      gcRow = (await gcResourceSchedule.getRowsByTitle(insertBotttomResource))[0];
      const mondayNodes = await gcRow.getNodes(firstMondayPlanningHorizon, firstTuesdayPlanningHorizon);
      if (insertBotttomResource === ResourceName._1303) {
        expect(mondayNodes.length).toBeGreaterThan(0, 'There should be some tasks scheduled on Monday');
      } else {
        expect(mondayNodes.length).toBe(0, 'No tasks should be scheduled on Monday');
      }
    }
  });
});
