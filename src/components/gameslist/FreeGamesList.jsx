import Image from 'next/image';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSteam } from 'react-icons/fa';

import { UserContext } from '@/components/contexts/UserContext';
import ExtLink from '@/components/ui/ExtLink';

export default function FreeGamesList() {
    const { t } = useTranslation();
    const { freeGamesList } = useContext(UserContext);

    const handleImageError = (event) => {
        event.target.src = '/fallback.jpg';
    };

    return (
        <div className='w-calc min-h-calc max-h-calc bg-base overflow-y-auto overflow-x-hidden rounded-tl-xl border-t border-l border-border select-none'>
            <div className='fixed w-[calc(100vw-68px)] z-[50] bg-opacity-90 backdrop-blur-md bg-base pl-4 pt-2 pr-2 rounded-tl-xl'>
                <div className='flex justify-between items-center pb-3'>
                    <div className='flex items-center gap-1'>
                        <div className='flex flex-col justify-center'>
                            <p className='text-lg font-semibold'>
                                {t('freeGames.title')}
                            </p>
                            <div className='flex gap-1'>
                                <p className='text-xs text-altwhite'>
                                    {t('common.showing', { count: freeGamesList.length, total: freeGamesList.length })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-5 2xl:grid-cols-7 gap-4 p-4 pt-2 mt-[60px]'>
                {freeGamesList && freeGamesList.map((item) => (
                    <div key={item.appid} className='relative group'>
                        <div className='aspect-[460/215] rounded-xl overflow-hidden transition-transform duration-200 ease-in-out transform group-hover:scale-105'>
                            <Image
                                src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${item.appid}/header.jpg`}
                                width={460}
                                height={215}
                                alt={`${item.name} image`}
                                priority={true}
                                onError={handleImageError}
                            />
                            <div className='absolute flex items-center justify-evenly inset-0 bg-black bg-opacity-0 dark:bg-opacity-20 group-hover:bg-opacity-40 dark:group-hover:bg-opacity-50 transition-opacity duration-200'>
                                <div className='absolute flex justify-center w-full bottom-0 left-0 px-2 pb-0.5 opacity-0 group-hover:opacity-100 duration-200'>
                                    <p className='text-sm text-offwhite bg-black bg-opacity-50 rounded-sm px-1 select-none truncate'>
                                        {item.name}
                                    </p>
                                </div>
                                <ExtLink href={`https://store.steampowered.com/app/${item.appid}`}>
                                    <div className='flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 hover:scale-105 duration-200'>
                                        <div className='p-2 bg-black text-offwhite bg-opacity-50 hover:bg-black hover:bg-opacity-70 cursor-pointer rounded-lg duration-200'>
                                            <FaSteam className='text-offwhite opacity-0 group-hover:opacity-100 duration-200' fontSize={32} />
                                        </div>
                                    </div>
                                </ExtLink>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}