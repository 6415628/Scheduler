/**
 * @file        ADSC-5420
 * @description Defining irregular unavailability events and applying to a group of resources
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { QConsole } from '../e2elib/lib/src/helper/qconsole';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { GanttChartNode } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartnode';
import { GanttChartRow } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartrow';
import { browser } from '../e2elib/node_modules/protractor/built';
import { LogMessage } from '../libappbase/logmessage';
import { AppScheduler } from '../libsch/appsch';
import { EventCategoryName, EventName, EventRecurrenceType } from '../libsch/data/data.calendar';
import { OrderNr } from '../libsch/data/data.order';
import { ResourceName } from '../libsch/data/data.resource';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { InputEventFields } from '../libsch/dialogs/event';
import { DialogEvent } from '../libsch/dialogs/event/dialog.event';
import { ListEventCategoryColumn } from '../libsch/forms/commoncalendar';
import { ListCalendarColumn, ListResourceCalendarEventColumn } from '../libsch/forms/resourcecalendar';
import { ListEventParentColumn } from '../libsch/lists/list.event';
import { LogMessageSch } from '../libsch/logmessagesch';

describe('ADSC-5420, Defining irregular unavailability events and applying to a group of resources', () => {
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
  const formWorkOrdersAndOperation = viewSchedule.formWorkOrdersAndOperation;
  const pnlScheduleOverview = formResourceSchedule.pnlScheduleOverview;
  const gcResourceSchedule = pnlScheduleOverview.gcResourceSchedule;
  let gcRow1202: GanttChartRow;
  let gcRow1304: GanttChartRow;

  const gcResourceScheduleStart = new Date(2017, 0, 4);
  const gcResourceScheduleEnd = new Date(2017, 0, 7);
  const secondPlanningDayEnd = new Date(Date.UTC(2017, 0, 6));
  const secondPlanningDayStart = new Date(2017, 0, 5);
  const eventBreakdown: InputEventFields = {
    name: EventName.Breakdown,
    recurrenceType: EventRecurrenceType.None,
    isAllDay: true,
    startDate: new Date(2017, 0, 4),
    endDate: new Date(2017, 0, 5),
  };
  const printingResources: string[] = [ResourceName._1101, ResourceName._1102, ResourceName._1103, ResourceName._1104];

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

  it('Step 1: View the resource schedule. Verify that casing operation and insert bottom operation of order nr 50 are scheduled on 5th of January', async () => {
    await viewSchedule.switchTo();
    expect(await formWorkOrdersAndOperation.isVisible()).toBe(true, LogMessage.form_notVisible(await formWorkOrdersAndOperation.getTitle()));
    expect(await formResourceSchedule.isVisible()).toBe(true, LogMessage.form_notVisible(await formResourceSchedule.getTitle()));

    // Show 4th Jan to 7th Jan for Resource Schedule Gantt Chart
    await gcResourceSchedule.show(gcResourceScheduleStart, gcResourceScheduleEnd);
    await QConsole.waitForScreenUpdate();

    gcRow1202 = (await gcResourceSchedule.getRowsByTitle(ResourceName._1202))[0];
    gcRow1304 = (await gcResourceSchedule.getRowsByTitle(ResourceName._1304))[0];

    // Get end time of OrderNr 50 node on casing and insert bottom resources
    const casingNode = <GanttChartNode>await gcResourceSchedule.getNode(gcRow1202, OrderNr._50);
    const insertBottomNode = <GanttChartNode>await gcResourceSchedule.getNode(gcRow1304, OrderNr._50);
    const casingNodeStartTime = (await casingNode.getEndDate()) as Date;
    const insertBottomNodeStartTime = (await insertBottomNode.getEndDate()) as Date;

    // Verify casing and insert bottom operations for OrderNr 50 completed on 5th Jan
    expect(casingNodeStartTime).toBeLessThan(secondPlanningDayEnd, 'Casing Operation of OrderNr 50 should be scheduled on 5th of January.');
    expect(insertBottomNodeStartTime).toBeLessThan(secondPlanningDayEnd, 'Insert bottom Operation of OrderNr 50 should be scheduled on 5th of January.');
  });

  it('Step 2: Open view Data -> Manage Calendars', async () => {
    await viewManageCalendars.switchTo();
    expect(await formCommonCalendar.isVisible()).toBe(true, LogMessage.form_notVisible(await formCommonCalendar.getTitle()));
    expect(await formResourceCalendar.isVisible()).toBe(true, LogMessage.form_notVisible(await formResourceCalendar.getTitle()));
  });

  it("Step 3: Choose category as exception and right click on blank space in event patterns form and then click on 'Create event'.Verify that a dialog poped up.", async () => {
    // Select Exception in event category list
    const eventCategoryRow = await listEventCategory.getRowByCellValue(ListEventCategoryColumn.Name, EventCategoryName.Exception);
    await listEventCategory.selectRows([eventCategoryRow]);

    await pnlEventPattern.switchTo();
    dlgEvent = await gcCommonCalendar.openDialogEvent();
    expect(await dlgEvent.isVisible()).toBe(true, LogMessage.dialog_notVisible(await dlgEvent.getTitle()));
  });

  it('Step 4: Name it "Breakdown", select unavailable in type in order to make capacity 0, Recurence->None , Start date->4-Jan, End date->5-Jan. Thick up "All day" check box.', async () => {
    await dlgEvent.pnlEvent.updateDialogValues(eventBreakdown);
  });

  it('Step 5. Go to Subscribers tab and select printing resources. Press "Ok".', async () => {
    await dlgEvent.pnlSubscriber.switchTo();
    // Select printing resources
    await dlgEvent.pnlSubscriber.listSubscriber.selectSubscribers(printingResources);

    // Press "Ok"
    const [isOKButtonClickable, btnDisabledTooltip] = await dlgEvent.btnOk.verifyIsButtonClickable();
    expect(isOKButtonClickable).toBe(true, LogMessage.btn_notClickable('OK', btnDisabledTooltip));
    await dlgEvent.clickOK();
  });

  it('Step 6: Go to one of the printing resource from resource schedule and verify that breakdown is visible in its events list.', async () => {
    await pnlRCEventList.switchTo();

    // Get one resource from each resource group
    const printingResource = printingResources[Math.floor(Math.random() * printingResources.length)];
    // Select it in the Resource Calendar list
    const calendarRow = await listCalendar.getRowByCellValue(ListCalendarColumn.CalendarID, printingResource);
    await listCalendar.selectRows([calendarRow]);

    // Verify that breakdown is visible on casing and printing resources
    const isBreakdownPrintingExisted = await rcListEvent.hasRow(
      [
        { columnID: ListResourceCalendarEventColumn.CalendarID, value: printingResource },
        { columnID: ListResourceCalendarEventColumn.Name, value: EventName.Breakdown },
        { columnID: ListResourceCalendarEventColumn.NrOfOccurrences, value: '1' },
      ],
      [[{ columnID: ListEventParentColumn.Category, value: EventCategoryName.Exception }]],
    );
    expect(isBreakdownPrintingExisted).toBe(true, LogMessage.row_notFound(printingResource));
  });

  it('Step 7: Verify that casing and insert bottom operations for order nr 50 are postponed so their processes end on 6th of January.', async () => {
    await viewSchedule.switchTo();

    // Show 4th Jan to 7th Jan for Resource Schedule Gantt Chart
    await gcResourceSchedule.show(gcResourceScheduleStart, gcResourceScheduleEnd);
    // FIX ME: RFC raised (CTAS-110946) to avoid calling browser sleep
    await browser.sleep(1000);

    // Get end time of OrderNr 50 node on casing and insert bottom resources
    const casingNode = <GanttChartNode>await gcResourceSchedule.getNode(gcRow1202, OrderNr._50);
    const insertBottomNode = <GanttChartNode>await gcResourceSchedule.getNode(gcRow1304, OrderNr._50);
    const casingNodeStartTime = (await casingNode.getEndDate()) as Date;
    const insertBottomNodeStartTime = (await insertBottomNode.getEndDate()) as Date;

    // Verify casing and insert bottom operations for OrderNr 50 completed after 5th Jan
    expect(casingNodeStartTime).toBeGreaterThan(secondPlanningDayEnd, 'Casing Operation of OrderNr 50 should be scheduled on 6th of January.');
    expect(insertBottomNodeStartTime).toBeGreaterThan(secondPlanningDayEnd, 'Insert bottom Operation of OrderNr 50 should be scheduled on 6th of January.');
  });

  it('Step 8: Verify that calendars are closed in the gantt chart on the date when exceptional type of events are occured for all resources even though there are open shifts for printing resources.', async () => {
    for (const resource of printingResources) {
      const resourceNodesOnJan4 = await gcResourceSchedule.getNodesBetweenDates(resource, gcResourceScheduleStart, secondPlanningDayStart);
      expect(resourceNodesOnJan4.length).toBe(0, LogMessageSch.ganttchart_numOfNodesNotMatched(resource, 0, resourceNodesOnJan4.length));
    }
  });
});
