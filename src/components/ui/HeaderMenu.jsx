import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { invoke } from '@tauri-apps/api/core';
import { relaunch } from '@tauri-apps/plugin-process';
import { check } from '@tauri-apps/plugin-updater';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TbBookFilled, TbBugFilled, TbBulbFilled, TbDownload, TbLayoutNavbarExpand, TbListCheck, TbStarFilled } from 'react-icons/tb';

import { UpdateContext } from '@/components/contexts/UpdateContext';
import ExtLink from '@/components/ui/ExtLink';
import { logEvent } from '@/utils/tasks';
import { fetchLatest, preserveKeysAndClearData } from '@/utils/tasks';
import { showDangerToast, showPrimaryToast } from '@/utils/toasts';

export default function HeaderMenu() {
    const { t } = useTranslation();
    const { setShowChangelog } = useContext(UpdateContext);
    const [showMenu, setShowMenu] = useState(false);

    const handleUpdate = async () => {
        try {
            const update = await check();
            if (update?.available) {
                localStorage.setItem('hasUpdated', 'true');
                await invoke('kill_all_steamutil_processes');
                const latest = await fetchLatest();
                await update.downloadAndInstall();
                if (latest?.major) {
                    await preserveKeysAndClearData();
                }
                await relaunch();
            } else {
                showPrimaryToast(t('toast.checkUpdate.none'));
            }
        } catch (error) {
            showDangerToast(t('toast.checkUpdate.error'));
            console.error('Error in (handleUpdate):', error);
            logEvent(`Error in (handleUpdate): ${error}`);
        }
    };

    return (

        <Dropdown backdrop='opaque' onOpenChange={() => setShowMenu(!showMenu)} classNames={{ content: ['rounded-lg p-0 bg-titlebar border border-border'] }}>
            <DropdownTrigger>
                <div className={`flex items-center p-2 hover:bg-titlehover rounded-full cursor-pointer active:scale-90 relative duration-200 ${showMenu && 'bg-titlehover'}`}>
                    <TbLayoutNavbarExpand fontSize={20} />
                </div>
            </DropdownTrigger>
            <DropdownMenu aria-label='Settings actions' className='text-content'>
                <DropdownItem showDivider key='help' startContent={<TbBookFilled size={18} />} className='rounded p-1' textValue='Help' classNames={{ base: ['data-[hover=true]:!bg-titlehover data-[hover=true]:!text-content'] }}>
                    <ExtLink href='https://steamgameidler.vercel.app/' className='flex text-sm w-full'>
                        {t('menu.guide')}
                    </ExtLink>
                </DropdownItem>
                <DropdownItem key='report' startContent={<TbBugFilled size={18} />} className='rounded p-1' textValue='Report an issue' classNames={{ base: ['data-[hover=true]:!bg-titlehover data-[hover=true]:!text-content'] }}>
                    <ExtLink href='https://github.com/zevnda/steam-game-idler/issues/new?assignees=zevnda&labels=bug%2Cinvestigating&projects=&template=issue_report.yml&title=Title' className='flex text-sm w-full'>
                        {t('menu.issue')}
                    </ExtLink>
                </DropdownItem>
                <DropdownItem showDivider key='feature' startContent={<TbBulbFilled size={18} />} className='rounded p-1' textValue='Feature request' classNames={{ base: ['data-[hover=true]:!bg-titlehover data-[hover=true]:!text-content'] }}>
                    <ExtLink href='https://github.com/zevnda/steam-game-idler/issues/new?assignees=zevnda&labels=feature+request&projects=&template=feature_request.yml&title=Title' className='flex text-sm w-full'>
                        {t('menu.feature')}
                    </ExtLink>
                </DropdownItem>
                <DropdownItem showDivider key='support-me' startContent={<TbStarFilled size={18} />} className='rounded p-1' textValue='Support me' classNames={{ base: ['data-[hover=true]:!bg-titlehover data-[hover=true]:!text-content'] }}>
                    <ExtLink href='https://github.com/sponsors/zevnda' className='flex text-sm w-full'>
                        {t('menu.support')}
                    </ExtLink>
                </DropdownItem>
                <DropdownItem key='changelog' startContent={<TbListCheck size={18} />} className='rounded p-1' textValue='Changelog' onPress={() => setShowChangelog(true)} classNames={{ base: ['data-[hover=true]:!bg-titlehover data-[hover=true]:!text-content'] }}>
                    {t('menu.changelog')}
                </DropdownItem>
                <DropdownItem key='updates' startContent={<TbDownload size={18} />} className='rounded p-1' textValue='Check for updates' onPress={handleUpdate} classNames={{ base: ['data-[hover=true]:!bg-titlehover data-[hover=true]:!text-content'] }}>
                    <p className='flex  w-full'>
                        {t('menu.update')}
                    </p>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}