import { Button } from '@heroui/react';
import Image from 'next/image';
import { useContext, useState, useEffect, useRef } from 'react';
import { TbCheck } from 'react-icons/tb';

import { StateContext } from '@/components/contexts/StateContext';
import { useAchievementUnlocker } from '@/hooks/automation/useAchievementUnlocker';
import { stopIdle } from '@/utils/global/idle';

export default function AchievementUnlocker({ activePage }) {
    const { isDarkMode, setIsAchievementUnlocker } = useContext(StateContext);

    const isMountedRef = useRef(true);
    const abortControllerRef = useRef(new AbortController());

    const [imageSrc, setImageSrc] = useState('');
    const [isInitialDelay, setIsInitialDelay] = useState(true);
    const [currentGame, setCurrentGame] = useState({});
    const [isComplete, setIsComplete] = useState(false);
    const [achievementCount, setAchievementCount] = useState(0);
    const [countdownTimer, setCountdownTimer] = useState('00:00:10');
    const [isWaitingForSchedule, setIsWaitingForSchedule] = useState('');

    useEffect(() => {
        setImageSrc(isDarkMode ?
            'https://raw.githubusercontent.com/zevnda/steam-game-idler/refs/heads/main/public/dbg.webp'
            : 'https://raw.githubusercontent.com/zevnda/steam-game-idler/refs/heads/main/public/lbg.webp');
    }, [isDarkMode]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useAchievementUnlocker(
            isInitialDelay,
            setIsInitialDelay,
            setCurrentGame,
            setIsComplete,
            setAchievementCount,
            setCountdownTimer,
            setIsWaitingForSchedule,
            isMountedRef,
            abortControllerRef
        );

        const abortController = abortControllerRef.current;

        return () => {
            isMountedRef.current = false;
            abortController.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={`${activePage !== 'customlists/achievement-unlocker' && 'hidden'} absolute top-12 left-14 bg-base z-50 rounded-tl-xl border-t border-l border-border`}>
            <div className='relative flex justify-evenly items-center flex-col p-4 w-calc h-calc'>
                {imageSrc && (
                    <Image
                        src={imageSrc}
                        className='absolute top-0 left-0 w-full h-full object-cover rounded-tl-xl'
                        alt='background'
                        width={1920}
                        height={1080}
                        priority
                    />
                )}
                <div className='absolute bg-base/10 backdrop-blur-[10px] w-full h-full rounded-tl-xl' />

                <div className='flex items-center flex-col gap-6 z-10 backdrop-blur-md bg-base/20 p-8 border border-border/40 rounded-lg'>
                    <p className='text-3xl font-semibold'>
                        Achievement Unlocker
                    </p>

                    {isWaitingForSchedule && (
                        <p className='text-sm text-yellow-400'>
                            Achievement unlocking paused due to being outside of the scheduled time and will resume again once inside the scheduled time
                        </p>
                    )}

                    {isComplete && (
                        <div className='border border-border rounded-full inline-block p-2 w-fit'>
                            <TbCheck className='text-green-400' fontSize={50} />
                        </div>
                    )}

                    {isInitialDelay && (
                        <p className='text-sm'>
                            Starting in <span className='font-bold text-sm text-dynamic'>{countdownTimer}</span>
                        </p>
                    )}

                    {!isInitialDelay && !isComplete && !isWaitingForSchedule && (
                        <>
                            <p>
                                Unlocking <span className='font-bold text-dynamic'>{achievementCount}</span> achievement(s) for <span className='font-bold text-dynamic'>{currentGame.name}</span>
                            </p>

                            <p className='text-sm'>
                                Next unlock in <span className='font-bold text-sm text-dynamic'>{countdownTimer}</span>
                            </p>
                        </>
                    )}

                    <Button
                        size='sm'
                        color='danger'
                        className='min-h-[30px] font-semibold rounded-lg'
                        onPress={() => {
                            setIsAchievementUnlocker(false);
                            stopIdle(currentGame.appid, currentGame.name);
                        }}
                    >
                        {isComplete ? <p>Close</p> : <p>Stop</p>}
                    </Button>
                </div>
            </div>
        </div>
    );
}