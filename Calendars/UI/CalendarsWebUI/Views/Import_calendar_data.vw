Quintiq file version 2.0
{
  viewcontents
  {
    forms
    {
      form_LibCal_frmImportData
      {
        title: 'LibCal_frmImportData'
        shown: true
        componentID: 'LibCal_frmImportData'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 23
          columnPosition: 1
          columnSpan: 12
        }
        components
        {
          LibCal_frmImportData_pnlToolbar
          {
            sizeRatio: 1
          }
          LibCal_frmImportData_pnlErrorsAndWarnings
          {
            sizeRatio: 1
          }
          LibCal_frmImportData_pnlStagingCalendars
          {
            sizeRatio: 1
          }
          LibCal_frmImportData_lstStagingCalendars
          {
          }
          LibCal_frmImportData_dslStagingCalendars
          {
            groupDepth: -1
            column_CalendarType
            {
              columnId: 'CalendarType'
              dataPath: 'CalendarType'
              dataType: 'string'
              title: 'CalendarType'
              index: 0
              subtotals: ''
              width: 150
            }
            column_StagingCalendarID
            {
              columnId: 'StagingCalendarID'
              dataPath: 'StagingCalendarID'
              dataType: 'string'
              title: 'StagingCalendarID'
              index: 1
              subtotals: ''
              width: 150
            }
            column_OwnerID
            {
              columnId: 'OwnerID'
              dataPath: 'OwnerID'
              dataType: 'string'
              title: 'OwnerID'
              index: 2
              subtotals: ''
              width: 150
            }
            column_IsAlwaysAvailable
            {
              columnId: 'IsAlwaysAvailable'
              dataPath: 'IsAlwaysAvailable'
              dataType: 'boolean'
              title: 'IsAlwaysAvailable'
              index: 3
              subtotals: ''
              width: 128
            }
            column_Base
            {
              columnId: 'Base'
              dataPath: 'Base'
              dataType: 'datetime'
              title: 'Base'
              index: 4
              subtotals: ''
              width: 150
            }
            column_Window
            {
              columnId: 'Window'
              dataPath: 'Window'
              dataType: 'number'
              title: 'Window'
              index: 5
              subtotals: ''
              width: 77
            }
            column_History
            {
              columnId: 'History'
              dataPath: 'History'
              dataType: 'number'
              title: 'History'
              index: 6
              subtotals: ''
              width: 69
            }
            column_UpdateInterval
            {
              columnId: 'UpdateInterval'
              dataPath: 'UpdateInterval'
              dataType: 'duration'
              title: 'UpdateInterval'
              index: 7
              subtotals: ''
              width: 150
            }
            column_Validation
            {
              columnId: 'Validation'
              dataPath: 'Validation'
              dataType: 'string'
              title: 'Validation'
              index: 8
              subtotals: ''
              width: 375
            }
          }
          LibCal_frmImportData_pnlStagingEvents
          {
            sizeRatio: 1
          }
          LibCal_frmImportData_lstStagingEvents
          {
          }
          LibCal_frmImportData_dslStagingEvents
          {
            groupDepth: -1
            column_CalendarType
            {
              columnId: 'CalendarType'
              dataPath: 'CalendarType'
              dataType: 'string'
              title: 'CalendarType'
              index: 0
              subtotals: ''
              width: 197
            }
            column_CalendarID
            {
              columnId: 'CalendarID'
              dataPath: 'CalendarID'
              dataType: 'string'
              title: 'CalendarID'
              index: 1
              subtotals: ''
              width: 150
            }
            column_Category
            {
              columnId: 'Category'
              dataPath: 'Category'
              dataType: 'string'
              title: 'Category'
              index: 2
              subtotals: ''
              width: 150
            }
            column_Subject
            {
              columnId: 'Subject'
              dataPath: 'Subject'
              dataType: 'string'
              title: 'Subject'
              index: 3
              subtotals: ''
              width: 199
            }
            column_Description
            {
              columnId: 'Description'
              dataPath: 'Description'
              dataType: 'string'
              title: 'Description'
              index: 4
              subtotals: ''
              width: 187
            }
            column_Type
            {
              columnId: 'Type'
              dataPath: 'Type'
              dataType: 'string'
              title: 'Type'
              index: 5
              subtotals: ''
              width: 99
            }
            column_IsDefault
            {
              columnId: 'IsDefault'
              dataPath: 'IsDefault'
              dataType: 'boolean'
              title: 'IsDefault'
              index: 6
              subtotals: ''
              width: 81
            }
            column_PartialCapacity
            {
              columnId: 'PartialCapacity'
              dataPath: 'PartialCapacity'
              dataType: 'real'
              title: 'PartialCapacity'
              index: 7
              subtotals: ''
              width: 94
            }
            column_StartTimeOfDay
            {
              columnId: 'StartTimeOfDay'
              dataPath: 'StartTimeOfDay'
              dataType: 'duration'
              title: 'StartTimeOfDay'
              index: 8
              subtotals: ''
              width: 111
            }
            column_Duration
            {
              columnId: 'Duration'
              dataPath: 'Duration'
              dataType: 'duration'
              title: 'Duration'
              index: 9
              subtotals: ''
              width: 98
            }
            column_IsAllDay
            {
              columnId: 'IsAllDay'
              dataPath: 'IsAllDay'
              dataType: 'boolean'
              title: 'IsAllDay'
              index: 10
              subtotals: ''
              width: 70
            }
            column_IsRecurring
            {
              columnId: 'IsRecurring'
              dataPath: 'IsRecurring'
              dataType: 'boolean'
              title: 'IsRecurring'
              index: 11
              subtotals: ''
              width: 93
            }
            column_PatternType
            {
              columnId: 'PatternType'
              dataPath: 'PatternType'
              dataType: 'string'
              title: 'PatternType'
              index: 12
              subtotals: ''
              width: 92
            }
            column_RecurrenceInterval
            {
              columnId: 'RecurrenceInterval'
              dataPath: 'RecurrenceInterval'
              dataType: 'number'
              title: 'RecurrenceInterval'
              index: 13
              subtotals: ''
              width: 129
            }
            column_PatternWeekly_Weekdays
            {
              columnId: 'PatternWeekly_Weekdays'
              dataPath: 'PatternWeekly_Weekdays'
              dataType: 'string'
              title: 'PatternWeekly_Weekdays'
              index: 14
              subtotals: ''
              width: 171
            }
            column_PatternMonthly_IsDay
            {
              columnId: 'PatternMonthly_IsDay'
              dataPath: 'PatternMonthly_IsDay'
              dataType: 'boolean'
              title: 'PatternMonthly_IsDay'
              index: 15
              subtotals: ''
              width: 86
            }
            column_PatternMonthly_Day
            {
              columnId: 'PatternMonthly_Day'
              dataPath: 'PatternMonthly_Day'
              dataType: 'number'
              title: 'PatternMonthly_Day'
              index: 16
              subtotals: ''
              width: 92
            }
            column_PatternMonthly_WeekOfMonth
            {
              columnId: 'PatternMonthly_WeekOfMonth'
              dataPath: 'PatternMonthly_WeekOfMonth'
              dataType: 'string'
              title: 'PatternMonthly_WeekOfMonth'
              index: 17
              subtotals: ''
              width: 92
            }
            column_PatternMonthly_DayOfWeek
            {
              columnId: 'PatternMonthly_DayOfWeek'
              dataPath: 'PatternMonthly_DayOfWeek'
              dataType: 'string'
              title: 'PatternMonthly_DayOfWeek'
              index: 18
              subtotals: ''
              width: 89
            }
            column_PatternYearly_IsDay
            {
              columnId: 'PatternYearly_IsDay'
              dataPath: 'PatternYearly_IsDay'
              dataType: 'boolean'
              title: 'PatternYearly_IsDay'
              index: 19
              subtotals: ''
              width: 87
            }
            column_PatternYearly_Month
            {
              columnId: 'PatternYearly_Month'
              dataPath: 'PatternYearly_Month'
              dataType: 'number'
              title: 'PatternYearly_Month'
              index: 20
              subtotals: ''
              width: 89
            }
            column_PatternYearly_Day
            {
              columnId: 'PatternYearly_Day'
              dataPath: 'PatternYearly_Day'
              dataType: 'number'
              title: 'PatternYearly_Day'
              index: 21
              subtotals: ''
              width: 87
            }
            column_PatternYearly_WeekOfMonth
            {
              columnId: 'PatternYearly_WeekOfMonth'
              dataPath: 'PatternYearly_WeekOfMonth'
              dataType: 'string'
              title: 'PatternYearly_WeekOfMonth'
              index: 22
              subtotals: ''
              width: 89
            }
            column_PatternYearly_DayOfWeek
            {
              columnId: 'PatternYearly_DayOfWeek'
              dataPath: 'PatternYearly_DayOfWeek'
              dataType: 'string'
              title: 'PatternYearly_DayOfWeek'
              index: 23
              subtotals: ''
              width: 89
            }
            column_Validation
            {
              columnId: 'Validation'
              dataPath: 'Validation'
              dataType: 'string'
              title: 'Validation'
              index: 24
              subtotals: ''
              width: 375
            }
          }
          LibCal_frmImportData_pnlStagingParticipations
          {
            sizeRatio: 1
          }
          LibCal_frmImportData_lstStagingParticipations
          {
          }
          LibCal_frmImportData_dslStagingParticipations
          {
            groupDepth: -1
            column_CalendarType
            {
              columnId: 'CalendarType'
              dataPath: 'CalendarType'
              dataType: 'string'
              title: 'CalendarType'
              index: 0
              subtotals: ''
              width: 208
            }
            column_CalendarID
            {
              columnId: 'CalendarID'
              dataPath: 'CalendarID'
              dataType: 'string'
              title: 'CalendarID'
              index: 1
              subtotals: ''
              width: 150
            }
            column_StagingEvent_CalendarID
            {
              columnId: 'StagingEvent.CalendarID'
              dataPath: 'StagingEvent.CalendarID'
              dataType: 'string'
              title: 'EventCalendarID'
              index: 2
              subtotals: ''
              width: 150
            }
            column_StagingEvent_Subject
            {
              columnId: 'StagingEvent.Subject'
              dataPath: 'StagingEvent.Subject'
              dataType: 'string'
              title: 'Subject'
              index: 3
              subtotals: ''
              width: 150
            }
            column_IsSubscription
            {
              columnId: 'IsSubscription'
              dataPath: 'IsSubscription'
              dataType: 'boolean'
              title: 'IsSubscription'
              index: 4
              subtotals: ''
              width: 105
            }
            column_EventIsRecurring
            {
              columnId: 'EventIsRecurring'
              dataPath: 'EventIsRecurring'
              dataType: 'boolean'
              title: 'EventIsRecurring'
              index: 5
              subtotals: ''
              width: 123
            }
            column_StartDate
            {
              columnId: 'StartDate'
              dataPath: 'StartDate'
              dataType: 'date'
              title: 'StartDate'
              index: 6
              subtotals: ''
              width: 106
            }
            column_PeriodType
            {
              columnId: 'PeriodType'
              dataPath: 'PeriodType'
              dataType: 'string'
              title: 'PeriodType'
              index: 7
              subtotals: ''
              width: 100
            }
            column_PeriodStartDate
            {
              columnId: 'PeriodStartDate'
              dataPath: 'PeriodStartDate'
              dataType: 'date'
              title: 'PeriodStartDate'
              index: 8
              subtotals: ''
              width: 115
            }
            column_PeriodEndDate
            {
              columnId: 'PeriodEndDate'
              dataPath: 'PeriodEndDate'
              dataType: 'date'
              title: 'PeriodEndDate'
              index: 9
              subtotals: ''
              width: 110
            }
            column_Validation
            {
              columnId: 'Validation'
              dataPath: 'Validation'
              dataType: 'string'
              title: 'Validation'
              index: 10
              subtotals: ''
              width: 423
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
  id: 'Import calendar data'
  name: 'Import calendar data'
  isglobal: false
  isroot: true
}
