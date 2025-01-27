import { Fragment, useContext, useState } from 'react';

import { Modal, ModalContent, ModalBody, Button, useDisclosure, ModalFooter, ModalHeader, Select, SelectItem } from '@heroui/react';

import { handleUnlockAll, handleLockAll, handleUpdateAll, handleResetAll } from '@/src/utils/achievements/tabButtonsHandler';
import { sortOptions, handleChange } from '@/src/utils/achievements/pageHeaderHandler';
import { AppContext } from '@/src/components/layout/AppContext';

import { MdSort } from 'react-icons/md';

export default function TabButtons({ initialStatValues, newStatValues, setNewStatValues, btnLoading, setBtnLoading, setIsSorted, userGameAchievementsMap, percentageMap }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [state, setState] = useState('');
    const [type, setType] = useState('');
    const {
        appId,
        appName,
        achievementQueryValue,
        achievementList,
        setAchievementList,
        achievementsUnavailable,
        statisticsUnavailable,
        currentTab
    } = useContext(AppContext);

    const handleSetState = (state, type) => {
        setState(state);
        setType(type);
        onOpen();
    };

    return (
        <Fragment>
            <div className='flex justify-center items-center w-full min-h-8'>
                <div className='flex justify-end w-full'>
                    {!achievementsUnavailable && currentTab === 'achievements' && (
                        <div className='flex items-center gap-2'>
                            <Button
                                size='sm'
                                color='primary'
                                isLoading={btnLoading}
                                isDisabled={!achievementList || achievementQueryValue.length > 0 || currentTab === 'statistics'}
                                className='font-semibold rounded'
                                onPress={() => handleSetState('unlock', 'achievements')}
                            >
                                Unlock all
                            </Button>
                            <Button
                                size='sm'
                                color='danger'
                                isLoading={btnLoading}
                                isDisabled={!achievementList || achievementQueryValue.length > 0}
                                className='font-semibold rounded'
                                onPress={() => handleSetState('lock', 'achievements')}
                            >
                                Lock all
                            </Button>
                        </div>
                    )}
                    {!statisticsUnavailable && currentTab === 'statistics' && (
                        <div className='flex items-center gap-2'>
                            <Button
                                size='sm'
                                color='primary'
                                isLoading={btnLoading}
                                isDisabled={Object.keys(initialStatValues).length === 0}
                                className='font-semibold rounded'
                                onPress={() => handleUpdateAll(appId, appName, initialStatValues, newStatValues, setBtnLoading)}
                            >
                                Save changes
                            </Button>
                            <Button
                                size='sm'
                                color='danger'
                                isLoading={btnLoading}
                                isDisabled={Object.keys(initialStatValues).length === 0}
                                className='font-semibold rounded'
                                onPress={() => handleSetState('reset', 'statistics')}
                            >
                                Reset all
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {!achievementsUnavailable && currentTab === 'achievements' && (
                <Select
                    size='sm'
                    aria-label='sort'
                    isDisabled={achievementQueryValue.length > 0 || achievementsUnavailable || currentTab === 'statistics'}
                    disallowEmptySelection
                    radius='none'
                    startContent={<MdSort fontSize={26} />}
                    items={sortOptions}
                    className='w-[230px]'
                    classNames={{
                        listbox: ['p-0'],
                        value: ['text-sm'],
                        trigger: ['bg-input border border-inputborder data-[hover=true]:!bg-titlebar data-[open=true]:!bg-titlebar duration-100 rounded'],
                        popoverContent: ['bg-base border border-border rounded']
                    }}
                    defaultSelectedKeys={['percent']}
                    onSelectionChange={(e) => { handleChange(e, achievementList, setAchievementList, percentageMap, userGameAchievementsMap, setIsSorted); }}
                >
                    {(item) => <SelectItem classNames={{ title: ['text-sm'], base: ['rounded'] }}>{item.label}</SelectItem>}
                </Select>
            )}

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='bg-container'>
                <ModalContent>
                    {(onClose) => (
                        <Fragment>
                            <ModalHeader className='flex flex-col gap-1 bg-modalheader border-b border-border' data-tauri-drag-region>
                                Confirm
                            </ModalHeader>
                            <ModalBody className='my-4'>
                                <p className='text-sm'>
                                    Are you sure you want to <strong>{state}</strong> all {type}?
                                </p>
                            </ModalBody>
                            <ModalFooter className='border-t border-border bg-footer px-4 py-3'>
                                <Button
                                    size='sm'
                                    color='danger'
                                    variant='light'
                                    className='font-semibold rounded'
                                    onPress={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size='sm'
                                    color='primary'
                                    className='font-semibold rounded'
                                    onPress={
                                        type === 'statistics' ?
                                            () => handleResetAll(appId, setBtnLoading, setNewStatValues, onClose) :
                                            state === 'unlock' ?
                                                () => handleUnlockAll(appId, appName, achievementList, setBtnLoading, onClose) :
                                                () => handleLockAll(appId, appName, achievementList, setBtnLoading, onClose)
                                    }
                                >
                                    Confirm
                                </Button>
                            </ModalFooter>
                        </Fragment>
                    )}
                </ModalContent>
            </Modal>
        </Fragment>
    );
}