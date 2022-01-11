*** Settings ***
Documentation  Write something about your test suites
...            All tests contain a workflow constructed from keywords in

Library  qtestlib

Suite Setup  TestSuite Initialize
Suite Teardown  TestSuite Finalize

Test Timeout  35 Minutes

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
Test Case AllowedOperationOnResource
  Execute UTF  MyServer  UTF_AllowedOperationOnResource.*
Test Case AllowedValuesRule
  Execute UTF  MyServer  UTF_AllowedValuesRule.*    
Test Case AllowedWithinOnHoldHorizon
  Execute UTF  MyServer  UTF_AllowedWithinOnHoldHorizon.*
Test Case ApplyRuleOnShutdownScope
  Execute UTF  MyServer  UTF_ApplyRuleOnShutdownScope.*
Test Case ApplyRuleScopeToResource
  Execute UTF  MyServer  UTF_ApplyRuleScopeToResource.*
Test Case ApplyRuleScopeToShutdown
  Execute UTF  MyServer  UTF_ApplyRuleScopeToShutdown.*
Test Case CanDeleteDemandBatchOrDemand
  Execute UTF  MyServer  UTF_CanDeleteDemandBatchOrDemand.*
Test Case CanResequenceOperationOrTask
  Execute UTF  MyServer  UTF_CanResequenceOperationOrTask.*
Test Case CanReserveUnreserveMaterial
  Execute UTF  MyServer  UTF_CanReserveUnreserveMaterial.*
Test Case CheckDifferenceJump
  Execute UTF  MyServer  UTF_CheckDifferenceJump.*
Test Case CheckMinMaxValue
  Execute UTF  MyServer  UTF_CheckMinMaxValue.*    
Test Case CheckProgramPhaseTransitionRule
  Execute UTF  MyServer  UTF_CheckProgramPhaseTransitionRule.*
Test Case CheckProgramRule
  Execute UTF  MyServer  UTF_CheckProgramRule.*
Test Case CheckValueJump
  Execute UTF  MyServer  UTF_CheckValueJump.*
Test Case EnableDisableRule
  Execute UTF  MyServer  UTF_EnableDisableRule.*
Test Case EnableSequencingRuleInProgramChange
  Execute UTF  MyServer  UTF_EnableSequencingRuleInProgramChange.*
Test Case EnableSequencingRuleInShutdownType
  Execute UTF  MyServer  UTF_EnableSequencingRuleInShutdownType.*
Test Case RuleCheckOnManualPlanning
  Execute UTF  MyServer  UTF_RuleCheckOnManualPlanning.*
Test Case RuleCheckOnOptimizer
  Execute UTF  MyServer  UTF_RuleCheckOnOptimizer.*
Test Case RuleCheckOnRuleScopeUsingShutdown
  Execute UTF  MyServer  UTF_RuleCheckOnRuleScopeUsingShutdown.*
Test Case ShelfLifeExpirationInTask
  Execute UTF  MyServer  UTF_ShelfLifeExpirationInTask.*

# UTF_DemandBatching.robot
Test Case Demand_Batching
  Execute UTF  MyServer  UTF_DemandBatching.*

# UTF_FixedSequencePlanLogic.robot
Test Case FixedSequencePlanLogic
  Execute UTF  MyServer  UTF_FixedSequencePlanLogic.*

# UTF_FrozenHorizon.robot
Test Case FrozenHorizon_Operation
  Execute UTF  MyServer  UTF_FrozenHorizon_Operation.*
Test Case FrozenHorizon_Program
  Execute UTF  MyServer  UTF_FrozenHorizon_Program.*
Test Case FrozenHorizon_Shutdown
  Execute UTF  MyServer  UTF_FrozenHorizon_Shutdown.*
  
# UTF_KPI.robot
Test Case KPI
  Execute UTF  MyServer  UTF_KPI.*

# UTF_KPITracker.robot
Test Case KPITrackerInitializeMetaData
  Execute UTF  MyServer  UTF_KPITrackerInitializeMetaData.*

# UTF_KPITracker.robot
Test Case KPITrackerInitializeMetaData
  Execute UTF  MyServer  UTF_KPITrackerInitializeMetaData.*

# UTF_ManageFeedback.robot
Test Case Manage_Batch_Feedback_Task
  Execute UTF  MyServer  UTF_ManageBatchFeedbackTask
Test Case Manage_Calendar_Feedback
  Execute UTF  MyServer  UTF_ManageCalendarFeedback
Test Case Manage_Single_Feedback_Task
  Execute UTF  MyServer  UTF_ManageSingleFeedbackTask

# UTF_MaterialReservation.robot
Test Case Material_Reservation
  Execute UTF  MyServer  UTF_MaterialReservation.*

# UTF_MES.robot
Test Case MES_Export
  Execute UTF  MyServer  UTF_MESExport.*
Test Case MESImportProgram
  Execute UTF  MyServer  UTF_MESImportProgram.*
Test Case MESImportShutdown
  Execute UTF  MyServer  UTF_MESImportShutdown.*

# UTF_MPS.robot
Test Case Inventory_Management
  Execute UTF  MyServer  UTF_InventoryManagement.*
Test Case MPSIntegration_OperationExport
  Execute UTF  MyServer  UTF_MPSIntegration_OperationExport.*
Test Case MPSPlan_Adherence_Quantity
  Execute UTF  MyServer  UTF_MPSPlan_AdherenceQuantity.*
Test Case MPSPlan_Create_and_Synchronize
  Execute UTF  MyServer  UTF_MPSPlan_Synchronize.*
