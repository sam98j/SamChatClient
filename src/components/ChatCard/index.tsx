import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Box, SkeletonCircle, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SingleChat, setOpenedChat } from '@/redux/chats.slice';
import { useSelector } from 'react-redux';
import useChatsApi, { ChatPreviewData } from './getData.hook';
import MessageStatusIcon from '../MessageStatus';
import { MessageStatus, MessagesTypes } from '@/interfaces/chat.interface';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/router';
import styles from './styles.module.scss';
import ChatUsrActions from '../ChatUsrActions/ChatUsrActions';
import { useDispatch } from 'react-redux';
import { TimeUnits, getTime } from '@/utils/time';
import VoiceMemoPreview from '../VoiceMemoPreview';
import { shrinkMsg } from '@/utils/chat.util';
import ImagePreview from '../ImagePreview';
import VideoPreview from '../VideoPreview';
import FilePreview from '../FilePreview';

const ChatCard: React.FC<{ chat: SingleChat }> = ({ chat }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // chat avatar
  const [chatAvatar] = useState(() => {
    // check for avatar exist
    if (!chat.avatar) return '';
    return `${apiUrl}${chat.avatar}`;
  });
  // use dispatch
  const dispatch = useDispatch();
  // localize lang
  const { locale } = useRouter();
  // Messages types
  const { TEXT, VOICENOTE, PHOTO, VIDEO, FILE } = MessagesTypes;
  // search params
  const searchParams = useSearchParams();
  // get data from store
  const newIncomingMsg = useSelector((state: RootState) => state.system.newIncomingMsg);
  // get data from store
  const isChatUsrDoingAction = useSelector((state: RootState) => state.chat.isChatUsrDoingAction);
  // handleCardClick
  const handleCardClick = () => dispatch(setOpenedChat(chat));
  // preview data
  const [previewData, setPreveiwData] = useState<ChatPreviewData>();
  // fetch preview data
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
    if (!newIncomingMsg || newIncomingMsg.senderId !== chat._id) return;
    const { date, senderId, content: lastMsgText, fileName, type, status, voiceNoteDuration } = newIncomingMsg;
    // incoming msg date
    const incomingMsgDate = new Date(date);
    setPreveiwData({
      ...previewData,
      senderId,
      lastMsgText,
      type,
      fileName,
      status: status,
      voiceNoteDuration,
      unReadedMsgs: previewData?.unReadedMsgs as number,
      date: `${incomingMsgDate.getHours()}:${incomingMsgDate.getMinutes()}`,
    });
  }, [newIncomingMsg]);
  // componet did mount
  useEffect(() => {
    (async () => {
      const data = await fetchChatPreviewData(chat._id);
      if (!data) return;
      setPreveiwData({ ...data });
    })();
  }, []);
  return (
    <Link href={`/chat?${createQueryString('id', chat._id)}`} onClick={handleCardClick}>
      <Box
        display={'flex'}
        gap={'3'}
        padding={'1.25rem 1.25rem 0rem 1.25rem'}
        pref-lang={locale}
        chat-usr-doing-actions={String(
          Boolean(isChatUsrDoingAction.actionSender === chat._id && isChatUsrDoingAction.action !== null)
        )}
        className={styles.chatCard}
      >
        {/* chat avatar */}
        <Avatar name='Hosam Alden' src={chatAvatar} />
        <Box flexGrow={'1'}>
          {/* chat usr name */}
          <Text fontSize={'md'} marginBottom={'5px'} textColor={'messenger.500'} fontFamily={'"Baloo Bhaijaan 2"'}>
            {chat.name}
          </Text>
          {/* usr actions (usr typing, recording voice) */}
          <Text className={styles.chat_usr_actions}>
            <ChatUsrActions />
          </Text>
          {/* text message field */}
          <Text textColor={'gray.500'} display={'flex'} className={styles.msg_text}>
            {/* message status icons */}
            <MessageStatusIcon
              data={{ msgStatus: previewData?.status as MessageStatus, senderId: previewData?.senderId as string }}
            />
            {/* display text msg  */}
            {previewData && previewData?.type === TEXT ? shrinkMsg(previewData.lastMsgText) : ''}
            {/* display voice message details */}
            {previewData && previewData.type === VOICENOTE ? (
              <VoiceMemoPreview duration={previewData.voiceNoteDuration} />
            ) : (
              ''
            )}
            {/* photo message */}
            {previewData && previewData.type === PHOTO ? <ImagePreview /> : ''}
            {/* video message preview*/}
            {previewData && previewData.type === VIDEO ? <VideoPreview /> : ''}
            {/* file message preview */}
            {previewData && previewData.type === FILE ? <FilePreview fileName={previewData.fileName!} /> : ''}
            {/* loading */}
            {!previewData ? <Box height={'10px'} width={'100%'} bgColor={'gray.100'} borderRadius={'10px'}></Box> : ''}
          </Text>
        </Box>
        <Box>
          {/* loading msg time */}
          <Text width={'fit-content'} textColor={'gray'}>
            {previewData ? (
              getTime(previewData?.date, TimeUnits.time)
            ) : (
              // show skelton loading
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
