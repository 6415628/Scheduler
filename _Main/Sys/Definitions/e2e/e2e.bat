@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

REM Flag for E2E Runner
SET E2E_MODE=true
SET E2E_TARGET=%~dp0\.\

REM e2e.bat version
SET E2E_BAT_VERSION=2.1.0-beta.1

REM Navigate to E2E_SETUP then E2E_START. E2E_UPDATE is on top to allow all attempts to abort the script
GOTO :E2E_SETUP

REM ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
REM ===== This section are the default parameters and setup logic                                                     =====
REM ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====


:E2E_UPDATE_PROCESS
if not exist "%~dp0\e2e.update.bat" (
  GOTO :MISSING_UPDATE
)

call echo Updating e2e.bat since we managed to download the update
call move /Y "%~dp0\e2e.update.bat" "%~dp0\e2e.bat" & attrib -s -h -r "e2e.bat" /s /d

if "%~1" =="update" (
  GOTO :EXIT
)

GOTO :E2E_SETUPRESUME

:E2E_UPDATE
call echo Update e2e.bat

if exist "%~dp0\e2e.update.bat" (
  del /F /S /Q "%~dp0\e2e.update.bat"
)

call echo Processing copying of e2e.bat from "\\dsone.3ds.com\Quintiqbu$\R&D\Software\AutoTest\E2E\e2e.bat"
if exist "\\dsone.3ds.com\Quintiqbu$\R&D\Software\AutoTest\E2E\e2e.bat" (
  copy /B /V /Y /Z "\\dsone.3ds.com\Quintiqbu$\R&D\Software\AutoTest\E2E\e2e.bat" "%~dp0\e2e.update.bat"
)

if exist "%~dp0\e2e.update.bat" (
  GOTO :E2E_UPDATE_PROCESS
)

call echo Processing copying of e2e.bat from "\\dsone.3ds.com\Quintiqbu$\Global\Products\IndustrySolutions\Cross ISD\WebApp_E2E\E2E\e2e.bat"
if exist "\\dsone.3ds.com\Quintiqbu$\Global\Products\IndustrySolutions\Cross ISD\WebApp_E2E\E2E\e2e.bat" (
  copy /B /V /Y /Z "\\dsone.3ds.com\Quintiqbu$\Global\Products\IndustrySolutions\Cross ISD\WebApp_E2E\E2E\e2e.bat" "%~dp0\e2e.update.bat"
)

if exist "%~dp0\e2e.update.bat" (
  GOTO :E2E_UPDATE_PROCESS
)

call Ping widgetfactory.extranet.3ds.com  -n 1 -w 1000
if errorlevel 1 (
  call echo Internal network not found.
) else (
  call echo Processing downloading of e2e.bat from "https://widgetfactory.extranet.3ds.com/api/download/WebDAV/file/WebAppRelease/public/E2E/e2e.bat"
  powershell.exe -Command ^
  $WebClient = New-Object System.Net.WebClient ; ^
  $WebClient.DownloadFile('https://widgetfactory.extranet.3ds.com/api/download/WebDAV/file/WebAppRelease/public/E2E/e2e.bat', '%~dp0\e2e.update.bat')

  if exist "%~dp0\e2e.update.bat" (
    GOTO :E2E_UPDATE_PROCESS
  )
)

if not "%~1" =="update" (
  call echo Proceed execution
  GOTO :E2E_SETUPRESUME
)


 


REM Abort after update as the E2E_UPDATE will cause issues if there is a continuation
GOTO :MISSING_UPDATE

REM ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
REM ===== This section are the default parameters and setup logic                                                     =====
REM ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====

:E2E_SETUP
  GOTO :E2E_UPDATE
:E2E_SETUPRESUME
SET E2E_ZIP_HANDLING_MODE=NULL
REM Check whether is E2ELib
for %%I in (.) do set CURRENT_FOLDER=%%~nxI
SET PUSH_PATH="%~dp0\e2elib"

REM set path for pointer
IF "%CURRENT_FOLDER%"=="e2elib" SET ISE2E=TRUE
IF "%CURRENT_FOLDER%"=="E2Elib" SET ISE2E=TRUE

IF "%ISE2E%"=="TRUE" SET PUSH_PATH="%~dp0"


