import { getAppVersion } from '@/src/utils/settings/settingsHandler';
import { Button } from '@heroui/react';
import { invoke } from '@tauri-apps/api/tauri';
import { Fragment } from 'react';
import { toast } from 'react-toastify';

export default function ExportSettings() {
    const exportSettings = async () => {
        const allSettings = {};

        const version = await getAppVersion(toast);
        allSettings['version'] = version;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (
                key === 'userSummary' ||
                key === 'steamCookies' ||
                key === 'apiKey' ||
                key === 'cachedNotifications' ||
                key === 'seenNotifications' ||
                key === 'ally-supports-cache'
            ) continue;
            const value = localStorage.getItem(key);
            try {
                allSettings[key] = JSON.parse(value);
            } catch (e) {
                allSettings[key] = value;
            }
        }
        const allSettingsString = JSON.stringify(allSettings, null, 2);
        navigator.clipboard.writeText(`\`\`\`json\n${allSettingsString}\n\`\`\``).then(() => {
            toast.success('Data copied to clipboard');
        }).catch(() => {
            toast.error('Error exporting data');
        });
    };

    return (
        <Fragment>
            <Button
                size='sm'
                color='primary'
                className='font-semibold rounded'
                onPress={exportSettings}
            >
                Export Data
            </Button>
        </Fragment>
    );
}