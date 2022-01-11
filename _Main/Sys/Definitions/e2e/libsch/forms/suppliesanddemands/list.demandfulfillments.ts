import { ListBase } from '../../../libappbase/listbase';

export class ListDemandFulfillments extends ListBase {
  public constructor() {
    super('ListDemandFulfillments');
  }
}

export enum ListDemandFulfillmentsColumn {
  DemandID = 'Demand ID',
  SupplyID = 'Supply ID',
  Quantity = 'Quantity',
}
