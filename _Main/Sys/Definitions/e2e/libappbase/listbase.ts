import { ColumnMenuName, FilterMenuName, SortDirection } from '../e2elib/lib/src/helper/enumhelper';
import { QUtils } from '../e2elib/lib/src/main/qutils.class';
import { ContextMenu } from '../e2elib/lib/src/pageobjects/contextmenu/contextmenu.component';
import { List } from '../e2elib/lib/src/pageobjects/list/list.component';
import { ListCell } from '../e2elib/lib/src/pageobjects/list/listcell.component';
import { ListColumn } from '../e2elib/lib/src/pageobjects/list/listcolumn.component';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { promise } from '../e2elib/node_modules/@types/selenium-webdriver/';
import { by, protractor } from '../e2elib/node_modules/protractor';
import { FilterManager } from './filtermanager';
import { asyncFilter, EnumLike, getEnumKeyEntries, getHtmlContent, lowercaseFirstLetter } from './utils';

export class ListBase extends List {
  private readonly _dlgFilterManager = new FilterManager();

  /**
   * Configure the list to show specified columns.
   *
   * @param actionBarName action bar name for the list.
   * @param columnMenu column which shall be toggled to show in the list
   * @param columnMenus columns which shall be toggled to show in the list
   * @example
   * await list.configureColumns('abpList', 'OrderID');
   * await list2.configureColumns('abpList2', 'MachineID', 'MachineName', 'Speed', 'MachineType');
   */
  public async configureColumns(actionBarName: string, columnMenu?: ColumnMenuName | string, ...columnMenus: ColumnMenuName[] | string[]): Promise<void> {
    await this.leftClickOnWhiteSpace();
    if (columnMenu) {
      await super.configureColumns(actionBarName, columnMenu);
    }
    for (const menu of columnMenus) {
      await super.configureColumns(actionBarName, menu);
    }
  }

  /**
   * Simulate dragging a list row and drop it on another list row
   *
   * @param sourceRow The list row(s) to be dragged
   * @param targetRow The list row to be dropped
   * @param hasTooltips retrieve the info tooltip while drop is not allow
   *
   * @returns Promise<string>
   */
  public async dropRowOnTargetRow(sourceRow: ListRow | ListRow[], targetRow: ListRow, hasTooltips: boolean = false): Promise<string> {
    await this.selectRows(Array.isArray(sourceRow) ? sourceRow : [sourceRow]);
    if (Array.isArray(sourceRow)) {
      return QUtils.emitDragAndDropEvent(sourceRow[0].element, targetRow.element, hasTooltips);
    }
    return QUtils.emitDragAndDropEvent(sourceRow.element, targetRow.element, hasTooltips);
  }

  /**
   * Simulate dragging a list row and drop it on the white space of the list
   *
   * @param sourceRow Source row to drag
   * @param hasTooltips retrieve the info tooltip while drop is not allow
   */
  public async dropRowOnWhiteSpace(sourceRow: ListRow | ListRow[], hasTooltips: boolean = false): Promise<string> {
    const dropTarget = this.element.element(by.css('q-scrollarea'));
    await this.selectRows(Array.isArray(sourceRow) ? sourceRow : [sourceRow]);

    if (Array.isArray(sourceRow)) {
      return QUtils.emitDragAndDropEvent(sourceRow[0].element, dropTarget, hasTooltips);
    }
    return QUtils.emitDragAndDropEvent(sourceRow.element, dropTarget, hasTooltips);
  }

  /**
   * Finds a row (by typing the specified search value) from the list, then gets the row.
   *
   * This method allows auto-navigation to the specified row.
   *
   * @param target target row to be navigated
   * @param parents parent rows of the targeted row (optional: only should be specified for hierarchy list)
   *
   * @return List row found
   */
  public async findRowByValue(target: ColumnValueSearch, parents?: ColumnValueSearch[]): Promise<ListRow> {
    // Search through the list to ensure the row is visible to avoid undefined row when using getRowByValue()
    await (parents ? this.searchListInHierarchy(target, parents) : this.searchList(target.columnID, target.searchValue));
    return this.getRowByValue([{ columnID: target.columnID, value: target.searchValue }]);
  }

