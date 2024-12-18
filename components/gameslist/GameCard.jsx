import React, { useState } from 'react';
import Image from 'next/image';
import CardMenu from './CardMenu';
import Loader from '../Loader';
import { IoPlay } from 'react-icons/io5';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { startIdler, logEvent } from '@/utils/utils';
import { FaAward } from 'react-icons/fa';

export default function GameCard({ gameList, favorites, cardFarming, achievementUnlocker, autoIdle, setFavorites, setAchievementUnlocker, setCardFarming, setAutoIdle, showAchievements, setShowAchievements, setAppId, setAppName }) {
    const [isLoading, setIsLoading] = useState(true);

    setTimeout(() => {
        setIsLoading(false);
    }, 100);

    const handleIdle = async (item) => {
        try {
            const idleStatus = await startIdler(item.appid, item.name);
            if (idleStatus) {
                toast.success(`Started idling ${item.name}`);
            } else {
                toast.error('Steam is not running');
            }
        } catch (error) {
            console.error('Error in (handleIdle):', error);
            logEvent(`[Error] in (handleIdle): ${error}`);
        }
    };

    const viewAchievments = (item) => {
        setAppId(item.appid);
        setAppName(item.name);
        setShowAchievements(!showAchievements);
    };

    const viewStorePage = async (item) => {
        if (typeof window !== 'undefined' && window.__TAURI__) {
            try {
                await window.__TAURI__.shell.open(`https://store.steampowered.com/app/${item.appid}`);
            } catch (error) {
                console.error('Failed to open link:', error);
            }
        }
    };

    const addToFavorites = (e, item) => {
        e.stopPropagation();
        setTimeout(() => {
            try {
                let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                favorites.push(JSON.stringify(item));
                localStorage.setItem('favorites', JSON.stringify(favorites));
                const newFavorites = (localStorage.getItem('favorites') && JSON.parse(localStorage.getItem('favorites'))) || [];
                toast.success(`${item.name} added to favorites`, { autoClose: true });
                setFavorites(newFavorites.map(JSON.parse));
                logEvent(`[Favorites] Added ${item.name} (${item.appid})`);
            } catch (error) {
                console.error('Error in (addToFavorites):', error);
                logEvent(`[Error] in (addToFavorites): ${error}`);
            }
        }, 500);
    };

    const removeFromFavorites = (e, item) => {
        e.stopPropagation();
        setTimeout(() => {
            try {
                const favorites = (localStorage.getItem('favorites') && JSON.parse(localStorage.getItem('favorites'))) || [];
                const updatedFavorites = favorites.filter(arr => JSON.parse(arr).appid !== item.appid);
                localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
                const newFavorites = (localStorage.getItem('favorites') && JSON.parse(localStorage.getItem('favorites'))) || [];
                toast.success(`${item.name} removed from favorites`, { autoClose: true });
                setFavorites(newFavorites.map(JSON.parse));
                logEvent(`[Favorites] Removed ${item.name} (${item.appid})`);
            } catch (error) {
                console.error('Error in (removeFromFavorites):', error);
                logEvent(`[Error] in (removeFromFavorites): ${error}`);
            }
        }, 500);
    };

    const addToCardFarming = (e, item) => {
        e.stopPropagation();
        setTimeout(() => {
            try {
                let cardFarming = JSON.parse(localStorage.getItem('cardFarming')) || [];
                cardFarming.push(JSON.stringify(item));
                localStorage.setItem('cardFarming', JSON.stringify(cardFarming));
                const newCardFarming = (localStorage.getItem('cardFarming') && JSON.parse(localStorage.getItem('cardFarming'))) || [];
                toast.success(`${item.name} added to card farming`, { autoClose: true });
                setCardFarming(newCardFarming.map(JSON.parse));
                logEvent(`[Card Farming] Added ${item.name} (${item.appid})`);
            } catch (error) {
                console.error('Error in (addToCardFarming):', error);
                logEvent(`[Error] in (addToCardFarming): ${error}`);
            }
        }, 500);
    };

    const removeFromCardFarming = (e, item) => {
        e.stopPropagation();
        setTimeout(() => {
            try {
                const cardFarming = (localStorage.getItem('cardFarming') && JSON.parse(localStorage.getItem('cardFarming'))) || [];
                const updatedCardFarming = cardFarming.filter(arr => JSON.parse(arr).appid !== item.appid);
                localStorage.setItem('cardFarming', JSON.stringify(updatedCardFarming));
                const newCardFarming = (localStorage.getItem('cardFarming') && JSON.parse(localStorage.getItem('cardFarming'))) || [];
                toast.success(`${item.name} removed from card farming`, { autoClose: true });
                setCardFarming(newCardFarming.map(JSON.parse));
                logEvent(`[Card Farming] Removed ${item.name} (${item.appid})`);
            } catch (error) {
                console.error('Error in (removeFromCardFarming):', error);
                logEvent(`[Error] in (removeFromCardFarming): ${error}`);
            }
        }, 500);
    };

    const addToAchievementUnlocker = (e, item) => {
        e.stopPropagation();
        setTimeout(() => {
            try {
                let achievementUnlocker = JSON.parse(localStorage.getItem('achievementUnlocker')) || [];
                achievementUnlocker.push(JSON.stringify(item));
                localStorage.setItem('achievementUnlocker', JSON.stringify(achievementUnlocker));
                const newAchievementUnlocker = (localStorage.getItem('achievementUnlocker') && JSON.parse(localStorage.getItem('achievementUnlocker'))) || [];
                toast.success(`${item.name} added to achievement unlocker`, { autoClose: true });
                setAchievementUnlocker(newAchievementUnlocker.map(JSON.parse));
                logEvent(`[Achievement Unlocker] Added ${item.name} (${item.appid})`);
            } catch (error) {
                console.error('Error in (addToAchievementUnlocker):', error);
                logEvent(`[Error] in (addToAchievementUnlocker): ${error}`);
            }
        }, 500);
    };

    const removeFromAchievementUnlocker = (e, item) => {
        e.stopPropagation();
        setTimeout(() => {
            try {
                const achievementUnlocker = (localStorage.getItem('achievementUnlocker') && JSON.parse(localStorage.getItem('achievementUnlocker'))) || [];
                const updatedAchievementUnlocker = achievementUnlocker.filter(arr => JSON.parse(arr).appid !== item.appid);
                localStorage.setItem('achievementUnlocker', JSON.stringify(updatedAchievementUnlocker));
                const newAchievementUnlocker = (localStorage.getItem('achievementUnlocker') && JSON.parse(localStorage.getItem('achievementUnlocker'))) || [];
                toast.success(`${item.name} removed from achievement unlocker`, { autoClose: true });
                setAchievementUnlocker(newAchievementUnlocker.map(JSON.parse));
                logEvent(`[Achievement Unlocker] Removed ${item.name} (${item.appid})`);
            } catch (error) {
                console.error('Error in (removeFromAchievementUnlocker):', error);
                logEvent(`[Error] in (removeFromAchievementUnlocker): ${error}`);
            }
        }, 500);
    };

    const addToAutoIdle = (e, item) => {
        e.stopPropagation();
        setTimeout(() => {
            try {
                let autoIdle = (localStorage.getItem('autoIdle') && JSON.parse(localStorage.getItem('autoIdle'))) || [];
                if (autoIdle.length < 32) {
                    autoIdle.push(JSON.stringify(item));
                    localStorage.setItem('autoIdle', JSON.stringify(autoIdle));
                    const newAutoIdle = (localStorage.getItem('autoIdle') && JSON.parse(localStorage.getItem('autoIdle'))) || [];
                    toast.success(`${item.name} added to auto idle`, { autoClose: true });
                    setAutoIdle(newAutoIdle.map(JSON.parse));
                    logEvent(`[Auto Idle] Added ${item.name} (${item.appid})`);
                } else {
                    return toast.error('A max of 32 games can be added to auto idler', { autoClose: true });
                }
            } catch (error) {
                console.error('Error in (addToAutoIdle):', error);
                logEvent(`[Error] in (addToAutoIdle): ${error}`);
            }
        }, 500);
    };

    const removeFromAutoIdle = (e, item) => {
        e.stopPropagation();
        setTimeout(() => {
            try {
                const autoIdle = (localStorage.getItem('autoIdle') && JSON.parse(localStorage.getItem('autoIdle'))) || [];
                const updatedAutoIdle = autoIdle.filter(arr => JSON.parse(arr).appid !== item.appid);
                localStorage.setItem('autoIdle', JSON.stringify(updatedAutoIdle));
                const newAutoIdle = (localStorage.getItem('autoIdle') && JSON.parse(localStorage.getItem('autoIdle'))) || [];
                toast.success(`${item.name} removed from auto idle`, { autoClose: true });
                setAutoIdle(newAutoIdle.map(JSON.parse));
                logEvent(`[Auto Idle] Removed ${item.name} (${item.appid})`);
            } catch (error) {
                console.error('Error in (removeFromAutoIdle):', error);
                logEvent(`[Error] in (removeFromAutoIdle): ${error}`);
            }
        }, 500);
    };

    if (isLoading) return <Loader />;

    return (
        <React.Fragment>
            <div className='grid grid-cols-5 2xl:grid-cols-7 gap-4'>
                {gameList && gameList.map((item) => (
                    <div key={item.appid} className='relative group'>
                        <div className='aspect-[460/215] rounded-lg overflow-hidden transition-transform duration-200 ease-in-out transform group-hover:scale-105'>
                            <Image
                                src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${item.appid || item?.game?.id}/header.jpg`}
                                width={460}
                                height={215}
                                alt={`${item.name} image`}
                                priority={true}
                            />
                            <div className='absolute flex items-center justify-evenly inset-0 bg-black bg-opacity-0 dark:bg-opacity-20 group-hover:bg-opacity-40 dark:group-hover:bg-opacity-50 transition-opacity duration-200'>
                                <div className='absolute flex justify-center w-full bottom-0 left-0 px-2 pb-0.5 opacity-0 group-hover:opacity-100 duration-200'>
                                    <p className='text-xs text-offwhite bg-black bg-opacity-50 rounded-sm px-1 select-none truncate'>
                                        {item.name}
                                    </p>
                                </div>
                                <div className='flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 hover:scale-105 duration-200 group/two' onClick={() => handleIdle(item)}>
                                    <div className='p-2 bg-black text-offwhite bg-opacity-50 hover:bg-black hover:bg-opacity-70 cursor-pointer rounded duration-200'>
                                        <IoPlay className='text-offwhite opacity-0 group-hover:opacity-100 duration-200 group-hover/two:text-sgi' fontSize={36} />
                                    </div>
                                </div>

                                <div className='flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 hover:scale-105 duration-200 group/three' onClick={() => viewAchievments(item)}>
                                    <div className='p-2 bg-black text-offwhite bg-opacity-50 hover:bg-black hover:bg-opacity-70 cursor-pointer rounded duration-200'>
                                        <FaAward className='text-offwhite opacity-0 group-hover:opacity-100 duration-200 group-hover/three:text-sgi' fontSize={36} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                            <CardMenu
                                item={item}
                                favorites={favorites}
                                cardFarming={cardFarming}
                                achievementUnlocker={achievementUnlocker}
                                autoIdle={autoIdle}
                                handleIdle={handleIdle}
                                viewAchievments={viewAchievments}
                                viewStorePage={viewStorePage}
                                addToFavorites={addToFavorites}
                                removeFromFavorites={removeFromFavorites}
                                addToCardFarming={addToCardFarming}
                                removeFromCardFarming={removeFromCardFarming}
                                addToAchievementUnlocker={addToAchievementUnlocker}
                                removeFromAchievementUnlocker={removeFromAchievementUnlocker}
                                addToAutoIdle={addToAutoIdle}
                                removeFromAutoIdle={removeFromAutoIdle}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </React.Fragment>
    );
}