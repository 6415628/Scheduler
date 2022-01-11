/* eslint-disable @typescript-eslint/naming-convention */
import { LogMessage } from '../libappbase/logmessage';

/**
 * A private helper function for this file to allow scheduler's specific log message object to carry properties from the common log message object.
 * @param firstObject An object to get ready for intersection
 * @param secondObject Another object to intersect with firstObject
 * @returns An intersected type of `T & U`
 * @example
 * // see LogMessageSch object
 */
const extendObjectLiteral = <T extends object, U extends object>(firstObject: T, secondObject: U): T & U => {
  let result: Partial<T & U> = {};
  for (const prop in firstObject) {
    if (!result.hasOwnProperty(prop)) {
      (result as T)[prop] = firstObject[prop];
    }
  }
  for (const prop in secondObject) {
    if (!result.hasOwnProperty(prop)) {
      (result as U)[prop] = secondObject[prop];
    }
  }

  return result as T & U;
};

/**
 * Scheduler-specific log message object that contains all failed output messages
 */
const logMessageSch = extendObjectLiteral(LogMessage, {
  batchDetail_indexNotMatched: (workOrder: string, expectedIndex: number, actualIndex: number): string => `${workOrder} should have ${expectedIndex} index but it has ${actualIndex} index in the Batch Detail list`,
  dlg_field_notMatched: (dialogField: string, expectedValue: string, actualValue: string): string => `${dialogField} should be ${expectedValue}, but actual value is "${actualValue}"`,
  ganttchart_numOfNodesNotMatched: (gcRow: string, expectedNumOfNodes: number, actualNumOfNodes: number): string => `${gcRow} row should have ${expectedNumOfNodes} nodes, but have ${actualNumOfNodes} nodes.`,
  ganttchart_numOfSubtaskNotMatched: (nodeName: string, gcRow: string, expectedNumOfSubtask: number, actualNumOfSubtask: number): string => `${nodeName} on ${gcRow} row should have ${expectedNumOfSubtask} subtasks, but have ${actualNumOfSubtask} subtasks.`,
  list_numOfRowsNotMatched: (listName: string, expectedNumOfRows: number, actualNumOfRows: number): string => `${listName} list should have ${expectedNumOfRows} rows, but have ${actualNumOfRows} rows.`,
  workOrder_markedForRelease: (workOrder: string): string => `${workOrder} should not be marked for release.`,
  workOrder_notMarkedForRelease: (workOrder: string): string => `${workOrder} should be marked for release.`,
  workOrder_notMarkedForReleaseAuto: (workOrder: string): string => `${workOrder} should be marked for release automatically as there is frozen operation.`,
  workOrder_notReleasedToExternalSystem: (workOrder: string): string => `${workOrder} should be released to external system.`,
  workOrder_releasedToExternalSystem: (workOrder: string): string => `${workOrder} should not be released to external system.`,
  workOrder_notScheduled: (workOrder: string): string => `${workOrder} should be already scheduled.`,
  workOrder_notScheduledInFrozenHorizon: (workOrder: string): string => `${workOrder} should be scheduled in frozen horizon.`,
  workOrder_scheduledInFrozenHorizon: (workOrder: string): string => `${workOrder} should not be scheduled in frozen horizon.`,
  workOrderOperation_notScheduledInFrozenHorizon: (workOrder: string, operation: string): string => `${workOrder} operation ${operation} should be scheduled in frozen horizon.`,
  workOrderOperation_notScheduled: (workOrder: string, operation: string): string => `${workOrder} operation ${operation} should be already scheduled.`,
  workOrderOperation_scheduled: (workOrder: string, operation: string): string => `${workOrder} operation ${operation} should be not scheduled.`,
  workOrder_scheduled: (workOrder: string): string => `${workOrder} should be not scheduled.`,
  supplyDemand_demandNotCompatible: (): string => 'All rows in Demand list should have Stocking Point ID and Product ID same with selected Supply row',
  supplyDemand_supplyNotCompatible: (): string => 'All rows in Supply list should have Stocking Point ID and Product ID same with selected Demand row',
  supplyDemand_openQtyNotMatch: (supplyId: string, openQty: string): string => `Open quantity of supply ${supplyId} should be the same as supply quantity ${openQty}`,
  supplyDemand_reserveQtyNotMatch: (supplyId: string, reserveQty: string): string => `Reserved quantity of supply ${supplyId} should decreased to ${reserveQty} units.`,
  supplyFulfilment_totalRowNotMatch: (supplyId: string[], expTotalRows: string, actTotalRows: string): string => `Expected total demands ${expTotalRows} reserved for supplies ${supplyId} but actual total demands ${actTotalRows}`,
  toast_notSuccess: (action: string): string => `Expected: Success toast box should be popped up for ${action}.`,
  toast_notWarning: (action: string): string => `Expected: Warning toast box should be popped up for ${action}.`,
  tooltip_notContains: (expected: string, msg: string): string => `Expected: ${expected} tooltip value should contains in ${msg}.`,
});

export { logMessageSch as LogMessageSch };
