Quintiq file version 2.0
{
  viewcontents
  {
    forms
    {
      form_LibSM_FormKnowledgeProfiles
      {
        title: 'QScenarioManager::LibSM_FormKnowledgeProfiles'
        shown: true
        componentID: 'QScenarioManager::LibSM_FormKnowledgeProfiles'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 6
          columnPosition: 1
          columnSpan: 5
        }
        components
        {
          LibSM_FormKnowledgeProfiles_PanelKnowledgeProfiles
          {
            sizeRatio: 1
          }
          LibSM_FormKnowledgeProfiles_PanelKnowledgeProfilesLeft
          {
            sizeRatio: 1
          }
          LibSM_FormKnowledgeProfiles_ListKnowledgeProfiles
          {
          }
          LibSM_FormKnowledgeProfiles_DataSetLevelKnowledgeProfiles
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
            column_ImgInvalidBranchContent
            {
              columnId: 'ImgInvalidBranchContent'
              dataPath: 'ImgInvalidBranchContent'
              dataType: 'string'
              title: 'ImgInvalidBranchContent'
              index: 1
              subtotals: ''
              width: 39
            }
            column_ErrorMessage
            {
              columnId: 'ErrorMessage'
              dataPath: 'ErrorMessage'
              dataType: 'string'
              title: 'ErrorMessage'
              index: 2
              subtotals: ''
              width: 150
            }
          }
          LibSM_FormKnowledgeProfiles_DataSetLevelScenariosPerProfile
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
          LibSM_FormKnowledgeProfiles_PanelKnowledgeProfilesRight
          {
            sizeRatio: 1
          }
          LibSM_FormKnowledgeProfiles_ListSelectedKnowledgeBranchesKnowledgeProfiles
          {
          }
          LibSM_FormKnowledgeProfiles_ListSelectedKnowledgeBranchesKnowledgeProfiles_DataSetLevelBranches
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
            column_ErrorMessage
            {
              columnId: 'ErrorMessage'
              dataPath: 'ErrorMessage'
              dataType: 'string'
              title: 'ErrorMessage'
              index: 3
              subtotals: ''
              width: 150
            }
          }
        }
      }
      form_LibSM_FormMetaData
      {
        title: 'QScenarioManager::LibSM_FormMetaData'
        shown: true
        componentID: 'QScenarioManager::LibSM_FormMetaData'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 6
          columnPosition: 6
          columnSpan: 7
        }
        components
        {
          LibSM_FormMetaData_PanelPlanningLevel
          {
            sizeRatio: 1
          }
          LibSM_FormMetaData_ListPlanningLevel
          {
          }
          LibSM_FormMetaData_DataSetLevelPlanningLevel
          {
            groupDepth: -1
            column_Value
            {
              columnId: 'Value'
              dataPath: 'Value'
              dataType: 'string'
              title: 'Value'
              index: 0
              subtotals: ''
              width: 150
            }
            column_Description
            {
              columnId: 'Description'
              dataPath: 'Description'
              dataType: 'string'
              title: 'Description'
              index: 1
              subtotals: ''
              width: 150
            }
          }
          LibSM_FormMetaData_PanelPlanType
          {
            sizeRatio: 1
          }
          LibSM_FormMetaData_ListPlanType
          {
          }
          LibSM_FormMetaData_DataSetLevelPlanType
          {
            groupDepth: -1
            column_Value
            {
              columnId: 'Value'
              dataPath: 'Value'
              dataType: 'string'
              title: 'Value'
              index: 0
              subtotals: ''
              width: 150
            }
            column_Description
            {
              columnId: 'Description'
              dataPath: 'Description'
              dataType: 'string'
              title: 'Description'
              index: 1
              subtotals: ''
              width: 150
            }
          }
          LibSM_FormMetaData_PanelLifecycleStatus
          {
            sizeRatio: 1
          }
          LibSM_FormMetaData_ListLifecycleStatus
          {
          }
          LibSM_FormMetaData_DataSetLevelLifecycleStatus
          {
            groupDepth: -1
            column_Value
            {
              columnId: 'Value'
              dataPath: 'Value'
              dataType: 'string'
              title: 'Value'
              index: 0
              subtotals: ''
              width: 150
            }
            column_Description
            {
              columnId: 'Description'
              dataPath: 'Description'
              dataType: 'string'
              title: 'Description'
              index: 1
              subtotals: ''
              width: 150
            }
          }
        }
      }
      form_LibSM_FormScenarios
      {
        title: 'QScenarioManager::LibSM_FormScenarios'
        shown: true
        componentID: 'QScenarioManager::LibSM_FormScenarios'
        layout
        {
          mode: 'open'
          rowPosition: 7
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
              width: 337
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
              width: 342
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
    }
    userconfigurableinformation
    {
    }
  }
  formatversion: 2
  id: 'Maintain_Plans'
  name: 'Maintain Plans'
  isglobal: false
  isroot: true
}
