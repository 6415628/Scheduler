/**
 * @file        TD002048
 * @description Tool tips on Gantt chart nodes
 * @author      Adrian Foo
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { ResourceName } from '../libsch/data/data.resource';
import { ExtractionType } from '../e2elib/lib/src/helper/enumhelper';
import { GanttChartRow } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartrow';
import { GanttChartNode } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartnode';
import { findHtmlElementByTag } from '../libappbase/utils';
import { HeatingTaskTooltip, ScalpingTaskTooltip } from '../libsch/data/data.schedule';
import { maxDate } from '../libappbase/timeutils';

describe('TD002048, Tool tips on Gantt chart nodes', () => {
  // Component used in this test script
  const appScheduler = AppScheduler.getInstance();
  const formWorkOrdersAndOperation = appScheduler.viewSchedule.formWorkOrdersAndOperation;
  const formResourceSchedule = appScheduler.viewSchedule.formResourceSchedule;
  const ganttChartResourceSchedule = formResourceSchedule.pnlScheduleOverview.gcResourceSchedule;

  // Data used across multiple test steps
  let planDate: Date;
  let scalpingResourceGcRow: GanttChartRow;
  let scalpingTaskGcNode: GanttChartNode;
  let heatingResourceGcRow: GanttChartRow;
  let heatingTaskGcNode: GanttChartNode;

  // Function used across multiple steps
  const verifyTooltipIsInHtmlTableFormat = (tooltip: string, expectedRowCount: number): void => {
    let tableElement = findHtmlElementByTag(tooltip, 'table');
    let trElements = findHtmlElementByTag(tooltip, 'tr');

    expect(tableElement).not.toBeNull("Tooltip doesn't appeared as HTML table with <table> tag"); // Verify the tooltip is formatted with HTML table
    expect(trElements).not.toBeNull("Tooltip doesn't contains any table row with <tr> tag"); // Verify the tooltip contains HTML table rows

    if (trElements) {
      expect(trElements.length).toBe(expectedRowCount, `Expect ${expectedRowCount} rows but getting ${trElements.length} rows: ${trElements}`); // Verify the tooltip has correct table rows
    }
  };

  const verifyTooltipHasCorrectTitle = (tooltip: Map<string, string>, expectedTooltipTitle: string[]): void => {
    expectedTooltipTitle.forEach((title: string) =>
      expect(tooltip.has(title)).toBe(true, `'${title}' couldn't be found in tooltip's title '${Array.from(tooltip.keys()).join(', ')}'`),
    );
  };

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

  it('Setup: Switch to Scheduling view.', async () => {
    await appScheduler.viewSchedule.switchTo();

    expect(await formResourceSchedule.isVisible()).toBe(true, 'Expected: Form Resource Schedule should be visible');
    expect(await formWorkOrdersAndOperation.isVisible()).toBe(true, 'Expected: Form Work Orders and Operations should be visible');

    planDate = await appScheduler.getPlanDate();
  });

  it('Step 1: Hover on Scalping task in Gantt chart resource schedule to show the tooltip', async () => {
    let rowsFound = await ganttChartResourceSchedule.getRowsByTitle(ResourceName.Sc1);
    expect(rowsFound.length).toBe(1, `More than 1 rows with title ${ResourceName.Sc1} were found`);
    scalpingResourceGcRow = rowsFound[0];

    scalpingTaskGcNode = (await scalpingResourceGcRow.getNodes(planDate, maxDate, ExtractionType.START, true))[0];

    let expectedTooltipTitle = ScalpingTaskTooltip.titles;
    let tooltip = await ganttChartResourceSchedule.triggerTooltip(scalpingTaskGcNode);
    const tooltipValuePair = await ganttChartResourceSchedule.getNodeTooltipValuePairs(scalpingTaskGcNode);

    verifyTooltipIsInHtmlTableFormat(tooltip, 7);
    verifyTooltipHasCorrectTitle(tooltipValuePair, expectedTooltipTitle);
  });

  it('Step 2: Hover on Heating task in Gantt chart resource schedule to show the tooltip', async () => {
    let rowsFound = await ganttChartResourceSchedule.getRowsByTitle(ResourceName.BigPit1);
    expect(rowsFound.length).toBe(1, `More than 1 rows with title ${ResourceName.BigPit1} were found`);
    heatingResourceGcRow = rowsFound[0];

    heatingTaskGcNode = (await heatingResourceGcRow.getNodes(planDate, maxDate, ExtractionType.START, true))[0];

    let expectedTooltipTitle = HeatingTaskTooltip.titles;
    let tooltip = await ganttChartResourceSchedule.triggerTooltip(heatingTaskGcNode);
    const tooltipValuePair = await ganttChartResourceSchedule.getNodeTooltipValuePairs(heatingTaskGcNode);

    verifyTooltipIsInHtmlTableFormat(tooltip, 9);
    verifyTooltipHasCorrectTitle(tooltipValuePair, expectedTooltipTitle);
  });
});
