Quintiq file version 2.0
{
  viewcontents
  {
    forms
    {
      form_LibDEF_FormDataTransfer
      {
        title: 'QDataExchangeFramework::LibDEF_FormDataTransfer'
        shown: true
        componentID: 'QDataExchangeFramework::LibDEF_FormDataTransfer'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 17
          columnPosition: 1
          columnSpan: 6
        }
        components
        {
          LibDEF_FormDataTransfer_pnlActionBar
          {
            sizeRatio: 1
          }
          LibDEF_FormDataTransfer_lstLibDEF_DataTransfer
          {
          }
          LibDEF_FormDataTransfer_dslLibDEF_DataTransfer
          {
            groupDepth: -1
            column_GUID
            {
              columnId: 'GUID'
              dataPath: 'GUID'
              dataType: 'string'
              title: 'GUID'
              index: 0
              subtotals: ''
              width: 150
            }
            column_CreationTime
            {
              columnId: 'CreationTime'
              dataPath: 'CreationTime'
              dataType: 'datetime'
              title: 'CreationTime'
              index: 1
              subtotals: ''
              width: 150
            }
            column_TotalContentLength
            {
              columnId: 'TotalContentLength'
              dataPath: 'TotalContentLength'
              dataType: 'number'
              title: 'TotalContentLength'
              index: 2
              subtotals: ''
              width: 150
            }
            column_ChunkSizeLimit
            {
              columnId: 'ChunkSizeLimit'
              dataPath: 'ChunkSizeLimit'
              dataType: 'number'
              title: 'ChunkSizeLimit'
              index: 3
              subtotals: ''
              width: 150
            }
            column_CanExecute
            {
              columnId: 'CanExecute'
              dataPath: 'CanExecute'
              dataType: 'boolean'
              title: 'CanExecute'
              index: 4
              subtotals: ''
              width: 150
            }
          }
        }
      }
      form_LibDEF_FormDataPiece
      {
        title: 'QDataExchangeFramework::LibDEF_FormDataPiece'
        shown: true
        componentID: 'QDataExchangeFramework::LibDEF_FormDataPiece'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 17
          columnPosition: 7
          columnSpan: 6
        }
        components
        {
          LibDEF_FormDataPiece_lstLibDEF_DataPiece
          {
          }
          LibDEF_FormDataPiece_dslLibDEF_DataPiece
          {
            groupDepth: -1
            column_SequenceNr
            {
              columnId: 'SequenceNr'
              dataPath: 'SequenceNr'
              dataType: 'number'
              title: 'SequenceNr'
              index: 0
              subtotals: ''
              width: 150
            }
            column_IsCompleted
            {
              columnId: 'IsCompleted'
              dataPath: 'IsCompleted'
              dataType: 'boolean'
              title: 'IsCompleted'
              index: 1
              subtotals: ''
              width: 150
            }
            column_Payload
            {
              columnId: 'Payload'
              dataPath: 'Payload'
              dataType: 'string'
              title: 'Payload'
              index: 2
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
  id: 'Data_Transfers'
  name: 'Data Transfers'
  isglobal: false
  isroot: true
}
