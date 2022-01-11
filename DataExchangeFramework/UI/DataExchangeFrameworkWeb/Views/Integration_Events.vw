Quintiq file version 2.0
{
  viewcontents
  {
    forms
    {
      form_LibDEF_FormEvent
      {
        title: 'QDataExchangeFramework::LibDEF_FormEvent'
        shown: true
        componentID: 'QDataExchangeFramework::LibDEF_FormEvent'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 17
          columnPosition: 1
          columnSpan: 6
        }
        components
        {
          LibDEF_FormEvent_pnlActionBar
          {
            sizeRatio: 1
          }
          LibDEF_FormEvent_lstLibDEF_IntegrationEvent
          {
          }
          LibDEF_FormEvent_dslLibDEF_IntegrationEvent
          {
            groupDepth: -1
            column_ID
            {
              columnId: 'ID'
              dataPath: 'ID'
              dataType: 'string'
              title: 'ID'
              index: 0
              subtotals: ''
              width: 150
            }
            column_Status
            {
              columnId: 'Status'
              dataPath: 'Status'
              dataType: 'string'
              title: 'Status'
              index: 1
              subtotals: ''
              width: 150
            }
            column_Start
            {
              columnId: 'Start'
              dataPath: 'Start'
              dataType: 'datetime'
              title: 'Start'
              index: 2
              subtotals: ''
              width: 150
            }
            column_End
            {
              columnId: 'End'
              dataPath: 'End'
              dataType: 'datetime'
              title: 'End'
              index: 3
              subtotals: ''
              width: 150
            }
            column_Duration
            {
              columnId: 'Duration'
              dataPath: 'Duration'
              dataType: 'duration'
              title: 'Duration'
              index: 4
              subtotals: ''
              width: 150
            }
          }
        }
      }
      form_LibDEF_FormEventActivity
      {
        title: 'QDataExchangeFramework::LibDEF_FormEventActivity'
        shown: true
        componentID: 'QDataExchangeFramework::LibDEF_FormEventActivity'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 17
          columnPosition: 7
          columnSpan: 7
        }
        components
        {
          LibDEF_FormEventActivity_lstLibDEF_IntegrationEventActivity
          {
          }
          LibDEF_FormEventActivity_dslLibDEF_IntegrationEventActivity
          {
            groupDepth: -1
            column_Title
            {
              columnId: 'Title'
              dataPath: 'Title'
              dataType: 'string'
              title: 'Title'
              index: 0
              subtotals: ''
              width: 150
            }
            column_IsSucceeded
            {
              columnId: 'IsSucceeded'
              dataPath: 'IsSucceeded'
              dataType: 'boolean'
              title: 'IsSucceeded'
              index: 1
              subtotals: ''
              width: 150
            }
            column_Start
            {
              columnId: 'Start'
              dataPath: 'Start'
              dataType: 'datetime'
              title: 'Start'
              index: 2
              subtotals: ''
              width: 150
            }
            column_End
            {
              columnId: 'End'
              dataPath: 'End'
              dataType: 'datetime'
              title: 'End'
              index: 3
              subtotals: ''
              width: 150
            }
            column_Duration
            {
              columnId: 'Duration'
              dataPath: 'Duration'
              dataType: 'duration'
              title: 'Duration'
              index: 4
              subtotals: ''
              width: 150
            }
            column_ErrorMessage
            {
              columnId: 'ErrorMessage'
              dataPath: 'ErrorMessage'
              dataType: 'string'
              title: 'ErrorMessage'
              index: 5
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
  id: 'Integration_Events'
  name: 'Integration Events'
  isglobal: false
  isroot: true
}