REM These E2E_ARG* are designed to be usable by the Test executors by looking at the process.env.E2E_ARG...
REM  as there may be cases where the process.argv[?] is not passed along properly
SET E2E_ARG_1=%~1
SET E2E_ARG_2=%~2
SET E2E_ARG_3=%~3
SET E2E_ARG_4=%~4
SET E2E_ARG_5=%~5
SET E2E_ARG_6=%~6
SET E2E_ARG_7=%~7
SET E2E_ARG_8=%~8
SET E2E_ARG_9=%~9
SET E2E_ARGS=%*

REM Create this folder at root as this is the operating folder for the e2e.bat
if not exist "%CD:~0,2%\E2E-TOOLS" (
  mkdir "%CD:~0,2%\E2E-TOOLS"
)

REM ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
REM ===== This section is the Start-up logic                                                                          =====
REM ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====

:E2E_START
REM If there are no arguments provided we will try to process the default behaviour
if "%~1" == "" (
  REM We support the e2elib.zip being placed in the same folder as the e2e.bat to allow immediate handling of the e2elib.zip extraction
  if exist "%~dp0\e2elib.zip" (
    call echo E2ELib.zip file is found, starting extraction before default run.

	REM Set the continuation of the ZIP handling
    SET E2E_ZIP_HANDLING_MODE=ZIP_LOCAL
	GOTO :ZIP_TOOL
  )
  if exist "%~dp0\e2elib" (
    REM Since the environment seems to be OK, we can trigger default run
	GOTO :RUN_DEFAULT
  )

  REM Go to missing start configuration
  GOTO :MISSING_START 
)

REM Convert argument to upper-case for comparison
SET FIRST_ARG=%~1
for %%a in ("a=A" "b=B" "c=C" "d=D" "e=E" "f=F" "g=G" "h=H" "i=I" "j=J" "k=K" "l=L"
            "m=M" "n=N" "o=O" "p=P" "q=Q" "r=R" "s=S" "t=T" "u=U" "v=V" "w=W" "x=X"
            "y=Y" "z=Z" "ä=Ä" "ö=Ö" "ü=Ü") do (
  SET FIRST_ARG=!FIRST_ARG:%%~a!
)

REM If the first argument is RUN, we go to the RUN_COMMAND section
if "!FIRST_ARG!" == "RUN" (
  call echo Going to RUN command section
  GOTO :RUN_COMMAND
)

REM If the first argument is RUN, we go to the RUN_COMMAND section
if "!FIRST_ARG!" == "--RUN" (
  call echo Going to RUN command section
  GOTO :RUN_COMMAND
)

REM If the first argument is RUN, we go to the RUN_COMMAND section
if "!FIRST_ARG!" == "-R" (
  call echo Going to RUN command section
  GOTO :RUN_COMMAND
)

REM If the first argument is RUN, we go to the RUN_COMMAND section
if "!FIRST_ARG!" == "/RUN" (
  call echo Going to RUN command section
  GOTO :RUN_COMMAND
)

REM If the first argument is RUN, we go to the RUN_COMMAND section
if "!FIRST_ARG!" == "/R" (
  call echo Going to RUN command section
  GOTO :RUN_COMMAND
)

REM If the first argument is UPDATE, we go to the E2E_UPDATE section
if "!FIRST_ARG!" == "UPDATE" (
  GOTO :E2E_UPDATE
)

REM If the first argument is UPDATE, we go to the E2E_UPDATE section
if "!FIRST_ARG!" == "--UPDATE" (
  GOTO :E2E_UPDATE
)

REM If the first argument is UPDATE, we go to the E2E_UPDATE section
if "!FIRST_ARG!" == "-U" (
  GOTO :E2E_UPDATE
)

REM If the first argument is UPDATE, we go to the E2E_UPDATE section
if "!FIRST_ARG!" == "/UPDATE" (
  GOTO :E2E_UPDATE
)

REM If the first argument is UPDATE, we go to the E2E_UPDATE section
if "!FIRST_ARG!" == "/U" (
  GOTO :E2E_UPDATE
)

REM If the first argument is VERSION, we go to the E2E_UPDATE section
if "!FIRST_ARG!" == "VERSION" (
  GOTO :E2E_VERSION
)

REM If the first argument is VERSION, we go to the E2E_UPDATE section
if "!FIRST_ARG!" == "--VERSION" (
  GOTO :E2E_VERSION
)

