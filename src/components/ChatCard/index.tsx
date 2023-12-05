import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Box, Heading, SkeletonCircle, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SingleChat, setOpenedChat } from '@/redux/chats.slice';
import { useSelector } from 'react-redux';
import useChatsApi from './getData.hook';
import useTranslation from 'next-translate/useTranslation';
import { Icon } from '@chakra-ui/icons';
import { BsMic } from 'react-icons/bs';
import { secondsToDurationConverter } from '@/utils/voiceMemoRec';
import MessageStatusIcon from '../MessageStatus';
import { MessageStatus } from '@/interfaces/chat.interface';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/router';
import styles from './styles.module.scss';
import ChatUsrActions from '../ChatUsrActions/ChatUsrActions';
import { useDispatch } from 'react-redux';

const ChatCard: React.FC<{ chat: SingleChat }> = ({ chat }) => {
  // use dispatch
  const dispatch = useDispatch();
  // localize lang
  const { locale } = useRouter();
  const searchParams = useSearchParams();
  // get data from store
  const newIncomingMsg = useSelector((state: RootState) => state.system.newIncomingMsg);
  // get data from store
  const isChatUsrDoingAction = useSelector((state: RootState) => state.chat.isChatUsrDoingAction);
  // handleCardClick
  const handleCardClick = () =>
    dispatch(
      setOpenedChat({
        id: chat.usrid,
        usrname: chat.usrname,
        avatar: chat.avatar,
      })
    );
  const { t } = useTranslation('chatCard');
  const [previewData, setPreveiwData] = useState<{
    date: string;
    lastMsgText: string;
    unReadedMsgs: number;
    isItTextMsg: boolean;
    voiceNoteDuration: string;
    senderId: string;
    status: MessageStatus | null;
  }>();
  const { fetchChatPreviewData } = useChatsApi();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams as unknown as URLSearchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  // listen for the new incoming msg
  useEffect(() => {
    if (!newIncomingMsg || newIncomingMsg.senderId !== chat.usrid) return;
    const { date, senderId, text: lastMsgText, isItTextMsg, status, voiceNoteDuration } = newIncomingMsg;
    // incoming msg date
    const incomingMsgDate = new Date(date);
    setPreveiwData({
      ...previewData,
      senderId,
      lastMsgText,
      isItTextMsg,
      status: status,
      voiceNoteDuration,
      unReadedMsgs: previewData?.unReadedMsgs as number,
      date: `${incomingMsgDate.getHours()}:${incomingMsgDate.getMinutes()}`,
    });
  }, [newIncomingMsg]);
  // componet did mount
  useEffect(() => {
    (async () => {
      const data = await fetchChatPreviewData(chat.usrid);
      if (!data) return;
      setPreveiwData({ ...data });
    })();
  }, []);
  return (
    <Link href={`/chat?${createQueryString('id', chat.usrid)}`} onClick={handleCardClick}>
      <Box
        display={'flex'}
        gap={'3'}
        padding={'1.25rem 1.25rem 0rem 1.25rem'}
        pref-lang={locale}
        chat-usr-doing-actions={String(
          Boolean(isChatUsrDoingAction.actionSender === chat.usrid && isChatUsrDoingAction.action !== null)
        )}
        className={styles.chatCard}
      >
        {/* chat avatar */}
        <Avatar name='Hosam Alden' src={chat.avatar} />
        <Box flexGrow={'1'}>
          {/* chat usr name */}
          <Heading size={'sm'} marginBottom={'5px'} textColor={'messenger.500'}>
            {chat.usrname}
          </Heading>
          {/* usr actions */}
          <Text className={styles.chat_usr_actions}>
            <ChatUsrActions />
          </Text>
          {/* text message field */}
          <Text textColor={'gray.500'} display={'flex'} className={styles.msg_text}>
            {/* message status icons */}
            <MessageStatusIcon
              data={{
                msgStatus: previewData?.status as MessageStatus,
                senderId: previewData?.senderId as string,
              }}
            />
            {/* display text msg  */}
            {previewData && previewData?.isItTextMsg
              ? `${previewData?.lastMsgText.split(' ').slice(0, 6).join(' ')} ...`
              : ''}
            {/* display voice message details */}
            {previewData && !previewData.isItTextMsg ? (
              <>
                <Icon as={BsMic} />
                {t('voiceMsg')} {secondsToDurationConverter(Number(previewData?.voiceNoteDuration))}
              </>
            ) : (
              ''
            )}
            {/* loading */}
            {!previewData ? <Box height={'10px'} width={'100%'} bgColor={'gray.100'} borderRadius={'10px'}></Box> : ''}
          </Text>
        </Box>
        <Box>
          {/* loading msg time */}
          <Text width={'fit-content'}>
            {previewData ? (
              previewData?.date
            ) : (
              <Box height={'10px'} width={'50px'} bgColor={'gray.100'} borderRadius={'10px'}></Box>
            )}
          </Text>
          {/* un readed messages */}
          {previewData && previewData?.unReadedMsgs !== 0 ? (
            <Text
              bgColor={'messenger.500'}
              textColor={'white'}
              width={'1.25rem'}
              height={'1.25rem'}
              borderRadius={'50%'}
              textAlign={'center'}
              className={styles.un_readed_messages_count}
            >
              {previewData?.unReadedMsgs}
            </Text>
          ) : (
            ''
          )}
          {/* loading */}
          {!previewData ? <SkeletonCircle size='5' className={styles.skeleton_circle} /> : ''}
        </Box>
      </Box>
    </Link>
  );
};

export default ChatCard;
