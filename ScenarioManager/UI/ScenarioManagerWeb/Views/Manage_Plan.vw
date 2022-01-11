Quintiq file version 2.0
{
  viewcontents
  {
    forms
    {
      form_LibSM_FormScenarios
      {
        title: 'QScenarioManager::LibSM_FormScenarios'
        shown: true
        componentID: 'QScenarioManager::LibSM_FormScenarios'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 14
          columnPosition: 1
          columnSpan: 12
        }
        components
        {
          LibSM_FormScenarios_ListScenarios
          {
          }
          LibSM_FormScenarios_DataSetLevelScenarioManagerRoots
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
              width: 349
            }
          }
          LibSM_FormScenarios_DataSetLevelNodes
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
              width: 352
            }
            column_astype_LibSM_Scenario__ImgHasDataset
            {
              columnId: 'astype(LibSM_Scenario).ImgHasDataset'
              dataPath: 'astype(LibSM_Scenario).ImgHasDataset'
              dataType: 'string'
              title: 'HasDataset'
              index: 1
              subtotals: ''
              width: 150
            }
            column_astype_LibSM_Scenario__KnowledgeProfile_Name
            {
              columnId: 'astype(LibSM_Scenario).KnowledgeProfile.Name'
              dataPath: 'astype(LibSM_Scenario).KnowledgeProfile.Name'
              dataType: 'string'
              title: 'Knowledge Profile'
              index: 2
              subtotals: ''
              width: 150
            }
            column_astype_LibSM_Scenario__PlanningLevel
            {
              columnId: 'astype(LibSM_Scenario).PlanningLevel'
              dataPath: 'astype(LibSM_Scenario).PlanningLevel'
              dataType: 'string'
              title: 'Planning Level'
              index: 3
              subtotals: ''
              width: 150
            }
            column_astype_LibSM_Scenario__PlanType
            {
              columnId: 'astype(LibSM_Scenario).PlanType'
              dataPath: 'astype(LibSM_Scenario).PlanType'
              dataType: 'string'
              title: 'Plan Type'
              index: 4
              subtotals: ''
              width: 150
            }
            column_astype_LibSM_Scenario__LifecycleStatus
            {
              columnId: 'astype(LibSM_Scenario).LifecycleStatus'
              dataPath: 'astype(LibSM_Scenario).LifecycleStatus'
              dataType: 'string'
              title: 'Lifecycle Status'
              index: 5
              subtotals: ''
              width: 150
            }
            column_ChangedBy
            {
              columnId: 'ChangedBy'
              dataPath: 'ChangedBy'
              dataType: 'string'
              title: 'ChangedBy'
              index: 6
              subtotals: ''
              width: 150
            }
            column_ChangedOn
            {
              columnId: 'ChangedOn'
              dataPath: 'ChangedOn'
              dataType: 'datetime'
              title: 'ChangedOn'
              index: 7
              subtotals: ''
              width: 150
            }
          }
        }
      }
      form_LibSM_FormAssumptions
      {
        title: 'QScenarioManager::LibSM_FormAssumptions'
        shown: true
        componentID: 'QScenarioManager::LibSM_FormAssumptions'
        layout
        {
          mode: 'open'
          rowPosition: 15
          rowSpan: 6
          columnPosition: 1
          columnSpan: 12
        }
        components
        {
          LibSM_FormAssumptions_ListAssumptions
          {
          }
          LibSM_FormAssumptions_DataSetLevelAssumptions
          {
            groupDepth: -1
            column_Category
            {
              columnId: 'Category'
              dataPath: 'Category'
              dataType: 'string'
              title: 'Category'
              index: 0
              subtotals: ''
              width: 150
            }
            column_Importance
            {
              columnId: 'Importance'
              dataPath: 'Importance'
              dataType: 'string'
              title: 'Importance'
              index: 1
              subtotals: ''
              width: 150
            }
            column_Title
            {
              columnId: 'Title'
              dataPath: 'Title'
              dataType: 'string'
              title: 'Title'
              index: 2
              subtotals: ''
              width: 150
            }
            column_CreatedBy
            {
              columnId: 'CreatedBy'
              dataPath: 'CreatedBy'
              dataType: 'string'
              title: 'CreatedBy'
              index: 3
              subtotals: ''
              width: 150
            }
            column_CreatedOn
            {
              columnId: 'CreatedOn'
              dataPath: 'CreatedOn'
              dataType: 'datetime'
              title: 'CreatedOn'
              index: 4
              subtotals: ''
              width: 150
            }
            column_Type
            {
              columnId: 'Type'
              dataPath: 'Type'
              dataType: 'string'
              title: 'Type'
              index: 5
              subtotals: ''
              width: 150
            }
            column_View
            {
              columnId: 'View'
              dataPath: 'View'
              dataType: 'string'
              title: 'View'
              index: 6
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
  id: 'Manage_Plan'
  name: 'Manage Plan'
  isglobal: false
  isroot: true
}
