!include "MUI2.nsh"
!include "FileFunc.nsh"

!define PRODUCT_NAME "HyVanila"
!define PRODUCT_VERSION "1.0.0"
!define PRODUCT_PUBLISHER "7ostera"
!define PRODUCT_WEB_SITE "https://github.com/7osteradev/HyVanila"

Name "${PRODUCT_NAME}"
OutFile "..\..\bin\HyVanila-Installer-x64.exe"
InstallDir "$LOCALAPPDATA\HyVanila"
InstallDirRegKey HKCU "Software\HyVanila" ""
RequestExecutionLevel user

!define MUI_ABORTWARNING
!define MUI_ICON "..\icon.ico"
!define MUI_UNICON "..\icon.ico"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"

Section "MainSection" SEC01
  SetOutPath "$INSTDIR"
  SetOverwrite on
  File "..\..\bin\HyVanila.exe"
  File "..\..\bin\WebView2Loader.dll"
  
  ; Create shortcuts
  CreateDirectory "$SMPROGRAMS\HyVanila"
  CreateShortCut "$SMPROGRAMS\HyVanila\HyVanila.lnk" "$INSTDIR\HyVanila.exe"
  CreateShortCut "$DESKTOP\HyVanila.lnk" "$INSTDIR\HyVanila.exe"
  
  ; Write uninstall info
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\HyVanila" "DisplayName" "${PRODUCT_NAME}"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\HyVanila" "UninstallString" "$INSTDIR\Uninstall.exe"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\HyVanila" "DisplayIcon" "$INSTDIR\HyVanila.exe"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\HyVanila" "Publisher" "${PRODUCT_PUBLISHER}"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\HyVanila" "URLInfoAbout" "${PRODUCT_WEB_SITE}"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\HyVanila" "DisplayVersion" "${PRODUCT_VERSION}"
  
  WriteUninstaller "$INSTDIR\Uninstall.exe"
SectionEnd

Section "Uninstall"
  Delete "$INSTDIR\HyVanila.exe"
  Delete "$INSTDIR\WebView2Loader.dll"
  Delete "$INSTDIR\Uninstall.exe"
  
  Delete "$DESKTOP\HyVanila.lnk"
  Delete "$SMPROGRAMS\HyVanila\HyVanila.lnk"
  RMDir "$SMPROGRAMS\HyVanila"
  
  RMDir "$INSTDIR"
  
  DeleteRegKey HKCU "Software\HyVanila"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\HyVanila"
SectionEnd