  /**
   * Get the cells by columns of a list row
   *
   * @param row The row to retrieve it cells
   * @param columnsIndexName The columns' name/index of the cells to retreive
   */
  public async getCellsFromRow(row: ListRow, columnsIndexName?: string[] | number[] | EnumLike): Promise<Map<string | number, ListCell>> {
    let columnCellMap: Map<string | number, ListCell> = new Map();

    if (columnsIndexName) {
      // type guarder that checks if columnsIndexName is array or EnumLike, true if it's EnumLike
      let enumLike = (e: string[] | number[] | EnumLike): e is EnumLike => !Array.isArray(e);

      if (enumLike(columnsIndexName)) {
        let keys = getEnumKeyEntries(columnsIndexName);
        for (const key of keys) {
          let cell: ListCell;
          try {
            cell = await row.getCell(columnsIndexName[key]);
          } catch {
            await this.resizeColumnWithCoveredName(columnsIndexName[key], 50);
            cell = await row.getCell(columnsIndexName[key]);
          }
          columnCellMap.set(key, cell);
        }
      } else {
        for (let column of columnsIndexName as string[] | number[]) {
          let cell: ListCell;
          try {
            cell = await row.getCell(column);
          } catch {
            if (typeof column === 'string') {
              await this.resizeColumnWithCoveredName(column, 50);
            }
            cell = await row.getCell(column);
          }
          columnCellMap.set(column, cell);
        }
      }
    } else {
      columnCellMap = await this.getAllCellsInRow(row);
    }

    return columnCellMap;
  }

  /**
   * Get the cell value of the row by column
   *
   * @param columnIndexName Column name of the cell value
   * @param row Row to retrieve the cell value
   * @param isImgAttribute To determine whether pass-in column name is image attribute column
   * @returns the cell value of the row
   */
  public async getCellValueFromRow(columnIndexName: string | number, rows: ListRow, isImgAttribute?: boolean): Promise<string>;

  /**
   * Loop through all the rows to get the cell value by column
   *
   * @param columnIndexName Column name of the cell value
   * @param rows Rows to retrieve the cell value
   * @param isImgAttribute To determine whether pass-in column name is image attribute column
   * @returns Array of cell values
   */
  public async getCellValueFromRow(columnIndexName: string | number, rows: ListRow[], isImgAttribute?: boolean): Promise<string[]>;

  public async getCellValueFromRow(columnIndexName: string | number, rows: ListRow | ListRow[], isImgAttribute: boolean = false): Promise<string | string[]> {
    if (rows instanceof ListRow) {
      const cell = await rows.getCell(columnIndexName);
      const value = isImgAttribute ? await cell.getImageAttribute() : await cell.getValue();
      return value;
    } else {
      const promises: promise.Promise<string>[] = [];
      for (let row of rows) {
        const value = row.getCell(columnIndexName).then((cell: ListCell) => (isImgAttribute ? cell.getImageAttribute() : cell.getValue()));
        promises.push(value);
      }
      const values = await protractor.promise.all(promises);
      return values;
    }
  }

