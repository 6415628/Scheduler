Quintiq file version 2.0
{
  viewcontents
  {
    forms
    {
      form_FormWorkOrdersAndOperations
      {
        title: 'QLibSchedulerWebApp::FormWorkOrdersAndOperations'
        shown: true
        componentID: 'QLibSchedulerWebApp::FormWorkOrdersAndOperations'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 10
          columnPosition: 1
          columnSpan: 12
        }
        components
        {
          FormWorkOrdersAndOperations_PanelWorkOrdersAndOperations
          {
            sizeRatio: 1
            activeChild: 'PanelWorkOrders'
          }
          FormWorkOrdersAndOperations_PanelWorkOrders
          {
            sizeRatio: 1
          }
          FormWorkOrdersAndOperations_ListWorkOrdersInPanelWorkOrders
          {
          }
          FormWorkOrdersAndOperations_ListWorkOrdersInPanelWorkOrders_DataSetLevelWorkOrders
          {
            groupDepth: -1
            column_ImgLifecycleState
            {
              columnId: 'ImgLifecycleState'
              dataPath: 'ImgLifecycleState'
              dataType: 'string'
              title: 'ImgLifecycleState'
              index: 0
              subtotals: ''
              width: 43
            }
            column_ImgIsOnTime
            {
              columnId: 'ImgIsOnTime'
              dataPath: 'ImgIsOnTime'
              dataType: 'string'
              title: 'ImgIsOnTime'
              index: 1
              subtotals: ''
              width: 30
            }
            column_Id
            {
              columnId: 'Id'
              dataPath: 'Id'
              dataType: 'string'
              title: 'ID'
              index: 2
              subtotals: ''
              width: 172
            }
            column_StockingPointId
            {
              columnId: 'StockingPointId'
              dataPath: 'StockingPointId'
              dataType: 'string'
              title: 'Stocking Point'
              index: 3
              subtotals: ''
              width: 136
            }
            column_ProductId
            {
              columnId: 'ProductId'
              dataPath: 'ProductId'
              dataType: 'string'
              title: 'Product'
              index: 4
              subtotals: ''
              width: 129
            }
            column_RoutingID
            {
              columnId: 'RoutingID'
              dataPath: 'RoutingID'
              dataType: 'string'
              title: 'Routing'
              index: 5
              subtotals: ''
              width: 150
            }
            column_DueDate
            {
              columnId: 'DueDate'
              dataPath: 'DueDate'
              dataType: 'datetime'
              title: 'Due'
              index: 6
              subtotals: ''
              width: 150
            }
            column_Quantity
            {
              columnId: 'Quantity'
              dataPath: 'Quantity'
              dataType: 'real'
              title: 'Quantity'
              index: 7
              subtotals: ''
              width: 76
            }
            column_NrOfLots
            {
              columnId: 'NrOfLots'
              dataPath: 'NrOfLots'
              dataType: 'number'
              title: 'Lots'
              index: 8
              subtotals: ''
              width: 83
            }
            column_LotSize
            {
              columnId: 'LotSize'
              dataPath: 'LotSize'
              dataType: 'real'
              title: 'Lot Size'
              index: 9
              subtotals: ''
              width: 72
            }
          }
          FormWorkOrdersAndOperations_PanelOperations
          {
            sizeRatio: 1
          }
          FormWorkOrdersAndOperations_PanelOperationsFilter
          {
            sizeRatio: 1
          }
          FormWorkOrdersAndOperations_ListOperationsInPanelOperations
          {
            backendState
            {
              componentId: 'QLibSchedulerWebApp::FormWorkOrdersAndOperations.ListOperationsInPanelOperations'
              state
              {
                sublevels:
                [
                  {
                    filter
                    {
                      name: ''
                      terms
                      {
                        type: 'group'
                        children:
                        [
                        ]
                      }
                    }
                  }
                ]
              }
            }
          }
          FormWorkOrdersAndOperations_ListOperationsInPanelOperations_DataSetLevelOperations
          {
            groupDepth: -1
            sort: 'DueDate,PlanUnit_SC.Order_SC.OrderNr,SequenceNr'
            column_MaterialStatus
            {
              columnId: 'MaterialStatus'
              dataPath: 'MaterialStatus'
              dataType: 'string'
              title: 'MaterialStatus'
              index: 0
              subtotals: ''
              width: 43
            }
            column_ImgIsPlanned
            {
              columnId: 'ImgIsPlanned'
              dataPath: 'ImgIsPlanned'
              dataType: 'string'
              title: 'ImgIsPlanned'
              index: 1
              subtotals: ''
              width: 30
            }
            column_ImgIsOnTime
            {
              columnId: 'ImgIsOnTime'
              dataPath: 'ImgIsOnTime'
              dataType: 'string'
              title: 'ImgIsOnTime'
              index: 2
              subtotals: ''
              width: 30
            }
            column_Type
            {
              columnId: 'Type'
              dataPath: 'Type'
              dataType: 'string'
              title: 'Operation Type'
              index: 3
              subtotals: ''
              width: 112
            }
            column_PlanUnit_SC_Order_SC_OrderNr
            {
              columnId: 'PlanUnit_SC.Order_SC.OrderNr'
              dataPath: 'PlanUnit_SC.Order_SC.OrderNr'
              dataType: 'string'
              title: 'OrderNr'
              index: 4
              subtotals: ''
              width: 174
            }
            column_SequenceNr
            {
              columnId: 'SequenceNr'
              dataPath: 'SequenceNr'
              dataType: 'number'
              title: '#'
              index: 5
              subtotals: ''
              width: 49
            }
            column_PlanUnit_SC_ProductId
            {
              columnId: 'PlanUnit_SC.ProductId'
              dataPath: 'PlanUnit_SC.ProductId'
              dataType: 'string'
              title: 'ProductID'
              index: 6
              subtotals: ''
              width: 95
            }
            column_DueDate
            {
              columnId: 'DueDate'
              dataPath: 'DueDate'
              dataType: 'datetime'
              title: 'DueDate'
              index: 7
              subtotals: ''
              width: 136
            }
            column_AllowedResource
            {
              columnId: 'AllowedResource'
              dataPath: 'AllowedResource'
              dataType: 'string'
              title: 'AllowedResource'
              index: 8
              subtotals: ''
              width: 150
            }
            column_EarliestStart
            {
              columnId: 'EarliestStart'
              dataPath: 'EarliestStart'
              dataType: 'datetime'
              title: 'EarliestStart'
              index: 9
              subtotals: ''
              width: 132
            }
            column_Start
            {
              columnId: 'Start'
              dataPath: 'Start'
              dataType: 'datetime'
              title: 'Start'
              index: 10
              subtotals: ''
              width: 150
            }
            column_End
            {
              columnId: 'End'
              dataPath: 'End'
              dataType: 'datetime'
              title: 'End'
              index: 11
              subtotals: ''
              width: 150
            }
          }
          FormWorkOrdersAndOperations_PanelOperationBatches
          {
            sizeRatio: 1
          }
          FormWorkOrdersAndOperations_PanelOperationBatchesFilterToolbar
          {
            sizeRatio: 1
          }
          FormWorkOrdersAndOperations_PanelOperationBatchesList
          {
            sizeRatio: 1
          }
          FormWorkOrdersAndOperations_ListBatchInPanelOperationBatchesList
          {
          }
          FormWorkOrdersAndOperations_ListBatchInPanelOperationBatchesList_DataSetLevelBatch
          {
            groupDepth: -1
            sort: 'DueDate,Start,End,BatchID'
            column_ImgIsBatchHasCommonPractice
            {
              columnId: 'ImgIsBatchHasCommonPractice'
              dataPath: 'ImgIsBatchHasCommonPractice'
              dataType: 'string'
              title: 'ImgIsBatchHasCommonPractice'
              index: 0
              subtotals: ''
              width: 43
            }
            column_ImgIsBatchSizeOK
            {
              columnId: 'ImgIsBatchSizeOK'
              dataPath: 'ImgIsBatchSizeOK'
              dataType: 'string'
              title: 'ImgIsBatchSizeOK'
              index: 1
              subtotals: ''
              width: 30
            }
            column_ImgIsFinished
            {
              columnId: 'ImgIsFinished'
              dataPath: 'ImgIsFinished'
              dataType: 'string'
              title: 'ImgIsFinished'
              index: 2
              subtotals: ''
              width: 30
            }
            column_ImgIsPlanned
            {
              columnId: 'ImgIsPlanned'
              dataPath: 'ImgIsPlanned'
              dataType: 'string'
              title: 'ImgIsPlanned'
              index: 3
              subtotals: ''
              width: 30
            }
            column_BatchID
            {
              columnId: 'BatchID'
              dataPath: 'BatchID'
              dataType: 'string'
              title: 'BatchID'
              index: 4
              subtotals: ''
              width: 119
            }
            column_DueDate
            {
              columnId: 'DueDate'
              dataPath: 'DueDate'
              dataType: 'datetime'
              title: 'DueDate'
              index: 5
              subtotals: ''
              width: 150
            }
            column_Start
            {
              columnId: 'Start'
              dataPath: 'Start'
              dataType: 'datetime'
              title: 'Start'
              index: 6
              subtotals: ''
              width: 150
            }
            column_End
            {
              columnId: 'End'
              dataPath: 'End'
              dataType: 'datetime'
              title: 'End'
              index: 7
              subtotals: ''
              width: 150
            }
            column_SelectedPractice
            {
              columnId: 'SelectedPractice'
              dataPath: 'SelectedPractice'
              dataType: 'string'
              title: 'Practice'
              index: 8
              subtotals: ''
              width: 150
            }
            column_Size
            {
              columnId: 'Size'
              dataPath: 'Size'
              dataType: 'real'
              title: 'Size'
              index: 9
              subtotals: ''
              width: 150
            }
            column_MaxBatchSize
            {
              columnId: 'MaxBatchSize'
              dataPath: 'MaxBatchSize'
              dataType: 'real'
              title: 'MaxBatchSize'
              index: 10
              subtotals: ''
              width: 150
            }
            column__Chart12
            {
              columnId: '_Chart12'
              dataPath: '_Chart12'
              dataType: 'string'
              title: 'Reserved/Open'
              index: 11
              subtotals: ''
              width: 150
            }
          }
          FormWorkOrdersAndOperations_ListBatchInPanelOperationBatchesList_DataSetLevelBatchElements
          {
            groupDepth: -1
            column_ImgIsPlanned
            {
              columnId: 'ImgIsPlanned'
              dataPath: 'ImgIsPlanned'
              dataType: 'string'
              title: 'ImgIsPlanned'
              index: 0
              subtotals: ''
              width: 71
            }
            column_BatchSequenceElement_SequenceNr
            {
              columnId: 'BatchSequenceElement.SequenceNr'
              dataPath: 'BatchSequenceElement.SequenceNr'
              dataType: 'number'
              title: 'SequenceNr'
              index: 1
              subtotals: ''
              width: 103
            }
            column_PlanUnit_SC_AsParentPlanUnitToOrder_OrderNr
            {
              columnId: 'PlanUnit_SC.AsParentPlanUnitToOrder.OrderNr'
              dataPath: 'PlanUnit_SC.AsParentPlanUnitToOrder.OrderNr'
              dataType: 'string'
              title: 'OrderNr'
              index: 2
              subtotals: ''
              width: 96
            }
            column_OperationID
            {
              columnId: 'OperationID'
              dataPath: 'OperationID'
              dataType: 'string'
              title: 'OperationID'
              index: 3
              subtotals: ''
              width: 150
            }
            column_Start
            {
              columnId: 'Start'
              dataPath: 'Start'
              dataType: 'datetime'
              title: 'Start'
              index: 4
              subtotals: ''
              width: 150
            }
            column_End
            {
              columnId: 'End'
              dataPath: 'End'
              dataType: 'datetime'
              title: 'End'
              index: 5
              subtotals: ''
              width: 150
            }
            column_Practice
            {
              columnId: 'Practice'
              dataPath: 'Practice'
              dataType: 'string'
              title: 'Practice'
              index: 6
              subtotals: ''
              width: 150
            }
          }
        }
      }
      form_FormResourceSchedule_1
      {
        title: 'QLibSchedulerWebApp::FormResourceSchedule'
        shown: true
        componentID: 'QLibSchedulerWebApp::FormResourceSchedule'
        layout
        {
          mode: 'open'
          rowPosition: 11
          rowSpan: 10
          columnPosition: 1
          columnSpan: 12
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
            VisibleStartDate: '2017-01-04T11:50:07'
            SynchronizationGroup: 'GanttChartandInventoryChartSynchronize'
            RowHeaderWidth: 250
            CurrentZoomFactor: 1
          }
          FormResourceSchedule_PanelResourceSequenceDetails
          {
            sizeRatio: 1
          }
          FormResourceSchedule_PanelResources
          {
            sizeRatio: 0.241559435327915
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
            sizeRatio: 1.75844056467208
          }
          FormResourceSchedule_ListTasks
          {
          }
          FormResourceSchedule_DataSetLevelTasks
          {
            groupDepth: -1
            column_ImgFrozen
            {
              columnId: 'ImgFrozen'
              dataPath: 'ImgFrozen'
              dataType: 'string'
              title: 'ImgFrozen'
              index: 0
              subtotals: ''
              width: 150
            }
            column_astype_SingleTaskBase__OperationAsSingleTask_PlanUnit_SC_Order_SC_OrderNr
            {
              columnId: 'astype(SingleTaskBase).OperationAsSingleTask.PlanUnit_SC.Order_SC.OrderNr'
              dataPath: 'astype(SingleTaskBase).OperationAsSingleTask.PlanUnit_SC.Order_SC.OrderNr'
              dataType: 'string'
              title: 'OrderNr'
              index: 1
              subtotals: ''
              width: 150
            }
            column_Start
            {
              columnId: 'Start'
              dataPath: 'Start'
              dataType: 'datetime'
              title: 'Start'
              index: 2
              subtotals: ''
              width: 150
            }
            column_End
            {
              columnId: 'End'
              dataPath: 'End'
              dataType: 'datetime'
              title: 'End'
              index: 3
              subtotals: ''
              width: 150
            }
            column_ProcessDuration
            {
              columnId: 'ProcessDuration'
              dataPath: 'ProcessDuration'
              dataType: 'duration'
              title: 'ProcessDuration'
              index: 4
              subtotals: ''
              width: 150
            }
            column_SetupDuration
            {
              columnId: 'SetupDuration'
              dataPath: 'SetupDuration'
              dataType: 'duration'
              title: 'SetupDuration'
              index: 5
              subtotals: ''
              width: 150
            }
            column_CPPlannedEnd
            {
              columnId: 'CPPlannedEnd'
              dataPath: 'CPPlannedEnd'
              dataType: 'datetime'
              title: 'MPS Planned End'
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
  id: 'Schedule'
  name: 'Schedule'
  isglobal: false
  isroot: true
}
