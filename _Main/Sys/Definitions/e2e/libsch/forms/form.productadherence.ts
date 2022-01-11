import { Form } from '../../e2elib/lib/src/pageobjects/form.component';
import { ListBase } from '../../libappbase/listbase';
import { DropDownListBase } from '../../libappbase/dropdownlistbase';
export class FormProductAdherence extends Form {
  public ddlStockingPoint = new DropDownListBase('DropDownListStockingPoint');
  public listProducts = new ListProducts();
  public listRouting = new ListRouting();

  public constructor() {
    super('FormProductAdherence');
  }
}

export class ListProducts extends ListBase {
  public constructor() {
    super('ListProducts');
  }
}

export class ListRouting extends ListBase {
  public constructor() {
    super('ListRouting');
  }
}

export enum ListProductsColumn {
  Product = 'Product',
  Qty = 'Qty',
  AdherenceToMPS = 'Adherence to MPS',
}

export enum ListRoutingsColumn {
  Routing = 'Routing',
  Qty = 'Qty',
  AdherenceToMPS = 'Adherence to MPS',
}
