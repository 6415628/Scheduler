Quintiq file version 2.0
{
  viewcontents
  {
    forms
    {
      form_FormProductAdherence
      {
        title: 'QLibSchedulerWebApp::FormProductAdherence'
        shown: true
        componentID: 'QLibSchedulerWebApp::FormProductAdherence'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 19
          columnPosition: 10
          columnSpan: 3
        }
        components
        {
          FormProductAdherence_PanelProducts
          {
            sizeRatio: 1
          }
          FormProductAdherence_ListProducts
          {
          }
          FormProductAdherence_DataSetLevelProductAdherence
          {
            groupDepth: -1
            sort: 'Id'
            column_Id
            {
              columnId: 'Id'
              dataPath: 'Id'
              dataType: 'string'
              title: 'Product'
              index: 0
              subtotals: ''
              width: 135
            }
            column_TotalMPSPlannedOrderQuantity
            {
              columnId: 'TotalMPSPlannedOrderQuantity'
              dataPath: 'TotalMPSPlannedOrderQuantity'
              dataType: 'real'
              title: 'Qty'
              index: 1
              subtotals: ''
              width: 58
            }
            column__Chart1
            {
              columnId: '_Chart1'
              dataPath: '_Chart1'
              dataType: 'string'
              title: 'Adherence to MPS'
              index: 2
              subtotals: ''
              width: 270
            }
          }
          FormProductAdherence_PanelRouting
          {
            sizeRatio: 1
          }
          FormProductAdherence_ListRouting
          {
          }
          FormProductAdherence_DataSetLevelRouting
          {
            groupDepth: -1
            column_RoutingId
            {
              columnId: 'RoutingId'
              dataPath: 'RoutingId'
              dataType: 'string'
              title: 'Routing'
              index: 0
              subtotals: ''
              width: 136
            }
            column_TotalMPSPlannedOrderQuantity
            {
              columnId: 'TotalMPSPlannedOrderQuantity'
              dataPath: 'TotalMPSPlannedOrderQuantity'
              dataType: 'real'
              title: 'Qty'
              index: 1
              subtotals: ''
              width: 60
            }
            column__Chart1
            {
              columnId: '_Chart1'
              dataPath: '_Chart1'
              dataType: 'string'
              title: 'Adherence to MPS'
              index: 2
              subtotals: ''
              width: 245
            }
          }
        }
      }
      form_FormAdherenceToMPS
      {
        title: 'QLibSchedulerWebApp::FormAdherenceToMPS'
        shown: true
        componentID: 'QLibSchedulerWebApp::FormAdherenceToMPS'
        layout
        {
          mode: 'open'
          rowPosition: 10
          rowSpan: 10
          columnPosition: 5
          columnSpan: 5
        }
        components
        {
          FormAdherenceToMPS_PanelAdherenceToMPSAllCharts
          {
            sizeRatio: 1
            activeChild: 'PanelAdherenceToMPSAgainstTarget'
          }
          FormAdherenceToMPS_PanelAdherenceToMPSAgainstTarget
          {
            sizeRatio: 1
          }
          FormAdherenceToMPS_ChartAdherenceToMPSAgainstTarget
          {
            SynchronizationGroup: ''
          }
          FormAdherenceToMPS_PanelAdherenceToMPS
          {
            sizeRatio: 1
          }
          FormAdherenceToMPS_ChartAdherenceToMPS
          {
            SynchronizationGroup: ''
          }
        }
      }
      form_FormMPSPlannedOrders
      {
        title: 'QLibSchedulerWebApp::FormMPSPlannedOrders'
        shown: true
        componentID: 'QLibSchedulerWebApp::FormMPSPlannedOrders'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 19
          columnPosition: 1
          columnSpan: 4
        }
        components
        {
          FormMPSPlannedOrders_ListPlannedOrders
          {
          }
          FormMPSPlannedOrders_DataSetLevelPlannedOrders
          {
            groupDepth: -1
            sort: 'MPSPeriodEnd'
            column_RoutingID
            {
              columnId: 'RoutingID'
              dataPath: 'RoutingID'
              dataType: 'string'
              title: 'Routing'
              index: 0
              subtotals: ''
              width: 142
            }
            column_MPSPeriodStart
            {
              columnId: 'MPSPeriodStart'
              dataPath: 'MPSPeriodStart'
              dataType: 'datetime'
              title: 'Period Start'
              index: 1
              subtotals: ''
              width: 109
            }
            column_MPSPeriodEnd
            {
              columnId: 'MPSPeriodEnd'
              dataPath: 'MPSPeriodEnd'
              dataType: 'datetime'
              title: 'Period End'
              index: 2
              subtotals: ''
              width: 105
            }
            column_Quantity
            {
              columnId: 'Quantity'
              dataPath: 'Quantity'
              dataType: 'real'
              title: 'Qty'
              index: 3
              subtotals: ''
              width: 44
            }
            column__Chart7
            {
              columnId: '_Chart7'
              dataPath: '_Chart7'
              dataType: 'string'
              title: 'Firmed Quantity (absolute)'
              index: 4
              subtotals: ''
              width: 170
            }
          }
        }
      }
      form_FormWorkOrders
      {
        title: 'QLibSchedulerWebApp::FormWorkOrders'
        shown: true
        componentID: 'QLibSchedulerWebApp::FormWorkOrders'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 9
          columnPosition: 5
          columnSpan: 5
        }
        components
        {
          FormWorkOrders_ListWorkOrdersInFormWorkOrders
          {
          }
          FormWorkOrders_ListWorkOrdersInFormWorkOrders_DataSetLevelWorkOrders
          {
            groupDepth: -1
            sort: 'DueDate,ProductId,RoutingID'
            column_ImgIsCreatedInScheduler
            {
              columnId: 'ImgIsCreatedInScheduler'
              dataPath: 'ImgIsCreatedInScheduler'
              dataType: 'string'
              title: 'ImgIsCreatedInScheduler'
              index: 0
              subtotals: ''
              width: 43
            }
            column_ImgLifecycleState
            {
              columnId: 'ImgLifecycleState'
              dataPath: 'ImgLifecycleState'
              dataType: 'string'
              title: 'ImgLifecycleState'
              index: 1
              subtotals: ''
              width: 30
            }
            column_ImgDeliveryStatus
            {
              columnId: 'ImgDeliveryStatus'
              dataPath: 'ImgDeliveryStatus'
              dataType: 'string'
              title: 'ImgDeliveryStatus'
              index: 2
              subtotals: ''
              width: 30
            }
            column_ImgReleasedBy
            {
              columnId: 'ImgReleasedBy'
              dataPath: 'ImgReleasedBy'
              dataType: 'string'
              title: 'ImgReleasedBy'
              index: 3
              subtotals: ''
              width: 30
            }
            column_Id
            {
              columnId: 'Id'
              dataPath: 'Id'
              dataType: 'string'
              title: 'Work order'
              index: 4
              subtotals: ''
              width: 155
            }
            column_ProductId
            {
              columnId: 'ProductId'
              dataPath: 'ProductId'
              dataType: 'string'
              title: 'Product'
              index: 5
              subtotals: ''
              width: 69
            }
            column_RoutingID
            {
              columnId: 'RoutingID'
              dataPath: 'RoutingID'
              dataType: 'string'
              title: 'Routing'
              index: 6
              subtotals: ''
              width: 139
            }
            column_DueDate
            {
              columnId: 'DueDate'
              dataPath: 'DueDate'
              dataType: 'datetime'
              title: 'Due'
              index: 7
              subtotals: ''
              width: 98
            }
            column_Quantity
            {
              columnId: 'Quantity'
              dataPath: 'Quantity'
              dataType: 'real'
              title: 'Qty'
              index: 8
              subtotals: ''
              width: 44
            }
            column_Order_SC_CompletionTime
            {
              columnId: 'Order_SC.CompletionTime'
              dataPath: 'Order_SC.CompletionTime'
              dataType: 'datetime'
              title: 'Completion Time'
              index: 9
              subtotals: ''
              width: 123
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
  id: 'MPS Plan'
  name: 'Manage Orders'
  isglobal: false
  isroot: true
}
