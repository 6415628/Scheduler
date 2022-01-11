Quintiq file version 2.0
{
  viewcontents
  {
    forms
    {
      form_FormKpiSnapshots
      {
        title: 'QKpiTracker::FormKpiSnapshots'
        shown: true
        componentID: 'QKpiTracker::FormKpiSnapshots'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 21
          columnPosition: 1
          columnSpan: 12
        }
        components
        {
          FormKpiSnapshots_PanelButtons
          {
            sizeRatio: 1
          }
          FormKpiSnapshots_PanelSnapshots
          {
            sizeRatio: 1
          }
          FormKpiSnapshots_PanelConfiguration
          {
            sizeRatio: 1
            active: false
          }
          FormKpiSnapshots_PanelServerQuery
          {
            sizeRatio: 1
          }
          FormKpiSnapshots_PanelTimestampSelection
          {
            sizeRatio: 1
          }
          FormKpiSnapshots_PanelQueryParameters
          {
            sizeRatio: 1
          }
          FormKpiSnapshots_RadioButtonGroupTimespan
          {
            value: 'all'
          }
          FormKpiSnapshots_NumberPickerMaxResults
          {
            value: '1000'
          }
          FormKpiSnapshots_PanelLabels
          {
            sizeRatio: 1
          }
          FormKpiSnapshots_PanelLabelFiltering
          {
            sizeRatio: 1
          }
          FormKpiSnapshots_CheckboxEnableLabelFiltering
          {
            checked: false
          }
          FormKpiSnapshots_ListLabelFilter
          {
          }
          FormKpiSnapshots_DataSetLevelLabels
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
          FormKpiSnapshots_DataSetLevelLabelValues
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
          }
          FormKpiSnapshots_PanelKpiValues
          {
            sizeRatio: 1
          }
          FormKpiSnapshots_PanelKpiSelection
          {
            sizeRatio: 1
          }
          FormKpiSnapshots_ListKpiSelection
          {
          }
          FormKpiSnapshots_DataSetLevelKPISelection
          {
            groupDepth: -1
            column_DisplayName
            {
              columnId: 'DisplayName'
              dataPath: 'DisplayName'
              dataType: 'string'
              title: 'DisplayName'
              index: 0
              subtotals: ''
              width: 150
            }
          }
          FormKpiSnapshots_PanelSeriesSelection
          {
            sizeRatio: 1
          }
          FormKpiSnapshots_PanelLists
          {
            sizeRatio: 1
            active: false
          }
          FormKpiSnapshots_PanelSnapshotsList
          {
            sizeRatio: 1
          }
          FormKpiSnapshots_ListSnapshots
          {
          }
          FormKpiSnapshots_DataSetLevelSnapshots
          {
            groupDepth: -1
            column_ServerDateTime
            {
              columnId: 'ServerDateTime'
              dataPath: 'ServerDateTime'
              dataType: 'datetime'
              title: 'ServerDateTime'
              index: 0
              subtotals: ''
              width: 150
            }
            column_PlanDateTime
            {
              columnId: 'PlanDateTime'
              dataPath: 'PlanDateTime'
              dataType: 'datetime'
              title: 'PlanDateTime'
              index: 1
              subtotals: ''
              width: 150
            }
          }
          FormKpiSnapshots_PanelKPILabels
          {
            sizeRatio: 1
          }
          FormKpiSnapshots_ListKpiLabels
          {
          }
          FormKpiSnapshots_DataSetLevelKpiLabels
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
          }
          FormKpiSnapshots_PanelKPIValues
          {
            sizeRatio: 3
          }
          FormKpiSnapshots_ListKpiValues
          {
          }
          FormKpiSnapshots_DataSetLevelKpiValues
          {
            groupDepth: -1
            column_UI_LabelValue
            {
              columnId: 'UI_LabelValue'
              dataPath: 'UI_LabelValue'
              dataType: 'string'
              title: 'UI_LabelValue'
              index: 0
              subtotals: ''
              width: 150
            }
            column_Name
            {
              columnId: 'Name'
              dataPath: 'Name'
              dataType: 'string'
              title: 'Name'
              index: 1
              subtotals: ''
              width: 150
            }
            column_UI_DateTime
            {
              columnId: 'UI_DateTime'
              dataPath: 'UI_DateTime'
              dataType: 'datetime'
              title: 'UI_DateTime'
              index: 2
              subtotals: ''
              width: 150
            }
            column_Value
            {
              columnId: 'Value'
              dataPath: 'Value'
              dataType: 'real'
              title: 'Value'
              index: 3
              subtotals: ''
              width: 150
            }
          }
          FormKpiSnapshots_PanelChart
          {
            sizeRatio: 1
            active: false
          }
          FormKpiSnapshots_ChartKpis
          {
            SynchronizationGroup: ''
          }
          FormKpiSnapshots_ChartKpisBar
          {
            SynchronizationGroup: ''
          }
        }
      }
    }
    userconfigurableinformation
    {
    }
  }
  formatversion: 2
  id: 'Track_KPIs'
  name: 'Track KPIs'
  isglobal: false
  isroot: true
}
