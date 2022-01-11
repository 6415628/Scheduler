/**
 * @file        ADSC-4918
 * @description View calendar downtimes in Web Client Gantt chart
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { LogMessage } from '../libappbase/logmessage';
import {
  EventCategoryName,
  EventName,
  EventRecurrenceType,
  EventTime,
  EventTypeName,
} from '../libsch/data/data.calendar';
import { DialogEvent } from '../libsch/dialogs/event/dialog.event';
import { InputEventFields } from '../libsch/dialogs/event/panel.event';
import { ResourceName } from '../libsch/data/data.resource';
import { GanttChartNodeColor } from '../libsch/data/data.schedule';
import { DialogEditCalendar, ListEventChildColumn } from '../libsch/dialogs/dialog.editcalendar';
import { GanttChartRow } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartrow';
import { ListEventParentColumn } from '../libsch/lists/list.event';

describe('ADSC-4918, View calendar downtimes in Web Client Gantt chart', () => {
  const appScheduler = AppScheduler.getInstance();

  let dlgEditCalendar: DialogEditCalendar;
  let dlgEvent: DialogEvent;
  const viewSchedule = appScheduler.viewSchedule;
  const formResourceSchedule = viewSchedule.formResourceSchedule;
  const pnlScheduleOverview = formResourceSchedule.pnlScheduleOverview;
  const gcResourceSchedule = pnlScheduleOverview.gcResourceSchedule;
  let gcRowSC1: GanttChartRow;

  const eventDowntime: InputEventFields = {
    name: EventName.Downtime,
    eventType: EventTypeName.Unavailable,
    category: EventCategoryName.Unavailable,
    recurrenceType: EventRecurrenceType.None,
    startDate: new Date(2017, 0, 5),
    startTime: [EventTime.Hour06, EventTime.Min00],
    endDate: new Date(2017, 0, 5),
    endTime: [EventTime.Hour08, EventTime.Min00],
  };

  const sc1 = ResourceName.Sc1;

  const downtimeStart = new Date(2017, 0, 5, 6);
  const downtimeEnd = new Date(2017, 0, 5, 8);

  const unavailable = GanttChartNodeColor.Unavailable;

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
    await appScheduler.switchToDemoScenario(DemoCategory.SalesDemo, DemoScenario.AluminumHotRolling);
  });

  afterAll(async () => {
    await appScheduler.cleanUpDataset();
    await appScheduler.logout();
  });

  afterEach(async () => {
    await appScheduler.checkToastMessage();
  });

  it('Step 1: Open view Schedule -> Schedule', async () => {
    await viewSchedule.switchTo();
    expect(await formResourceSchedule.isVisible()).toBe(true, LogMessage.form_notVisible('Resource Schedule'));
  });

  it('Step 2: Create a downtime period for SC1 on Jan 5th 2017 from 6:00 until 8:00 and put "Downtime" in the Name field', async () => {
    await pnlScheduleOverview.switchTo();
    gcRowSC1 = (await gcResourceSchedule.getRowsByTitle(sc1))[0];

    // Open Edit Calendar Dialog for SC1
    dlgEditCalendar = await gcResourceSchedule.openEditCalendarDialog(gcRowSC1);
    expect(await dlgEditCalendar.isVisible()).toBe(true, LogMessage.dialog_notVisible('Edit Calendar'));

    // Verify SC1 is selected for calendar dropdown
    const calendar = await dlgEditCalendar.ddlCalendar.getSelectedString();
    expect(calendar).toBe(sc1, LogMessage.ddl_incorrectSelection('Calendar', sc1));

    // Open Event dialog
    dlgEvent = await dlgEditCalendar.listEvent.openDialogEvent();
    expect(await dlgEvent.isVisible()).toBe(true, LogMessage.dialog_notVisible('Event'));

    // Update Event tab fields
    await dlgEvent.pnlEvent.switchTo();
    await dlgEvent.pnlEvent.updateDialogValues(eventDowntime);

    const [isOKButtonClickable, btnDisabledTooltip] = await dlgEvent.btnOk.verifyIsButtonClickable();
    expect(isOKButtonClickable).toBe(true, LogMessage.btn_notClickable('OK', btnDisabledTooltip));
    await dlgEvent.clickOK();
    await dlgEditCalendar.clickOK();
  });

  it('Step 3: Verify in Resource Schedule GC the downtime is correctly displayed', async () => {
    // Open Resource Schedule GC
    await viewSchedule.switchTo();
    expect(await formResourceSchedule.isVisible()).toBe(true, LogMessage.form_notVisible('Resource Schedule'));
    await pnlScheduleOverview.switchTo();

    // Retrieve Downtime Node
    const downtimeNodes = await gcResourceSchedule.getNodesBetweenDates(sc1, downtimeStart, downtimeEnd, false);
    expect(downtimeNodes.length).toBe(1, LogMessage.value_notMatched('1', downtimeNodes.length.toString()));

    // Verify Downtime node color is overlay (unavailable) color
    const nodesColors = await gcResourceSchedule.getNodesColor(downtimeNodes);
    expect(nodesColors[0]).toBe(unavailable, LogMessage.value_notMatched(unavailable, nodesColors[0]));
  });

  xit('Step 4: Verify hovering with the mouse over downtime node displays a tooltip with the following informatiion: Resource, Duration, Capacity, Start and End', async () => {
    // FIXME: currently this verification is not possible.
    // Waiting for Core team to implement tooltip for overlay web gantt chart node (CTAS-48106)
  });

  it('Step 5: Remove the downtime period for SC1', async () => {
    // Open Edit Calendar Dialog for SC1
    dlgEditCalendar = await gcResourceSchedule.openEditCalendarDialog(gcRowSC1);

    // Delete SC1 downtime event
    const rcSC1 = await dlgEditCalendar.listEvent.getRowByValueInHierarchy(
      [{ columnID: ListEventChildColumn.Name, value: EventName.Downtime }],
      [[{ columnID: ListEventParentColumn.Category, value: EventCategoryName.Unavailable }]],
    );
    await dlgEditCalendar.listEvent.deleteEvent(rcSC1);
    await dlgEditCalendar.clickOK();
  });

  it('Step 6: Verify in Resouce Schedule GC the downtime is not displayed anymore', async () => {
    // Retrieve Nodes on Jan 5th 2017 from 6:00 until 8:00 (same time as downtime)
    const nodes = await gcResourceSchedule.getNodesBetweenDates(sc1, downtimeStart, downtimeEnd, false);
    // Verify no nodes has overlay (unavailable) color
    const nodesColors = await gcResourceSchedule.getNodesColor(nodes);
    for (const nodeColor of nodesColors) {
      expect(nodeColor).not.toBe(unavailable, LogMessage.value_isMatched(unavailable, nodeColor));
    }
  });
});
