Quintiq file version 2.0
{
  viewcontents
  {
    forms
    {
      form_LibSM_FormImportExportScenario
      {
        title: 'QScenarioManager::LibSM_FormImportExportScenario'
        shown: true
        componentID: 'QScenarioManager::LibSM_FormImportExportScenario'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 20
          columnPosition: 1
          columnSpan: 12
        }
        components
        {
          LibSM_FormImportExportScenario_PanelButtons
          {
            sizeRatio: 1
          }
          LibSM_FormImportExportScenario_PanelScenario
          {
            sizeRatio: 1
            activeChild: 'PanelScenarioFolders'
          }
          LibSM_FormImportExportScenario_PanelScenarioFolders
          {
            sizeRatio: 1
          }
          LibSM_FormImportExportScenario_PanelScenarioFoldersButton
          {
            sizeRatio: 1
          }
          LibSM_FormImportExportScenario_PanelScenarioFoldersLists
          {
            sizeRatio: 1
          }
          LibSM_FormImportExportScenario_PanelScenarioFoldersStagingList
          {
            sizeRatio: 1.21548084975475
          }
          LibSM_FormImportExportScenario_ListScenarioFoldersStagingList
          {
          }
          LibSM_FormImportExportScenario_DataSetLevelScenarioFoldersStaging
          {
            groupDepth: -1
            column_ChangedBy
            {
              columnId: 'ChangedBy'
              dataPath: 'ChangedBy'
              dataType: 'string'
              title: 'ChangedBy'
              index: 0
              subtotals: ''
              width: 150
            }
            column_ChangedOn
            {
              columnId: 'ChangedOn'
              dataPath: 'ChangedOn'
              dataType: 'datetime'
              title: 'ChangedOn'
              index: 1
              subtotals: ''
              width: 150
            }
            column_Comment
            {
              columnId: 'Comment'
              dataPath: 'Comment'
              dataType: 'string'
              title: 'Comment'
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
            column_Name
            {
              columnId: 'Name'
              dataPath: 'Name'
              dataType: 'string'
              title: 'Name'
              index: 5
              subtotals: ''
              width: 150
            }
            column_ParentName
            {
              columnId: 'ParentName'
              dataPath: 'ParentName'
              dataType: 'string'
              title: 'ParentName'
              index: 6
              subtotals: ''
              width: 150
            }
          }
          LibSM_FormImportExportScenario_PanelScenarioFoldersList
          {
            sizeRatio: 0.784519150245254
          }
          LibSM_FormImportExportScenario_ListScenarioFoldersList
          {
          }
          LibSM_FormImportExportScenario_DataSetLevelScenarioFolders
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
          LibSM_FormImportExportScenario_PanelScenarios
          {
            sizeRatio: 1
          }
          LibSM_FormImportExportScenario_PanelScenariosButton
          {
            sizeRatio: 1
          }
          LibSM_FormImportExportScenario_PanelScenariosLists
          {
            sizeRatio: 1
          }
          LibSM_FormImportExportScenario_PanelScenariosStagingList
          {
            sizeRatio: 1
          }
          LibSM_FormImportExportScenario_ListScenariosStagingList
          {
          }
          LibSM_FormImportExportScenario_DataSetLevelScenariosStaging
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
            column_ParentName
            {
              columnId: 'ParentName'
              dataPath: 'ParentName'
              dataType: 'string'
              title: 'Parent name'
              index: 1
              subtotals: ''
              width: 150
            }
            column_Comment
            {
              columnId: 'Comment'
              dataPath: 'Comment'
              dataType: 'string'
              title: 'Comment'
              index: 2
              subtotals: ''
              width: 150
            }
            column_DatasetName
            {
              columnId: 'DatasetName'
              dataPath: 'DatasetName'
              dataType: 'string'
              title: 'Dataset'
              index: 3
              subtotals: ''
              width: 150
            }
            column_IsLoaded
            {
              columnId: 'IsLoaded'
              dataPath: 'IsLoaded'
              dataType: 'boolean'
              title: 'Loaded'
              index: 4
              subtotals: ''
              width: 150
            }
            column_KnowledgeProfileName
            {
              columnId: 'KnowledgeProfileName'
              dataPath: 'KnowledgeProfileName'
              dataType: 'string'
              title: 'Knowledge profile'
              index: 5
              subtotals: ''
              width: 150
            }
            column_StorageState
            {
              columnId: 'StorageState'
              dataPath: 'StorageState'
              dataType: 'string'
              title: 'Storage state'
              index: 6
              subtotals: ''
              width: 150
            }
            column_TimezoneID
            {
              columnId: 'TimezoneID'
              dataPath: 'TimezoneID'
              dataType: 'string'
              title: 'TimezoneID'
              index: 7
              subtotals: ''
              width: 150
            }
            column_PlanningLevel
            {
              columnId: 'PlanningLevel'
              dataPath: 'PlanningLevel'
              dataType: 'string'
              title: 'PlanningLevel'
              index: 8
              subtotals: ''
              width: 150
            }
            column_PlanType
            {
              columnId: 'PlanType'
              dataPath: 'PlanType'
              dataType: 'string'
              title: 'PlanType'
              index: 9
              subtotals: ''
              width: 150
            }
            column_LifecycleStatus
            {
              columnId: 'LifecycleStatus'
              dataPath: 'LifecycleStatus'
              dataType: 'string'
              title: 'LifecycleStatus'
              index: 10
              subtotals: ''
              width: 150
            }
          }
          LibSM_FormImportExportScenario_PanelScenariosList
          {
            sizeRatio: 1
          }
          LibSM_FormImportExportScenario_ListScenariosList
          {
          }
          LibSM_FormImportExportScenario_DataSetLevelScenarios
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
  id: 'Import_folders_and_scenarios'
  name: 'Import folders and scenarios'
  isglobal: false
  isroot: true
}
