*** Settings ***
Documentation  WorkforcePlanner UTF Basic Tests
...            All tests contain a workflow constructed from keywords in

Library  qtestlib
Library  RequestsLibrary
Library  OperatingSystem

Suite Setup  TestSuite Initialize
Suite Teardown  TestSuite Finalize

Test Timeout  30 minutes

*** Variables ***
# Do not change remove this, we need these for ALM execution
&{alm_params}

# Do not remove this, special pamater ALM and RnD local run
# Provide alternative to specify the external configuration from cmd
&{external_settings}

# Set the Quintiq settings
# Available settings are:
# ignore_errors=12345,23456  warn_errors=12345,23456  suite_settings_file=local_local.yaml  suite_settings_section=Database.MSSQL2012
&{quintiq_settings}=  ignore_errors=113796,116713  suite_settings_file=local_SCH_55x.yaml


# Do not change these set of parameters, for library internal usage
&{global_params}=  current_dir=${CURDIR}  &{quintiq_settings}  &{external_settings}  &{alm_params}

# Set QExecutable commandline argumment, for eg: /webserverport=8888  /webservermode=2
@{qdbodbc_param}
@{qserver_param}
@{qtce_param}=  /webserverport=8082  /webserverloglevel=3  /serviceport.web.enablelocalhostnonsecure  /noqimauthentication  /qimlogcount=10000
@{qtc_sch_param}=  /project=SchedulerTC  /autostart  /service=quintiq

&{qtce_connection_incoming_qthinclient}=  port=6300  service=Quintiq  minimumsecurity=Nonsecure
&{qtce_connection_incoming_webclient}=  port=6300  service=Web  minimumsecurity=Nonsecure
&{qtce_connection_group_incoming}=  active=true  groupindex=1  0=&{qtce_connection_incoming_qthinclient}  1=&{qtce_connection_incoming_webclient}

# Set the QExecutable settings:
# Default value for max_start_time, max_shutdown_time, max_execution_time are 100
# Available settings are:
# max_start_time=${120}  max_shutdown_time=${120}  max_execution_time=${120}  ignore_errors=12345,23456  warn_errors=12345,23456
&{qdbodbc_settings}
&{qserver_settings}=  max_start_time=${1800}  max_shutdown_time=${1800}  max_execution_time=${10800}
&{qtce_settings}
&{qtc_sch_settings}

# Set the dbodbc connection in qserver
# You don't need to configure anything if you don't need to modify the value
# Available settings are:
# group_name=dbodbc1  host=localhost  port=6100  secure_comm_enabled=True  compression=FastCompression  encryption=Normal
# custom_cipher_file=${EMPTY}  protocol=${EMPTY}  authentication_enabled=False  key_store=${EMPTY}
&{dbodbc_connection}

${weburl}=  http://localhost:6300/webapp/SchedulerProductWeb

*** Keywords ***
TestSuite Initialize
  Initialize  &{global_params}
  Setup Model Settings
  Register QComponent  QDBODBC  MyDBODBC  @{qdbodbc_param}  &{qdbodbc_settings}
  Register QComponent  QServer  MyServer  @{qserver_param}  &{qserver_settings}
  Register QComponent  QTCE  MyTCE  @{qtce_param}  &{qtce_settings}
  Register QComponent  QThinClient  MyTCSCH  @{qtc_sch_param}  &{qtc_sch_settings}

  Init Arch  DefaultSettings
  Configure Incoming Connection  MyTCE  serviceportgroup1  &{qtce_connection_group_incoming}

  Start QComponent  MyDBODBC
  Start QComponent  MyServer
  Start QComponent  MyTCE
  Start QComponent  MyTCSCH

TestSuite Finalize
  Run Keyword If Any Tests Failed  QTestLib.Handle_Failure  Check if any failure detected in child test execution
  Inspect Failure
  Finish

Check Site
  Create Session  webclient  ${weburl}
  ${resp}=  Get Request  webclient  /
  Should Be Equal As Strings  ${resp.status_code}  200
  Log To Console  ${resp.status_code}

*** Test Cases ***
Get Requests
  Wait Until Keyword Succeeds  3 min  5 sec  Check Site

# Execute UTF TestSuite  MyServer  testsuite.xml
Test Case ModelHealth
  Sleep  3 min
  Execute UTF  MyServer  UTF_000ModelHealth