REM If the first argument is VERSION, we go to the E2E_UPDATE section
if "!FIRST_ARG!" == "-V" (
  GOTO :E2E_VERSION
)

REM If the first argument is VERSION, we go to the E2E_UPDATE section
if "!FIRST_ARG!" == "/VERSION" (
  GOTO :E2E_VERSION
)

REM If the first argument is VERSION, we go to the E2E_UPDATE section
if "!FIRST_ARG!" == "/V" (
  GOTO :E2E_VERSION
)

REM If the first argument is HELP, we go to the E2E_HELP section
if "!FIRST_ARG!" == "HELP" (
  GOTO :E2E_HELP
)

REM If the first argument is HELP, we go to the E2E_HELP section
if "!FIRST_ARG!" == "--HELP" (
  GOTO :E2E_HELP
)

REM If the first argument is HELP, we go to the E2E_HELP section
if "!FIRST_ARG!" == "-H" (
  GOTO :E2E_HELP
)

REM If the first argument is HELP, we go to the E2E_HELP section
if "!FIRST_ARG!" == "/HELP" (
  GOTO :E2E_HELP
)

REM If the first argument is HELP, we go to the E2E_HELP section
if "!FIRST_ARG!" == "/H" (
  GOTO :E2E_HELP
)

REM If the first argument is HELP, we go to the E2E_HELP section
if "!FIRST_ARG!" == "?" (
  GOTO :E2E_HELP
)

REM If the first argument is HELP, we go to the E2E_HELP section
if "!FIRST_ARG!" == "--?" (
  GOTO :E2E_HELP
)

REM If the first argument is HELP, we go to the E2E_HELP section
if "!FIRST_ARG!" == "-?" (
  GOTO :E2E_HELP
)

REM If the first argument is HELP, we go to the E2E_HELP section
if "!FIRST_ARG!" == "/?" (
  GOTO :E2E_HELP
)

REM If the first argument is WEBDRIVER, we go to the WEBDRIVER section
if "!FIRST_ARG!" == "WEBDRIVER" (
  GOTO :WEBDRIVER
)

REM If the first argument is not a valid COMMAND, we check if it is the ZIP path for the e2elib.zip
if not exist "%CD:~0,2%\E2E-TOOLS\Download\" (
  mkdir "%CD:~0,2%\E2E-TOOLS\Download\"
)
if exist "%CD:~0,2%\E2E-TOOLS\Download\e2elib.zip" (
  del /F /S /Q "%CD:~0,2%\E2E-TOOLS\Download\e2elib.zip"
)

if exist "%~1" (
  if "%~nx1" == "e2elib.zip"  (
    call echo File path provided seems to exist, processing ZIP file handling
    GOTO :ZIP_TOOL
  ) 
  
  REM If the Path contain e2elib.zip, use it
  REM Enforce E2E.bat to update when extract new e2ezip
  if exist "%~1\e2elib.zip" (

    call echo Found e2elib.zip in given path "%~1"  , processing ZIP file handling

    call echo Copying e2elib to local drive to avoid issues for 7za at "%CD:~0,2%\E2E-TOOLS\Download\"
    REM Copy e2elib.zip to local drive to prevent issues as 7za.exe requires local file
    copy /B /V /Y /Z "%~1\e2elib.zip" "%CD:~0,2%\E2E-TOOLS\Download\"
	
    GOTO :ZIP_TOOL
  ) 
  
  REM IF the Path Exist but without e2elib.zip, we check it in latest directory
  For /F "Delims=" %%A In ('
	PowerShell -C "Get-ChildItem '%~1' | ?{ $_.PSIsContainer } | Select-Object -Expand Name | Sort-Object { [regex]::Replace($_, '\d+', { $args[0].Value.PadLeft(20) }) } -Descending"
  ') Do (
    if exist "%~1\%%A\e2elib.zip" (
    call echo Found e2elib.zip in given path ="%~1"\%%A , processing ZIP file handling

    call echo Copying e2elib to local drive to avoid issues for 7za at "%CD:~0,2%\E2E-TOOLS\Download\"
    REM Copy e2elib.zip to local drive to prevent issues as 7za.exe requires local file
    copy /B /V /Y /Z "%~1\%%A\e2elib.zip" "%CD:~0,2%\E2E-TOOLS\Download\"
    
    GOTO :ZIP_TOOL
    )
  )
)

