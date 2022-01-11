Quintiq file version 2.0
{
  viewcontents
  {
    forms
    {
      form_FormKpiMatrix
      {
        title: 'QKpiTracker::FormKpiMatrix'
        shown: true
        componentID: 'QKpiTracker::FormKpiMatrix'
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
          FormKpiMatrix_PanelKpiMatrixButton
          {
            sizeRatio: 1
          }
          FormKpiMatrix_PanelKpiMatrix
          {
            sizeRatio: 1
          }
          FormKpiMatrix_PanelSelection
          {
            sizeRatio: 1
            active: false
          }
          FormKpiMatrix_PanelSelectionList
          {
            sizeRatio: 1
          }
          FormKpiMatrix_RadioButtonGroupSelectionList
          {
            value: 'PLAN'
          }
          FormKpiMatrix_PanelCompareLabel
          {
            sizeRatio: 1
          }
          FormKpiMatrix_PanelCompareLabelList
          {
            sizeRatio: 1
          }
          FormKpiMatrix_ListCompareLabel
          {
          }
          FormKpiMatrix_DataSetLevelCompareLabel
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
          FormKpiMatrix_PanelFilterLabel
          {
            sizeRatio: 1
          }
          FormKpiMatrix_ListLabelFilter
          {
          }
          FormKpiMatrix_DataSetLevelLabels
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
          FormKpiMatrix_DataSetLevelLabelValues
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
          FormKpiMatrix_PanelFilterKpi
          {
            sizeRatio: 1
          }
          FormKpiMatrix_PanelFilterKpiButton
          {
            sizeRatio: 1
          }
          FormKpiMatrix_ListFilterKpi
          {
          }
          FormKpiMatrix_DataSetLevelFilterKpi
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
          FormKpiMatrix_PanelKpiMatrixList
          {
            sizeRatio: 1
            active: false
          }
          FormKpiMatrix_PanelKpiMatrixListView
          {
            sizeRatio: 1
          }
          FormKpiMatrix_MatrixEditorKpiMatrixList
          {
            gridColor: '#c4c4c4'
            totalHeaderWidth: 200
            attributeHeaderWidthRatio: 0.6
            nameHeaderWidthRatio: 0.4
            columnWidth: 100
            horizontalGrid: true
            verticalGrid: true
            backendState
            {
              componentId: 'QKpiTracker::FormKpiMatrix.MatrixEditorKpiMatrixList'
              state
              {
                cells
                {
                  attributes
                  {
                    attribute_Value
                    {
                      type: 'MatrixEditorWebApiCellDataModelInterest'
                      index: 0
                      rowsubtotal: ''
                      columnsubtotal: ''
                      attribute: 'Value'
                    }
                  }
                }
                columns
                {
                  sorting
                  {
                    criteria: "datamember:'Value'"
                  }
                }
                rows
                {
                  sorting
                  {
                    criteria: "datamember:'DisplayName'"
                  }
                }
              }
            }
          }
          FormKpiMatrix_PanelKpiMatrixChart
          {
            sizeRatio: 1
            active: false
          }
          FormKpiMatrix_PanelChart
          {
            sizeRatio: 1
          }
          FormKpiMatrix_ChartKpiMatrixChart
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
  id: 'Compare_KPIs'
  name: 'Compare KPIs'
  isglobal: false
  isroot: true
}
