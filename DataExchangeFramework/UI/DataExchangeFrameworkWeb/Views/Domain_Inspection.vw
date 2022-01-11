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
          rowSpan: 16
          columnPosition: 1
          columnSpan: 6
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
          }
        }
      }
      form_LibDEF_FormChannel
      {
        title: 'QDataExchangeFramework::LibDEF_FormChannel'
        shown: true
        componentID: 'QDataExchangeFramework::LibDEF_FormChannel'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 16
          columnPosition: 7
          columnSpan: 6
        }
        components
        {
          LibDEF_FormChannel_lstLibDEF_ChannelMeta
          {
          }
          LibDEF_FormChannel_dslLibDEF_ChannelMeta
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
  id: 'Domain_Inspection'
  name: 'Domain Inspection'
  isglobal: false
  isroot: true
}
