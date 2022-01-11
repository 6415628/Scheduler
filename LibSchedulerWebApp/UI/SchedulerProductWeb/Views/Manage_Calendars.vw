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
          rowSpan: 9
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
            RowHeaderWidth: 250
            SynchronizationGroup: '7eb39a90-11db-4c05-9a18-4f199ec11b81'
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
            sizeRatio: 1
          }
          LibCal_frmCommonCalendar_pnlEventsAndOccurrences_pnlEvents_lstParticipations
          {
          }
          LibCal_frmCommonCalendar_pnlEventsAndOccurrences_pnlEvents_lstParticipations_dslEventCategories
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
              width: 150
            }
          }
          LibCal_frmCommonCalendar_pnlEventsAndOccurrences_pnlEvents_lstParticipations_dslEventCategories_dslEventParticipations
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
              width: 150
            }
            column_Info
            {
              columnId: 'Info'
              dataPath: 'Info'
              dataType: 'string'
              title: 'Info'
              index: 1
              subtotals: ''
              width: 150
            }
            column_NrOfOccurrences
            {
              columnId: 'NrOfOccurrences'
              dataPath: 'NrOfOccurrences'
              dataType: 'number'
              title: 'NrOfOccurrences'
              index: 2
              subtotals: ''
              width: 150
            }
          }
          LibCal_frmCommonCalendar_pnlEventsAndOccurrences_pnlOccurrences
          {
            sizeRatio: 1
          }
          LibCal_frmCommonCalendar_pnlEventsAndOccurrences_pnlOccurrences_lstOccurrences
          {
          }
          LibCal_frmCommonCalendar_pnlEventsAndOccurrences_pnlOccurrences_lstOccurrences_dslOccurrences
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
          rowPosition: 10
          rowSpan: 10
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
            RowHeaderWidth: 250
            SynchronizationGroup: '7eb39a90-11db-4c05-9a18-4f199ec11b81'
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
          LibCal_frmResourceCalendars_pnlEventsAndOccurrences_pnlEvents_lstParticipations
          {
          }
          LibCal_frmResourceCalendars_pnlEventsAndOccurrences_pnlEvents_lstParticipations_dslEventCategories
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
              width: 150
            }
          }
          LibCal_frmResourceCalendars_pnlEventsAndOccurrences_pnlEvents_lstParticipations_dslEventCategories_dslEventParticipations
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
              width: 150
            }
            column_Event_Subject
            {
              columnId: 'Event.Subject'
              dataPath: 'Event.Subject'
              dataType: 'string'
              title: 'Name'
              index: 1
              subtotals: ''
              width: 150
            }
            column_Info
            {
              columnId: 'Info'
              dataPath: 'Info'
              dataType: 'string'
              title: 'Info'
              index: 2
              subtotals: ''
              width: 150
            }
            column_Event_Initiator
            {
              columnId: 'Event.Initiator'
              dataPath: 'Event.Initiator'
              dataType: 'string'
              title: 'Initiator'
              index: 3
              subtotals: ''
              width: 150
            }
            column_NrOfOccurrences
            {
              columnId: 'NrOfOccurrences'
              dataPath: 'NrOfOccurrences'
              dataType: 'number'
              title: 'NrOfOccurrences'
              index: 4
              subtotals: ''
              width: 150
            }
          }
          LibCal_frmResourceCalendars_pnlEventsAndOccurrences_pnlOccurrences
          {
            sizeRatio: 1
          }
          LibCal_frmResourceCalendars_pnlEventsAndOccurrences_pnlOccurrences_lstOccurrences
          {
          }
          LibCal_frmResourceCalendars_pnlEventsAndOccurrences_pnlOccurrences_lstOccurrences_dslOccurrences
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
          }
        }
      }
    }
    userconfigurableinformation
    {
    }
  }
  formatversion: 2
  id: 'Manage_Calendars'
  name: 'Manage Calendars'
  isglobal: false
  isroot: true
}
