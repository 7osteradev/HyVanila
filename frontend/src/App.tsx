import React, { useState, useEffect } from 'react';
import { Titlebar } from './components/Titlebar';
import { BackgroundImage } from './components/BackgroundImage';
import { ProfileSection } from './components/ProfileSection';
import { ControlSection } from './components/ControlSection';
import { MusicPlayer } from './components/MusicPlayer';
import { UpdateOverlay } from './components/UpdateOverlay';
import { ErrorModal } from './components/ErrorModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { ModManager } from './components/ModManager';
import hytaleLogo from './assets/logo.png';

import { 
  DownloadAndLaunch, 
  OpenFolder, 
  GetNick, 
  SetNick, 
  DeleteGame, 
  Update,
  ExitGame,
  GetAvailableVersions,
  GetCurrentVersion,
  DownloadVersion,
  IsGameRunning,
  GetInstalledVersions,
  SwitchVersion,
  // Mod Manager
  SearchMods,
  GetInstalledMods,
  InstallMod,
  UninstallMod,
  ToggleMod,
  GetModCategories,
  OpenModsFolder
} from '../wailsjs/go/app/App';
import { EventsOn } from '../wailsjs/runtime/runtime';

interface InstalledVersion {
  version: number;
  versionType: string;
  installDate: string;
}

const App: React.FC = () => {
  // User state
  const [username, setUsername] = useState<string>("HyPrism");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Download state
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>("Ready to play");
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isGameRunning, setIsGameRunning] = useState<boolean>(false);
  const [currentFile, setCurrentFile] = useState<string>("");
  const [downloadSpeed, setDownloadSpeed] = useState<string>("");
  const [downloaded, setDownloaded] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  
  // Update state
  const [updateAsset, setUpdateAsset] = useState<any>(null);
  const [isUpdatingLauncher, setIsUpdatingLauncher] = useState<boolean>(false);
  const [updateStats, setUpdateStats] = useState({ d: 0, t: 0 });

  // Modal state
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showModManager, setShowModManager] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  // Version state
  const [currentVersion, setCurrentVersion] = useState<string>("Not installed");
  const [latestVersion, setLatestVersion] = useState<number>(0);
  const [installedVersions, setInstalledVersions] = useState<InstalledVersion[]>([]);

  // Game state polling
  useEffect(() => {
    if (!isGameRunning) return;
    
    const pollInterval = setInterval(async () => {
      try {
        const running = await IsGameRunning();
        if (!running) {
          setIsGameRunning(false);
          setStatus("Ready to play");
          setProgress(0);
        }
      } catch (e) {
        console.error('Failed to check game state:', e);
      }
    }, 2000); // Check every 2 seconds
    
    return () => clearInterval(pollInterval);
  }, [isGameRunning]);

  useEffect(() => {
    // Initialize
    GetNick().then((n: string) => n && setUsername(n));
    
    // Load version info
    GetCurrentVersion().then(v => setCurrentVersion(v || "Not installed")).catch(console.error);
    GetAvailableVersions().then(v => {
      if (v && typeof v === 'object') {
        setLatestVersion(v.release || 0);
      }
    }).catch(console.error);
    
    // Load installed versions
    GetInstalledVersions().then(versions => {
      if (versions && Array.isArray(versions)) {
        setInstalledVersions(versions);
      }
    }).catch(console.error);

    // Event listeners
    const unsubProgress = EventsOn('progress-update', (data: any) => {
      setProgress(data.progress);
      setStatus(data.message);
      setDownloadSpeed(data.speed);
      setCurrentFile(data.currentFile);
      setDownloaded(data.downloaded);
      setTotal(data.total);
      
      if (data.progress >= 100 && data.stage === 'launch') {
        setIsGameRunning(true);
        setIsDownloading(false);
        setStatus("Game is running");
      }
    });

    const unsubUpdate = EventsOn('update:available', (asset: any) => {
      setUpdateAsset(asset);
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
        message: 'Failed to update launcher',
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
        message: 'Invalid Nickname',
        technical: 'Nickname must be between 1 and 16 characters',
        timestamp: new Date().toISOString()
      });
      return;
    }
    
    setIsDownloading(true);
    try {
      await DownloadAndLaunch(username);
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
    setStatus("Ready to play");
  };

  const handleInstallVersion = async (_version: number) => {
    setIsDownloading(true);
    try {
      await DownloadVersion("release", username);
      const newVersion = await GetCurrentVersion();
      setCurrentVersion(newVersion || "Not installed");
      // Refresh installed versions
      const versions = await GetInstalledVersions();
      if (versions) setInstalledVersions(versions);
    } catch (err) {
      console.error('Install failed:', err);
      setIsDownloading(false);
    }
  };

  const handleSwitchVersion = async (version: number) => {
    try {
      await SwitchVersion(version);
      const newVersion = await GetCurrentVersion();
      setCurrentVersion(newVersion || "Not installed");
      setStatus("Ready to play");
    } catch (err) {
      console.error('Switch failed:', err);
      setError({
        type: 'VERSION_ERROR',
        message: 'Failed to switch version',
        technical: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="relative w-screen h-screen max-w-[1280px] max-h-[720px] bg-[#090909] text-white overflow-hidden font-sans select-none mx-auto">
      <BackgroundImage />
      <Titlebar />
      
      {/* Music Player - positioned in top right */}
      <div className="absolute top-12 right-4 z-20">
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
          />

          {/* Hytale Logo - Right Side */}
          <img src={hytaleLogo} alt="Hytale" className="h-24 drop-shadow-2xl" />
        </div>

        <ControlSection 
          onPlay={handlePlay}
          onExit={handleExit}
          onInstallVersion={handleInstallVersion}
          onSwitchVersion={handleSwitchVersion}
          isDownloading={isDownloading}
          isGameRunning={isGameRunning}
          progress={progress}
          status={status}
          speed={downloadSpeed}
          downloaded={downloaded}
          total={total}
          currentFile={currentFile}
          currentVersion={currentVersion}
          latestVersion={latestVersion}
          installedVersions={installedVersions}
          actions={{
            openFolder: OpenFolder,
            showDelete: () => setShowDelete(true),
            showModManager: () => setShowModManager(true)
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
          searchMods={SearchMods}
          getInstalledMods={GetInstalledMods}
          installMod={InstallMod}
          uninstallMod={UninstallMod}
          toggleMod={ToggleMod}
          getModCategories={GetModCategories}
          openModsFolder={OpenModsFolder}
        />
      )}
    </div>
  );
};

export default App;
