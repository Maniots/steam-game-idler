import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { logEvent } from '@/utils/utils';
import { toast } from 'react-toastify';

export default function Logs() {
    const [logs, setLogs] = useState([]);
    const [logPath, setLogPath] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            if (typeof window !== 'undefined' && window.__TAURI__) {
                try {
                    const fullLogPath = await invoke('get_app_log_dir');
                    const logContents = await window.__TAURI__.fs.readTextFile(`${fullLogPath}\\log.txt`);
                    const logEntries = logContents.split('\n').filter(entry => entry.trim() !== '').map(entry => {
                        const [timestamp, message] = entry.split(' + ');
                        return { timestamp, message };
                    });
                    setLogs(logEntries);
                    setLogPath(`${fullLogPath}\\log.txt`);
                } catch (error) {
                    toast.error(`Error in (fetchLogs): ${error?.message}`);
                    console.error('Error in (fetchLogs):', error);
                    logEvent(`[Error] in (fetchLogs): ${error}`);
                }
            }
        };
        fetchLogs();
        const intervalId = setInterval(fetchLogs, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const handleOpenLogFile = async () => {
        try {
            await invoke('open_file_explorer', { path: logPath });
        } catch (error) {
            toast.error(`Error in (handleOpenLogFile): ${error?.message}`);
            console.error('Error in (handleOpenLogFile):', error);
            logEvent(`[Error] in (handleOpenLogFile): ${error}`);
        }
    };

    return (
        <React.Fragment>
            <div className='p-2'>
                <div className='mb-2'>
                    <p className='text-xs font-mono text-blue-400 cursor-pointer w-fit' onClick={handleOpenLogFile}>
                        Open in File Explorer
                    </p>
                </div>
                <div className='bg-container border border-border font-mono text-xs rounded min-h-[200px] max-h-[calc(100vh-260px)] overflow-y-auto'>
                    <table className='w-full border-collapse'>
                        <thead className='sticky top-0 z-10'>
                            <tr className='border-b border-border bg-[#dedede] dark:bg-base'>
                                <th className='text-left p-1.5 w-[200px]'>Time</th>
                                <th className='text-left p-1.5'>Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length > 0 ? (
                                <React.Fragment>
                                    {logs.map((log, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-container' : 'bg-[#f1f1f1] dark:bg-[#1a1a1a]'}>
                                            <td className='p-1.5 text-sgi uppercase'>{log.timestamp}</td>
                                            <td className={`p-1.5 ${log.message?.includes('Error') && 'text-red-400'}`}>
                                                {log.message}
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ) : (
                                <tr className='bg-container'>
                                    <td className='p-1.5 text-sgi uppercase'>-</td>
                                    <td className='p-1.5'>No logs created yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </React.Fragment>
    );
}