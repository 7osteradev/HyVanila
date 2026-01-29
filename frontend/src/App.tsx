import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GameBranch } from './constants/enums';
import { Titlebar } from './components/Titlebar';
import { BackgroundImage } from './components/BackgroundImage';
import { ProfileSection } from './components/ProfileSection';
import { ControlSection } from './components/ControlSection';
import { MusicPlayer } from './components/MusicPlayer';
import { UpdateOverlay } from './components/UpdateOverlay';
import { ErrorModal } from './components/ErrorModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { ModManager } from './components/ModManager';
import { SettingsModal } from './components/SettingsModal';
import { LogsModal } from './components/LogsModal';
import hytaleLogo from './assets/logo.png';

import {
  DownloadAndLaunch,
  OpenFolder,
  GetNick,
  SetNick,
  DeleteGame,
  Update,
  ExitGame,
  IsGameRunning,
  // Version Manager
  GetVersionType,
  SetVersionType,
  SetSelectedVersion,
  GetVersionList,
  IsVersionInstalled,
  GetInstalledVersionsForBranch,
  CheckLatestNeedsUpdate,
  CheckUpdate,
  // Settings
  SelectInstanceDirectory,
  GetNews,
  GetLauncherVersion,
  GetGameLogs,
} from '../wailsjs/go/app/App';
import { EventsOn } from '../wailsjs/runtime/runtime';
import { NewsPreview } from './components/NewsPreview';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  // User state
  const [username, setUsername] = useState<string>("HyVanila");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [launcherVersion, setLauncherVersion] = useState<string>("1.0.0");

  // Download state
  const [progress, setProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isGameRunning, setIsGameRunning] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  // Update state
  const [updateAsset, setUpdateAsset] = useState<any>(null);
  const [isUpdatingLauncher, setIsUpdatingLauncher] = useState<boolean>(false);
  const [updateStats, setUpdateStats] = useState({ d: 0, t: 0 });
  const [speed, setSpeed] = useState<string>('');

  // Modal state
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showModManager, setShowModManager] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showLogs, setShowLogs] = useState<boolean>(false);
  const [modManagerSearchQuery, setModManagerSearchQuery] = useState<string>('');
  const [error, setError] = useState<any>(null);

  // Version state
  const [currentBranch, setCurrentBranch] = useState<string>(GameBranch.RELEASE);
  const [currentVersion, setCurrentVersion] = useState<number>(0);
  const [availableVersions, setAvailableVersions] = useState<number[]>([]);
  const [installedVersions, setInstalledVersions] = useState<number[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState<boolean>(false);
  const [isVersionInstalled, setIsVersionInstalled] = useState<boolean>(false);
  const [isCheckingInstalled, setIsCheckingInstalled] = useState<boolean>(false);
  // const [customInstanceDir, setCustomInstanceDir] = useState<string>("");
  const [latestNeedsUpdate, setLatestNeedsUpdate] = useState<boolean>(false);

  // Startup Update Check
  const [isCheckingUpdate, setIsCheckingUpdate] = useState<boolean>(true);
  const [blockingUpdate, setBlockingUpdate] = useState<any>(null);

  // Update document direction and language based on i18n
  useEffect(() => {
    const isRTL = i18n.language === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // Check if current version is installed when branch or version changes
  useEffect(() => {
    const checkInstalled = async () => {
      if (currentVersion === 0) {
        // Version 0 is the auto-updating "latest" instance
        // Check if it's actually installed
        setIsCheckingInstalled(true);
        try {
          const installed = await IsVersionInstalled(currentBranch, 0);
          setIsVersionInstalled(installed);
          // Check if latest needs update
          const needsUpdate = await CheckLatestNeedsUpdate(currentBranch);
          setLatestNeedsUpdate(needsUpdate);
        } catch (e) {
          console.error('Failed to check latest instance:', e);
          setIsVersionInstalled(false);
          setLatestNeedsUpdate(false);
        }
        setIsCheckingInstalled(false);
        return;
      }
      if (currentVersion < 0) {
        // Uninitialized or invalid version
        setIsVersionInstalled(false);
        setLatestNeedsUpdate(false);
        return;
      }
      setIsCheckingInstalled(true);
      try {
        const installed = await IsVersionInstalled(currentBranch, currentVersion);
        setIsVersionInstalled(installed);
        setLatestNeedsUpdate(false); // Versioned instances don't auto-update
      } catch (e) {
        console.error('Failed to check if version installed:', e);
        setIsVersionInstalled(false);
        setLatestNeedsUpdate(false);
      }
      setIsCheckingInstalled(false);
    };
    checkInstalled();
  }, [currentBranch, currentVersion]);

  // Load version list when branch changes
  useEffect(() => {
    const loadVersions = async () => {
      setIsLoadingVersions(true);
      try {
        const versions = await GetVersionList(currentBranch);
        setAvailableVersions(versions || []);

        // Load installed versions
        const installed = await GetInstalledVersionsForBranch(currentBranch);
        setInstalledVersions(installed || []);

        // If current version is not valid for this branch, set to latest
        if (versions && !versions.includes(currentVersion) && versions.length > 0) {
          setCurrentVersion(versions[0]);
          await SetSelectedVersion(versions[0]);
        }
      } catch (e) {
        console.error('Failed to load versions:', e);
        setAvailableVersions([]);
        setInstalledVersions([]);
      }
      setIsLoadingVersions(false);
    };
    loadVersions();
  }, [currentBranch]);

  // Handle branch change - immediately load and set latest version for new branch
  const handleBranchChange = async (branch: string) => {
    setCurrentBranch(branch);
    await SetVersionType(branch);

    // Load versions for new branch and set to latest (version 0)
    setIsLoadingVersions(true);
    try {
      const versions = await GetVersionList(branch);
      setAvailableVersions(versions);
      // Always set to "latest" (version 0) when switching branches
      setCurrentVersion(0);
      await SetSelectedVersion(0);
    } catch (e) {
      console.error('Failed to load versions for branch:', e);
    }
    setIsLoadingVersions(false);
  };

  // Handle version change
  const handleVersionChange = async (version: number) => {
    setCurrentVersion(version);
    await SetSelectedVersion(version);
  };

  // Game state polling
  useEffect(() => {
    if (!isGameRunning) return;

    const pollInterval = setInterval(async () => {
      try {
        const running = await IsGameRunning();
        if (!running) {
          setIsGameRunning(false);
          setProgress(0);
        }
      } catch (e) {
        console.error('Failed to check game state:', e);
      }
    }, 3000); // Check every 3 seconds (reduced frequency)

    return () => clearInterval(pollInterval);
  }, [isGameRunning]);

  useEffect(() => {
    // Initialize user settings
    GetNick().then((n: string) => n && setUsername(n));
    GetLauncherVersion().then((v: string) => setLauncherVersion(v));
    // GetCustomInstanceDir().then((dir: string) => setCustomInstanceDir(dir));

    // Load saved branch and version - must load branch first, then version
    const loadSettings = async () => {
      try {
        // Run update check first
        setIsCheckingUpdate(true);
        try {
          // Add a small delay for better UX (so the checking screen doesn't flash too fast)
          await new Promise(r => setTimeout(r, 1500));
          const asset = await CheckUpdate();
          if (asset) {
            setBlockingUpdate(asset);
          }
        } catch (e) {
          console.error('Failed to check for updates:', e);
        } finally {
          setIsCheckingUpdate(false);
        }

        // Get saved branch (defaults to "release" in backend if not set)
        const savedBranch = await GetVersionType();
        const branch = savedBranch || GameBranch.RELEASE;
        setCurrentBranch(branch);

        // Load version list for this branch
        setIsLoadingVersions(true);
        const versions = await GetVersionList(branch);
        setAvailableVersions(versions);

        // Load installed versions
        const installed = await GetInstalledVersionsForBranch(branch);
        setInstalledVersions(installed);

        // Check if "latest" (version 0) is installed first
        const latestInstalled = await IsVersionInstalled(branch, 0);

        if (latestInstalled) {
          // Use latest if installed
          setCurrentVersion(0);
          await SetSelectedVersion(0);
          setIsVersionInstalled(true);
        } else if (installed && installed.length > 0) {
          // If latest not installed but other versions exist, select the highest installed version
          const highestInstalled = Math.max(...installed.filter(v => v > 0));
          if (highestInstalled > 0) {
            setCurrentVersion(highestInstalled);
            await SetSelectedVersion(highestInstalled);
            setIsVersionInstalled(true);
          } else {
            // Only version 0 in the list but not actually installed
            setCurrentVersion(0);
            await SetSelectedVersion(0);
            setIsVersionInstalled(false);
          }
        } else {
          // No versions installed, default to latest
          setCurrentVersion(0);
          await SetSelectedVersion(0);
          setIsVersionInstalled(false);
        }

        setIsLoadingVersions(false);
      } catch (e) {
        console.error('Failed to load settings:', e);
        setIsLoadingVersions(false);
      }
    };
    loadSettings();



    const unsubProgress = EventsOn('progress-update', (data: any) => {
      setProgress(data.progress);
      setDownloaded(data.downloaded);
      setTotal(data.total);
      setSpeed(data.speed);

      // When launch stage is received, game is starting
      if (data.stage === 'launch') {
        setIsGameRunning(true);
        setIsDownloading(false);
        setProgress(0);
        setSpeed('');

        // Game is now installed, update state
        setIsVersionInstalled(true);
      }
    });

    const unsubUpdate = EventsOn('update:available', (asset: any) => {
      setUpdateAsset(asset);
      // Don't auto-update - let user click the update button
      console.log('Update available:', asset);
    });

    const unsubUpdateProgress = EventsOn('update:progress', (_stage: string, progress: number, _message: string, _file: string, _speed: string, downloaded: number, total: number) => {
      setProgress(progress);
      setUpdateStats({ d: downloaded, t: total });
    });

    const unsubError = EventsOn('error', (err: any) => {
      setError(err);
      setIsDownloading(false);
    });

    return () => {
      unsubProgress();
      unsubUpdate();
      unsubUpdateProgress();
      unsubError();
    };
  }, []);

  const handleUpdate = async () => {
    setIsUpdatingLauncher(true);
    setProgress(0);
    setUpdateStats({ d: 0, t: 0 });

    try {
      await Update();
    } catch (err) {
      console.error('Update failed:', err);
      setError({
        type: 'UPDATE_ERROR',
        message: t('Failed to update launcher'),
        technical: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString()
      });
      setIsUpdatingLauncher(false);
    }
  };

  const handlePlay = async () => {
    if (!username.trim() || username.length > 16) {
      setError({
        type: 'VALIDATION',
        message: t('Invalid Nickname'),
        technical: t('Nickname must be between 1 and 16 characters'),
        timestamp: new Date().toISOString()
      });
      return;
    }

    setIsDownloading(true);
    try {
      await DownloadAndLaunch(username);
      // Button state will be managed by progress events:
      // - 'launch' event sets isGameRunning=true and isDownloading=false
      // - 'error' event sets isDownloading=false
    } catch (err) {
      console.error('Launch failed:', err);
      setIsDownloading(false);
    }
  };

  const handleNickChange = async (newNick: string) => {
    setUsername(newNick);
    await SetNick(newNick);
  };


  const handleExit = async () => {
    try {
      await ExitGame();
    } catch (err) {
      console.error('Failed to exit game:', err);
    }
    setIsGameRunning(false);
    setProgress(0);
  };

  const handleCustomDirChange = async () => {
    try {
      const selectedDir = await SelectInstanceDirectory();
      if (selectedDir) {
        console.log('Instance directory updated to:', selectedDir);

        // Show info about what gets moved
        setError({
          type: 'INFO',
          message: t('Instance Directory Updated'),
          technical: t('Game instances will now be stored in:\n{{dir}}\n\nNote: The following remain in AppData:\n• Java Runtime (JRE)\n• Butler tool\n• Cache files\n• Logs\n• Launcher settings\n• WebView2 (EBWebView folder)\n\nYou may need to reinstall the game if switching drives.', { dir: selectedDir }),
          timestamp: new Date().toISOString()
        });

        // Reload version list and check installed versions for new directory
        setIsLoadingVersions(true);
        try {
          const versions = await GetVersionList(currentBranch);
          setAvailableVersions(versions || []);

          const installed = await GetInstalledVersionsForBranch(currentBranch);
          setInstalledVersions(installed || []);

          // Re-check if current version is installed in new directory
          const isInstalled = await IsVersionInstalled(currentBranch, currentVersion);
          setIsVersionInstalled(isInstalled);

          // Check if latest needs update
          if (currentVersion === 0) {
            const needsUpdate = await CheckLatestNeedsUpdate(currentBranch);
            setLatestNeedsUpdate(needsUpdate);
          }
        } catch (e) {
          console.error('Failed to reload versions after directory change:', e);
        }
        setIsLoadingVersions(false);
      }
    } catch (err) {
      console.error('Failed to change instance directory:', err);
      setError({
        type: 'SETTINGS_ERROR',
        message: t('Failed to change instance directory'),
        technical: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="relative w-screen h-screen bg-[#090909] text-white overflow-hidden font-sans select-none">
      <BackgroundImage />

      {/* Startup Check Overlay */}
      {isCheckingUpdate && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#090909]">
          <img src={hytaleLogo} alt="Hytale" className="h-32 mb-8 animate-pulse drop-shadow-2xl" />
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-[#FFA845] animate-spin" />
            <p className="text-white/50 text-sm font-medium tracking-wide uppercase">{t('Checking for updates...')}</p>
          </div>
        </div>
      )}

      {/* Blocking Update Modal */}
      {!isCheckingUpdate && blockingUpdate && !isUpdatingLauncher && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <div className="w-full max-w-md bg-[#0d0d0d] rounded-2xl border border-white/10 p-8 flex flex-col items-center text-center shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[#FFA845]/20 flex items-center justify-center text-[#FFA845] mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{t('Update Available')}</h2>
            <p className="text-white/60 mb-8">
              {t('A new version of HyVanila is available.')}
              <span className="block mt-1 text-[#FFA845] font-mono text-sm">{blockingUpdate.name}</span>
            </p>

            <button
              onClick={handleUpdate}
              className="w-full py-4 bg-[#FFA845] hover:bg-[#FFB966] text-black font-bold rounded-xl transition-all active:scale-95"
            >
              {t('Update Now')}
            </button>

            <button
              onClick={() => setBlockingUpdate(null)}
              className="mt-3 w-full py-3 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-medium rounded-xl transition-all active:scale-95"
            >
              {t('Skip Update')}
            </button>
          </div>
        </div>
      )}

      <Titlebar />

      {/* Music Player - positioned in top right */}
      <div className="absolute top-12 end-4 z-20">
        <MusicPlayer forceMuted={isGameRunning} />
      </div>

      {isUpdatingLauncher && (
        <UpdateOverlay
          progress={progress}
          downloaded={updateStats.d}
          total={updateStats.t}
        />
      )}

      <main className="relative z-10 h-full p-10 flex flex-col justify-between pt-[60px]">
        <div className="flex justify-between items-start">
          <ProfileSection
            username={username}
            isEditing={isEditing}
            onEditToggle={setIsEditing}
            onUserChange={handleNickChange}
            updateAvailable={!!updateAsset}
            onUpdate={handleUpdate}
            launcherVersion={launcherVersion}
          />
          {/* Hytale Logo & News - Right Side */}
          <div className="flex flex-col items-end gap-3">
            <img src={hytaleLogo} alt="Hytale" className="h-24 drop-shadow-2xl" />
            <NewsPreview getNews={async () => await GetNews(3)} />
          </div>
        </div>

        <ControlSection
          onPlay={handlePlay}
          onDownload={handlePlay}
          onExit={handleExit}
          isDownloading={isDownloading}
          isGameRunning={isGameRunning}
          isVersionInstalled={isVersionInstalled}
          isCheckingInstalled={isCheckingInstalled}
          progress={progress}
          downloaded={downloaded}
          total={total}
          speed={speed}
          currentBranch={currentBranch}
          currentVersion={currentVersion}
          availableVersions={availableVersions}
          installedVersions={installedVersions}
          isLoadingVersions={isLoadingVersions}
          latestNeedsUpdate={latestNeedsUpdate}
          onBranchChange={handleBranchChange}
          onVersionChange={handleVersionChange}
          onCustomDirChange={handleCustomDirChange}
          actions={{
            openFolder: OpenFolder,
            showDelete: () => setShowDelete(true),
            showModManager: (query?: string) => {
              setModManagerSearchQuery(query || '');
              setShowModManager(true);
            },
            showSettings: () => setShowSettings(true)
          }}
        />
      </main>

      {/* Modals */}
      {showDelete && (
        <DeleteConfirmationModal
          onConfirm={() => {
            DeleteGame();
            setShowDelete(false);
          }}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {error && (
        <ErrorModal
          error={error}
          onClose={() => setError(null)}
        />
      )}

      {showModManager && (
        <ModManager
          onClose={() => setShowModManager(false)}
          currentBranch={currentBranch}
          currentVersion={currentVersion}
          initialSearchQuery={modManagerSearchQuery}
        />
      )}

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onShowLogs={() => setShowLogs(true)}
        />
      )}

      {showLogs && (
        <LogsModal
          onClose={() => setShowLogs(false)}
          getGameLogs={GetGameLogs}
        />
      )}
    </div>
  );
};

export default App;
