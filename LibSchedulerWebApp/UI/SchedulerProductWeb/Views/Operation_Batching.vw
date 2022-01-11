Quintiq file version 2.0
{
  viewcontents
  {
    forms
    {
      form_FormOperationsAndBatches
      {
        title: 'QLibSchedulerWebApp::FormOperationsAndBatches'
        shown: true
        componentID: 'QLibSchedulerWebApp::FormOperationsAndBatches'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 16
          columnPosition: 1
          columnSpan: 12
        }
        components
        {
          FormOperationsAndBatches_PanelOperation
          {
            sizeRatio: 1
          }
          FormOperationsAndBatches_PanelBatchOperationActionToolbar
          {
            sizeRatio: 1
          }
          FormOperationsAndBatches_PanelBatchOperationFilterToolbar
          {
            sizeRatio: 1
          }
          FormOperationsAndBatches_PanelBatchOperation
          {
            sizeRatio: 1
          }
          FormOperationsAndBatches_ListBatchOperation
          {
          }
          FormOperationsAndBatches_ListBatchOperation_DataSetLevelOperations
          {
            groupDepth: -1
            sort: 'DueDate,PlanUnitId,PlanUnit_SC.Order_SC.OrderNr,Practice'
            column_ImgIsPlanned
            {
              columnId: 'ImgIsPlanned'
              dataPath: 'ImgIsPlanned'
              dataType: 'string'
              title: 'ImgIsPlanned'
              index: 0
              subtotals: ''
              width: 42
            }
            column_Type
            {
              columnId: 'Type'
              dataPath: 'Type'
              dataType: 'string'
              title: 'Operation Type'
              index: 1
              subtotals: ''
              width: 111
            }
            column_PlanUnit_SC_Order_SC_OrderNr
            {
              columnId: 'PlanUnit_SC.Order_SC.OrderNr'
              dataPath: 'PlanUnit_SC.Order_SC.OrderNr'
              dataType: 'string'
              title: 'OrderNr'
              index: 2
              subtotals: ''
              width: 76
            }
            column_PlanUnitId
            {
              columnId: 'PlanUnitId'
              dataPath: 'PlanUnitId'
              dataType: 'string'
              title: 'PlanUnitId'
              index: 3
              subtotals: ''
              width: 110
            }
            column_PlanUnit_SC_ProductId
            {
              columnId: 'PlanUnit_SC.ProductId'
              dataPath: 'PlanUnit_SC.ProductId'
              dataType: 'string'
              title: 'ProductID'
              index: 4
              subtotals: ''
              width: 143
            }
            column_DueDate
            {
              columnId: 'DueDate'
              dataPath: 'DueDate'
              dataType: 'datetime'
              title: 'DueDate'
              index: 5
              subtotals: ''
              width: 85
            }
            column_Start
            {
              columnId: 'Start'
              dataPath: 'Start'
              dataType: 'datetime'
              title: 'Start'
              index: 6
              subtotals: ''
              width: 88
            }
            column_End
            {
              columnId: 'End'
              dataPath: 'End'
              dataType: 'datetime'
              title: 'End'
              index: 7
              subtotals: ''
              width: 80
            }
            column_Practice
            {
              columnId: 'Practice'
              dataPath: 'Practice'
              dataType: 'string'
              title: 'Practice'
              index: 8
              subtotals: ''
              width: 74
            }
          }
          FormOperationsAndBatches_PanelBatches
          {
            sizeRatio: 1
          }
          FormOperationsAndBatches_PanelBatchActionToolbar
          {
            sizeRatio: 1
          }
          FormOperationsAndBatches_PanelBatchResequenceBatchElements
          {
            sizeRatio: 1
          }
          FormOperationsAndBatches_PanelBatchCreateEditDelete
          {
            sizeRatio: 1
          }
          FormOperationsAndBatches_PanelBatchFilterToolbar
          {
            sizeRatio: 1
          }
          FormOperationsAndBatches_PanelBatchList
          {
            sizeRatio: 1
          }
          FormOperationsAndBatches_ListBatchInPanelBatchList
          {
          }
          FormOperationsAndBatches_ListBatchInPanelBatchList_DataSetLevelBatch
          {
            groupDepth: -1
            sort: 'DueDate,BatchID'
            column_ImgIsBatchHasCommonPractice
            {
              columnId: 'ImgIsBatchHasCommonPractice'
              dataPath: 'ImgIsBatchHasCommonPractice'
              dataType: 'string'
              title: 'ImgIsBatchHasCommonPractice'
              index: 0
              subtotals: ''
              width: 35
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
              width: 94
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
            column_SelectedPractice
            {
              columnId: 'SelectedPractice'
              dataPath: 'SelectedPractice'
              dataType: 'string'
              title: 'Practice'
              index: 6
              subtotals: ''
              width: 76
            }
            column_Size
            {
              columnId: 'Size'
              dataPath: 'Size'
              dataType: 'real'
              title: 'Size'
              index: 7
              subtotals: ''
              width: 79
            }
            column_MaxBatchSize
            {
              columnId: 'MaxBatchSize'
              dataPath: 'MaxBatchSize'
              dataType: 'real'
              title: 'MaxBatchSize'
              index: 8
              subtotals: ''
              width: 115
            }
            column__Chart12
            {
              columnId: '_Chart12'
              dataPath: '_Chart12'
              dataType: 'string'
              title: 'Reserved/Open'
              index: 9
              subtotals: ''
              width: 150
            }
          }
          FormOperationsAndBatches_ListBatchInPanelBatchList_DataSetLevelBatchElements
          {
            groupDepth: -1
            sort: 'ImgIsPlanned'
            column_ImgIsPlanned
            {
              columnId: 'ImgIsPlanned'
              dataPath: 'ImgIsPlanned'
              dataType: 'string'
              title: 'ImgIsPlanned'
              index: 0
              subtotals: ''
              width: 72
            }
            column_BatchSequenceElement_SequenceNr
            {
              columnId: 'BatchSequenceElement.SequenceNr'
              dataPath: 'BatchSequenceElement.SequenceNr'
              dataType: 'number'
              title: 'SequenceNr'
              index: 1
              subtotals: ''
              width: 126
            }
            column_PlanUnit_SC_AsParentPlanUnitToOrder_OrderNr
            {
              columnId: 'PlanUnit_SC.AsParentPlanUnitToOrder.OrderNr'
              dataPath: 'PlanUnit_SC.AsParentPlanUnitToOrder.OrderNr'
              dataType: 'string'
              title: 'OrderNr'
              index: 2
              subtotals: ''
              width: 79
            }
            column_OperationID
            {
              columnId: 'OperationID'
              dataPath: 'OperationID'
              dataType: 'string'
              title: 'OperationID'
              index: 3
              subtotals: ''
              width: 132
            }
            column_Start
            {
              columnId: 'Start'
              dataPath: 'Start'
              dataType: 'datetime'
              title: 'Start'
              index: 4
              subtotals: ''
              width: 111
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
    }
    userconfigurableinformation
    {
    }
  }
  formatversion: 2
  id: 'Operation_Batching'
  name: 'Operation Batching'
  isglobal: false
  isroot: true
}
