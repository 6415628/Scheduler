*** Settings ***
Documentation  Write something about your test suites
...            All tests contain a workflow constructed from keywords in

Library  qtestlib

Suite Setup  TestSuite Initialize
Suite Teardown  TestSuite Finalize

Test Timeout  25 Minutes

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
# UTF_CIM.robot
Test Case ImportEquipment
  Execute UTF  MyServer  UTF_ImportEquipment.*
Test Case ImportCalendar
  Execute UTF  MyServer  UTF_ImportCalendar.*

# UTF_Configuration.robot
Test Case AssignStoppageSubtask
  Execute UTF  MyServer  UTF_AssignStoppageSubtask.*
Test Case Configure_Demand_Type
  Execute UTF  MyServer  UTF_DemandBatchType
Test Case Configure_Integration_Parameters
  Execute UTF  MyServer  UTF_IntegrationConfiguration
Test Case Configure_Planning_Parameters
  Execute UTF  MyServer  UTF_PlanningConfiguration
Test Case Configure_Technical_Parameters
  Execute UTF  MyServer  UTF_TechnicalConfiguration
Test Case CreateEditResourceGroup
  Execute UTF  MyServer  UTF_CreateEditResourceGroup.*
Test Case Manage_Demo
  Execute UTF  MyServer  UTF_ManageDemo
Test Case Resource_Precondition
  Execute UTF  MyServer  UTF_Resource_Precondition.*
Test Case Synchronize_Batch_Resource
  Execute UTF  MyServer  UTF_BatchResource_Synchronize
Test Case Synchronize_Continous_Resource
  Execute UTF  MyServer  UTF_ContinuousResource_Synchronize
Test Case Synchronize_Practice
  Execute UTF  MyServer  UTF_Practice
Test Case Synchronize_Resource_Group
  Execute UTF  MyServer  UTF_ResourceGroup_Synchronize
Test Case Synchronize_Single_Resource
  Execute UTF  MyServer  UTF_SingleResource_Synchronize

# UTF_InternalWorkOrder.robot
Test Case InternalWorkOrder_EditDelete
  Execute UTF  MyServer  UTF_InternalWorkOrder_EditDelete.*
Test Case InternalWorkOrder_MarkForRelease
  Execute UTF  MyServer  UTF_InternalWorkOrder_MarkForRelease.*
Test Case ReplaceInternalWOWithExternalWO_ConstraintCheck
  Execute UTF  MyServer  UTF_ReplaceInternalWOWithExternalWO_ConstraintCheck.*
Test Case ReplaceInternalWOWithExternalWO_SanityChecks
  Execute UTF  MyServer  UTF_ReplaceInternalWOWithExternalWO_SanityChecks.*

# UTF_TimeConstraint.robot
Test Case TimeConstraint_InvalidSubtaskAssignedConstraintPrecon
  Execute UTF  MyServer  UTF_TimeConstraint_InvalidSubtaskAssignedConstraintPrecon.*	
Test Case TimeConstraint_SynchronizeSubtasks
  Execute UTF  MyServer  UTF_TimeConstraint_SynchronizeSubtasks.*	
Test Case TimeConstraint_SynchronizeWOOpPrecedence
  Execute UTF  MyServer  UTF_TimeConstraint_SynchronizeWOOpPrecedence.*	
Test Case TimeConstraint_TimeConstraint_FinishToStart
  Execute UTF  MyServer  UTF_TimeConstraint_FinishToStart.*	
Test Case TimeConstraint_TimeConstraint_SyncOperationDependency
  Execute UTF  MyServer  UTF_TimeConstraint_SyncOperationDependency.*	
