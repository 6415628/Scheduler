Quintiq file version 2.0
{
  viewcontents
  {
    forms
    {
      form_FormKpiMetaData
      {
        title: 'QKpiTracker::FormKpiMetaData'
        shown: true
        componentID: 'QKpiTracker::FormKpiMetaData'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 6
          columnPosition: 1
          columnSpan: 12
        }
        components
        {
          FormKpiMetaData_ListKpiMetaData
          {
          }
          FormKpiMetaData_DataSetLevelKpiMetaData
          {
            groupDepth: -1
            column_ImgInterpretation
            {
              columnId: 'ImgInterpretation'
              dataPath: 'ImgInterpretation'
              dataType: 'string'
              title: 'ImgInterpretation'
              index: 0
              subtotals: ''
              width: 60
            }
            column_Name
            {
              columnId: 'Name'
              dataPath: 'Name'
              dataType: 'string'
              title: 'Name'
              index: 1
              subtotals: ''
              width: 227
            }
            column_DisplayName
            {
              columnId: 'DisplayName'
              dataPath: 'DisplayName'
              dataType: 'string'
              title: 'DisplayName'
              index: 2
              subtotals: ''
              width: 258
            }
            column_Description
            {
              columnId: 'Description'
              dataPath: 'Description'
              dataType: 'string'
              title: 'Description'
              index: 3
              subtotals: ''
              width: 233
            }
            column_UnitOfMeasure
            {
              columnId: 'UnitOfMeasure'
              dataPath: 'UnitOfMeasure'
              dataType: 'string'
              title: 'UnitOfMeasure'
              index: 4
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
  id: 'Configure_KPIs'
  name: 'Configure KPIs'
  isglobal: false
  isroot: true
}
