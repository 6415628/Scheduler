*** Settings ***
Documentation  Write something about your test suites
...            All tests contain a workflow constructed from keywords in

Library  qtestlib

Suite Setup  TestSuite Initialize
Suite Teardown  TestSuite Finalize

Test Timeout  120 Minutes

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
&{qserver_settings}=  max_start_time=${300}  max_execution_time=${3600}  ignore_errors=113797

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
# UTF_TimeLogic.robot
Test Case TimeLogic_Strategy
  Execute UTF  MyServer  UTF_TimeLogic_Strategy.*
Test Case TimeLogic_SingleTask
  Execute UTF  MyServer  UTF_TimeLogic_SingleTask.*
Test Case TimeLogic_BatchTask
  Execute UTF  MyServer  UTF_TimeLogic_BatchTask.*
Test Case TimeLogic_InputLot
  Execute UTF  MyServer  UTF_TimeLogic_InputLot.*
Test Case TimeLogic_OutputLot
  Execute UTF  MyServer  UTF_TimeLogic_OutputLot.*
Test Case TimeLogic_Operation
  Execute UTF  MyServer  UTF_TimeLogic_Operation.*
Test Case TimeLogic_OperationMaterial
  Execute UTF  MyServer  UTF_TimeLogic_OperationMaterial.*
Test Case TimeLogic_ProcessDuration
  Execute UTF  MyServer  UTF_TimeLogic_ProcessDuration.*

# UTF_DemandBatching.robot
Test Case Demand_Batching
  Execute UTF  MyServer  UTF_DemandBatching.*

# UTF_MaterialReservation.robot
Test Case Material_Reservation
  Execute UTF  MyServer  UTF_MaterialReservation.*

# UTF_FrozenHorizon.robot
Test Case FrozenHorizon_Operation
  Execute UTF  MyServer  UTF_FrozenHorizon_Operation.*

# UTF_MPS.robot
Test Case MPSPlan_Create_and_Synchronize
  Execute UTF  MyServer  UTF_MPSPlan_Synchronize.*
Test Case MPSPlan_Create_Firm_Planned_Orders
  Execute UTF  MyServer  UTF_MPSPlan_CreateFirmPlannedOrders.*
Test Case MPSPlan_Adherence_Quantity
  Execute UTF  MyServer  UTF_MPSPlan_AdherenceQuantity.*
Test Case MPSPlan_Join_Planned_Orders  
  Execute UTF  MyServer  UTF_MPSPlan_JoinPlannedOrders.*
Test Case MPSPlan_Split_Planned_Orders  
  Execute UTF  MyServer  UTF_MPSPlan_SplitPlannedOrder.*
Test Case MPSIntegration_OperationExport  
  Execute UTF  MyServer  UTF_MPSIntegration_OperationExport.*  
Test Case Inventory_Management  
  Execute UTF  MyServer  UTF_InventoryManagement.*

# UTF_AllowedResourceOrSequenceRule.robot
Test Case CanDeleteDemandBatchOrDemand
  Execute UTF  MyServer  UTF_CanDeleteDemandBatchOrDemand.*
Test Case CanReserveUnreserveMaterial
  Execute UTF  MyServer  UTF_CanReserveUnreserveMaterial.*
Test Case CanResequenceOperationOrTask
  Execute UTF  MyServer  UTF_CanResequenceOperationOrTask.*
Test Case ShelfLifeExpirationInTask
  Execute UTF  MyServer  UTF_ShelfLifeExpirationInTask.*
Test Case ApplyRuleScopeToResource
  Execute UTF  MyServer  UTF_ApplyRuleScopeToResource.*
Test Case ApplyRuleScopeToShutdown
  Execute UTF  MyServer  UTF_ApplyRuleScopeToShutdown.*  
Test Case CheckDifferenceJump
  Execute UTF  MyServer  UTF_CheckDifferenceJump.*
Test Case CheckMinMaxValue
  Execute UTF  MyServer  UTF_CheckMinMaxValue.*  
Test Case CheckOverlappingRange
  Execute UTF  MyServer  UTF_CheckOverlappingRange.*
Test Case CheckProgramPhaseTransitionRule
  Execute UTF  MyServer  UTF_CheckProgramPhaseTransitionRule.*  
Test Case CheckProgramRule
  Execute UTF  MyServer  UTF_CheckProgramRule.*     
