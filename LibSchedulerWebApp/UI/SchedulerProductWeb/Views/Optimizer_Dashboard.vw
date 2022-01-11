Quintiq file version 2.0
{
  viewcontents
  {
    forms
    {
      form_FormOptimizerConvergenceGraph
      {
        title: 'QLibSchedulerWebApp::FormOptimizerConvergenceGraph'
        shown: true
        componentID: 'QLibSchedulerWebApp::FormOptimizerConvergenceGraph'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 19
          columnPosition: 3
          columnSpan: 10
        }
        components
        {
          FormOptimizerConvergenceGraph_PanelOptimizerConvergenceGraph
          {
            sizeRatio: 1
          }
          FormOptimizerConvergenceGraph_ChartOptimizerConvergenceGraph
          {
            SynchronizationGroup: ''
          }
        }
      }
      form_FormOptimizerDashboard
      {
        title: 'QLibSchedulerWebApp::FormOptimizerDashboard'
        shown: true
        componentID: 'QLibSchedulerWebApp::FormOptimizerDashboard'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 19
          columnPosition: 1
          columnSpan: 2
        }
        components
        {
          FormOptimizerDashboard_PanelOptimizerStrategySetting
          {
            sizeRatio: 1
          }
          FormOptimizerDashboard_PanelOptimizerProgress
          {
            sizeRatio: 1
          }
          FormOptimizerDashboard_PanelOptimizerDashboard
          {
            sizeRatio: 1
          }
          FormOptimizerDashboard_ListOptimizerDashboard
          {
          }
          FormOptimizerDashboard_DataSetLevelOptimizerDashboard
          {
            groupDepth: -1
            sort: 'DESC:TimeSince'
            column_TimeSince
            {
              columnId: 'TimeSince'
              dataPath: 'TimeSince'
              dataType: 'duration'
              title: 'TimeSince'
              index: 0
              subtotals: ''
              width: 104
            }
            column__Expr1
            {
              columnId: '_Expr1'
              dataPath: '_Expr1'
              dataType: 'string'
              title: 'Total KPI'
              index: 1
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
  id: 'Optimizer_Dashboard'
  name: 'Optimizer Dashboard'
  isglobal: false
  isroot: true
}
