Quintiq file version 2.0
{
  viewcontents
  {
    forms
    {
      form_LibDEF_FormSystem
      {
        title: 'QDataExchangeFramework::LibDEF_FormSystem'
        shown: true
        componentID: 'QDataExchangeFramework::LibDEF_FormSystem'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 17
          columnPosition: 1
          columnSpan: 3
        }
        components
        {
          LibDEF_FormSystem_pnlActionBar
          {
            sizeRatio: 1
          }
          LibDEF_FormSystem_lstLibDEF_System
          {
          }
          LibDEF_FormSystem_dslLibDEF_System
          {
            groupDepth: -1
            column_GUID
            {
              columnId: 'GUID'
              dataPath: 'GUID'
              dataType: 'string'
              title: 'GUID'
              index: 0
              subtotals: ''
              width: 150
            }
            column_HostName
            {
              columnId: 'HostName'
              dataPath: 'HostName'
              dataType: 'string'
              title: 'HostName'
              index: 1
              subtotals: ''
              width: 150
            }
            column_PortNumber
            {
              columnId: 'PortNumber'
              dataPath: 'PortNumber'
              dataType: 'number'
              title: 'PortNumber'
              index: 2
              subtotals: ''
              width: 150
            }
            column_IsAvailable
            {
              columnId: 'IsAvailable'
              dataPath: 'IsAvailable'
              dataType: 'boolean'
              title: 'IsAvailable'
              index: 3
              subtotals: ''
              width: 150
            }
          }
        }
      }
      form_LibDEF_FormSetInterestOfDataset
      {
        title: 'QDataExchangeFramework::LibDEF_FormSetInterestOfDataset'
        shown: true
        componentID: 'QDataExchangeFramework::LibDEF_FormSetInterestOfDataset'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 8
          columnPosition: 10
          columnSpan: 4
        }
        components
        {
          LibDEF_FormSetInterestOfDataset_lstLibDEF_SetInterestOfDataset
          {
          }
          LibDEF_FormSetInterestOfDataset_dslLibDEF_SetInterestOfDataset
          {
            groupDepth: -1
            column_DatasetKind
            {
              columnId: 'DatasetKind'
              dataPath: 'DatasetKind'
              dataType: 'string'
              title: 'DatasetKind'
              index: 0
              subtotals: ''
              width: 150
            }
            column_DatasetName
            {
              columnId: 'DatasetName'
              dataPath: 'DatasetName'
              dataType: 'string'
              title: 'DatasetName'
              index: 1
              subtotals: ''
              width: 150
            }
          }
        }
      }
      form_LibDEF_FormSetInterestFromSystem
      {
        title: 'QDataExchangeFramework::LibDEF_FormSetInterestFromSystem'
        shown: true
        componentID: 'QDataExchangeFramework::LibDEF_FormSetInterestFromSystem'
        layout
        {
          mode: 'open'
          rowPosition: 9
          rowSpan: 9
          columnPosition: 10
          columnSpan: 4
        }
        components
        {
          LibDEF_FormSetInterestFromSystem_lstLibDEF_SetInterestFromSystem
          {
          }
          LibDEF_FormSetInterestFromSystem_dslLibDEF_SetInterestFromSystem
          {
            groupDepth: -1
            column_SystemInterestedIn_Name
            {
              columnId: 'SystemInterestedIn.Name'
              dataPath: 'SystemInterestedIn.Name'
              dataType: 'string'
              title: 'Name'
              index: 0
              subtotals: ''
              width: 150
            }
            column_SystemInterestedIn_GUID
            {
              columnId: 'SystemInterestedIn.GUID'
              dataPath: 'SystemInterestedIn.GUID'
              dataType: 'string'
              title: 'GUID'
              index: 1
              subtotals: ''
              width: 150
            }
          }
        }
      }
      form_LibDEF_FormSetType
      {
        title: 'QDataExchangeFramework::LibDEF_FormSetType'
        shown: true
        componentID: 'QDataExchangeFramework::LibDEF_FormSetType'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 17
          columnPosition: 4
          columnSpan: 3
        }
        components
        {
          LibDEF_FormSetType_lstLibDEF_SetTypeMeta
          {
          }
          LibDEF_FormSetType_dslLibDEF_SetTypeMeta
          {
            groupDepth: -1
            column_Name
            {
              columnId: 'Name'
              dataPath: 'Name'
              dataType: 'string'
              title: 'Name'
              index: 0
              subtotals: ''
              width: 150
            }
            column_ChannelName
            {
              columnId: 'ChannelName'
              dataPath: 'ChannelName'
              dataType: 'string'
              title: 'ChannelName'
              index: 1
              subtotals: ''
              width: 150
            }
          }
        }
      }
      form_LibDEF_FormSet
      {
        title: 'QDataExchangeFramework::LibDEF_FormSet'
        shown: true
        componentID: 'QDataExchangeFramework::LibDEF_FormSet'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 17
          columnPosition: 7
          columnSpan: 3
        }
        components
        {
          LibDEF_FormSet_lstLibDEF_SetMeta
          {
          }
          LibDEF_FormSet_dslLibDEF_SetMeta
          {
            groupDepth: -1
            column_Name
            {
              columnId: 'Name'
              dataPath: 'Name'
              dataType: 'string'
              title: 'Name'
              index: 0
              subtotals: ''
              width: 150
            }
          }
        }
      }
    }
    userconfigurableinformation
    {
    }
  }
  formatversion: 2
  id: 'Integration'
  name: 'Integration'
  isglobal: false
  isroot: true
}