  /**
   * Get all cell values from a given row.
   *
   * @description The function will obtain all cell values from the given row.\
   * If `columnIDs` is defined, the function will obtain cell values from the given columns, in the given row.
   *
   * @template T Generic type T which extends the properties of either `EnumLike`, `string[]` or `number[]`.
   * @template K Generic type K which stands for key, which extends the properties from the key of type `T` only when it's enumerator-like.
   * @param {ListRow} row `ListRow` The row to retrive its cell values
   * @param {T} columnIDs `T` (Optional) Columns to determine the values to be retrieved. Accepts an enumerator, `string[]` or `number[]`.
   *
   * @return `Promise<Record<K, string>` or `Promise<Record<string, string>` -- depends on the parameter `columnIDs`.\
   * IF it's enumerator-like then former return type will be used, ELSE IF it's `string[]` or `number[]` then the latter return type will be used.
   *
   * @example |   ...  | Order ID |   Name  | ...and other columns
   *          | imgYes |  12345   | Order 1 | ...and other values
   * // assume row is illustrated like above.
   * // first column is sized shorter than the column name resulting in '...'. Assume the column name as 'ImgPlanned'
   *
   * ----- example usage (most recommended usage) -----
   * enum OrderColumn {
   * IMGPLANNED = 'imgPlanned';
   * ORDER_ID = 'Order ID';
   * NAME = 'Name';
   * }
   * // type-safe call by passing the entire OrderColumn enum into the method.
   * const {IMGPLANNED, ORDER_ID, NAME} = await getCellValuesInRow(row, OrderColumn); // safe, obtains value from column imgPlanned, Order ID and Name.
   * const {NAME} = await getCellValuesInRow(row, OrderColumn); // safe, obtains value from column Name.
   * const {IMGPLANNED, random1} = await getCellValuesInRow(row, OrderColumn) // ERROR, typescript will auto highlight 'random1' in red.
   *
   * // you can also call such as the line of code below, but TypeScript will not tell you whether the names are correct or not.
   * const {imgPlanned, orderID} = await getCellValuesInRow(row, ['ImgPlanned', 'Order ID']);
   * // thus this is not type-safe and we only recommend to perform type-safe calls.
   */
  public async getCellValuesFromRow<T extends CellValue, K extends keyof T>(
    row: ListRow,
    columnIDs?: T,
  ): Promise<Record<T extends undefined ? string : T extends any[] ? string : K, string>> {
    let values = {} as any; // type assertion
    let columnCellMap = await this.getCellsFromRow(row, columnIDs);
    // type guarder
    let enumLike = (e: any): e is EnumLike => !Array.isArray(e);
    // if columnsIndexName exists and it's not enum-like, or doesn't exists at all (to prevent lowercasing if columnsIndexName is passed in as enumerator)
    let isNotEnumLike = (columnIDs && !enumLike(columnIDs)) || !columnIDs;

    for (const [column, cell] of columnCellMap) {
      let value = await (await cell.isImageAttributeCell() ? cell.getImageAttribute() : cell.getValue());
      let columnName = column;
      if (isNotEnumLike) {
        if (typeof column === 'string') {
          columnName = column.replace(/\s/, '');
          columnName = lowercaseFirstLetter(columnName);
        } else if (typeof column === 'number') {
          columnName = column.toString(10);
        }
      }

      if (value === '') {
        value = await cell.getImageAttribute();
      }

      values[columnName] = value;
    }

    return values;
  }

  /**
   * Get the column by the title of the tooltip of the column
   *
   * @param title The title of the tooltip of the column
   */
  public async getColumnByToolipTitle(title: string): Promise<ListColumn | undefined> {
    let columnCount = await this.getColumnCount();
    let column: ListColumn;
    let titleFound: string;

    for (let i = 0; i < columnCount; i++) {
      column = await this.getColumnByIndex(i);
      let tooltip = await column.getTooltip(true, false, true);
      titleFound = getHtmlContent(tooltip)[0]; // Tooltip title will be at the first array item

      if (titleFound === title) {
        return column;
      }
    }
    return undefined;
  }

  /**
   * Get all highlighted rows component in the list
   * @returns array of highlighted rows
   */
  public async getHighlightedRows(): Promise<ListRow[]> {
    let highlightedRows: ListRow[] = [];
    let rows = await this.getAllRows();
    for (const row of rows) {
      let isHighlighted = await row.isHighlighted();

      if (isHighlighted) {
        highlightedRows.push(row);
      }
    }

    return highlightedRows;
  }

  /**
   * Get value of inline chart in the cell
   *
   * @param cell List cell to get inline chart value
   * @returns Key value map of chart
   */
  public async getInlineChartValue(cell: ListCell): Promise<Map<string, string>> {
    let valuePair: Map<string, string> = new Map();
    let cellValue = await cell.getValue();
    let dataKeyValues = cellValue.split(';');
    dataKeyValues.pop();
    for (let dataKeyValue of dataKeyValues) {
      let pair = dataKeyValue.split(', ');
      let dataKey = pair[0].split('Data-Key: ')[1];
      let dataValue = pair[1].split('Data-Value: ')[1];
      valuePair.set(dataKey, dataValue);
    }
    return valuePair;
  }