REM If we end up here we can assume the command in invalid
GOTO :INVALID_COMMAND

REM ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
REM ===== This section is the ZIP handling logic                                                                      =====
REM ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====

:ZIP_TOOL
REM If the 7za folder is not available we need to create it
if not exist "%CD:~0,2%\E2E-TOOLS\7za1900" (
  mkdir "%CD:~0,2%\E2E-TOOLS\7za1900"
)

REM Check if we have 7za already
if exist "%CD:~0,2%\E2E-Tools\7za1900\7za.exe" (
  call echo Using existing copy of 7za.exe
  GOTO :ZIP_TOOL_DONE
)
call echo Processing copying of 7za to enable unzipping of resources from "\\dsone.3ds.com\Quintiqbu$\R&D\Software\AutoTest\7za1900"

REM Copy from Core Technology Department Shared Software directory, more restrictions
copy /B /V /Y /Z "\\dsone.3ds.com\Quintiqbu$\R&D\Software\AutoTest\7za1900" "%CD:~0,2%\E2E-Tools\7za1900"

REM Validate if copy is successful
if exist "%CD:~0,2%\E2E-Tools\7za1900\7za.exe" (
  GOTO :ZIP_TOOL_DONE
)
call echo Processing copying of 7za to enable unzipping of resources from "\\dsone.3ds.com\Quintiqbu$\Global\Products\IndustrySolutions\Cross ISD\WebApp_E2E\7za1900"

REM Copy from Application Development Team Shared directory, less restrictions
copy /B /V /Y /Z "\\dsone.3ds.com\Quintiqbu$\Global\Products\IndustrySolutions\Cross ISD\WebApp_E2E\7za1900" "%CD:~0,2%\E2E-Tools\7za1900"

REM Validate if copy is successful
if exist "%CD:~0,2%\E2E-Tools\7za1900\7za.exe" (
  GOTO :ZIP_TOOL_DONE
)
call echo Processing downloading of 7za to enable unzipping of resources from "https://widgetfactory.extranet.3ds.com/api/download/WebDAV/file/WebAppRelease/public/7za1900/"

REM We use PowerShell to process the download as this is the most universal approach
powershell.exe -Command ^
$WebClient = New-Object System.Net.WebClient ; ^
$WebClient.DownloadFile('https://widgetfactory.extranet.3ds.com/api/download/WebDAV/file/WebAppRelease/public/7za1900/7za.dll', '%CD:~0,2%\E2E-Tools\7za1900\7za.dll') ; ^
$WebClient.DownloadFile('https://widgetfactory.extranet.3ds.com/api/download/WebDAV/file/WebAppRelease/public/7za1900/7zxa.dll', '%CD:~0,2%\E2E-Tools\7za1900\7zxa.dll') ; ^
$WebClient.DownloadFile('https://widgetfactory.extranet.3ds.com/api/download/WebDAV/file/WebAppRelease/public/7za1900/7za.exe', '%CD:~0,2%\E2E-Tools\7za1900\7za.exe') ; ^
$WebClient.DownloadFile('https://widgetfactory.extranet.3ds.com/api/download/WebDAV/file/WebAppRelease/public/7za1900/history.txt', '%CD:~0,2%\E2E-Tools\7za1900\history.txt') ; ^
$WebClient.DownloadFile('https://widgetfactory.extranet.3ds.com/api/download/WebDAV/file/WebAppRelease/public/7za1900/License.txt', '%CD:~0,2%\E2E-Tools\7za1900\License.txt') ; ^
$WebClient.DownloadFile('https://widgetfactory.extranet.3ds.com/api/download/WebDAV/file/WebAppRelease/public/7za1900/readme.txt', '%CD:~0,2%\E2E-Tools\7za1900\readme.txt')

REM Validate if download is successful
if exist "%CD:~0,2%\E2E-Tools\7za1900\7za.exe" (
  GOTO :ZIP_TOOL_DONE
)

REM If we end up here when processing the ZIP_TOOL, we likely failed to automatically retrieve the executable
GOTO :MISSING_7ZA

