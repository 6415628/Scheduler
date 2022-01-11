import { ExtractionType } from '../e2elib/lib/src/helper/enumhelper';
import { GanttChartNode } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartnode';
import { GanttChartRow } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchartrow';
import { getHtmlContent, getValuePairsFromHtmlTable } from './utils';
import { convertDateToUTC } from './timeutils';
import { promise } from '../e2elib/node_modules/@types/selenium-webdriver/';
import { protractor } from '../e2elib/node_modules/protractor';
import { GanttChartNodeCompartment } from '../e2elib/lib/src/pageobjects/ganttchart/qgcnodecompartment';
import { GanttChart } from '../e2elib/lib/src/pageobjects/ganttchart/ganttchart.component';

export class GanttChartBase extends GanttChart {

  /**
   * Find a node in an array which its Start Date & End Date matches
   *
   * @param nodes An array of nodes to find the node
   * @param startDate The start date of the node to find
   * @param endDate The end date of the node to find
   * @param isUTC Indicate whether both the start and end date is in UTC
   */
  public async findNodeByStartEndDate(nodes: GanttChartNode[], startDate: Date, endDate: Date, isUTC: boolean = true): Promise<GanttChartNode | undefined> {
    if (!isUTC) {
      startDate = convertDateToUTC(startDate);
      endDate = convertDateToUTC(endDate);
    }

    for (let node of nodes) {
      let start = await node.getStartDate();
      let end = await node.getEndDate();

      if (start && end) {
        let startDateIsMatch = start.getTime() === startDate.getTime();
        let endDataIsMatch = end.getTime() === endDate.getTime();

        if (startDateIsMatch && endDataIsMatch) {
          return node;
        }
      }
    }
    return;
  }

  /**
   * Get all the visible rows in the gantt chart
   *
   */
  public async getAllRows(): Promise<GanttChartRow[]> {
    let promises: promise.Promise<any>[] = [];
    let numRows = await this.getNumRows();
    for (let i = 0; i < numRows; i++) {
      promises.push(this.getRow(i));
    }
    return protractor.promise.all(promises);
  }

  /**
   * Get all the visible nodes in the gantt chart. If gantt chart row is provided, it will proceed to get all visible nodes from the given row,.
   * @param gcRow Gantt chart row which will be extracted for all visible nodes in the given row.
   */
  public async getAllNodes(gcRow?: GanttChartRow): Promise<GanttChartNode[]> {
    let promises: promise.Promise<any>[] = [];
    if (gcRow) {
      let numNodes = await gcRow.getNumNodes();
      for (let i = 0; i < numNodes; i++) {
        promises.push(gcRow.getNode(i));
      }
    } else {
      // when gcRow param is not given, perform recursion for each row present in the gantt chart with gcRow param.
      // with gcRow param passed in, this else block will not execute. only if block will be executed.
      let rows = await this.getAllRows();
      for (const row of rows) {
        promises.concat(this.getAllNodes(row));
      }
    }

    return protractor.promise.all(promises);
  }

  /**
   * Get gantt chart row title
   *
   * @param gcRow Target GCRow to retrieve row title value
   */
  public async getGCRowTitle(gcRow: GanttChartRow): Promise<string> {
    let titleHTML = await gcRow.getTitle();
    return getHtmlContent(titleHTML).join(' ');
  }

  /**
   * Get the last node of a row in gantt chart
   *
   * @param row row to get its last node
   * @returns last node of the specified row
   */
  public async getLastNode(row: GanttChartRow): Promise<GanttChartNode> {
    let numNodes = await row.getNumNodes();
    return <GanttChartNode>await row.getNode(numNodes - 1);
  }

  /**
   * Get node of a row based on node text in gantt chart
   *
   * @param row row to get its last node
   * @returns node of the specified row based on node text
   */
  public async getNode(row: GanttChartRow, nodeText: string): Promise<GanttChartNode | undefined> {
    let rowNodes = await this.getAllNodes(row);
    for (const node of rowNodes) {
      if ((await this.getNodeText(node)) === nodeText) {
        return node;
      }
    }
    return undefined;
  }

  /**
   * Get nodes of a row that fall between the specified start and end date
   *
   * @param rowName Name of the row to get nodes
   * @param startDate Start date to get from
   * @param endDate End date to get from
   * @param isUTC Indicates to convert the start and end date into UTC
   * @returns Array of GanttChartNode
   */
  public async getNodesBetweenDates(rowName: string, startDate: Date, endDate: Date, isUTC: boolean = true): Promise<GanttChartNode[]> {
    let rows = await this.getRowsByTitle(rowName);
    if (!isUTC) {
      startDate = convertDateToUTC(startDate);
      endDate = convertDateToUTC(endDate);
    }

    expect(rows.length).toBe(1, `Row with title ${rowName} couldn't be found.`);
    expect(rows.length).not.toBeGreaterThan(1, `${rows.length} of rows with title ${rowName} are retrieved.`);

    let row = rows[0];
    let nodes = await row.getNodes(startDate, endDate, ExtractionType.BOTH, true);

    return nodes;
  }

  /**
   * Get the color of the Gantt chart nodes
   *
   * @param nodes Nodes to get its color
   * @param compartmentIndex The index of the compartment of the node
   */
  public async getNodesColor(nodes: GanttChartNode[], compartmentIndex: number = 0): Promise<string[]> {
    let colors: promise.Promise<string>[] = [];

    for (let node of nodes) {
      let color = node.getCompartment(compartmentIndex).then((gcCompartment: GanttChartNodeCompartment | undefined) => {
        if (gcCompartment) {
          return gcCompartment.getBackgroundColor();
        }
        return node.getBackgroundColor();
      });

      colors.push(color);
    }

    return protractor.promise.all(colors);
  }

  /**
   * Get the total number of nodes of all rows within the specified period
   *
   * @param periodStart Date of start of period
   * @param periodEnd Date of end of period
   * @returns Number of nodes of all rows within period
   */
  public async getNumNodesFromAllRowsWithinPeriod(periodStart: Date, periodEnd: Date): Promise<number> {
    let numNodes = 0;
    let rowNum = await this.getNumRows();
    for (let i = 0; i <= rowNum; i++) {
      let row = await this.getRow(i);
      if (row !== undefined) {
        let nodes = await row.getNodes(periodStart, periodEnd);
        numNodes += nodes.length;
      }
    }
    return numNodes;
  }

  /**
   * Get all the visible nodes' text of Gantt chart row
   *
   * @param rowTitle The title of the Gantt chart row
   */
  public async getNodesText(row: GanttChartRow): Promise<string[]> {
    let texts: promise.Promise<string>[] = [];
    let text: Promise<string>;

    let nodes = await this.getAllNodes(row);

    for (let node of nodes) {
      text = this.getNodeText(node);
      texts.push(text);
    }

    return protractor.promise.all(texts);
  }

  /**
   * Get GanttChartNode text
   *
   * @param gcNode Target GCNode to retrieve node text value
   */
  public async getNodeText(gcNode: GanttChartNode): Promise<string> {
    let nodeHTMLText = await gcNode.getLeftNodeText();
    let nodeText = getHtmlContent(nodeHTMLText).join(' ');
    return nodeText;
  }

  /**
   * Trigger the tooltip on the GC Node and retrieve its value
   *
   * @param gcNode Target GC node to retrieve tooltip value
   * @returns Map object with titles map to values
   *
   */
  public async getNodeTooltipValuePairs(gcNode: GanttChartNode): Promise<Map<string, string>> {
    let tooltip = await this.triggerTooltip(gcNode);

    return getValuePairsFromHtmlTable(tooltip);
  }
}
