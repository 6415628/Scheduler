/* eslint-disable @typescript-eslint/naming-convention */
// =========================================== Resource list in Schedule view =========================================//
export enum ResourceGroupIndex {
  // Aluminum hotrolling
  Scalping = 0,
  Welding = 2,
  Heating = 4,
  HotRolling = 15,
  // Paperbags
  Printing = 0,
  Casing = 5,
  InsertBottom = 10,
  // Join and split firm planned order
  Finisher1 = 0,
  Finisher2 = 2,
  Laser = 4,
}

// Aluminum hotrolling
export enum ScalpingResourceIndex {
  SC1 = 1,
}

export enum WeldingResourceIndex {
  WE = 3,
}

export enum HeatingResourceIndex {
  BigPit1 = 5,
  BigPit2 = 6,
  BigPit3 = 7,
  BigPit4 = 8,
  SmallPit1 = 9,
  SmallPit2 = 10,
  SmallPit3 = 11,
  SmallPit4 = 12,
  SmallPit5 = 13,
}

export enum HotRollingResourceIndex {
  HM = 14,
}

// Paperbags
export enum PrintingResourceIndex {
  _1101 = 1,
  _1102 = 2,
  _1103 = 3,
  _1104 = 4,
}

export enum CasingResourceIndex {
  _1201 = 6,
  _1202 = 7,
  _1203 = 8,
  _1204 = 9,
}

export enum InsertBottomIndex {
  _1301 = 11,
  _1302 = 12,
  _1303 = 13,
  _1304 = 14,
}

// Join and split firm planned order
export enum Finisher1ResourceIndex {
  FIN01 = 1,
}

export enum Finisher2ResourceIndex {
  FIN02 = 3,
}

export enum LaserResourceIndex {
  LAS1 = 5,
}
// ===========================================

export enum GanttChartNodeColor {
  Grey = '#C0C0C0',
  Yellow = '#FFFFCC',
  Unavailable = '#E3E3E3B2',
  ConstraintViolated = '#FF0000',
}

export enum GanttChartSubtaskColor {
  Green_Process = '#80C784',
  Blue_FeedbackProcess = '#BBDEFB',
  Orange_NoBufferWait = '#F06C00',
  Brown_NoBufferAction = '#8D6E63',
  Yellow_Setup = '#FFEC3A',
}

const scalpingTaskTooltip = {
  titles: ['OrderNr', 'Start', 'End', 'Process duration', 'Setup duration', 'MPS planned end'],
};

const heatingTaskTooltip = {
  titles: ['Batch ID', 'Practice', 'Start', 'End', 'Process duration', 'Setup duration', 'MPS planned end'],
};

export { scalpingTaskTooltip as ScalpingTaskTooltip };
export { heatingTaskTooltip as HeatingTaskTooltip };

export enum OperationBatch {
  // Batch ID
  Batch3 = 'Batch 3',
  Batch10 = 'Batch 10',
  Batch14 = 'Batch 14',

  // Reserved/Open
  ReservedTooltip = 'Reserved size: ',
  OpenTooltip = 'Open size: ',
}

export enum GanttChartNodeText {
  // Paperbags
  _8 = '8',
  // Single Task
  _10064 = '10064',
  _10024 = '10024',
  _10170 = '10170',
  _10176 = '10176',
  // Batch Task
  batch15 = 'B / Batch 15 100.0 % ( 6 / 6 )',
  batch16 = 'B / Batch 16 100.0 % ( 6 / 6 )',
  FeedbackBatch18 = 'FB Batch 18',
  FeedbackBatch19 = 'FB Batch 19',
}

export enum OperationDueDate {
  _08Jan2017 = 'Jan 8, 2017',
  _09Jan2017 = 'Jan 9, 2017',
  _10Jan2017 = 'Jan 10, 2017',
  _11Jan2017 = 'Jan 11, 2017',
  _12Jan2017 = 'Jan 12, 2017',
  _13Jan2017 = 'Jan 13, 2017',
  _14Jan2017 = 'Jan 14, 2017',
}
