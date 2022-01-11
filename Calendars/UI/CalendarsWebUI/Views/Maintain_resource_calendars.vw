Quintiq file version 2.0
{
  viewcontents
  {
    forms
    {
      form_LibCal_frmCommonCalendar
      {
        title: 'QCalendars::LibCal_frmCommonCalendar'
        shown: true
        componentID: 'QCalendars::LibCal_frmCommonCalendar'
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
          LibCal_frmCommonCalendar_pnlEventCategories
          {
            sizeRatio: 1
          }
          LibCal_frmCommonCalendar_lstEventCategories
          {
          }
          LibCal_frmCommonCalendar_dslEventCategories
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
            column_NrOfCommonEvents
            {
              columnId: 'NrOfCommonEvents'
              dataPath: 'NrOfCommonEvents'
              dataType: 'number'
              title: 'NrOfEvents'
              index: 1
              subtotals: ''
              width: 88
            }
          }
          LibCal_frmCommonCalendar_pnlCommonCalendar
          {
            sizeRatio: 6
            activeChild: 'tabGanttChart'
          }
          LibCal_frmCommonCalendar_tabGanttChart
          {
            sizeRatio: 1
          }
          LibCal_frmCommonCalendar_gcCalendar
          {
            VisibleStartDate: '2021-02-15T12:38:01'
            SynchronizationGroup: 'LibCal_sgCalendars'
            RowHeaderWidth: 250
            CurrentZoomFactor: 4
          }
          LibCal_frmCommonCalendar_tabEventsAndOccurrences
          {
            sizeRatio: 1
          }
          LibCal_frmCommonCalendar_pnlEventsAndOccurrences
          {
            sizeRatio: 1
          }
          LibCal_frmCommonCalendar_pnlEventsAndOccurrences_pnlEvents
          {
            sizeRatio: 2
          }
          LibCal_frmCommonCalendar_pnlEventsAndOccurrences_lstParticipations
          {
          }
          LibCal_frmCommonCalendar_pnlEventsAndOccurrences_dslEventCategories
          {
            groupDepth: -1
            column_Name
            {
              columnId: 'Name'
              dataPath: 'Name'
              dataType: 'string'
              title: 'Category'
              index: 0
              subtotals: ''
              width: 235
            }
          }
          LibCal_frmCommonCalendar_pnlEventsAndOccurrences_dslEventParticipations
          {
            groupDepth: -1
            column_Event_Subject
            {
              columnId: 'Event.Subject'
              dataPath: 'Event.Subject'
              dataType: 'string'
              title: 'Name'
              index: 0
              subtotals: ''
              width: 235
            }
            column_Event_Info
            {
              columnId: 'Event.Info'
              dataPath: 'Event.Info'
              dataType: 'string'
              title: 'Info'
              index: 1
              subtotals: ''
              width: 690
            }
            column_NrOfOccurrences
            {
              columnId: 'NrOfOccurrences'
              dataPath: 'NrOfOccurrences'
              dataType: 'number'
              title: 'NrOfOccurrences'
              index: 2
              subtotals: ''
              width: 88
            }
          }
          LibCal_frmCommonCalendar_pnlEventsAndOccurrences_pnlOccurrences
          {
            sizeRatio: 1
          }
          LibCal_frmCommonCalendar_pnlEventsAndOccurrences_lstOccurrences
          {
          }
          LibCal_frmCommonCalendar_pnlEventsAndOccurrences_dslOccurrences
          {
            groupDepth: -1
            column_Start
            {
              columnId: 'Start'
              dataPath: 'Start'
              dataType: 'datetime'
              title: 'Start'
              index: 0
              subtotals: ''
              width: 150
            }
            column_End
            {
              columnId: 'End'
              dataPath: 'End'
              dataType: 'datetime'
              title: 'End'
              index: 1
              subtotals: ''
              width: 150
            }
            column_Comment
            {
              columnId: 'Comment'
              dataPath: 'Comment'
              dataType: 'string'
              title: 'Comment'
              index: 2
              subtotals: ''
              width: 214
            }
          }
        }
      }
      form_LibCal_frmResourceCalendars
      {
        title: 'QCalendars::LibCal_frmResourceCalendars'
        shown: true
        componentID: 'QCalendars::LibCal_frmResourceCalendars'
        layout
        {
          mode: 'open'
          rowPosition: 11
          rowSpan: 9
          columnPosition: 1
          columnSpan: 12
        }
        components
        {
          LibCal_frmResourceCalendars_pnlResourceCalendarList
          {
            sizeRatio: 1
          }
          LibCal_frmResourceCalendars_lstResourceCalendars
          {
          }
          LibCal_frmResourceCalendars_dslResourceCalendars
          {
            groupDepth: -1
            column_CalendarID
            {
              columnId: 'CalendarID'
              dataPath: 'CalendarID'
              dataType: 'string'
              title: 'CalendarID'
              index: 0
              subtotals: ''
              width: 150
            }
          }
          LibCal_frmResourceCalendars_pnlResourceCalendars
          {
            sizeRatio: 6
            activeChild: 'tabGanttChart'
          }
          LibCal_frmResourceCalendars_tabGanttChart
          {
            sizeRatio: 1
          }
          LibCal_frmResourceCalendars_gcResourceCalendar
          {
            VisibleStartDate: '2021-02-15T12:38:01'
            SynchronizationGroup: 'LibCal_sgCalendars'
            RowHeaderWidth: 250
            CurrentZoomFactor: 4
          }
          LibCal_frmResourceCalendars_gcResourceCalendar_abpGanttChart_btnShowOccurrences
          {
            isPressed: false
          }
          LibCal_frmResourceCalendars_gcResourceCalendar_abpGanttChart_btnShowSubscriptions
          {
            isPressed: false
          }
          LibCal_frmResourceCalendars_tabEventsAndOccurrences
          {
            sizeRatio: 1
          }
          LibCal_frmResourceCalendars_pnlEventsAndOccurrences
          {
            sizeRatio: 1
          }
          LibCal_frmResourceCalendars_pnlEventsAndOccurrences_pnlEvents
          {
            sizeRatio: 2
          }
          LibCal_frmResourceCalendars_pnlEventsAndOccurrences_lstParticipations
          {
          }
          LibCal_frmResourceCalendars_pnlEventsAndOccurrences_dslEventCategories
          {
            groupDepth: -1
            column_Name
            {
              columnId: 'Name'
              dataPath: 'Name'
              dataType: 'string'
              title: 'Category'
              index: 0
              subtotals: ''
              width: 200
            }
          }
          LibCal_frmResourceCalendars_pnlEventsAndOccurrences_dslEventParticipations
          {
            groupDepth: -1
            column_Calendar_CalendarID
            {
              columnId: 'Calendar.CalendarID'
              dataPath: 'Calendar.CalendarID'
              dataType: 'string'
              title: 'CalendarID'
              index: 0
              subtotals: ''
              width: 200
            }
            column_Event_Subject
            {
              columnId: 'Event.Subject'
              dataPath: 'Event.Subject'
              dataType: 'string'
              title: 'Name'
              index: 1
              subtotals: ''
              width: 200
            }
            column_Event_Info
            {
              columnId: 'Event.Info'
              dataPath: 'Event.Info'
              dataType: 'string'
              title: 'Info'
              index: 2
              subtotals: ''
              width: 396
            }
            column_Event_Initiator
            {
              columnId: 'Event.Initiator'
              dataPath: 'Event.Initiator'
              dataType: 'string'
              title: 'Initiator'
              index: 3
              subtotals: ''
              width: 130
            }
            column_NrOfOccurrences
            {
              columnId: 'NrOfOccurrences'
              dataPath: 'NrOfOccurrences'
              dataType: 'number'
              title: 'NrOfOccurrences'
              index: 4
              subtotals: ''
              width: 88
            }
          }
          LibCal_frmResourceCalendars_pnlEventsAndOccurrences_pnlOccurrences
          {
            sizeRatio: 1
          }
          LibCal_frmResourceCalendars_pnlEventsAndOccurrences_lstOccurrences
          {
          }
          LibCal_frmResourceCalendars_pnlEventsAndOccurrences_dslOccurrences
          {
            groupDepth: -1
            column_Start
            {
              columnId: 'Start'
              dataPath: 'Start'
              dataType: 'datetime'
              title: 'Start'
              index: 0
              subtotals: ''
              width: 150
            }
            column_End
            {
              columnId: 'End'
              dataPath: 'End'
              dataType: 'datetime'
              title: 'End'
              index: 1
              subtotals: ''
              width: 150
            }
            column_Comment
            {
              columnId: 'Comment'
              dataPath: 'Comment'
              dataType: 'string'
              title: 'Comment'
              index: 2
              subtotals: ''
              width: 214
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
  id: 'Maintain_resource_calendars'
  name: 'Maintain resource calendars'
  isglobal: false
  isroot: true
}
