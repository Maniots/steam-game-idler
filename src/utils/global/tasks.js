import { addToast } from '@heroui/react';
import { getVersion } from '@tauri-apps/api/app';
import { invoke } from '@tauri-apps/api/core';

// Fetch the latest.json for tauri updater
export async function fetchLatest() {
    try {
        const res = await fetch('https://raw.githubusercontent.com/zevnda/steam-game-idler/main/latest.json');
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error in (fetchLatest):', error);
        logEvent(`[Error] in (fetchLatest): ${error}`);
        return null;
    }
};

// Manage the anti-away status
let antiAwayInterval = null;
export async function antiAwayStatus(active = null) {
    try {
        const steamRunning = await invoke('is_steam_running');
        if (!steamRunning) return;
        const settings = JSON.parse(localStorage.getItem('settings')) || {};
        const { antiAway } = settings?.general || {};
        const shouldRun = active !== null ? active : antiAway;
        if (shouldRun) {
            await invoke('anti_away');
            if (!antiAwayInterval) {
                antiAwayInterval = setInterval(async () => {
                    await invoke('anti_away');
                }, 3 * 60 * 1000);
            }
        } else {
            if (antiAwayInterval) {
                clearInterval(antiAwayInterval);
                antiAwayInterval = null;
            }
        }
    } catch (error) {
        console.error('Error in (antiAwayStatus):', error);
        logEvent(`[Error] in (antiAwayStatus): ${error}`);
    }
}

// Clear local/session storage but preserving important keys
export const preserveKeysAndClearData = async () => {
    try {
        const keysToPreserve = ['theme', 'minToTrayNotified', 'seenNotifications', 'hasUpdated'];

        const preservedData = keysToPreserve.reduce((acc, key) => {
            const value = localStorage.getItem(key);
            if (value) acc[key] = value;
            return acc;
        }, {});

        localStorage.clear();
        sessionStorage.clear();

        await invoke('delete_all_cache_files');

        Object.entries(preservedData).forEach(([key, value]) => {
            localStorage.setItem(key, value);
        });
    } catch (error) {
        addToast({ description: `Error in (preserveKeysAndClearData): ${error?.message || error}`, color: 'danger' });
        console.error('Error in (preserveKeysAndClearData):', error);
        logEvent(`[Error] in (preserveKeysAndClearData): ${error}`);
    }
};

// Log event
export async function logEvent(message) {
    try {
        const version = await getVersion();
        await invoke('log_event', { message: `[v${version}] ${message}` });
    } catch (error) {
        console.error('Error in logEvent util: ', error);
    }
};