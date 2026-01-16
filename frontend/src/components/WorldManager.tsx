import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Globe, Trash2, RefreshCw, FolderOpen,
  Edit2, Save, Archive, RotateCcw, Loader2, AlertCircle,
  HardDrive, Calendar, Clock
} from 'lucide-react';

interface World {
  id: string;
  name: string;
  path: string;
  createdAt: string;
  lastPlayed: string;
  sizeBytes: number;
  gameMode: string;
  seed?: string;
  isBackup?: boolean;
  backupOf?: string;
}

interface WorldManagerProps {
  onClose: () => void;
  getWorlds: () => Promise<World[]>;
  getBackups: () => Promise<World[]>;
  renameWorld: (worldId: string, newName: string) => Promise<void>;
  deleteWorld: (worldId: string) => Promise<void>;
  backupWorld: (worldId: string) => Promise<World>;
  restoreBackup: (backupId: string) => Promise<World>;
  deleteBackup: (backupId: string) => Promise<void>;
  openWorldsFolder: () => Promise<void>;
}

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateStr;
  }
};

export const WorldManager: React.FC<WorldManagerProps> = ({
  onClose,
  getWorlds,
  getBackups,
  renameWorld,
  deleteWorld,
  backupWorld,
  restoreBackup,
  deleteBackup,
  openWorldsFolder,
}) => {
  const [activeTab, setActiveTab] = useState<'worlds' | 'backups'>('worlds');
  const [worlds, setWorlds] = useState<World[]>([]);
  const [backups, setBackups] = useState<World[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingWorld, setEditingWorld] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [worldsData, backupsData] = await Promise.all([
        getWorlds(),
        getBackups()
      ]);
      setWorlds(worldsData || []);
      setBackups(backupsData || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    }
    setIsLoading(false);
  }, [getWorlds, getBackups]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRename = async (worldId: string) => {
    if (!editName.trim()) return;
    
    setProcessing(worldId);
    try {
      await renameWorld(worldId, editName);
      setEditingWorld(null);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to rename world');
    }
    setProcessing(null);
  };

  const handleDelete = async (worldId: string) => {
    if (!confirm('Are you sure you want to delete this world? This cannot be undone.')) return;
    
    setProcessing(worldId);
    try {
      await deleteWorld(worldId);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete world');
    }
    setProcessing(null);
  };

  const handleBackup = async (worldId: string) => {
    setProcessing(worldId);
    try {
      await backupWorld(worldId);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to create backup');
    }
    setProcessing(null);
  };

  const handleRestore = async (backupId: string) => {
    setProcessing(backupId);
    try {
      await restoreBackup(backupId);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to restore backup');
    }
    setProcessing(null);
  };

  const handleDeleteBackup = async (backupId: string) => {
    if (!confirm('Are you sure you want to delete this backup?')) return;
    
    setProcessing(backupId);
    try {
      await deleteBackup(backupId);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete backup');
    }
    setProcessing(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-8"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-3xl max-h-[85vh] bg-[#0d0d0d] rounded-2xl border border-white/10 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
              <Globe size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">World Manager</h2>
              <p className="text-xs text-gray-400">Manage your worlds and backups</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              title="Refresh"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={openWorldsFolder}
              className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              title="Open Worlds Folder"
            >
              <FolderOpen size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('worlds')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'worlds'
                ? 'text-[#FFA845] border-b-2 border-[#FFA845]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Worlds ({worlds.length})
          </button>
          <button
            onClick={() => setActiveTab('backups')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'backups'
                ? 'text-[#FFA845] border-b-2 border-[#FFA845]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Backups ({backups.length})
          </button>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mx-4 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2"
            >
              <AlertCircle size={16} className="text-red-400" />
              <span className="text-sm text-red-400">{error}</span>
              <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="text-[#FFA845] animate-spin" />
            </div>
          ) : activeTab === 'worlds' ? (
            worlds.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Globe size={48} className="mb-4 opacity-50" />
                <p className="text-lg font-medium">No worlds found</p>
                <p className="text-sm">Play the game to create worlds</p>
              </div>
            ) : (
              <div className="space-y-3">
                {worlds.map((world) => (
                  <motion.div
                    key={world.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white/5 rounded-xl border border-white/5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-teal-500/20 flex items-center justify-center">
                        <Globe size={24} className="text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {editingWorld === world.id ? (
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="flex-1 bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#FFA845]"
                              autoFocus
                            />
                            <button
                              onClick={() => handleRename(world.id)}
                              disabled={processing === world.id}
                              className="p-1 text-green-400 hover:text-green-300"
                            >
                              <Save size={16} />
                            </button>
                            <button
                              onClick={() => setEditingWorld(null)}
                              className="p-1 text-gray-400 hover:text-gray-300"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <h3 className="font-bold text-white truncate">{world.name}</h3>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                          <span className="flex items-center gap-1">
                            <HardDrive size={12} />
                            {formatSize(world.sizeBytes)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatDate(world.lastPlayed)}
                          </span>
                          <span className="bg-white/10 px-2 py-0.5 rounded">
                            {world.gameMode}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {processing === world.id ? (
                          <Loader2 size={18} className="text-[#FFA845] animate-spin" />
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingWorld(world.id);
                                setEditName(world.name);
                              }}
                              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                              title="Rename"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleBackup(world.id)}
                              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                              title="Create Backup"
                            >
                              <Archive size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(world.id)}
                              className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          ) : (
            // Backups Tab
            backups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Archive size={48} className="mb-4 opacity-50" />
                <p className="text-lg font-medium">No backups found</p>
                <p className="text-sm">Create backups from the Worlds tab</p>
              </div>
            ) : (
              <div className="space-y-3">
                {backups.map((backup) => (
                  <motion.div
                    key={backup.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white/5 rounded-xl border border-white/5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                        <Archive size={24} className="text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white truncate">{backup.name}</h3>
                        <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                          <span className="flex items-center gap-1">
                            <HardDrive size={12} />
                            {formatSize(backup.sizeBytes)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDate(backup.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {processing === backup.id ? (
                          <Loader2 size={18} className="text-[#FFA845] animate-spin" />
                        ) : (
                          <>
                            <button
                              onClick={() => handleRestore(backup.id)}
                              className="p-2 rounded-lg hover:bg-green-500/20 text-green-400 transition-colors"
                              title="Restore"
                            >
                              <RotateCcw size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteBackup(backup.id)}
                              className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
