Quintiq file version 2.0
{
  viewcontents
  {
    forms
    {
      form_FormScenarios_1
      {
        title: 'QLibSchedulerWebApp::FormScenarios'
        shown: true
        componentID: 'QLibSchedulerWebApp::FormScenarios'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 18
          columnPosition: 1
          columnSpan: 12
        }
        components
        {
          FormScenarios_ListScenarios
          {
          }
          FormScenarios_ListScenarios_DataSetLevelScenarioManagerRoots
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
            column_ChangedBy
            {
              columnId: 'ChangedBy'
              dataPath: 'ChangedBy'
              dataType: 'string'
              title: 'ChangedBy'
              index: 1
              subtotals: ''
              width: 150
            }
            column_ChangedOn
            {
              columnId: 'ChangedOn'
              dataPath: 'ChangedOn'
              dataType: 'datetime'
              title: 'ChangedOn'
              index: 2
              subtotals: ''
              width: 150
            }
          }
          FormScenarios_ListScenarios_DataSetLevelScenarioManagerRoots_DataSetLevelNodes
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
              width: 225
            }
            column_ChangedBy
            {
              columnId: 'ChangedBy'
              dataPath: 'ChangedBy'
              dataType: 'string'
              title: 'ChangedBy'
              index: 1
              subtotals: ''
              width: 150
            }
            column_ChangedOn
            {
              columnId: 'ChangedOn'
              dataPath: 'ChangedOn'
              dataType: 'datetime'
              title: 'ChangedOn'
              index: 2
              subtotals: ''
              width: 150
            }
          }
        }
      }
      form_LibSM_FormScenarios
      {
        _removed: true
      }
      form_LibSM_FormAssumptions
      {
        _removed: true
      }
      form_LibSM_FormScenarioTypes
      {
        _removed: true
      }
    }
  }
  formatversion: 2
  id: 'Manage_Plan'
  name: 'Manage Plan'
  isglobal: false
  isroot: false
}
