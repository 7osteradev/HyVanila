import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Activity, Check, X as XIcon, RefreshCw, Save, Loader2 } from 'lucide-react';

interface DiagnosticsModalProps {
  onClose: () => void;
  onRunDiagnostics: () => Promise<any>;
  onSaveDiagnostics: () => Promise<string>;
}

export const DiagnosticsModal: React.FC<DiagnosticsModalProps> = ({
  onClose,
  onRunDiagnostics,
  onSaveDiagnostics
}) => {
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedPath, setSavedPath] = useState<string>('');

  const runDiagnostics = async () => {
    setIsLoading(true);
    try {
      const result = await onRunDiagnostics();
      setReport(result);
    } catch (err) {
      console.error('Diagnostics failed:', err);
    }
    setIsLoading(false);
  };

  const saveDiagnostics = async () => {
    try {
      const path = await onSaveDiagnostics();
      setSavedPath(path);
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  React.useEffect(() => {
    runDiagnostics();
  }, []);

  const StatusIcon: React.FC<{ ok: boolean }> = ({ ok }) => (
    ok 
      ? <Check size={14} className="text-green-400" />
      : <XIcon size={14} className="text-red-400" />
  );

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
        className="w-full max-w-xl bg-[#0d0d0d] rounded-2xl border border-white/10 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFA845]/20 flex items-center justify-center">
              <Activity size={20} className="text-[#FFA845]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">System Diagnostics</h2>
              <p className="text-xs text-gray-400">Check your system configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={32} className="text-[#FFA845] animate-spin mb-4" />
              <p className="text-gray-400">Running diagnostics...</p>
            </div>
          ) : report ? (
            <div className="space-y-4">
              {/* Platform */}
              <div className="p-4 bg-white/5 rounded-xl">
                <h3 className="text-sm font-bold text-white mb-3">Platform</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">OS:</span>
                    <span className="text-white">{report.platform?.os}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Arch:</span>
                    <span className="text-white">{report.platform?.arch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Version:</span>
                    <span className="text-white">{report.platform?.version}</span>
                  </div>
                </div>
              </div>

              {/* Connectivity */}
              <div className="p-4 bg-white/5 rounded-xl">
                <h3 className="text-sm font-bold text-white mb-3">Connectivity</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Hytale Patches Server</span>
                    <StatusIcon ok={report.connectivity?.hytalePatches} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">GitHub API</span>
                    <StatusIcon ok={report.connectivity?.github} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">itch.io (Butler)</span>
                    <StatusIcon ok={report.connectivity?.itchIO} />
                  </div>
                </div>
                {report.connectivity?.error && (
                  <p className="mt-2 text-xs text-red-400">{report.connectivity.error}</p>
                )}
              </div>

              {/* Game Status */}
              <div className="p-4 bg-white/5 rounded-xl">
                <h3 className="text-sm font-bold text-white mb-3">Game Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Installed</span>
                    <StatusIcon ok={report.gameStatus?.installed} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Client Executable</span>
                    <StatusIcon ok={report.gameStatus?.clientExists} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Online Fix Applied</span>
                    <StatusIcon ok={report.gameStatus?.onlineFixApplied} />
                  </div>
                  {report.gameStatus?.version && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Version</span>
                      <span className="text-white">{report.gameStatus.version}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dependencies */}
              <div className="p-4 bg-white/5 rounded-xl">
                <h3 className="text-sm font-bold text-white mb-3">Dependencies</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Java Runtime</span>
                    <StatusIcon ok={report.dependencies?.javaInstalled} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Butler Tool</span>
                    <StatusIcon ok={report.dependencies?.butlerInstalled} />
                  </div>
                </div>
              </div>

              {savedPath && (
                <p className="text-xs text-green-400 text-center">
                  Report saved to: {savedPath}
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No diagnostics data available</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-white/10 bg-black/30">
          <button
            onClick={runDiagnostics}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={saveDiagnostics}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition-colors"
            >
              <Save size={14} />
              Save Report
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-[#FFA845]/20 text-[#FFA845] hover:bg-[#FFA845]/30 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
