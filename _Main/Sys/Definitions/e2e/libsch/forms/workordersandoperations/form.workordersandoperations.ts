import { Form } from '../../../e2elib/lib/src/pageobjects/form.component';
import { PanelOperationBatches } from './panel.operationbatches';
import { PanelOperations } from './panel.operations';

export class FormWorkOrdersAndOperations extends Form {
  public pnlOperations = new PanelOperations();
  public pnlOperationBatches = new PanelOperationBatches();

  public constructor() {
    super('FormWorkOrdersAndOperations');
  }
}
