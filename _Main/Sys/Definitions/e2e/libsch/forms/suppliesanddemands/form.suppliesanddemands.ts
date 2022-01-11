import { Form } from '../../../e2elib/lib/src/pageobjects/form.component';
import { DialogCreateEditFulfillments } from '../../dialogs/dialog.createeditfulfillment';
import { DropDownStringListBase } from '../../../libappbase/dropdownstringlistbase';
import { CheckboxBase } from '../../../libappbase/checkboxbase';
import { ListSupplies, ListDemands, ListDemandFulfillments, ListSupplyFulfillments, ListSuppliesColumn, ListDemandsColumn } from './';

export class FormSuppliesAndDemands extends Form {
  // Lists
  public listSupplies = new ListSupplies();
  public listDemands = new ListDemands();
  public listDemandFulfillments = new ListDemandFulfillments();
  public listSupplyFulfillment = new ListSupplyFulfillments();

  // CheckBoxes
  public cbHideFullyReservedSupply = new CheckboxBase('CheckboxHideFullyReservedSupplies');
  public cbHideIncompatibleSupplies = new CheckboxBase('CheckboxHideIncompatibleSupplies');
  public cbHideFullyReservedDemand = new CheckboxBase('CheckboxHideFullyReservedDemands');
  public cbHideIncompatibleDemands = new CheckboxBase('CheckboxHideIncompatibleDemands');

  // Drop Down Lists
  public ddslStockingPoint = new DropDownStringListBase('DropDownStringListStockingPoints');

  // Dialogs
  public dlgCreateEditFulfillment = new DialogCreateEditFulfillments();

  public constructor() {
    super('FormSuppliesAndDemands');
  }

  /**
   * To check if Supplies/Demands's Stocking Point and Product ID is compatible to Demand/Supply's
   *
   * @param isCheckDemandCompatibleToSupply Check from Demands to Supply or vice versa
   * @param errorMsg Error message if there is any row does not compatible to Demand/Supply
   */
  public async checkSuppliesDemandIsCompatible(isCheckDemandCompatibleToSupply: boolean, errorMsg: string): Promise<void> {
    let supplyColumnArray = [ListSuppliesColumn.StockingPoint, ListSuppliesColumn.ProductId];
    let demandColumnArray = [ListDemandsColumn.StockingPoint, ListDemandsColumn.ProductID];
    if (isCheckDemandCompatibleToSupply) {
      await this.checkSuppliesDemandCompatible(errorMsg, this.listSupplies, supplyColumnArray, this.listDemands, demandColumnArray);
    } else {
      await this.checkSuppliesDemandCompatible(errorMsg, this.listDemands, demandColumnArray, this.listSupplies, supplyColumnArray);
    }
  }

  /**
   * To check if Supplies/Demands is compatible to Demand/Supply by comparing pass-in column(s)
   *
   * @param errorMsg Error message if there is any row does not compatible to Demand/Supply
   * @param sourceList List to compatible with Demands/Supplies
   * @param sourceColumnNames Column names to get value of source list and compatible with Demands/Supplies
   * @param targetList List to be compatible with Demand/Supply
   * @param targetColumnNames Column names to get value of target list and to be compatible with Demand/Supply
   */
  public async checkSuppliesDemandCompatible(
    errorMsg: string,
    sourceList: ListSupplies | ListDemands,
    sourceColumnNames: string[],
    targetList: ListSupplies | ListDemands,
    targetColumnNames: string[],
  ): Promise<void> {
    let firstRow = await sourceList.getRowByIndex(0);
    let expectedValues: string[] = [];
    for (let sourceColumnName of sourceColumnNames) {
      let columnCellValues = await sourceList.getCellValueFromRow(sourceColumnName, firstRow);
      expectedValues.push(columnCellValues);
    }
    let allTargetRows = await targetList.getAllRows();
    const isAllSatisfy = await targetList.rowHasValidValue(allTargetRows, targetColumnNames, expectedValues);
    expect(isAllSatisfy).toBe(true, errorMsg);
  }

  /**
   * To check/uncheck on checkboxes in Supplies&Demands form
   *
   * @param filter FiltersReserveMaterials elements to defined target checkbox to check/uncheck
   * @param isCheck isCheck boolean to toggle on or off check box (false | true)
   */
  public async checkFilter(filter: FilterReserveMaterials, isCheck: boolean): Promise<void> {
    let checkbox: CheckboxBase | undefined;
    switch (filter) {
      case FilterReserveMaterials.HideFullyReservedDemands:
        checkbox = this.cbHideFullyReservedDemand;
        break;
      case FilterReserveMaterials.HideFullyReservedSupplies:
        checkbox = this.cbHideFullyReservedSupply;
        break;
      case FilterReserveMaterials.HideIncompatibleDemands:
        checkbox = this.cbHideIncompatibleDemands;
        break;
      case FilterReserveMaterials.HideIncompatibleSupplies:
        checkbox = this.cbHideIncompatibleSupplies;
        break;
      default:
        checkbox = undefined;
        break;
    }
    if (checkbox !== undefined) {
      if (isCheck !== (await checkbox.isChecked())) {
        await checkbox.click();
      }
    }
  }
}

export enum FilterReserveMaterials {
  HideFullyReservedSupplies,
  HideFullyReservedDemands,
  HideIncompatibleSupplies,
  HideIncompatibleDemands,
}
