Quintiq file version 2.0
{
  viewcontents
  {
    forms
    {
      form_LibSM_FormImportExportMasterData
      {
        title: 'QScenarioManager::LibSM_FormImportExportMasterData'
        shown: true
        componentID: 'QScenarioManager::LibSM_FormImportExportMasterData'
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
          LibSM_FormImportExportMasterData_PanelButtons
          {
            sizeRatio: 1
          }
          LibSM_FormImportExportMasterData_PanelMasterData
          {
            sizeRatio: 1
            activeChild: 'PanelKnowledgeProfiles'
          }
          LibSM_FormImportExportMasterData_PanelKnowledgeProfiles
          {
            sizeRatio: 1
          }
          LibSM_FormImportExportMasterData_PanelKnowledgeProfilesButton
          {
            sizeRatio: 1
          }
          LibSM_FormImportExportMasterData_PanelKnowledgeProfilesLists
          {
            sizeRatio: 1
          }
          LibSM_FormImportExportMasterData_PanelKnowledgeProfilesStagingList
          {
            sizeRatio: 1
          }
          LibSM_FormImportExportMasterData_ListKnowledgeProfilesStagingList
          {
          }
          LibSM_FormImportExportMasterData_DataSetLevelKnowledgeProfilesStaging
          {
            groupDepth: -1
            column_ProfileName
            {
              columnId: 'ProfileName'
              dataPath: 'ProfileName'
              dataType: 'string'
              title: 'ProfileName'
              index: 0
              subtotals: ''
              width: 150
            }
            column_KBDefinitionName
            {
              columnId: 'KBDefinitionName'
              dataPath: 'KBDefinitionName'
              dataType: 'string'
              title: 'KBDefinitionName'
              index: 1
              subtotals: ''
              width: 150
            }
            column_BranchName
            {
              columnId: 'BranchName'
              dataPath: 'BranchName'
              dataType: 'string'
              title: 'BranchName'
              index: 2
              subtotals: ''
              width: 150
            }
            column_BranchVersion
            {
              columnId: 'BranchVersion'
              dataPath: 'BranchVersion'
              dataType: 'string'
              title: 'BranchVersion'
              index: 3
              subtotals: ''
              width: 150
            }
          }
          LibSM_FormImportExportMasterData_PanelKnowledgeProfilesList
          {
            sizeRatio: 1
          }
          LibSM_FormImportExportMasterData_ListKnowledgeProfilesList
          {
          }
          LibSM_FormImportExportMasterData_DataSetLevelKnowledgeProfiles
          {
            groupDepth: -1
            column_KBDefinitionName
            {
              columnId: 'KBDefinitionName'
              dataPath: 'KBDefinitionName'
              dataType: 'string'
              title: 'KBDefinitionName'
              index: 0
              subtotals: ''
              width: 150
            }
            column_KBBranchName
            {
              columnId: 'KBBranchName'
              dataPath: 'KBBranchName'
              dataType: 'string'
              title: 'KBBranchName'
              index: 1
              subtotals: ''
              width: 150
            }
            column_KBBranchVersion
            {
              columnId: 'KBBranchVersion'
              dataPath: 'KBBranchVersion'
              dataType: 'string'
              title: 'KBBranchVersion'
              index: 2
              subtotals: ''
              width: 150
            }
          }
          LibSM_FormImportExportMasterData_PanelMetaData
          {
            sizeRatio: 1
          }
          LibSM_FormImportExportMasterData_PanelMetaDataButton
          {
            sizeRatio: 1
          }
          LibSM_FormImportExportMasterData_PanelMetaDataLists
          {
            sizeRatio: 1
          }
          LibSM_FormImportExportMasterData_PanelMetaDataStagingList
          {
            sizeRatio: 1
          }
          LibSM_FormImportExportMasterData_ListMetaDataStagingList
          {
          }
          LibSM_FormImportExportMasterData_DataSetLevelMetaDataStaging
          {
            groupDepth: -1
            column_Type
            {
              columnId: 'Type'
              dataPath: 'Type'
              dataType: 'string'
              title: 'Type'
              index: 0
              subtotals: ''
              width: 150
            }
            column_Value
            {
              columnId: 'Value'
              dataPath: 'Value'
              dataType: 'string'
              title: 'Value'
              index: 1
              subtotals: ''
              width: 150
            }
            column_Description
            {
              columnId: 'Description'
              dataPath: 'Description'
              dataType: 'string'
              title: 'Description'
              index: 2
              subtotals: ''
              width: 150
            }
          }
          LibSM_FormImportExportMasterData_PanelMetaDataList
          {
            sizeRatio: 1
          }
          LibSM_FormImportExportMasterData_ListMetaDataList
          {
          }
          LibSM_FormImportExportMasterData_DataSetLevelMetaData
          {
            groupDepth: -1
            column_Type
            {
              columnId: 'Type'
              dataPath: 'Type'
              dataType: 'string'
              title: 'Type'
              index: 0
              subtotals: ''
              width: 150
            }
            column_Value
            {
              columnId: 'Value'
              dataPath: 'Value'
              dataType: 'string'
              title: 'Value'
              index: 1
              subtotals: ''
              width: 150
            }
            column_Description
            {
              columnId: 'Description'
              dataPath: 'Description'
              dataType: 'string'
              title: 'Description'
              index: 2
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
  id: 'Import_export_master_data'
  name: 'Import/export master data'
  isglobal: false
  isroot: true
}
