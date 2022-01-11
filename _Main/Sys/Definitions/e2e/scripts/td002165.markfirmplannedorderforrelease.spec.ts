/**
 * @file        TD002165, TD002166
 * @description TD002165 - Mark firm planned order for release - multiple selection, none are released
 *              TD002166 - Mark firm planned order for release - multiple selection, all are released
 * @author      Mehrab Kamrani
 * @copyright   Dassault Systèmes
 */
import { AppScheduler } from '../libsch/appsch';
import { QJasmine } from '../e2elib/lib/src/main/qjasmineenv';
import { DemoCategory, DemoScenario } from '../libsch/data/data.scenario';
import { ListRow } from '../e2elib/lib/src/pageobjects/list/listrow.component';
import { ImgLifecycleState, ImgReleasedBy, ListWorkOrdersContextMenuItem, WorkOrderPrecondition } from '../libsch/forms/form.workorders';
import { WorkOrder } from '../libsch/data/data.workorder';
import { ActionTriggerType } from '../libappbase/utils';
import { LogMessage } from '../libappbase/logmessage';
import { LogMessageSch } from '../libsch/logmessagesch';

describe('Mark firm planned order for release', () => {
  let appScheduler = AppScheduler.getInstance();
  let listWorkOrders = appScheduler.viewManageOrders.formWorkOrders.listWorkOrders;
  let cogA22: ListRow;
  let cogB22: ListRow;
  const expectedTooltip = WorkOrderPrecondition.WorkOrderAlreadyMarkedForRelease;

  QJasmine.initGlobal();
  beforeAll(async () => {
    await appScheduler.login();
    await appScheduler.switchToDemoScenario(DemoCategory.TestDemo, DemoScenario.Test2JoinAndSplitFirmPlannedOrder);
  });

  afterAll(async () => {
    await appScheduler.cleanUpDataset();
    await appScheduler.logout();
  });

  afterEach(async () => {
    await appScheduler.checkToastMessage();
  });

  describe('TD002165, Mark firm planned order for release', () => {
    it('Step 1: Go to Manage Work Orders action bar, open view Manage Orders.', async () => {
      await appScheduler.viewManageOrders.switchTo();
      expect(await appScheduler.viewManageOrders.formWorkOrders.isVisible()).toBe(true, LogMessage.form_notVisible('Work Order'));
    });

    it('Step 2: In the work order list, select firm planned orders CogA-2-2 and CogB-2-2.', async () => {
      cogA22 = await listWorkOrders.getWorkOrder(WorkOrder.CogA_2_2);
      cogB22 = await listWorkOrders.getWorkOrder(WorkOrder.CogB_2_2);
      // Verify firm planned orders CogA-2-2 and CogB-2-2 are not yet marked for release.
      expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, cogA22, true)).toBe(
        ImgLifecycleState.CreatedButNotReleased,
        LogMessageSch.workOrder_markedForRelease(WorkOrder.CogA_2_2),
      );
      expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, cogB22, true)).toBe(
        ImgLifecycleState.CreatedButNotReleased,
        LogMessageSch.workOrder_markedForRelease(WorkOrder.CogB_2_2)
      );
      await listWorkOrders.selectRows([cogA22, cogB22]);
      // Verify firm planned orders CogA-2-2 and CogB-2-2 are selected
      expect(await cogA22.isSelected()).toBe(true, `${WorkOrder.CogA_2_2} should be selected.`);
      expect(await cogB22.isSelected()).toBe(true, `${WorkOrder.CogB_2_2} should be selected.`);
    });

    it('Step 3: Press the "Mark for release" button (either context menu or Schedule -> Schedule view)', async () => {
      await listWorkOrders.markWorkOrderAsRelease(ActionTriggerType.ContextMenu, [cogA22, cogB22]);
      // Verify that work orders CogA-2-2 and CogB-2-2 are both marked for release by user
      expect(await listWorkOrders.getCellValueFromRow(ImgReleasedBy.ColumnIndex, cogA22, true)).toBe(
        ImgReleasedBy.MarkedByUser,
        `${WorkOrder.CogA_2_2} should be marked for release by user.`,
      );
      expect(await listWorkOrders.getCellValueFromRow(ImgReleasedBy.ColumnIndex, cogB22, true)).toBe(
        ImgReleasedBy.MarkedByUser,
        `${WorkOrder.CogB_2_2} should be marked for release by user.`,
      );
      // Verify release status turns to marked for release
      expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, cogA22, true)).toBe(
        ImgLifecycleState.MarkedForReleased,
        LogMessageSch.workOrder_notMarkedForRelease(WorkOrder.CogA_2_2)
      );
      expect(await listWorkOrders.getCellValueFromRow(ImgLifecycleState.ColumnIndex, cogB22, true)).toBe(
        ImgLifecycleState.MarkedForReleased,
        LogMessageSch.workOrder_notMarkedForRelease(WorkOrder.CogB_2_2)

      );
    });
  });

  describe('TD002166 - Mark firm planned order for release - multiple selection, all are released', () => {
    it('Step 1: Go to Manage Work Orders action bar, open view Manage Orders.', async () => {
      await appScheduler.viewManageOrders.switchTo();
      expect(await appScheduler.viewManageOrders.formWorkOrders.isVisible()).toBe(true, 'Expected: Form Work Orders should be visible');
    });

    it(`Step 2: In the work order list, select firm planned orders ${WorkOrder.CogA_2_2} and ${WorkOrder.CogB_2_2}.`, async () => {
      cogA22 = await listWorkOrders.getWorkOrder(`${WorkOrder.CogA_2_2}`);
      cogB22 = await listWorkOrders.getWorkOrder(`${WorkOrder.CogB_2_2}`);
      // Verify firm planned orders CogA-2-2 and CogB-2-2 are already marked for release.
      expect(await listWorkOrders.getCellValueFromRow(ImgReleasedBy.ColumnIndex, cogA22, true)).toBe(
        ImgReleasedBy.MarkedByUser,
        `${WorkOrder.CogA_2_2} should be marked for release.`,
      );
      expect(await listWorkOrders.getCellValueFromRow(ImgReleasedBy.ColumnIndex, cogB22, true)).toBe(
        ImgReleasedBy.MarkedByUser,
        `${WorkOrder.CogB_2_2} should be marked for release.`,
      );
    });
    it('Step 3: Verify that the "Mark for release" context menu is disabled, with feedback that selected work orders have already been marked for release', async () => {
      // Verify Mark for release menu item is disabled
      const [isClickable, tooltip] = await listWorkOrders.verifyIsMenuItemClickable(ListWorkOrdersContextMenuItem.MarkForRelease, [cogA22, cogB22]);
      expect(isClickable).toBe(false, LogMessage.menu_isEnabled('Mark for release'));
      // Verify Mark for release menu item displays correct tooltip
      expect(tooltip).toContain(expectedTooltip, LogMessageSch.tooltip_notContains(expectedTooltip, tooltip));
    });
    it('Step 4: Verify that the "Mark for release" button(Schedule -> Schedule view) is disabled with same feedback', async () => {
      await appScheduler.abpSchedule.click();
      const [isClickable] = await appScheduler.abpSchedule.btnMarkForRelease.verifyIsButtonClickable();
      // Verify that the "Mark for release" button is disabled
      expect(isClickable).toBe(false, LogMessage.btn_isEnabled('"Mark for release" Action Bar'));
      // Verify that the "Mark for release" button have the following feedback: Selected work order(s) already marked for release.
      const tooltip = await appScheduler.abpSchedule.getButtonMarkForReleaseTooltip();
      expect(tooltip).toBe(expectedTooltip, LogMessage.tooltip_notMatched(expectedTooltip, tooltip));
    });
  });
});
