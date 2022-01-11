Quintiq file version 2.0
{
  viewcontents
  {
    forms
    {
      form_FormIntegrationConfiguration
      {
        title: 'QLibSchedulerWebApp::FormIntegrationConfiguration'
        shown: true
        componentID: 'QLibSchedulerWebApp::FormIntegrationConfiguration'
        layout
        {
          mode: 'open'
          rowPosition: 1
          rowSpan: 15
          columnPosition: 1
          columnSpan: 4
        }
        components
        {
          FormIntegrationConfiguration_PanelIntegration
          {
            sizeRatio: 1
          }
          FormIntegrationConfiguration_PanelSanityCheck
          {
            sizeRatio: 1
          }
          FormIntegrationConfiguration_PanelIntegrationSetting
          {
            sizeRatio: 1
          }
          FormIntegrationConfiguration_PanelMPSMESIntegration
          {
            sizeRatio: 6
            activeChild: 'PanelMPSIntegration'
          }
          FormIntegrationConfiguration_PanelMPSIntegration
          {
            sizeRatio: 1
          }
          FormIntegrationConfiguration_PanelDataExchangeFrameworkSettings
          {
            sizeRatio: 1
          }
          FormIntegrationConfiguration_PanelEDIBrokerSettings
          {
            sizeRatio: 1
          }
          FormIntegrationConfiguration_PanelIntegrationInventoryTargetSetting
          {
            sizeRatio: 1
          }
          FormIntegrationConfiguration_PanelMESIntegration
          {
            sizeRatio: 1
          }
          FormIntegrationConfiguration_PanelIntegrationButtons
          {
            sizeRatio: 1
          }
        }
      }
    }
    userconfigurableinformation
    {
    }
  }
  formatversion: 2
  id: 'Configure_Integration'
  name: 'Configure Integration'
  isglobal: false
  isroot: true
}
