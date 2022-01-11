Quintiq file version 2.0
{
  viewcontents
  {
    forms
    {
      form_FormProductInStockingPoint
      {
        title: 'QLibSchedulerWebApp::FormProductInStockingPoint'
        shown: true
        componentID: 'QLibSchedulerWebApp::FormProductInStockingPoint'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 21
          columnPosition: 1
          columnSpan: 3
        }
        components
        {
          FormProductInStockingPoint_ListProductInStockingPoint
          {
          }
          FormProductInStockingPoint_DataSetLevelProductInStockingPoint
          {
            groupDepth: -1
            sort: 'StockingPointId,ProductId'
            column_StockingPointId
            {
              columnId: 'StockingPointId'
              dataPath: 'StockingPointId'
              dataType: 'string'
              title: 'Stocking Point ID'
              index: 0
              subtotals: ''
              width: 118
            }
            column_ProductId
            {
              columnId: 'ProductId'
              dataPath: 'ProductId'
              dataType: 'string'
              title: 'Product ID'
              index: 1
              subtotals: ''
              width: 136
            }
            column__Chart2
            {
              columnId: '_Chart2'
              dataPath: '_Chart2'
              dataType: 'string'
              title: 'Current'
              index: 2
              subtotals: ''
              width: 85
            }
            column__Chart3
            {
              columnId: '_Chart3'
              dataPath: '_Chart3'
              dataType: 'string'
              title: 'Scheduled'
              index: 3
              subtotals: ''
              width: 87
            }
          }
        }
      }
      form_FormInventoryChart
      {
        title: 'QLibSchedulerWebApp::FormInventoryChart'
        shown: true
        componentID: 'QLibSchedulerWebApp::FormInventoryChart'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 9
          columnPosition: 4
          columnSpan: 9
        }
        components
        {
          FormInventoryChart_ChartInventory
          {
            SynchronizationGroup: '93e96b83-115e-4c66-bc19-6a41c90c47b1'
          }
          FormInventoryChart_ChartInventory_legend
          {
            LegendItems:
            [
            ]
          }
        }
      }
      form_FormResourceSchedule
      {
        title: 'QLibSchedulerWebApp::FormResourceSchedule'
        shown: true
        componentID: 'QLibSchedulerWebApp::FormResourceSchedule'
        layout
        {
          mode: 'open'
          rowPosition: 10
          rowSpan: 12
          columnPosition: 4
          columnSpan: 9
        }
        components
        {
          FormResourceSchedule_PanelResourceSchedule
          {
            sizeRatio: 1
            activeChild: 'PanelScheduleOverview'
          }
          FormResourceSchedule_PanelScheduleOverview
          {
            sizeRatio: 1
          }
          FormResourceSchedule_GanttChartResourceSchedule
          {
            VisibleStartDate: '2019-04-01T00:27:16'
            SynchronizationGroup: '93e96b83-115e-4c66-bc19-6a41c90c47b1'
            RowHeaderWidth: 250
            CurrentZoomFactor: 4
          }
          FormResourceSchedule_PanelResourceSequenceDetails
          {
            sizeRatio: 1
          }
          FormResourceSchedule_PanelResources
          {
            sizeRatio: 1
          }
          FormResourceSchedule_ListResources
          {
          }
          FormResourceSchedule_DataSetLevelResourceGroup
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
          FormResourceSchedule_DataSetLevelResource
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
          FormResourceSchedule_PanelTasks
          {
            sizeRatio: 1
          }
          FormResourceSchedule_ListTasks
          {
          }
          FormResourceSchedule_DataSetLevelTasks
          {
            groupDepth: -1
            column_astype_SingleTaskBase__OperationAsSingleTask_PlanUnit_SC_Order_SC_OrderNr
            {
              columnId: 'astype(SingleTaskBase).OperationAsSingleTask.PlanUnit_SC.Order_SC.OrderNr'
              dataPath: 'astype(SingleTaskBase).OperationAsSingleTask.PlanUnit_SC.Order_SC.OrderNr'
              dataType: 'string'
              title: 'OrderNr'
              index: 0
              subtotals: ''
              width: 150
            }
            column_Start
            {
              columnId: 'Start'
              dataPath: 'Start'
              dataType: 'datetime'
              title: 'Start'
              index: 1
              subtotals: ''
              width: 150
            }
            column_End
            {
              columnId: 'End'
              dataPath: 'End'
              dataType: 'datetime'
              title: 'End'
              index: 2
              subtotals: ''
              width: 150
            }
            column_ProcessDuration
            {
              columnId: 'ProcessDuration'
              dataPath: 'ProcessDuration'
              dataType: 'duration'
              title: 'ProcessDuration'
              index: 3
              subtotals: ''
              width: 150
            }
            column_SetupDuration
            {
              columnId: 'SetupDuration'
              dataPath: 'SetupDuration'
              dataType: 'duration'
              title: 'SetupDuration'
              index: 4
              subtotals: ''
              width: 150
            }
            column_CPPlannedEnd
            {
              columnId: 'CPPlannedEnd'
              dataPath: 'CPPlannedEnd'
              dataType: 'datetime'
              title: 'MPS Planned End'
              index: 5
              subtotals: ''
              width: 150
            }
            column_ImgFrozen
            {
              columnId: 'ImgFrozen'
              dataPath: 'ImgFrozen'
              dataType: 'string'
              title: 'ImgFrozen'
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
  id: 'Review_Inventory'
  name: 'Review Inventory'
  isglobal: false
  isroot: true
}