  /**
   * Get last row of availble rows in list
   */
  public async getLastRow(): Promise<ListRow> {
    const count = await this.getRowCount();
    const lastRow = await this.getRowByIndex(count - 1);

    return lastRow;
  }

  /**
   * Get row by passing name of the column, target value, and all parent cell values. Parent cell values and target cell value will be based on columnName.
   *
   * @param columnName Column name to get from
   * @param targetValue Target cell value based on the column name defined
   * @param parentValues All parent cell values, based on the column name defined, to expand
   */
  public async getRowByCellValue(columnName: string, targetValue: string, parentValues?: string[]): Promise<ListRow> {
    let targetRow: ColumnIDValueMap[] = [{ columnID: columnName, value: targetValue }];
    if (parentValues) {
      let parents: ColumnIDValueMap[][] = [];
      for (let parentValue of parentValues) {
        let parentRow: ColumnIDValueMap[] = [{ columnID: columnName, value: parentValue }];
        parents.push(parentRow);
      }
      return this.getRowByValueInHierarchy(targetRow, parents);
    }
    return this.getRowByValue(targetRow);
  }

  /**
   * Get row by passing targetRow's ColumnIDValueMap and all parentRows' ColumnIDValueMap.
   *
   * This method can get row that is immediately visible in the current view. If the row is not visible in the current view, it won't able to get the row.
   *
   * @param targetRow target row's column header and cell value mapping
   * @param parents parent rows' column header and cell value mapping
   * @returns target list row
   */
  public async getRowByValueInHierarchy(targetRow: ColumnIDValueMap[], parents: ColumnIDValueMap[][]): Promise<ListRow> {
    // get first element and remove in array
    let firstParent = parents.shift();
    if (firstParent === undefined) {
      throw Error('No parent is found in parents parameter.');
    }
    let parentRow = await this.getRowByValue(firstParent, true);
    await parentRow.expandRow();
    // If there are still parent remaining, we'll loop through parent array and expand parent row
    if (parents.length > 0) {
      for (let parent of parents) {
        parentRow = await this.getRowByValue(parent, false, parentRow);
        await parentRow.expandRow();
      }
    }

    // NOTE: this a workaround due to the problem with getRowByValue when the hierarchy has a parent and its child that share same name
    const childRowCount = await parentRow.getChildRowCount();
    let childRows: ListRow[] = [];
    for (let i = 0; i < childRowCount; i++) {
      const childRow = <ListRow>await parentRow.getChildRow(i);
      childRows.push(childRow);
    }

    // clicks on the child level
    if (childRows.length > 0) {
      await childRows[0].leftClick();
    }

    // gets the child row we want
    const actualRow = await asyncFilter(childRows, async (childRow: ListRow) => {
      for (const map of targetRow) {
        const cell = await childRow.getCell(map.columnID);
        const value = await cell.getValue();
        if (value !== map.value) {
          return false;
        }
      }
      return true;
    });

    if (actualRow.length === 0) {
      throw new Error('Target row is not found.');
    }
    // returns the child row
    return actualRow[0];

    // BUG: getRowByValue currently doesn't work when parent and its child share the same name. (NB 219809). Workaround is provided above.
    // return this.getRowByValue(targetRow, false, parentRow);
  }

  /**
   * Get Multiple Rows based on multiple Values for a specific column
   *
   * @param columnName Column name
   * @param columnValues Values of the column
   * @returns Array of ListRows
   */
  public async getRowsByCellValuesFromOneColumn(columnName: string, columnValues: string[]): Promise<ListRow[]> {
    let promises: promise.Promise<ListRow>[] = [];
    for (let columnValue of columnValues) {
      promises.push(this.getRowByValue([{ columnID: columnName, value: columnValue }]));
    }
    let values = await protractor.promise.all(promises);
    return values;
  }

