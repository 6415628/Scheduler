/**
 * @file        ADSC-5416
 * @description Defining shift patterns on a group of resources
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { ExtractionType } from '../e2elib/lib/src/helper/enumhelper';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { GanttChartNode } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartnode';
import { GanttChartRow } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartrow';
import { browser } from '../e2elib/node_modules/protractor/built';
import { LogMessage } from '../libappbase/logmessage';
import { asyncFilter, getHtmlContent } from '../libappbase/utils';
import { AppScheduler } from '../libsch/appsch';
import { EventCapacity, EventCategoryName, EventName, EventRecurrenceType, EventTime, EventTypeName, EventWeeklyRecurrencePattern } from '../libsch/data/data.calendar';
import { ResourceName } from '../libsch/data/data.resource';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { GanttChartNodeColor, GanttChartNodeText } from '../libsch/data/data.schedule';
import { InputEditSubscriptionFields } from '../libsch/dialogs/dialog.editsubscription';
import { DialogEvent } from '../libsch/dialogs/event/dialog.event';
import { InputEventFields } from '../libsch/dialogs/event/panel.event';
import { ListEventCategoryColumn, ListEventColumn } from '../libsch/forms/commoncalendar';
import { ListCalendarColumn, ListResourceCalendarEventColumn } from '../libsch/forms/resourcecalendar';
import { ListEventParentColumn } from '../libsch/lists/list.event';

describe('ADSC-5416, Defining shift patterns on a group of resources', () => {
  const appScheduler = AppScheduler.getInstance();

  const viewManageCalendars = appScheduler.viewManageCalendars;
  const formCommonCalendar = viewManageCalendars.formCommonCalendar;
  const listEventCategory = formCommonCalendar.listEventCategory;
  const pnlEventPattern = formCommonCalendar.pnlEventPattern;
  const pnlEventAndOccurence = formCommonCalendar.pnlEventAndOccurence;
  const ccListEvent = pnlEventAndOccurence.listEvent;
  const gcCommonCalendar = pnlEventPattern.gcCommonCalendar;
  let dlgEvent: DialogEvent;
  const formResourceCalendar = viewManageCalendars.formResourceCalendar;
  const listCalendar = formResourceCalendar.listCalendar;
  const pnlRCEventList = formResourceCalendar.pnlRCEventList;
  const rcListEvent = pnlRCEventList.listEvent;
  const rcListOccurrence = pnlRCEventList.listOccurrence;
  const pnlRCEventGantt = formResourceCalendar.pnlRCEventGantt;
  const gcResourceCalendar = pnlRCEventGantt.gcResourceCalendar;
  const viewSchedule = appScheduler.viewSchedule;
  const formResourceSchedule = viewSchedule.formResourceSchedule;
  const pnlScheduleOverview = formResourceSchedule.pnlScheduleOverview;
  const gcResourceSchedule = pnlScheduleOverview.gcResourceSchedule;
  let gcRow: GanttChartRow;

  const eventPrintingShift: InputEventFields = {
    name: EventName.PrintingShift,
    eventType: EventTypeName.Available,
    category: EventCategoryName.Shift,
    recurrenceType: EventRecurrenceType.Weekly,
    startTime: [EventTime.Hour08, EventTime.Min00],
    endTime: [EventTime.Hour17, EventTime.Min00],
    recurrenceWeekDays: [
      EventWeeklyRecurrencePattern.Monday,
      EventWeeklyRecurrencePattern.Tuesday,
      EventWeeklyRecurrencePattern.Wednesday,
      EventWeeklyRecurrencePattern.Thursday,
      EventWeeklyRecurrencePattern.Friday,
    ],
    recurrencePeriodStart: new Date(2017, 0, 4),
    recurrencePeriodEnd: new Date(2018, 0, 4),
  };

  const eventCasingShift: InputEventFields = {
    name: EventName.CasingShift,
    eventType: EventTypeName.Capacity,
    capacity: EventCapacity._1,
    category: EventCategoryName.Shift,
    recurrenceType: EventRecurrenceType.Weekly,
    startTime: [EventTime.Hour08, EventTime.Min00],
    endTime: [EventTime.Hour17, EventTime.Min00],
    recurrenceWeekDays: [EventWeeklyRecurrencePattern.Wednesday, EventWeeklyRecurrencePattern.Thursday, EventWeeklyRecurrencePattern.Friday],
    recurrencePeriodStart: new Date(2017, 0, 4),
    recurrencePeriodEnd: new Date(2018, 0, 4),
  };

  const subscription1104: InputEditSubscriptionFields = {
    isAllOccurrences: false,
    isPeriodOfTime: true,
    periodStart: new Date(2017, 0, 4),
    periodEnd: new Date(2017, 0, 4),
  };

  const printingResources: string[] = [ResourceName._1101, ResourceName._1102, ResourceName._1103, ResourceName._1104];
  const casingResources: string[] = [ResourceName._1201, ResourceName._1202, ResourceName._1203, ResourceName._1204];

  const firstThursdayPlanningHorizon = new Date(2017, 0, 5);
  const firstFridayPlanningHorizon = new Date(2017, 0, 6);
  const firstSaturdayPlanningHorizon = new Date(2017, 0, 7);
  const firstMondayPlanningHorizon = new Date(2017, 0, 9);
  const firstTuesdayPlanningHorizon = new Date(2017, 0, 10);

  const grey = GanttChartNodeColor.Grey;
  const yellow = GanttChartNodeColor.Yellow;
  const unavailable = GanttChartNodeColor.Unavailable;

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
    await appScheduler.switchToDemoScenario(DemoCategory.SalesDemo, DemoScenario.Paperbags);
  });

  afterAll(async () => {
    await appScheduler.cleanUpDataset();
    await appScheduler.logout();
  });

  afterEach(async () => {
    await appScheduler.checkToastMessage();
  });

  it('Step 1: Open view Data -> Manage Calendars', async () => {
    await viewManageCalendars.switchTo();
    expect(await formCommonCalendar.isVisible()).toBe(true, LogMessage.form_notVisible('Common Calendar'));
    expect(await formResourceCalendar.isVisible()).toBe(true, LogMessage.form_notVisible('Resource Calendar'));
  });

  it('Step 2: In the Event patterns list, delete the existing shifts.', async () => {
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

    // Verify that calendar is not open anymore
    const eventPatternGCNodes = await gcCommonCalendar.getAllNodes();
    const isEventCalendarGCEmpty = eventPatternGCNodes.length === 0;
    expect(isEventCalendarGCEmpty).toBe(true, 'Event Calendar gantt chart should be empty');
  });

  it('Step 3: Right click on blank space in Event patterns form and then click on "Create event"', async () => {
    await pnlEventPattern.switchTo();
    dlgEvent = await gcCommonCalendar.openDialogEvent();
    expect(await dlgEvent.isVisible()).toBe(true, LogMessage.dialog_notVisible(await dlgEvent.getTitle()));
  });

  it('Step 4: Create a new event for Printing Shift', async () => {
    await dlgEvent.pnlEvent.switchTo();
    await dlgEvent.pnlEvent.updateDialogValues(eventPrintingShift);

    await dlgEvent.pnlSubscriber.switchTo();
    await dlgEvent.pnlSubscriber.listSubscriber.selectSubscribers(printingResources);

    const [isOKButtonClickable, btnDisabledTooltip] = await dlgEvent.btnOk.verifyIsButtonClickable();
    expect(isOKButtonClickable).toBe(true, LogMessage.btn_notClickable('OK', btnDisabledTooltip));
    await dlgEvent.clickOK();
  });

  it('Step 5: Create a new event for Casing Shift.', async () => {
    dlgEvent = await gcCommonCalendar.openDialogEvent();

    await dlgEvent.pnlEvent.switchTo();
    await dlgEvent.pnlEvent.updateDialogValues(eventCasingShift);

    await dlgEvent.pnlSubscriber.switchTo();
    await dlgEvent.pnlSubscriber.listSubscriber.selectSubscribers(casingResources);

    const [isOKButtonClickable, btnDisabledTooltip] = await dlgEvent.btnOk.verifyIsButtonClickable();
    expect(isOKButtonClickable).toBe(true, LogMessage.btn_notClickable('OK', btnDisabledTooltip));
    await dlgEvent.clickOK();
  });

  it('Step 6: Verify that there are two recurred events in Events list.', async () => {
    // Verify 2 shifts are created
    await pnlEventAndOccurence.switchTo();
    const eventRowCount = await ccListEvent.getRowCount();
    // total row count should be 3, 2 newly created and their parent row "Shift"
    expect(eventRowCount).toBe(3, LogMessage.value_notMatched('3', eventRowCount.toString()));
    const isPrintingShiftExisted = await ccListEvent.hasRow(
      [{ columnID: ListEventColumn.Name, value: EventName.PrintingShift }],
      [[{ columnID: ListEventParentColumn.Category, value: EventCategoryName.Shift }]],
    );
    expect(isPrintingShiftExisted).toBe(true, LogMessage.row_notFound(EventName.PrintingShift));
    const isCasingShiftExisted = await ccListEvent.hasRow(
      [{ columnID: ListEventColumn.Name, value: EventName.CasingShift }],
      [[{ columnID: ListEventParentColumn.Category, value: EventCategoryName.Shift }]],
    );
    expect(isCasingShiftExisted).toBe(true, LogMessage.row_notFound(EventName.CasingShift));
  });

  it('Step 7: In Resource Calendar, Edit calendar of one of the printing or casing resources and verify that shifts are visible in their events list.', async () => {
    await pnlRCEventList.switchTo();
    const calendarRows = await listCalendar.getRowsByCellValuesFromOneColumn(ListCalendarColumn.CalendarID, printingResources);
    await listCalendar.selectRows(calendarRows);

    // Edit 1104 calendar to only have the shift for first week
    const rc1104 = await rcListEvent.getRowByValueInHierarchy(
      [{ columnID: ListResourceCalendarEventColumn.CalendarID, value: ResourceName._1104 }],
      [[{ columnID: ListEventParentColumn.Category, value: EventCategoryName.Shift }]],
    );
    const dlgEditSubscription = await rcListEvent.openEditSubscriptionDialog(rc1104);
    await dlgEditSubscription.updateDialog(subscription1104);
    const [isOKButtonClickable, btnDisabledTooltip] = await dlgEditSubscription.btnOk.verifyIsButtonClickable();
    expect(isOKButtonClickable).toBe(true, LogMessage.btn_notClickable('OK', btnDisabledTooltip));
    await dlgEditSubscription.clickOK();

    // Verify NrOfOccurrences for edited calendar resource
    const rcOccurrenceCount1104 = await rcListOccurrence.getRowCount();
    expect(rcOccurrenceCount1104).toBe(1, LogMessage.value_notMatched('1', rcOccurrenceCount1104.toString()));

    // Verify NrOfOccurrences for the original calendar resource
    const rc1101 = await rcListEvent.getRowByValueInHierarchy(
      [{ columnID: ListResourceCalendarEventColumn.CalendarID, value: ResourceName._1101 }],
      [[{ columnID: ListEventParentColumn.Category, value: EventCategoryName.Shift }]],
    );
    const rcOccurrenceCount1101 = await rcListEvent.getCellValueFromRow(ListResourceCalendarEventColumn.NrOfOccurrences, rc1101);
    expect(rcOccurrenceCount1101).toBe('43', LogMessage.value_notMatched('43', rcOccurrenceCount1101));
  });

  it('Step 8: Verify that calendars are visible in the gantt chart for casing and printing resources.', async () => {
    await pnlRCEventGantt.switchTo();
    const allCalendarRows = await listCalendar.getAllRows();
    await listCalendar.selectRows(allCalendarRows);

    const gcRows = await gcResourceCalendar.getAllRows();
    for (const row of gcRows) {
      const rowTitle = getHtmlContent(await row.getTitle())[0];
      const nodes = await gcResourceCalendar.getAllNodes(row);
      // Getting nr of nodes for each resource for a day
      // expect 3 nodes if it is casing or printing resources. 1) unavailable from 12am to 8am, 2) available from 8am to 5pm, 3) unavailable from 5pm to 12am
      // expect 1 node otherwise. 1) unavailable from 12am to 12am next day
      if (printingResources.includes(rowTitle) || casingResources.includes(rowTitle)) {
        const nodeColors = await gcResourceCalendar.getNodesColor(nodes);
        expect(nodes.length).toBe(3, LogMessage.value_notMatched('3', nodes.length.toString()));
        expect(nodeColors[0]).toBe(grey, LogMessage.value_notMatched(grey, nodeColors[0]));
        expect(nodeColors[1]).toBe(yellow, LogMessage.value_notMatched(yellow, nodeColors[1]));
        expect(nodeColors[2]).toBe(grey, LogMessage.value_notMatched(grey, nodeColors[2]));
      } else {
        expect(nodes.length).toBe(1, LogMessage.value_notMatched('1', nodes.length.toString()));
      }
    }
  });

  it('Step 9: Verify that weekends are closed in the calendar and the tasks that are not finished on Fridays are carry overed on Mondays.', async () => {
    await viewSchedule.switchTo();
    expect(await formResourceSchedule.isVisible()).toBe(true, LogMessage.form_notVisible('Resource Schedule'));
    await pnlScheduleOverview.switchTo();

    await gcResourceSchedule.show(firstThursdayPlanningHorizon, firstTuesdayPlanningHorizon);
    // FIX ME: RFC raised (CTAS-110946) to avoid calling browser sleep
    await browser.sleep(1000);

    gcRow = (await gcResourceSchedule.getRowsByTitle(ResourceName._1101))[0];
    const weekendNodes = await gcRow.getNodes(firstSaturdayPlanningHorizon, firstMondayPlanningHorizon);
    expect(weekendNodes.length).toBe(0, 'No tasks should be scheduled on weekend');

    let fridayNodes = await gcRow.getNodes(firstFridayPlanningHorizon, firstSaturdayPlanningHorizon);
    // filter out empty nodes
    fridayNodes = await asyncFilter(fridayNodes, async (node: GanttChartNode) => (await node.getLeftNodeText()).length > 0);
    const mondayNodes = await gcRow.getNodes(firstMondayPlanningHorizon, firstTuesdayPlanningHorizon);

    const lastFridayNodeText = await fridayNodes[fridayNodes.length - 1].getLeftNodeText();
    const firstMondayNodeText = await mondayNodes[0].getLeftNodeText();
    expect(lastFridayNodeText).toBe(firstMondayNodeText, LogMessage.value_notMatched(firstMondayNodeText, lastFridayNodeText));
  });

  it('Step 10: Verify that shift ends at 17.00 and unfinished tasks are carried over to next day', async () => {
    const shiftEnd = new Date(Date.UTC(2017, 0, 5, 17));
    const shiftStart = new Date(Date.UTC(2017, 0, 6, 8));

    // Get unfinished task 8
    const unfinishedTaskNode = <GanttChartNode>await gcResourceSchedule.getNode(gcRow, GanttChartNodeText._8);
    const unfinishedTaskStart = <Date>await unfinishedTaskNode.getStartDate();
    const unfinishedTaskEnd = <Date>await unfinishedTaskNode.getEndDate();

    // Verify unfinished task is carried over to next day
    expect(unfinishedTaskStart).toBeLessThan(shiftEnd, `Task 8 should start before shift end: ${shiftEnd}`);
    expect(unfinishedTaskEnd).toBeGreaterThan(shiftStart, `Task 8 should end before shift start: ${shiftStart}`);

    // Verify resource doesn't have any task outside its shift
    let nodesOutsideShift = await gcRow.getNodes(shiftEnd, shiftStart, ExtractionType.BOTH, true);
    const nodesColors = await gcResourceSchedule.getNodesColor(nodesOutsideShift);
    expect(nodesColors[0]).toBe(unavailable, LogMessage.value_notMatched(unavailable, nodesColors[0]));
    nodesOutsideShift = await asyncFilter(nodesOutsideShift, async (node: GanttChartNode) => (await node.getLeftNodeText()).length > 0);
    expect(nodesOutsideShift.length).toBe(0, 'No tasks should be scheduled outside shift');
  });
});
