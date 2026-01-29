import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Cpu, Monitor, HardDrive, Binary } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
    SetJavaPath,
    SetMaxMemory,
    SetMinMemory,
    SetFullScreen,
    SetAutoUpdateLatest,
    SetMusicEnabled,
    SetDiscordRPCEnabled,
    SelectJavaPath,
    GetConfig
} from '../../wailsjs/go/app/App';

interface SettingsModalProps {
    onClose: () => void;
    onShowLogs: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onShowLogs }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'general' | 'performance'>('general');
    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const cfg = await GetConfig();
            setConfig(cfg);
        } catch (err) {
            console.error('Failed to load config:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleJavaPathSelect = async () => {
        try {
            const path = await SelectJavaPath();
            if (path) {
                setConfig({ ...config, javaPath: path });
            }
        } catch (err) {
            console.error('Failed to select Java path:', err);
        }
    };

    const handleMaxMemoryChange = async (value: number) => {
        try {
            await SetMaxMemory(value);
            setConfig({ ...config, maxMemory: value });
            // Ensure min memory is not greater than max memory
            if (config.minMemory > value) {
                await handleMinMemoryChange(value);
            }
        } catch (err) {
            console.error('Failed to set max memory:', err);
        }
    };

    const handleMinMemoryChange = async (value: number) => {
        try {
            await SetMinMemory(value);
            setConfig({ ...config, minMemory: value });
        } catch (err) {
            console.error('Failed to set min memory:', err);
        }
    };

    const handleAutoUpdateToggle = async () => {
        const newVal = !config.autoUpdateLatest;
        try {
            await SetAutoUpdateLatest(newVal);
            setConfig({ ...config, autoUpdateLatest: newVal });
        } catch (err) {
            console.error('Failed to set auto update:', err);
        }
    };

    const handleMusicToggle = async () => {
        const newVal = !config.musicEnabled;
        try {
            await SetMusicEnabled(newVal);
            setConfig({ ...config, musicEnabled: newVal });
        } catch (err) {
            console.error('Failed to set music:', err);
        }
    };

    const handleDiscordToggle = async () => {
        const newVal = !config.discordRPCEnabled;
        try {
            await SetDiscordRPCEnabled(newVal);
            setConfig({ ...config, discordRPCEnabled: newVal });
        } catch (err) {
            console.error('Failed to set discord rpc:', err);
        }
    };

    const handleFullScreenToggle = async () => {
        const newVal = !config.fullScreen;
        try {
            await SetFullScreen(newVal);
            setConfig({ ...config, fullScreen: newVal });
        } catch (err) {
            console.error('Failed to set full screen:', err);
        }
    };

    const tabs = [
        { id: 'general', label: t('General'), icon: <Settings size={18} /> },
        { id: 'performance', label: t('Performance'), icon: <Cpu size={18} /> },
    ];

    if (loading || !config) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="w-full max-w-3xl h-[600px] bg-[#0d0d0d] rounded-2xl border border-white/10 flex overflow-hidden shadow-2xl shadow-black/50"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Sidebar */}
                <div className="w-64 border-e border-white/5 bg-white/[0.02] p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-3 px-3 py-4 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-[#FFA845]/20 flex items-center justify-center text-[#FFA845]">
                            <Settings size={22} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white leading-tight">{t('Settings')}</h2>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest">{t('Configuration')}</p>
                        </div>
                    </div>

                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === tab.id
                                ? 'bg-[#FFA845]/10 text-[#FFA845]'
                                : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
                                }`}
                        >
                            {tab.icon}
                            <span className="font-medium">{tab.label}</span>
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="ms-auto w-1.5 h-1.5 rounded-full bg-[#FFA845]"
                                />
                            )}
                        </button>
                    ))}

                    <div className="mt-auto pt-4 flex flex-col gap-2 border-t border-white/5">
                        <button
                            onClick={onClose}
                            className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-medium transition-colors"
                        >
                            {t('Close')}
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-8">
                        <AnimatePresence mode="wait">
                            {activeTab === 'general' && (
                                <motion.div
                                    key="general"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <section>
                                        <div className="flex items-center gap-2 mb-6">
                                            <Settings size={18} className="text-[#FFA845]" />
                                            <h3 className="text-lg font-semibold text-white">{t('Launcher')}</h3>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-sm font-medium text-white">{t('Auto-Update Instances')}</h4>
                                                    <p className="text-xs text-white/40">{t('Automatically update the latest instance version')}</p>
                                                </div>
                                                <button
                                                    onClick={handleAutoUpdateToggle}
                                                    className={`w-12 h-6 rounded-full transition-colors relative ${config.autoUpdateLatest ? 'bg-[#FFA845]' : 'bg-white/10'}`}
                                                >
                                                    <motion.div
                                                        animate={{ x: config.autoUpdateLatest ? 26 : 4 }}
                                                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                                                    />
                                                </button>
                                            </div>

                                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-sm font-medium text-white">{t('Launcher Music')}</h4>
                                                    <p className="text-xs text-white/40">{t('Enable or disable the background music')}</p>
                                                </div>
                                                <button
                                                    onClick={handleMusicToggle}
                                                    className={`w-12 h-6 rounded-full transition-colors relative ${config.musicEnabled ? 'bg-[#FFA845]' : 'bg-white/10'}`}
                                                >
                                                    <motion.div
                                                        animate={{ x: config.musicEnabled ? 26 : 4 }}
                                                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                                                    />
                                                </button>
                                            </div>

                                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-sm font-medium text-white">{t('View Logs')}</h4>
                                                    <p className="text-xs text-white/40">{t('Open the game and launcher logs viewer')}</p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        onClose();
                                                        onShowLogs();
                                                    }}
                                                    className="px-4 py-2 bg-[#FFA845]/10 hover:bg-[#FFA845]/20 border border-[#FFA845]/20 rounded-lg text-sm text-[#FFA845] transition-colors"
                                                >
                                                    {t('Open Logger')}
                                                </button>
                                            </div>

                                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-sm font-medium text-white">{t('Discord Rich Presence')}</h4>
                                                    <p className="text-xs text-white/40">{t('Show your status on Discord')}</p>
                                                </div>
                                                <button
                                                    onClick={handleDiscordToggle}
                                                    className={`w-12 h-6 rounded-full transition-colors relative ${config.discordRPCEnabled ? 'bg-[#FFA845]' : 'bg-white/10'}`}
                                                >
                                                    <motion.div
                                                        animate={{ x: config.discordRPCEnabled ? 26 : 4 }}
                                                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex items-center gap-2 mb-6">
                                            <Binary size={18} className="text-[#FFA845]" />
                                            <h3 className="text-lg font-semibold text-white">{t('Java Settings')}</h3>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-3">
                                                <label className="text-sm font-medium text-white/60">{t('Java Executable Path')}</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value={config.javaPath || t('Default (Bundled)')}
                                                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white/50 focus:outline-none"
                                                    />
                                                    <button
                                                        onClick={handleJavaPathSelect}
                                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-colors"
                                                    >
                                                        {t('Browse')}
                                                    </button>
                                                    {config.javaPath && (
                                                        <button
                                                            onClick={() => {
                                                                SetJavaPath("");
                                                                setConfig({ ...config, javaPath: "" });
                                                            }}
                                                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-sm text-red-400 transition-colors"
                                                        >
                                                            {t('Reset')}
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-white/30 italic">
                                                    {t('Recommended to keep it empty to use the bundled JRE')}.
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex items-center gap-2 mb-6">
                                            <Monitor size={18} className="text-[#FFA845]" />
                                            <h3 className="text-lg font-semibold text-white">{t('Display')}</h3>
                                        </div>

                                        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-medium text-white">{t('Full Screen')}</h4>
                                                <p className="text-xs text-white/40">{t('Launch the game in full screen mode')}</p>
                                            </div>
                                            <button
                                                onClick={handleFullScreenToggle}
                                                className={`w-12 h-6 rounded-full transition-colors relative ${config.fullScreen ? 'bg-[#FFA845]' : 'bg-white/10'
                                                    }`}
                                            >
                                                <motion.div
                                                    animate={{ x: config.fullScreen ? 26 : 4 }}
                                                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                                                />
                                            </button>
                                        </div>
                                    </section>
                                </motion.div>
                            )}

                            {activeTab === 'performance' && (
                                <motion.div
                                    key="performance"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <section>
                                        <div className="flex items-center gap-2 mb-6">
                                            <Cpu size={18} className="text-[#FFA845]" />
                                            <h3 className="text-lg font-semibold text-white">{t('Memory Usage')}</h3>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5 space-y-6">
                                                <div className="flex justify-between items-end">
                                                    <label className="text-sm font-medium text-white/60">{t('Maximum RAM')}</label>
                                                    <div className="text-[#FFA845] font-bold text-xl">
                                                        {(config.maxMemory / 1024).toFixed(1)} <span className="text-xs font-normal text-white/40">GB</span>
                                                    </div>
                                                </div>

                                                <input
                                                    type="range"
                                                    min="1024"
                                                    max="16384"
                                                    step="512"
                                                    value={config.maxMemory}
                                                    onChange={(e) => handleMaxMemoryChange(parseInt(e.target.value))}
                                                    className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#FFA845]"
                                                />

                                                <div className="flex justify-between text-[10px] text-white/20 uppercase tracking-tighter">
                                                    <span>1 GB</span>
                                                    <span>4 GB</span>
                                                    <span>8 GB</span>
                                                    <span>12 GB</span>
                                                    <span>16 GB</span>
                                                </div>
                                            </div>

                                            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5 space-y-6">
                                                <div className="flex justify-between items-end">
                                                    <label className="text-sm font-medium text-white/60">{t('Minimum RAM')}</label>
                                                    <div className="text-[#FFA845] font-bold text-xl">
                                                        {(config.minMemory / 1024).toFixed(1)} <span className="text-xs font-normal text-white/40">GB</span>
                                                    </div>
                                                </div>

                                                <input
                                                    type="range"
                                                    min="512"
                                                    max={config.maxMemory}
                                                    step="256"
                                                    value={config.minMemory}
                                                    onChange={(e) => handleMinMemoryChange(parseInt(e.target.value))}
                                                    className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#FFA845]"
                                                />

                                                <div className="flex justify-between text-[10px] text-white/20 uppercase tracking-tighter">
                                                    <span>0.5 GB</span>
                                                    <span>{((config.maxMemory / 1024) / 2).toFixed(1)} GB</span>
                                                    <span>{(config.maxMemory / 1024).toFixed(1)} GB</span>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </motion.div>
                            )}


                        </AnimatePresence>
                    </div>

                    {/* Bottom Info */}
                    <div className="p-4 border-t border-white/5 bg-black/20 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[11px] text-white/30">
                            <HardDrive size={14} />
                            <span>{t('Config saved automatically')}</span>
                        </div>
                        <p className="text-[11px] text-white/20">HyVanila Launcher v1.0.0</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