  /**
   * Check whether a row exists in the list
   *
   * @param targetRow Cell value for the target row
   * @param parentRows All parent cell values, based on the column name defined, to expand
   *
   * @return a boolean (true = exists, false = not exists) indicating whether the row with the passed-in
   * value exists in the list
   */
  public async hasRow(targetRow: ColumnIDValueMap[], parentRows?: ColumnIDValueMap[][]): Promise<boolean> {
    try {
      await (parentRows ? this.getRowByValueInHierarchy(targetRow, parentRows) : this.getRowByValue(targetRow));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Perform left click on the empty space in the list.
   */
  public async leftClickOnWhiteSpace(): Promise<void> {
    const scrollArea = this.element.element(by.css('q-scrollarea'));
    await QUtils.leftClickElement(scrollArea);
  }

  /**
   * Open context menu on column
   *
   * @param columnID Target column name / index to open context menu
   */
  public async openColumnMenu(columnID: string | number): Promise<void> {
    const column = typeof columnID === 'string' ? await this.getColumnByValue(columnID) : await this.getColumnByIndex(columnID);
    if (column) {
      await column.columnMenu(); //  open context menu on the column
    }
  }

  /**
   * Trigger filter dialog on column
   *
   * @param columnNameIndex Target column name or index
   * @param contextMenu Context menu triggered
   * @returns Filter manager dialog
   */
  public async openFilterDialogOnColumn(columnNameIndex: string | number, contextMenu: ContextMenu): Promise<FilterManager> {
    await this.openColumnMenu(columnNameIndex);
    await contextMenu.selectFilterMenu(FilterMenuName.EditFilters);
    await this._dlgFilterManager.waitUntilPresent();
    return this._dlgFilterManager;
  }

  /**
   * Find and resize covered column in list based on pass-in column name
   *
   * @param columnName Target column that need to resize
   * @param size Pixel size to move
   */
  public async resizeColumnWithCoveredName(columnName: string, size: number): Promise<void> {
    let count = await this.getColumnCount();
    let isFound = false;
    for (let i = 0; i < count; i++) {
      let column = await this.getColumnByIndex(i);
      try {
        let columnHeader = await column.getValue();
        if (columnHeader === '…') {
          throw Error;
        }
      } catch {
        // Error will be thrown when getting value (...) in img attribut column
        // Resize column and check whether resized column's name is matched with pass-in column name
        await column.resizeColumn(size);
        let columnNameToCompare = await column.getValue();
        if (columnNameToCompare !== columnName) {
          await column.resizeColumn(size, false);
        } else {
          isFound = true;
        }
      }

      if (isFound) {
        break;
      }
    }
  }

  /**
   * Check whether the cell value in rows matches the expected value
   *
   * @param rows rows to verify it cell value
   * @param columnName name of column to identify the cell of the rows
   * @param expectedValue expected value of the cell value
   * @param isImgAttribute — [Default=false] To determine whether cell value is image attribute column
   *
   * @returns boolean indicating valid or invalid
   */
  public async rowHasValidValue(rows: ListRow[], columnName: string | string[], expectedValue: string | string[], isImgAttribute: boolean = false): Promise<boolean> {
    const columnNames = typeof columnName === 'string' ? [columnName] : columnName;
    let areAllValid = false;

    for (let name of columnNames) {
      const cellValues = await this.getCellValueFromRow(name, rows, isImgAttribute);
      areAllValid = Array.isArray(expectedValue)
        ? cellValues.every((cellValue: string) => expectedValue.includes(cellValue))
        : cellValues.every((cellValue: string) => cellValue === expectedValue);

      if (!areAllValid) {
        break;
      }
    }

    return areAllValid;
  }

  /**
   * Perform search action on list
   *
   * @param columnIndexName Target column name / index
   * @param searchValue Value to search
   * @param defaultRowClick reset the list and scroll to top for re-search a new value
   */
  public async searchList(columnIndexName: string | number, searchValue: string, defaultRowClick: boolean = true): Promise<void> {
    let index: number;

    if (typeof columnIndexName === 'string') {
      const column = await this.getColumnByValue(columnIndexName);
      index = await column.getIndex();
    } else {
      index = columnIndexName;
    }
    await super.searchList(index, searchValue, defaultRowClick);
  }

  /**
   * Perform search action on hierarchy list
   *
   * @param target target row to be navigated
   * @param parents parent rows of the targeted row
   */
  public async searchListInHierarchy(target: ColumnValueSearch, parents: ColumnValueSearch[]): Promise<void> {
    if (parents.length > 0) {
      for (let i = 0; i < parents.length; i++) {
        const parent = parents[i];
        await this.searchList(parent.columnID, parent.searchValue);
        const parentRow = (await this.getInboundSelectedRows())[0];
        await parentRow.expandRow();
        // click on its first child to update the list column
        const firstChildRow = await parentRow.getChildRow(0);
        if (firstChildRow) {
          await firstChildRow.leftClick();
          const cellSearch = i === parents.length - 1 ? await firstChildRow.getCell(target.columnID) : await firstChildRow.getCell(parents[i + 1].columnID);
          await cellSearch.leftClick();
        }
      }
    }
    await this.searchList(target.columnID, target.searchValue, false);
  }

  /**
   * Select multiple rows
   *
   * @param rows The rows to be selected
   */
  public async selectRows(rows: ListRow[]): Promise<void> {
    await rows[0].leftClick();
    for (let i = 1; i < rows.length; i++) {
      await rows[i].leftClick({ control: true });
    }
  }

  /**
   * Sort column in list
   *
   * @param columnName Target column that need to sort
   * @param isAscending To sort column in ascending order (default = true, false for descending order)
   * @param isImageAttribute Boolean value indicate whether the column is an image attribute column
   * @param ctrl Ctrl modifier key when click (default = false)
   */
  public async sortColumn(columnName: string, isAscending: boolean = true, isImageAttribute: boolean = false, ctrl: boolean = false): Promise<void> {
    if (isImageAttribute) {
      await this.resizeColumnWithCoveredName(columnName, 50);
    }
    let idColumn = await this.getColumnByValue(columnName);
    let sortDirection = isAscending ? SortDirection.ASC : SortDirection.DESC;
    await idColumn.setSortDirection(sortDirection, ctrl);
  }

  /**
   * Toggle ON/OFF the checkbox of a list row
   *
   * @param row Target row to toggle on/off the checkbox
   * @param expectedState Boolean indicate the expected checkbox state (true = checked, false = unchecked)
   *
   * @return the checkbox state after it's toggled
   */
  public async toggleRowCheckbox(row: ListRow, expectedState: boolean): Promise<boolean> {
    let currentState = await row.isChecked();

    if (currentState !== expectedState) {
      await row.checkboxClick();
    }

    return row.isChecked();
  }

  /**
   * Get all the cells within a list row
   *
   * @param row The row to retrieve it cells
   *
   * @return A Column to Cell Map object.
   */
   private async getAllCellsInRow(row: ListRow): Promise<Map<string, ListCell>> {
    const cellCount = await row.getCellCount();
    let columnName = '';
    let columnCellMap: Map<string, ListCell> = new Map<string, ListCell>();

    for (let i = 0; i < cellCount; i++) {
      let cell = await row.getCell(i);
      let column = await this.getColumnByIndex(i);

      try {
        columnName = await column.getValue();
      } catch {
        await column.resizeColumn(50);
        columnName = await column.getValue();
      } finally {
        columnName = columnName === '' ? `column${i + 1}` : columnName;
      }
      columnCellMap.set(columnName, cell);
    }

    return columnCellMap;
  }
}

/**
 * An interface that consists of a map of columnID and value.
 * ```
 * {
 *   columnID: string | number;
 *   value: string;
 * }
 * ```
 */
export interface ColumnIDValueMap {
  columnID: string | number;
  value: string;
}

/**
 * An interface used for searching in row. Contains a map of columnID and search value.
 * ```
 * {
 *   columnID: string | number;
 *   searchValue: string;
 * }
 * ```
 */
export interface ColumnValueSearch {
  columnID: string | number;
  searchValue: string;
}

export type CellValue = EnumLike | string[] | number[] | undefined;