:ZIP_TOOL_DONE
if "!E2E_ZIP_HANDLING_MODE!" == "ZIP_LOCAL" (
  REM Go to ZIP_LOCAL step after ZIP_TOOL is ready
  GOTO :ZIP_LOCAL
)
REM Continue to ZIP_COPY step after ZIP_TOOL is ready

:ZIP_COPY
call echo testing
call echo Extracting e2elib.zip

for %%I in (.) do set CURRENT_FOLDER=%%~nxI

REM set path for pointer
IF "%CURRENT_FOLDER%"=="e2elib" SET ISE2E=TRUE
IF "%CURRENT_FOLDER%"=="E2Elib" SET ISE2E=TRUE

REM Use 7za.exe to extract zip
call "%CD:~0,2%\E2E-Tools\7za1900\7za.exe" x -aoa -y -o"%~dp0" "%CD:~0,2%\E2E-TOOLS\Download\e2elib.zip"
if "%ISE2E%" == "TRUE" (
  call xcopy /r /y /s /i "%~dp0\e2elib\quintiq_modules" "%~dp0\quintiq_modules" > nul
) else (
  if exist "%~dp0\e2elib\e2elocalconfig.json" (
    call echo Copy config for vscode to e2e
    copy /B /V /Y /Z "%~dp0\e2elib\e2elocalconfig.json" "%~dp0\tsconfig.json"
  )
)

REM Remove Model in e2elib
call Rmdir /Q /S "%~dp0\e2elib\model"

REM End of ZIP_COPY
GOTO :EXIT

:ZIP_LOCAL
call echo Extracting e2elib.zip

REM Use 7za.exe to extract zip
call "%CD:~0,2%\E2E-Tools\7za1900\7za.exe" x -aoa -y -o"%~dp0" "%~dp0\e2elib.zip"
if "%ISE2E%" == "TRUE" (
 call xcopy /r /y /s /i "%~dp0\e2elib\quintiq_modules" "%~dp0\quintiq_modules" > nul
) else (
  if exist "%~dp0\e2elib\e2elocalconfig.json" (
    call echo Copy config for vscode to e2e
    copy /B /V /Y /Z "%~dp0\e2elib\e2elocalconfig.json" "%~dp0\tsconfig.json"
  )
)


REM End of ZIP_LOCAL
GOTO :EXIT

REM ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
REM ===== This section is the RUN command                                                                             =====
REM ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====

:RUN_DEFAULT
call echo Executing default run

REM Configure RUN argument
SET SECOND_ARG=CHROME

REM Start RUN execution by skipping RUN_COMMAND processing
GOTO :RUN_EXECUTION

:RUN_COMMAND
REM Convert argument to upper-case for comparison
SET SECOND_ARG=%~2
for %%a in ("a=A" "b=B" "c=C" "d=D" "e=E" "f=F" "g=G" "h=H" "i=I" "j=J" "k=K" "l=L"
            "m=M" "n=N" "o=O" "p=P" "q=Q" "r=R" "s=S" "t=T" "u=U" "v=V" "w=W" "x=X"
            "y=Y" "z=Z" "ä=Ä" "ö=Ö" "ü=Ü") do (
  SET SECOND_ARG=!SECOND_ARG:%%~a!
)

:RUN_EXECUTION
if not "%ISE2E%" == "TRUE" (
  if not exist "%~dp0\e2elib\" (
    REM Failure to find the e2elib
    GOTO :MISSING_E2ELIB
  )  
)

REM Validate if the request is to run the TypeScript compiler
if "!SECOND_ARG!" == "TSC" (
  call echo Triggering TypeScript compilation
  call echo.

  pushd %PUSH_PATH%
  IF "%ISE2E%"=="TRUE" (
   call npm run tsc %3 %4 %5 %6 %7 %8 %9
  ) ELSE (
   call npm run e2e:tsc %3 %4 %5 %6 %7 %8 %9
  )
  
  popd

  call echo.
  call echo TypeScript compilation completed, exiting...

  REM End of RUN_TSC
  GOTO :EXIT
)

