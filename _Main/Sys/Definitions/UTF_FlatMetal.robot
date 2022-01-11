*** Settings ***
Documentation  Write something about your test suites
...            All tests contain a workflow constructed from keywords in

Library  qtestlib

Suite Setup  TestSuite Initialize
Suite Teardown  TestSuite Finalize

Test Timeout  20 Minutes

*** Variables ***
# Do not change remove this, we need these for ALM execution
&{alm_params}

# Do not remove this, special pamater ALM and RnD local run
# Provide alternative to specify the external configuration from cmd
&{external_settings}

# Set the Quintiq settings
# Available settings are:
# ignore_errors=12345,23456  warn_errors=12345,23456  suite_settings_file=local_local.yaml  suite_settings_section=Database.MSSQL2012
&{quintiq_settings}=  suite_settings_file=local_SCH_55x.yaml


# Do not change these set of parameters, for library internal usage
&{global_params}=  current_dir=${CURDIR}  &{quintiq_settings}  &{external_settings}  &{alm_params}

# Set QExecutable commandline argumment, for eg: /webserverport=8888  /webservermode=2
@{qdbodbc_param}
@{qserver_param}

# Set the QExecutable settings:
# Default value for max_start_time, max_shutdown_time, max_execution_time are 100
# Available settings are:
# max_start_time=${120}  max_shutdown_time=${120}  max_execution_time=${120}  ignore_errors=12345,23456  warn_errors=12345,23456
&{qdbodbc_settings}
&{qserver_settings}=  max_start_time=${300}  max_execution_time=${600}

# Set the dbodbc connection in qserver
# You don't need to configure anything if you don't need to modify the value
# Available settings are:
# group_name=dbodbc1  host=localhost  port=6100  secure_comm_enabled=True  compression=FastCompression  encryption=Normal
# custom_cipher_file=${EMPTY}  protocol=${EMPTY}  authentication_enabled=False  key_store=${EMPTY}
&{dbodbc_connection}


*** Keywords ***
TestSuite Initialize
  Initialize  &{global_params}
  Setup Model Settings
  Register QComponent  QDBODBC  MyDBODBC  @{qdbodbc_param}  &{qdbodbc_settings}
  Register QComponent  QServer  MyServer  @{qserver_param}  &{qserver_settings}
  Configure DBODBC Connection  MyServer  @{dbodbc_connection}

  Start QComponent  MyDBODBC
  Start QComponent  MyServer

TestSuite Finalize
  Run Keyword If Any Tests Failed  QTestLib.Handle_Failure  Check if any failure detected in child test execution
  Inspect Failure
  Finish

*** Test Cases ***
# Execute UTF TestSuite  MyServer  testsuite.xml
# UTF_AllowedResourceOrSequenceRule.robot
Test Case CheckOverlappingRange
  Execute UTF  MyServer  UTF_CheckOverlappingRange.*		
Test Case EnableRuleCondition
  Execute UTF  MyServer  UTF_EnableRuleCondition.*  	
