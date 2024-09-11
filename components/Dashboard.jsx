import React, { useEffect, useState } from 'react';
import Header from './Header';
import GamesList from './gameslist/GamesList';
import SideBar from './SideBar';
import Settings from './settings/Settings';
import CardFarming from './automation/CardFarming';
import Achievements from './achievements/Achievements';
import AchievementUnlocker from './automation/AchievementUnlocker';
import { antiAwayStatus } from '@/utils/utils';
import FreeGamesList from './gameslist/FreeGamesList';

export default function Dashboard({ userSummary, setUserSummary, setInitUpdate, setUpdateManifest, showFreeGamesTab, freeGamesList }) {
    const [activePage, setActivePage] = useState('games');
    const [appId, setAppId] = useState(null);
    const [appName, setAppName] = useState(null);
    const [showAchievements, setShowAchievements] = useState(false);
    const [isQuery, setIsQuery] = useState(false);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        antiAwayStatus();
    }, []);

    return (
        <React.Fragment>
            <Header userSummary={userSummary} inputValue={inputValue} setInputValue={setInputValue} setIsQuery={setIsQuery} />

            <div className='flex w-full'>
                {showAchievements ? (
                    <Achievements steamId={userSummary.steamId} appId={appId} appName={appName} setShowAchievements={setShowAchievements} isQuery={isQuery} />
                ) : activePage === 'games' ? (
                    <React.Fragment>
                        <SideBar setUserSummary={setUserSummary} activePage={activePage} setActivePage={setActivePage} showFreeGamesTab={showFreeGamesTab} />
                        <GamesList
                            steamId={userSummary.steamId}
                            inputValue={inputValue}
                            isQuery={isQuery}
                            setActivePage={setActivePage}
                            setAppId={setAppId}
                            setAppName={setAppName}
                            showAchievements={showAchievements}
                            setShowAchievements={setShowAchievements}
                        />
                    </React.Fragment>
                ) : activePage === 'freeGames' ? (
                    <React.Fragment>
                        <SideBar setUserSummary={setUserSummary} activePage={activePage} setActivePage={setActivePage} showFreeGamesTab={showFreeGamesTab} />
                        <FreeGamesList freeGamesList={freeGamesList} />
                    </React.Fragment>
                ) : activePage === 'settings' ? (
                    <React.Fragment>
                        <SideBar setUserSummary={setUserSummary} activePage={activePage} setActivePage={setActivePage} showFreeGamesTab={showFreeGamesTab} />
                        <Settings setInitUpdate={setInitUpdate} setUpdateManifest={setUpdateManifest} />
                    </React.Fragment>
                ) : activePage === 'card-farming' ? (
                    <CardFarming setActivePage={setActivePage} />
                ) : (
                    <AchievementUnlocker setActivePage={setActivePage} />
                )}
            </div>
        </React.Fragment>
    );
}