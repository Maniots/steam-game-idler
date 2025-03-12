import { useState, useEffect, useContext } from 'react';

import { invoke } from '@tauri-apps/api/core';
import moment from 'moment';

import { AppContext } from '@/components/layout/AppContext';
import { logEvent } from '@/utils/utils';
import { addToast } from '@heroui/react';

export const usePageHeader = ({ setSortStyle, setRefreshKey }) => {
    const { userSummary } = useContext(AppContext);
    const [sortStyle, setSortStyleState] = useState(localStorage.getItem('sortStyle') || 'a-z');

    useEffect(() => {
        setSortStyle(sortStyle);
    }, [sortStyle, setSortStyle]);

    const handleSorting = (e) => {
        try {
            localStorage.setItem('sortStyle', e.currentKey);
            setSortStyleState(e.currentKey);
        } catch (error) {
            addToast({ description: `Error in (handleSorting): ${error?.message || error}`, color: 'danger' });
            console.error('Error in (handleSorting):', error);
            logEvent(`[Error] in (handleSorting): ${error}`);
        }
    };

    const handleRefetch = async () => {
        try {
            if (userSummary.steamId !== '76561198158912649' && userSummary.steamId !== '76561198999797359') {
                const cooldown = sessionStorage.getItem('cooldown');
                if (cooldown && moment().unix() < cooldown) {
                    return addToast({ description: `Games can be refreshed again at ${moment.unix(cooldown).format('h:mm A')}`, color: 'info' });
                }
            }
            await invoke('delete_games_list_files');
            sessionStorage.setItem('cooldown', moment().add(3, 'minutes').unix());
            setRefreshKey(prevKey => prevKey + 1);
        } catch (error) {
            addToast({ description: `Error in (handleRefetch): ${error?.message || error}`, color: 'danger' });
            console.error('Error in (handleRefetch):', error);
            logEvent(`[Error] in (handleRefetch): ${error}`);
        }
    };

    return { sortStyle, handleSorting, handleRefetch };
};