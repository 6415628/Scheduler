Quintiq file version 2.0
{
  viewcontents
  {
    forms
    {
      form_LibSM_FormKnowledgeProfiles
      {
        components
        {
          LibSM_FormKnowledgeProfiles_PanelKnowledgeProfilesRight
          {
            sizeRatio: 1.30711643320616
          }
          LibSM_FormKnowledgeProfiles_PanelKnowledgeProfilesLeft
          {
            sizeRatio: 0.692883566793842
          }
          LibSM_FormKnowledgeProfiles_DataSetLevelKnowledgeProfiles
          {
            sort: 'ErrorMessage'
          }
        }
        layout
        {
          columnSpan: 10
          rowSpan: 10
        }
      }
      form_LibSM_FormStatuses
      {
        layout
        {
          rowSpan: 10
          columnPosition: 11
        }
      }
      form_FormScenarios
      {
        title: 'QLibSchedulerWebApp::FormScenarios'
        shown: true
        componentID: 'QLibSchedulerWebApp::FormScenarios'
        layout
        {
          mode: 'open'
          rowPosition: 11
          rowSpan: 6
          columnPosition: 1
          columnSpan: 12
        }
        components
        {
          FormScenarios_ListScenarios
          {
          }
          FormScenarios_DataSetLevelScenarioManagerRoots
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
            column_astype_Scenario__HasBeenLeading
            {
              columnId: 'astype(Scenario).HasBeenLeading'
              dataPath: 'astype(Scenario).HasBeenLeading'
              dataType: 'boolean'
              title: 'HasBeenLeading'
              index: 3
              subtotals: ''
              width: 150
            }
            column_astype_Scenario__LastLeadingDateTime
            {
              columnId: 'astype(Scenario).LastLeadingDateTime'
              dataPath: 'astype(Scenario).LastLeadingDateTime'
              dataType: 'datetime'
              title: 'LastLeadingDateTime'
              index: 4
              subtotals: ''
              width: 150
            }
          }
          FormScenarios_DataSetLevelNodes
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
            column_astype_Scenario__HasBeenLeading
            {
              columnId: 'astype(Scenario).HasBeenLeading'
              dataPath: 'astype(Scenario).HasBeenLeading'
              dataType: 'boolean'
              title: 'HasBeenLeading'
              index: 3
              subtotals: ''
              width: 150
            }
            column_astype_Scenario__LastLeadingDateTime
            {
              columnId: 'astype(Scenario).LastLeadingDateTime'
              dataPath: 'astype(Scenario).LastLeadingDateTime'
              dataType: 'datetime'
              title: 'LastLeadingDateTime'
              index: 4
              subtotals: ''
              width: 150
            }
          }
        }
      }
      form_LibSM_FormOptimizerStrategies
      {
        _removed: true
      }
      form_LibSM_FormScenarioTypes
      {
        _removed: true
      }
      form_LibSM_FormScenarios
      {
        _removed: true
      }
    }
  }
  formatversion: 2
  id: 'Maintain_Plans'
  name: 'Maintain Plans'
  isglobal: false
  isroot: false
}
