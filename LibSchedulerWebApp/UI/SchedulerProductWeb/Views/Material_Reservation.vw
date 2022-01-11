Quintiq file version 2.0
{
  viewcontents
  {
    forms
    {
      form_FormSuppliesAndDemands
      {
        title: 'QLibSchedulerWebApp::FormSuppliesAndDemands'
        shown: true
        componentID: 'QLibSchedulerWebApp::FormSuppliesAndDemands'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 19
          columnPosition: 1
          columnSpan: 12
        }
        components
        {
          FormSuppliesAndDemands_PanelStockingPoints
          {
            sizeRatio: 1
          }
          FormSuppliesAndDemands_PanelSuppliesAndDemands
          {
            sizeRatio: 10
          }
          FormSuppliesAndDemands_PanelSupplies
          {
            sizeRatio: 1
          }
          FormSuppliesAndDemands_PanelSuppliesFilter
          {
            sizeRatio: 1
          }
          FormSuppliesAndDemands_PanelSuppliesList
          {
            sizeRatio: 11
          }
          FormSuppliesAndDemands_ListAllSupplies
          {
            backendState
            {
              componentId: 'QLibSchedulerWebApp::FormSuppliesAndDemands.ListAllSupplies'
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
                          {
                            type: 'attributecriterion'
                            valuetype: 'Real'
                            disallowed:
                            [
                              {
                                type: 'basicvalue'
                                operand: '<>'
                                valuetype: 'Number'
                                value: 0
                              }
                            ]
                            objecttype: 'Supply'
                            attribute: 'QuantityOpen'
                          }
                        ]
                      }
                    }
                  }
                ]
              }
            }
          }
          FormSuppliesAndDemands_DataSetLevelAllSupplies
          {
            groupDepth: -1
            sort: 'AvailableFrom'
            column_ImgSupplyType
            {
              columnId: 'ImgSupplyType'
              dataPath: 'ImgSupplyType'
              dataType: 'string'
              title: 'ImgSupplyType'
              index: 0
              subtotals: ''
              width: 34
            }
            column_SupplyID
            {
              columnId: 'SupplyID'
              dataPath: 'SupplyID'
              dataType: 'string'
              title: 'Supply ID'
              index: 1
              subtotals: ''
              width: 150
            }
            column_StockingPointId
            {
              columnId: 'StockingPointId'
              dataPath: 'StockingPointId'
              dataType: 'string'
              title: 'Stocking Point ID'
              index: 2
              subtotals: ''
              width: 122
            }
            column_astype_ProductSupply__ProductId
            {
              columnId: 'astype(ProductSupply).ProductId'
              dataPath: 'astype(ProductSupply).ProductId'
              dataType: 'string'
              title: 'Product ID'
              index: 3
              subtotals: ''
              width: 109
            }
            column_AvailableFrom
            {
              columnId: 'AvailableFrom'
              dataPath: 'AvailableFrom'
              dataType: 'datetime'
              title: 'Available From'
              index: 4
              subtotals: ''
              width: 105
            }
            column_Quantity
            {
              columnId: 'Quantity'
              dataPath: 'Quantity'
              dataType: 'real'
              title: 'Quantity'
              index: 5
              subtotals: ''
              width: 73
            }
            column_QuantityReserved
            {
              columnId: 'QuantityReserved'
              dataPath: 'QuantityReserved'
              dataType: 'real'
              title: 'Reserved'
              index: 6
              subtotals: ''
              width: 78
            }
            column_QuantityOpen
            {
              columnId: 'QuantityOpen'
              dataPath: 'QuantityOpen'
              dataType: 'real'
              title: 'Open'
              index: 7
              subtotals: ''
              width: 59
            }
            column__Chart8
            {
              columnId: '_Chart8'
              dataPath: '_Chart8'
              dataType: 'string'
              title: 'Reserved/Open'
              index: 8
              subtotals: ''
              width: 163
            }
          }
          FormSuppliesAndDemands_PanelDemands
          {
            sizeRatio: 1
          }
          FormSuppliesAndDemands_PanelDemandFilter
          {
            sizeRatio: 1
          }
          FormSuppliesAndDemands_PanelDemandList
          {
            sizeRatio: 11
          }
          FormSuppliesAndDemands_ListAllDemands
          {
          }
          FormSuppliesAndDemands_DataSetLevelAllDemands
          {
            groupDepth: -1
            sort: 'DueDate'
            column_ImgDemandType
            {
              columnId: 'ImgDemandType'
              dataPath: 'ImgDemandType'
              dataType: 'string'
              title: 'ImgDemandType'
              index: 0
              subtotals: ''
              width: 30
            }
            column_PlanUnit_SC_Order_SC_OrderNr
            {
              columnId: 'PlanUnit_SC.Order_SC.OrderNr'
              dataPath: 'PlanUnit_SC.Order_SC.OrderNr'
              dataType: 'string'
              title: 'Order Nr'
              index: 1
              subtotals: ''
              width: 73
            }
            column_StockingPointId
            {
              columnId: 'StockingPointId'
              dataPath: 'StockingPointId'
              dataType: 'string'
              title: 'Stocking Point ID'
              index: 2
              subtotals: ''
              width: 118
            }
            column_astype_ProductDemand__ProductId
            {
              columnId: 'astype(ProductDemand).ProductId'
              dataPath: 'astype(ProductDemand).ProductId'
              dataType: 'string'
              title: 'Product ID'
              index: 3
              subtotals: ''
              width: 112
            }
            column_DueDate
            {
              columnId: 'DueDate'
              dataPath: 'DueDate'
              dataType: 'datetime'
              title: 'Due Date'
              index: 4
              subtotals: ''
              width: 130
            }
            column_ReservationStatus
            {
              columnId: 'ReservationStatus'
              dataPath: 'ReservationStatus'
              dataType: 'string'
              title: 'Reservation Status'
              index: 5
              subtotals: ''
              width: 30
            }
            column_Quantity
            {
              columnId: 'Quantity'
              dataPath: 'Quantity'
              dataType: 'real'
              title: 'Quantity'
              index: 6
              subtotals: ''
              width: 71
            }
            column_QuantityReserved
            {
              columnId: 'QuantityReserved'
              dataPath: 'QuantityReserved'
              dataType: 'real'
              title: 'Reserved'
              index: 7
              subtotals: ''
              width: 77
            }
            column_QuantityOpen
            {
              columnId: 'QuantityOpen'
              dataPath: 'QuantityOpen'
              dataType: 'real'
              title: 'Open'
              index: 8
              subtotals: ''
              width: 57
            }
            column_ImgDueNotPlanned
            {
              columnId: 'ImgDueNotPlanned'
              dataPath: 'ImgDueNotPlanned'
              dataType: 'string'
              title: 'ImgDueNotPlanned'
              index: 9
              subtotals: ''
              width: 30
            }
            column_ImgFrozen
            {
              columnId: 'ImgFrozen'
              dataPath: 'ImgFrozen'
              dataType: 'string'
              title: 'ImgFrozen'
              index: 10
              subtotals: ''
              width: 30
            }
            column_ImgOrderOnTime
            {
              columnId: 'ImgOrderOnTime'
              dataPath: 'ImgOrderOnTime'
              dataType: 'string'
              title: 'ImgOrderOnTime'
              index: 11
              subtotals: ''
              width: 30
            }
            column__Chart12
            {
              columnId: '_Chart12'
              dataPath: '_Chart12'
              dataType: 'string'
              title: 'Reserved/Open'
              index: 12
              subtotals: ''
              width: 118
            }
          }
          FormSuppliesAndDemands_PanelFulfillments
          {
            sizeRatio: 10
          }
          FormSuppliesAndDemands_PanelSupplyFulfillments
          {
            sizeRatio: 1
          }
          FormSuppliesAndDemands_ListSupplyFulfillments
          {
          }
          FormSuppliesAndDemands_DataSetLevelSupplyFulfillments
          {
            groupDepth: -1
            column_DemandId
            {
              columnId: 'DemandId'
              dataPath: 'DemandId'
              dataType: 'string'
              title: 'Demand ID'
              index: 0
              subtotals: ''
              width: 178
            }
            column_SupplyId
            {
              columnId: 'SupplyId'
              dataPath: 'SupplyId'
              dataType: 'string'
              title: 'Supply ID'
              index: 1
              subtotals: ''
              width: 150
            }
            column_Quantity
            {
              columnId: 'Quantity'
              dataPath: 'Quantity'
              dataType: 'real'
              title: 'Quantity'
              index: 2
              subtotals: ''
              width: 72
            }
          }
          FormSuppliesAndDemands_PanelDemandFulfillments
          {
            sizeRatio: 1
          }
          FormSuppliesAndDemands_ListDemandFulfillments
          {
          }
          FormSuppliesAndDemands_DataSetLevelDemandFulfillments
          {
            groupDepth: -1
            column_DemandId
            {
              columnId: 'DemandId'
              dataPath: 'DemandId'
              dataType: 'string'
              title: 'Demand ID'
              index: 0
              subtotals: ''
              width: 174
            }
            column_SupplyId
            {
              columnId: 'SupplyId'
              dataPath: 'SupplyId'
              dataType: 'string'
              title: 'Supply ID'
              index: 1
              subtotals: ''
              width: 150
            }
            column_Quantity
            {
              columnId: 'Quantity'
              dataPath: 'Quantity'
              dataType: 'real'
              title: 'Quantity'
              index: 2
              subtotals: ''
              width: 76
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
  id: 'Material_Reservation'
  name: 'Reserve Material'
  isglobal: false
  isroot: true
}