REM template
if "!SECOND_ARG!" == "TEMPLATE" (
  call echo Triggering template compilation
  call echo.

  pushd %PUSH_PATH%

 IF "%~3" == "" (  
   call echo Application url not found. eg: https://localhost:6300/webapp/QuiCoWeb/webapi/
  ) ELSE (
   IF "%ISE2E%"=="TRUE" (
     call npm run template %3 %4 %5 %6 %7 %8 %9
   ) ELSE (
     call npm run e2e:template %3 %4 %5 %6 %7 %8 %9
   )
  )
  
  popd

  call echo.
  call echo TypeScript compilation completed, exiting...

  REM End of RUN_TSC
  GOTO :EXIT
)

if "!SECOND_ARG!" == "CLEAN" (
  call echo Triggering TypeScript cleaning
  call echo.

  pushd %PUSH_PATH%
  IF "%ISE2E%"=="TRUE" (
   call npm run clean %3 %4 %5 %6 %7 %8 %9
  ) ELSE (
   call npm run e2e:clean %3 %4 %5 %6 %7 %8 %9
  )
  
  popd

  call echo.
  call echo TypeScript cleaning completed, exiting...

  REM End of RUN_CLEAN
  GOTO :EXIT
)

REM Validate if the request is to run the TypeScript code linter
if "!SECOND_ARG!" == "LINT" (
  call echo Triggering TypeScript code linter
  call echo.

  pushd %PUSH_PATH%
  IF "%ISE2E%"=="TRUE" (
   call npm run lint %3 %4 %5 %6 %7 %8 %9
  ) ELSE (
   call npm run e2e:lint %3 %4 %5 %6 %7 %8 %9
  )
  popd

  call echo.
  call echo TypeScript code linting completed, exiting...

  REM End of RUN_LINT
  GOTO :EXIT
)

REM Validate if the request is to run the LOCAL run
if "!SECOND_ARG!" == "LOCAL" (
  call echo Triggering Local run
  call echo.

  pushd %PUSH_PATH%
  REM skip the argument %3 if it is not started with --
  IF "%E2E_ARG_3:~0,2%"=="--" (
    call npm run e2e:local -- %3 %4 %5 %6 %7 %8 %9
  ) else (
    call npm run e2e:local -- %4 %5 %6 %7 %8 %9
  )

  popd

  call echo.
  call echo Local run completed, exiting...

  REM End of RUN_LOCAL
  GOTO :EXIT
)

REM Validate if the request is to run the CHROME run
if "!SECOND_ARG!" == "CHROME" (
  call echo Triggering Chrome run
  call echo.

  pushd %PUSH_PATH%
  REM skip the argument %3 if it is not started with --
  IF "%E2E_ARG_3:~0,2%"=="--" (
    call npm run e2e:chrome -- %3 %4 %5 %6 %7 %8 %9
  ) else (
    call npm run e2e:chrome -- %4 %5 %6 %7 %8 %9
  )
  
  popd

  call echo.
  call echo Chrome run completed, exiting...

  REM End of RUN_CHROME
  GOTO :EXIT
)

REM Validate if the request is to run the FIREFOX run
if "!SECOND_ARG!" == "FIREFOX" (
  call echo Triggering Firefox run
  call echo.

  pushd %PUSH_PATH%
  REM skip the argument %3 if it is not started with --
  IF "%E2E_ARG_3:~0,2%"=="--" (
     call npm run e2e:firefox -- %3 %4 %5 %6 %7 %8 %9
  ) else (
     call npm run e2e:firefox -- %4 %5 %6 %7 %8 %9
  )
 
  popd

  call echo.
  call echo Chrome run completed, exiting...

  REM End of RUN_FIREFOX
  GOTO :EXIT
)

REM Validate if the request is to run the MSEDGE run
if "!SECOND_ARG!" == "EDGE" (
  call echo Triggering MSEdge run
  call echo.

  pushd %PUSH_PATH%
  REM skip the argument %3 if it is not started with --
  IF "%E2E_ARG_3:~0,2%"=="--" (
     call npm run e2e:msedge -- %3 %4 %5 %6 %7 %8 %9
  ) else (
     call npm run e2e:msedge -- %4 %5 %6 %7 %8 %9
  )
 
  popd

  call echo.
  call echo Chrome run completed, exiting...

  REM End of RUN_FIREFOX
  GOTO :EXIT
)

