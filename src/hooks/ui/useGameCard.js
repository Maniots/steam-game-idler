import { invoke } from '@tauri-apps/api/core';

import { startIdle } from '@/utils/idle';
import { checkSteamStatus, logEvent } from '@/utils/tasks';
import { showDangerToast, showSuccessToast, t } from '@/utils/toasts';

export default function useGameCard() {
    return {};
}

// Handle starting idling for a game
export const handleIdle = async (item) => {
    const success = await startIdle(item.appid, item.name, true);
    if (success) {
        showSuccessToast(t('toast.startIdle.success', { appName: item.name, appId: item.appid }));
    } else {
        showDangerToast(t('toast.startIdle.error', { appName: item.name, appId: item.appid }));
    }
};

// Handle stopping idling for a game
export const handleStopIdle = async (item, idleGamesList, setIdleGamesList) => {
    const game = idleGamesList.find((game) => game.appid === item.appid);
    try {
        const response = await invoke('kill_process_by_pid', { pid: game.pid });
        if (response.success) {
            setIdleGamesList(idleGamesList.filter((i) => i.pid !== item.pid));
            showSuccessToast(t('toast.stopIdle.success', { appName: item.name, appId: item.appid }));
        } else {
            showDangerToast(t('toast.stopIdle.error', { appName: item.name, appId: item.appid }));
        }
    } catch (error) {
        showDangerToast(t('common.error'));
        console.error('Error in handleStopIdle:', error);
        logEvent(`Error in (handleStopIdle): ${error}`);
    }
};

// Handle viewing achievements for a game
export const viewAchievments = async (item, setAppId, setAppName, setShowAchievements) => {
    // Make sure Steam client is running
    const isSteamRunning = checkSteamStatus(true);
    if (!isSteamRunning) return;

    setAppId(item.appid);
    setAppName(item.name);
    setShowAchievements(true);
};

// Handle viewing game settings for a game
export const viewGameSettings = (item, setAppId, setAppName, setSettingsModalOpen) => {
    setAppId(item.appid);
    setAppName(item.name);
    setSettingsModalOpen(true);
};