export enum ResourceType {
  BatchResource = 'BatchResource',
  ContinuousResource = 'ContinuousResource',
  SingleResource = 'SingleResource',
}

export enum ResourceGroupName {
  // Aluminum Hot Rolling
  Scalping = 'Scalping',
  Welding = 'Welding',
  Heating = 'Heating',
  Heating2 = 'Heating2',
  HotRolling = 'HotRolling',
  // Steel Cold Mill
  Galvanizing = 'Galvanizing',
}

export enum ResourceName {
  // Aluminum hotrolling
  // Scalping Resource
  Sc1 = 'SC1',
  // Welding Resource
  We = 'WE',
  // Heating Resource
  BigPit1 = 'BigPit1',
  BigPit2 = 'BigPit2',
  BigPit3 = 'BigPit3',
  BigPit4 = 'BigPit4',
  SmallPit1 = 'SmallPit1',
  SmallPit2 = 'SmallPit2',
  SmallPit3 = 'SmallPit3',
  SmallPit4 = 'SmallPit4',
  SmallPit5 = 'SmallPit5',
  // Hot Rolling Resource
  HM = 'HM',
  // Heating2 Resource
  Heater1 = 'Heater1',

  // Paperbags
  // Printing Resource
  _1101 = '1101',
  _1102 = '1102',
  _1103 = '1103',
  _1104 = '1104',
  // Casing Resource
  _1201 = '1201',
  _1202 = '1202',
  _1203 = '1203',
  _1204 = '1204',
  // InsertBottomResource
  _1301 = '1301',
  _1302 = '1302',
  _1303 = '1303',
  _1304 = '1304',

  // Join and split firm planned order
  // Finisher1 Resource
  Fin01 = 'FIN01',
  // Finisher2 Resource
  Fin02 = 'FIN02',
  // Laser Resource
  Las1 = 'LAS1',

  // Steel Cold Mill
  // Pickling Resource
  CPL = 'CPL',
  // Cold rolling Resource
  PLTCM = 'PL-TCM',
  // Galvanizing Resource
  HDGL1 = 'HDGL1',
  HDGL2 = 'HDGL2',
  HDGL3 = 'HDGL3',
  HDGL4 = 'HDGL4',
}

export enum ResourceID {
  Heater1 = 'Heater1',
}

export enum ResourceMaxBatchSize {
  _10 = '10',
}
