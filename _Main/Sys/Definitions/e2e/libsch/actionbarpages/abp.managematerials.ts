import { ActionBarPage } from '../../e2elib/lib/src/pageobjects/actionbarpage.component';
import { ButtonBase } from '../../libappbase/buttonbase';
import { CheckboxBase } from '../../libappbase/checkboxbase';

export class ActionBarPageManageMaterials extends ActionBarPage {
  // View Buttons
  public btnReserveMaterialView = new ButtonBase('ButtonReserveMaterialView');
  public btnReviewInventoryView = new ButtonBase('ButtonReviewInventoryView');

  // Action Buttons
  public btnReserveMaterial = new ButtonBase('ButtonReserveMaterial');
  public btnRemoveReservation = new ButtonBase('ButtonRemoveReservation');
  public cbReserveFullQty = new CheckboxBase('CheckboxReserveFullQuantity');

  public constructor() {
    super('ActionBarPageManageMaterial');
  }
}