REM Validate if the request is to run the FIREFOX run
if "!SECOND_ARG!" == "BROWSERS" (
  call echo Triggering cross browsers run
  call echo.

  pushd %PUSH_PATH%
  REM skip the argument %3 if it is not started with --
  IF "%E2E_ARG_3:~0,2%"=="--" (
     call npm run e2e:browsers -- %3 %4 %5 %6 %7 %8 %9
  ) else (
     call npm run e2e:browsers -- %4 %5 %6 %7 %8 %9
  )
 
  popd

  call echo.
  call echo Chrome run completed, exiting...

  REM End of RUN_FIREFOX
  GOTO :EXIT
)

REM The RUN_COMMAND will end up here if the COMMAND is invalid
GOTO :UNKNOWN_COMMAND

REM The WEBDRIVER will performance webdriver-manager update and star the webdriver-manager
:WEBDRIVER
pushd %PUSH_PATH%

REM Download MSEdgeDriver
FOR /F "TOKENS=1-2* SKIP=2" %%A IN ('reg query "HKEY_CURRENT_USER\Software\Microsoft\Edge\BLBeacon" /v version') DO SET QUERY_OUTPUT=%%C

call echo Processing downloading of microsoft edge driver from "https://msedgedriver.azureedge.net/%QUERY_OUTPUT%/edgedriver_win64.zip"
call echo Tempory disable due to VM not able to download
REM powershell.exe -Command ^
REM [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12^

REM $WebClient = New-Object System.Net.WebClient ; ^
REM $WebClient.DownloadFile('https://msedgedriver.azureedge.net/%QUERY_OUTPUT%/edgedriver_win64.zip', '.\edgedriver_win64.zip')

REM call echo Unzip the edge driver
REM powershell.exe -Command ^
REM Expand-Archive -LiteralPath .\edgedriver_win64.zip -DestinationPath . -Force

REM call "%CD:~0,2%\E2E-Tools\7za1900\7za.exe" x -aoa -y -o".\" ".\edgedriver_win64.zip"

REM Tempory implementation for the scripts that might not have the latest webdriver-manager 13.0.0
FOR /F "TOKENS=1-2* SKIP=2" %%A IN ('reg query "HKEY_CURRENT_USER\Software\Google\Chrome\BLBeacon" /v version') DO SET QUERY_OUTPUT=%%C
FOR /F "tokens=*" %%g IN ('node node_modules\webdriver-manager\bin\webdriver-manager --version') do (set webDriverVersion=%%g)

IF "%QUERY_OUTPUT:~0,3%" == "91." (
  SET QUERY_OUTPUT=90.0.4430.218
)

call node node_modules\webdriver-manager\bin\webdriver-manager update --versions.chrome=%QUERY_OUTPUT% --versions.standalone=3.141.59
IF %webDriverVersion% == 13.0.0 (
call start node node_modules\webdriver-manager\bin\webdriver-manager start --edge=".\msedgedriver.exe"
) ELSE (
call start node node_modules\webdriver-manager\bin\webdriver-manager start --versions.chrome=%QUERY_OUTPUT% --edge=".\msedgedriver.exe"
)
popd

REM The WEBDRIVER will end here
GOTO :EXIT

REM ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
REM ===== This section are all the messages                                                                           =====
REM ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====

:E2E_HELP
call echo.
call echo ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
call echo =====                                                   E2E.BAT                                                   =====
call echo ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
call echo.
call echo Welcome to the "e2e.bat", where this script is developed to assist you in setting up the Web Application End-to-End
call echo  Testing environment to enable you to run your test.
call echo.
call echo.
call echo ===== Requirements                                                                                                =====
call echo.
call echo Please take note that this "e2e.bat" has the requirement of running beside the "e2e" folder where the "e2e" test
call echo  scripts are developed and stored.
call echo.
call echo The assumption is that the location of this "e2e.bat" and the "e2e" scripts are at the following location:
call echo - [MODEL]\_Main\Sys\Definitions
call echo.
call echo Environment requirement will be that there must be Node.JS installed on your machine and is accessible from the console.
call echo.
call echo Please go to "https://nodejs.org/en/" and download the "LTS", version 8.00 or higher.
call echo Ensure that you install Node.JS and the "node" and "npm" commands are available in the console.
call echo The important part is that this script executes the following executable "npm" to manage the "e2e" scripts.
call echo.
call echo.
call echo ===== Available Commands                                                                                          =====
call echo.
call echo There are several ways to use this "e2e.bat":
call echo - Start the "e2e.bat" with no arguments when the environment is already configured to trigger the "run chrome" action.
call echo   CONSOLE: e2e
call echo - Start the "e2e.bat" with the path to the e2elib.zip to enable the downloading and extraction of the e2elib.
call echo   CONSOLE: e2e "\\dsone.3ds.com\Quintiqbu$\R&D\Projects\Web Client\_RELEASE_\197613\e2elib.zip"
call echo - Start the "e2e.bat" with commands and sub-commands, more in the table later.
call echo   CONSOLE: e2e help
call echo   CONSOLE: e2e run tsc
call echo.
call echo These are the available commands and sub-commands:
call echo  ----- ----- ----- ----- ----- ----- ----- ----- ----- -----
call echo :  COMMAND  :    SUB    :            DESCRIPTION            :
call echo  ----- ----- ----- ----- ----- ----- ----- ----- ----- -----
call echo : help      :           : Shows this help page              :
call echo  ----- ----- ----- ----- ----- ----- ----- ----- ----- -----
call echo : version   :           : Gets the current version          :
call echo  ----- ----- ----- ----- ----- ----- ----- ----- ----- -----
call echo : update    :           : Update this e2e.bat               :
call echo  ----- ----- ----- ----- ----- ----- ----- ----- ----- -----
call echo : webdriver :           : Update and run the webdriver      :
call echo  ----- ----- ----- ----- ----- ----- ----- ----- ----- -----
call echo : run       :           : NPM based run action group        :
call echo :           : tsc       : Run E2E TypeScript compilation    :
call echo :           : lint      : Run E2E TypeScript code linting   :
call echo :           : local     : Run E2E Local test action         :
call echo :           : chrome    : Run E2E Local Chrome test action  :
call echo :           : firefox   : Run E2E Local Firefox test action :
call echo :           : edge      : Run E2E Local MSEdge test action  :
call echo :           : browsers  : Run E2E Local chrome and firefox  :
call echo :           : template  : Generate component template       :
call echo  ----- ----- ----- ----- ----- ----- ----- ----- ----- -----
call echo.

REM End of E2E_VERSION
GOTO :EOF

:E2E_VERSION
call echo e2e.bat, version %E2E_BAT_VERSION%

REM End of E2E_VERSION
GOTO :EOF

:MISSING_START
call echo.
call echo Please provide either a Path to an E2ELib or start with the "run" command
call echo Only of the E2ELib folder is found beside this script can this script execute the default run without arguments
call echo.

REM End of MISSING_START
GOTO :EXIT

:MISSING_UPDATE
call echo.
call echo Failed to retrieve latest e2e.bat from the locations mentioned above
call echo Please either attempt to do this manually or file a support request
call echo.

REM End of MISSING_UPDATE
GOTO :EXIT

:MISSING_E2ELIB
call echo.
call echo Attempted to execute the RUN command but the e2elib is not found
call echo.

REM End of MISSING_E2ELIB
GOTO :EXIT

:MISSING_7ZA
call echo.
call echo Failed to really download or copy the 7za.exe
call echo.
call echo Please go to "https://www.7-zip.org/download.html" and download the "7-Zip Extra", version 19.00 or higher.
call echo Ensure that you extract the contents of "7z1900-extra.7z" to the "%CD:~0,2%\E2E-Tools\7za1900" and make sure that the "7za.exe" is available.
call echo The important part is that this script executes the following executable "%CD:~0,2%\E2E-Tools\7za1900\7za.exe" for ZIP file extraction.
call echo.

REM End of MISSING_7ZA
GOTO :EXIT

:UNKNOWN_COMMAND
call echo.
call echo Unknown RUN command: %~2
call echo.

REM End of UNKNOWN_COMMAND
GOTO :EXIT

:INVALID_COMMAND
call echo.
call echo Invalid file path or command, exiting...
call echo.

REM End of INVALID_COMMAND
GOTO :EXIT

:UPDATE_UNZIP
REM Unzip the e2elib.zip if exist
IF EXIST "%CD:~0,2%\E2E-TOOLS\Download\e2elib.zip" (
 GOTO :ZIP_TOOL
) ELSE (
 GOTO :EOF
)

REM ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
REM ===== This is the end of file or exit handling                                                                    =====
REM ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====

:EXIT
call echo Exiting...
ENDLOCAL
