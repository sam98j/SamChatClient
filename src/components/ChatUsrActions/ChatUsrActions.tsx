import React from 'react';
import styles from './styles.module.scss';
import { Box } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ChatUserActions } from '@/interfaces/chat.interface';
import RecVoiceInd from '../RecVoiceInd';
import useTranslation from 'next-translate/useTranslation';


const ChatUsrActions = () => {
    // localization
    const { t } = useTranslation('appHeader');
    // get data from redux store
    const {isChatUsrDoingAction, chatUsrStatus, openedChat} = useSelector((state: RootState) => state.chat);
    return (
        <Box
            fontSize={'sm'}
            className={styles.chat_usr_actions}
            is-usr-doing-action={String(isChatUsrDoingAction.action !== null)}
            is-chat-opened={String(Boolean(openedChat))}
        >
            <span className={styles.actions}>
                {isChatUsrDoingAction.action === ChatUserActions.TYPEING ? t('usr_typing') : ''}
                {isChatUsrDoingAction.action === ChatUserActions.RECORDING_VOICE ? <RecVoiceInd /> : ''}
            </span>
            <span className={styles.online}>{chatUsrStatus === 'online' ? t('online') : `${t('last_seen')} ${chatUsrStatus}`}</span>
        </Box>
    );
};

export default ChatUsrActions;