import { MatrixEditor } from '../e2elib/lib/src/pageobjects/matrix/matrixeditor.component';
import { MatrixEditorCell } from '../e2elib/lib/src/pageobjects/matrix/matrixeditorcell.component';

export interface CellLocator {
  columnName: string;
  rowName: string;
  attributeId?: number;
}

export class MatrixEditorBase extends MatrixEditor {
  /**
   * Navigate to pass-in column header in matrix editor
   *
   * @param matrixColumnHeader target matrix column header navigate to
   * @param navigateToRight [Optional] true to search column to right, false to left. [undefined will search to right then left]
   */
  public async navigateToColumnAppear(matrixColumnHeader: string, navigateToRight?: boolean): Promise<void> {
    let errorMessage = '';
    const matrixWaitHelper = this.getWaitHelper();
    if (navigateToRight) {
      await matrixWaitHelper.navigateUntilColumnAppears(matrixColumnHeader);
    } else if (!navigateToRight) {
      await matrixWaitHelper.navigateUntilColumnAppears(matrixColumnHeader, false);
    } else if (navigateToRight === undefined) {
      await matrixWaitHelper.navigateUntilColumnAppears(matrixColumnHeader);
      if (!(await this.hasColumn(matrixColumnHeader))) {
        await matrixWaitHelper.navigateUntilColumnAppears(matrixColumnHeader, false);
      }
    }

    if (!(await this.hasColumn(matrixColumnHeader))) {
      errorMessage = `error when finding column '${matrixColumnHeader}' in matrix editor ${this.componentName}.`;
      throw new Error(errorMessage);
    }
  }

  /**
   * @override
   */
  public async getCell(rowID: string | number, attributeID: string | number, columnID: string | number): Promise<MatrixEditorCell> {
    if (typeof columnID === 'string') {
      await this.navigateToColumnAppear(columnID);
    }
    const cell = await super.getCell(rowID, attributeID, columnID);

    return cell;
  }

  /**
   * Find cell based on passed in CellLocator [If passed in CellLocator]
   * Set value into searched cell / passed in MatrixEditorCell
   *
   * @param cell The matrix cell || An object containing the ColumnName and RowName
   * @param value The value to be entered into the cell
   */
  public async sendInputToCell(cell: CellLocator | MatrixEditorCell, value: string): Promise<string> {
    if (!(cell instanceof MatrixEditorCell)) {
      cell = await this.getCell(cell.rowName, cell.attributeId || 0, cell.columnName);
    }

    await cell.sendInput(value);
    const enteredValue = await cell.getValue();

    return enteredValue;
  }
}