Test Case CheckValueJump
  Execute UTF  MyServer  UTF_CheckValueJump.*
Test Case EnableDisableRule
  Execute UTF  MyServer  UTF_EnableDisableRule.*  
Test Case EnableRuleCondition
  Execute UTF  MyServer  UTF_EnableRuleCondition.*  
Test Case EnableSequencingRuleInShutdownType
  Execute UTF  MyServer  UTF_EnableSequencingRuleInShutdownType.*  
Test Case RuleCheckOnManualPlanning
  Execute UTF  MyServer  UTF_RuleCheckOnManualPlanning.*  
Test Case RuleCheckOnOptimizer
  Execute UTF  MyServer  UTF_RuleCheckOnOptimizer.*
Test Case RuleCheckOnRuleScopeUsingShutdown
  Execute UTF  MyServer  UTF_RuleCheckOnRuleScopeUsingShutdown.*  
Test Case AllowedValuesRule
  Execute UTF  MyServer  UTF_AllowedValuesRule.*  
Test Case ApplyRuleOnShutdownScope
  Execute UTF  MyServer  UTF_ApplyRuleOnShutdownScope.* 
  
# UTF_OptimizerScope.robot
Test Case OptimizerScope_Operation
  Execute UTF  MyServer  UTF_OptimizerScope_Operation.*

# UTF_ManageFeedback.robot
Test Case Manage_Batch_Feedback_Task
  Execute UTF  MyServer  UTF_ManageBatchFeedbackTask  
Test Case Manage_Calendar_Feedback
  Execute UTF  MyServer  UTF_ManageCalendarFeedback
Test Case Manage_Single_Feedback_Task
  Execute UTF  MyServer  UTF_ManageSingleFeedbackTask

# UTF_ScenarioManage.robot
Test Case ManageScenario
  Execute UTF  MyServer  UTF_ManageScenario

# UTF_KPITracker.robot
Test Case KPITrackerInitializeMetaData
  Execute UTF  MyServer  UTF_KPITrackerInitializeMetaData.*

# UTF_KPI.robot
Test Case KPI
  Execute UTF  MyServer  UTF_KPI.*

# UTF_OptimizerSettings.robot
Test Case OptimizerSettings_Sequencing
  Execute UTF  MyServer  UTF_OptimizerSettings_Sequencing.*

# UTF_OperationBatching.robot
Test Case ManageOperationInBatch
  Execute UTF  MyServer  UTF_ManageOperationInBatch.*
Test Case ResequenceOperationInBatch
  Execute UTF  MyServer  UTF_ResequenceOperationInBatch.*
Test Case OperationAllowedInBatch
  Execute UTF  MyServer  UTF_OperationAllowedInBatch.*
Test Case ManageBatchPractice
  Execute UTF  MyServer  UTF_ManageBatchPractice.*  

# UTF_Configuration.robot
Test Case Configure_Demand_Type
  Execute UTF  MyServer  UTF_DemandBatchType
Test Case Configure_Integration_Parameters
  Execute UTF  MyServer  UTF_IntegrationConfiguration
Test Case Configure_Planning_Parameters
  Execute UTF  MyServer  UTF_PlanningConfiguration
Test Case Synchronize_Practice
  Execute UTF  MyServer  UTF_Practice
Test Case Synchronize_Resource_Group
  Execute UTF  MyServer  UTF_ResourceGroup_Synchronize
Test Case Synchronize_Single_Resource
  Execute UTF  MyServer  UTF_SingleResource_Synchronize
Test Case Synchronize_Batch_Resource
  Execute UTF  MyServer  UTF_BatchResource_Synchronize
Test Case Synchronize_Continous_Resource
  Execute UTF  MyServer  UTF_ContinuousResource_Synchronize
Test Case Resource_Precondition
  Execute UTF  MyServer  UTF_Resource_Precondition.*
Test Case Configure_Technical_Parameters
  Execute UTF  MyServer  UTF_TechnicalConfiguration
Test Case Manage_Demo
  Execute UTF  MyServer  UTF_ManageDemo
Test Case AssignStoppageSubtask
  Execute UTF  MyServer  UTF_AssignStoppageSubtask.*

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
Test Case TimeConstraint_InvalidSubtaskAssignedConstraintPrecon
  Execute UTF  MyServer  UTF_TimeConstraint_InvalidSubtaskAssignedConstraintPrecon.*