Test Case MPSPlan_Create_Firm_Planned_Orders
  Execute UTF  MyServer  UTF_MPSPlan_CreateFirmPlannedOrders.*
Test Case MPSPlan_Join_Planned_Orders
  Execute UTF  MyServer  UTF_MPSPlan_JoinPlannedOrders.*
Test Case MPSPlan_Split_Planned_Orders
  Execute UTF  MyServer  UTF_MPSPlan_SplitPlannedOrder.*

# UTF_OperationBatching.robot
Test Case ManageBatchPractice
  Execute UTF  MyServer  UTF_ManageBatchPractice.*
Test Case ManageOperationInBatch
  Execute UTF  MyServer  UTF_ManageOperationInBatch.*
Test Case OperationAllowedInBatch
  Execute UTF  MyServer  UTF_OperationAllowedInBatch.*
Test Case ResequenceOperationInBatch
  Execute UTF  MyServer  UTF_ResequenceOperationInBatch.*

# UTF_OptimizerScope.robot
Test Case OptimizerScope_Operation
  Execute UTF  MyServer  UTF_OptimizerScope_Operation.*
Test Case OptimizerScope_CanOptimize
  Execute UTF  MyServer  UTF_OptimizerScope_CanOptimize.*
  
# UTF_OptimizerSettings.robot
Test Case OptimizerSettings_Sequencing
  Execute UTF  MyServer  UTF_OptimizerSettings_Sequencing.*

# UTF_Practice.robot
Test Case Practice
  Execute UTF  MyServer  UTF_Practice.*

# UTF_ProgramConfiguration.robot
Test Case ProgramConfiguration
  Execute UTF  MyServer  UTF_ProgramConfiguration.*

# UTF_ProgramScheduling.robot
Test Case ProgramScheduling
  Execute UTF  MyServer  UTF_ProgramScheduling.*

# UTF_RuleFramework.robot
Test Case DeleteRule
  Execute UTF  MyServer  UTF_DeleteRule.*
Test Case ExportRuleCofiguration
  Execute UTF  MyServer  UTF_ExportRuleCofiguration.*
Test Case GeneralPreconditionInRule
  Execute UTF  MyServer  UTF_GeneralPreconditionInRule.*
Test Case HasScopeSelectionConstraint
  Execute UTF  MyServer  UTF_HasScopeSelectionConstraint.*
Test Case ImportCharacteristicName
  Execute UTF  MyServer  UTF_ImportCharacteristicName.*
Test Case ImportRuleConfiguration
  Execute UTF  MyServer  UTF_ImportRuleConfiguration.*
Test Case InitializeRuleFramework
  Execute UTF  MyServer  UTF_InitializeRuleFramework.*
Test Case OverlappingJumpRangeConstraint
  Execute UTF  MyServer  UTF_OverlappingJumpRangeConstraint.*
Test Case PreconditionInRuleDifferentJumpRange
  Execute UTF  MyServer  UTF_PreconditionInRuleDifferentJumpRange.*
Test Case PreconditionInRuleDiffererentJump
  Execute UTF  MyServer  UTF_PreconditionInRuleDiffererentJump.*
Test Case PreconditionInRuleMinMaxValue
  Execute UTF  MyServer  UTF_PreconditionInRuleMinMaxValue.*
Test Case PreconditionInRuleOverlapping
  Execute UTF  MyServer  UTF_PreconditionInRuleOverlapping.*
Test Case PreconditionInRuleValueJump
  Execute UTF  MyServer  UTF_PreconditionInRuleValueJump.*
Test Case PreconditionInRuleValueStrings
  Execute UTF  MyServer  UTF_PreconditionInRuleValueStrings.*
Test Case ScopePreconditionInResource
  Execute UTF  MyServer  UTF_ScopePreconditionInResource.*
Test Case ScopePreconditionInShutdown
  Execute UTF  MyServer  UTF_ScopePreconditionInShutdown.*

# UTF_ScenarioManager.robot
Test Case ManageScenario
  Execute UTF  MyServer  UTF_ManageScenario

# UTF_Shutdown.robot
Test Case Shutdown
  Execute UTF  MyServer  UTF_Shutdown.*

# UTF_ShutdownType.robot
Test Case ShutdownType
  Execute UTF  MyServer  UTF_ShutdownType.*

# UTF_TimeLogic.robot
Test Case TimeLogic_BatchTask
  Execute UTF  MyServer  UTF_TimeLogic_BatchTask.*
Test Case TimeLogic_InputLot
  Execute UTF  MyServer  UTF_TimeLogic_InputLot.*
Test Case TimeLogic_Operation
  Execute UTF  MyServer  UTF_TimeLogic_Operation.*
Test Case TimeLogic_OperationMaterial
  Execute UTF  MyServer  UTF_TimeLogic_OperationMaterial.*
Test Case TimeLogic_OutputLot
  Execute UTF  MyServer  UTF_TimeLogic_OutputLot.*
Test Case TimeLogic_ProcessDuration
  Execute UTF  MyServer  UTF_TimeLogic_ProcessDuration.*
Test Case TimeLogic_SingleTask
  Execute UTF  MyServer  UTF_TimeLogic_SingleTask.*
Test Case TimeLogic_Strategy
  Execute UTF  MyServer  UTF_TimeLogic_Strategy.*

# UTF_WorkOrder.robot
Test Case WorkOrder
  Execute UTF  MyServer  UTF_WorkOrder
