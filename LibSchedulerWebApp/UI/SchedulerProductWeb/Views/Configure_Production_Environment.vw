Quintiq file version 2.0
{
  viewcontents
  {
    forms
    {
      form_FormProductionEnvironment
      {
        title: 'QLibSchedulerWebApp::FormProductionEnvironment'
        shown: true
        componentID: 'QLibSchedulerWebApp::FormProductionEnvironment'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 13
          columnPosition: 1
          columnSpan: 7
        }
        components
        {
          FormProductionEnvironment_PanelResourceGroup
          {
            sizeRatio: 1
          }
          FormProductionEnvironment_ListResourceGroup
          {
          }
          FormProductionEnvironment_listActionBarPageResourceGroup_PanelManageResource_ResourceGroup
          {
            sizeRatio: 1
          }
          FormProductionEnvironment_listActionBarPageResourceGroup_PanelManageResourcePosition
          {
            sizeRatio: 1
          }
          FormProductionEnvironment_DataSetLevelResourceGroup
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
            column_Type
            {
              columnId: 'Type'
              dataPath: 'Type'
              dataType: 'string'
              title: 'Type'
              index: 1
              subtotals: ''
              width: 83
            }
            column_HasOnlySupportedSubtasks
            {
              columnId: 'HasOnlySupportedSubtasks'
              dataPath: 'HasOnlySupportedSubtasks'
              dataType: 'boolean'
              title: 'HasOnlySupportedSubtasks'
              index: 2
              subtotals: ''
              width: 189
            }
          }
          FormProductionEnvironment_DataSetLevelResource
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
            column_Type
            {
              columnId: 'Type'
              dataPath: 'Type'
              dataType: 'string'
              title: 'Type'
              index: 1
              subtotals: ''
              width: 84
            }
            column_ResourceID
            {
              columnId: 'ResourceID'
              dataPath: 'ResourceID'
              dataType: 'string'
              title: 'ResourceID'
              index: 2
              subtotals: ''
              width: 186
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
  id: 'Configure_Production_Environment'
  name: 'Configure Production Environment'
  isglobal: false
  isroot: true
}