Test Case TimeConstraint_SynchronizeSubtasks
  Execute UTF  MyServer  UTF_TimeConstraint_SynchronizeSubtasks.*
Test Case TimeConstraint_SynchronizeWOOpPrecedence
  Execute UTF  MyServer  UTF_TimeConstraint_SynchronizeWOOpPrecedence.*
Test Case TimeConstraint_TimeConstraint_FinishToStart
  Execute UTF  MyServer  UTF_TimeConstraint_FinishToStart.*
Test Case TimeConstraint_TimeConstraint_SyncOperationDependency
  Execute UTF  MyServer  UTF_TimeConstraint_SyncOperationDependency.*

# UTF_CIM.robot
Test Case ImportEquipment
  Execute UTF  MyServer  UTF_ImportEquipment.*
Test Case ImportCalendar
  Execute UTF  MyServer  UTF_ImportCalendar.*

# UTF_RuleFramework.robot
Test Case OverlappingJumpRangeConstraint
  Execute UTF  MyServer  UTF_OverlappingJumpRangeConstraint.*
Test Case DeleteRule
  Execute UTF  MyServer  UTF_DeleteRule.*
Test Case ExportRuleCofiguration
  Execute UTF  MyServer  UTF_ExportRuleCofiguration.*
Test Case ImportCharacteristicName
  Execute UTF  MyServer  UTF_ImportCharacteristicName.*
Test Case ImportRuleConfiguration
  Execute UTF  MyServer  UTF_ImportRuleConfiguration.*
Test Case InitializeRuleFramework
  Execute UTF  MyServer  UTF_InitializeRuleFramework.*
Test Case GeneralPreconditionInRule
  Execute UTF  MyServer  UTF_GeneralPreconditionInRule.*
Test Case PreconditionInRuleDifferentJumpRange
  Execute UTF  MyServer  UTF_PreconditionInRuleDifferentJumpRange.*
Test Case PreconditionInRuleDiffererentJump
  Execute UTF  MyServer  UTF_PreconditionInRuleDiffererentJump.*
Test Case PreconditionInRuleMinMaxValue
  Execute UTF  MyServer  UTF_PreconditionInRuleMinMaxValue.*
Test Case PreconditionInRuleOverlapping
  Execute UTF  MyServer  UTF_PreconditionInRuleOverlapping.*
Test Case PreconditionInRuleValueJump
  Execute UTF  MyServer  UTF_PreconditionInRuleValueJump.*
Test Case PreconditionInRuleValueStrings
  Execute UTF  MyServer  UTF_PreconditionInRuleValueStrings.*
Test Case ScopePreconditionInShutdown
  Execute UTF  MyServer  UTF_ScopePreconditionInShutdown.*
Test Case ScopePreconditionInResource
  Execute UTF  MyServer  UTF_ScopePreconditionInResource.*  
Test Case HasScopeSelectionConstraint
  Execute UTF  MyServer  UTF_HasScopeSelectionConstraint.*  
  
# UTF_ShutdownType.robot
Test Case ShutdownType
  Execute UTF  MyServer  UTF_ShutdownType.*
  
# UTF_Shutdown.robot
Test Case Shutdown
  Execute UTF  MyServer  UTF_Shutdown.*

# UTF_ProgramConfiguration.robot
Test Case ProgramConfiguration
  Execute UTF  MyServer  UTF_ProgramConfiguration.*

# UTF_ProgramScheduling.robot
Test Case ProgramScheduling
  Execute UTF  MyServer  UTF_ProgramScheduling.*

# UTF_Practice.robot
Test Case Practice
  Execute UTF  MyServer  UTF_Practice.*

# UTF_FixedSequencePlanLogic.robot
Test Case FixedSequencePlanLogic
  Execute UTF  MyServer  UTF_FixedSequencePlanLogic.*  

# UTF_WorkOrder.robot
Test Case WorkOrder
  Execute UTF  MyServer  UTF_WorkOrder

# UTF_MES.robot
Test Case MES_Export
  Execute UTF  MyServer  UTF_MESExport.*
Test Case MESImportProgram
  Execute UTF  MyServer  UTF_MESImportProgram.*
Test Case MESImportShutdown
  Execute UTF  MyServer  UTF_MESImportShutdown.*  
