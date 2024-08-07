import { getChatProfile } from '@/apis/chats.api';
import ChatCalls from '@/components/ChatCalls';
import { RootState } from '@/redux/store';
import { setCurrentRoute } from '@/redux/system.slice';
import { Avatar, Box, List, ListItem, Text } from '@chakra-ui/react';
import { AnyAction } from '@reduxjs/toolkit';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';
import React, { MouseEventHandler, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import styles from './styles.module.scss';
import { ChatMessage, MessagesTypes } from '@/interfaces/chat.interface';
import useTranslation from 'next-translate/useTranslation';
import ImageMsgViewer from '@/components/ImageMsgViewer';
import VideoMsgPlayer from '@/components/VideoMsgPlayer';
import VoiceMemoPlayer from '@/components/VoiceMemoPlayer';
import FileMsgViewer from '@/components/FileMsgViewer';

const ChatProfile = () => {
  // api url
  const apiHost = process.env.NEXT_PUBLIC_API_URL;
  // data from redux store
  const { chatPorfile, chatMessages } = useSelector((state: RootState) => {
    return {
      chatPorfile: state.chat.currentChatPorfile,
      chatMessages: state.chat.chatMessages,
    };
  });
  // chat avatar
  const [avatar_url] = useState(() => {
    // check for avatar exist
    if (!chatPorfile?.avatar) return '';
    return `${apiHost}${chatPorfile.avatar}`;
  });
  // destruct messages  types
  const { VIDEO, PHOTO, FILE, VOICENOTE } = MessagesTypes;
  // what kind of messages has been displayed
  const [displayedMsgsTypes, setDisplayedMsgsTypes] = useState(PHOTO);
  // content list
  const [contentList, setContentList] = useState<ChatMessage[]>([]);
  // localization
  const { t } = useTranslation('chatProfile');
  // dispatch redux fun
  const dispatch = useDispatch();
  // url query params
  const params = useSearchParams();
  // component did mount
  useEffect(() => {
    // set current route
    dispatch(setCurrentRoute('chatProfile'));
    // dispatch an async action
    dispatch(getChatProfile(params.get('id') as string) as unknown as AnyAction);
    // terminate if no chatMessages
    if (!chatMessages) return;
    // filter chat messages based on message type
    const chatMessagesTypeBased = chatMessages.filter((msg) => msg.type === PHOTO);
    // set content list
    setContentList(chatMessagesTypeBased);
  }, []);
  // listContentTypeHandler
  const listContentTypeHandler: MouseEventHandler<HTMLLIElement> = (e) => {
    // terminate if no chatMessages
    if (!chatMessages) return;
    // list content type
    const listContentType = e.currentTarget.id as MessagesTypes;
    // filter chat messages based on message type
    const chatMessagesTypeBased = chatMessages.filter((msg) => msg.type === listContentType);
    // set content list
    setContentList(chatMessagesTypeBased);
    // set what kind of messages are displaing now
    setDisplayedMsgsTypes(listContentType);
  };
  return (
    <>
      <Head>
        <title>{`${chatPorfile?.name} | ${t('profile')}`}</title>
      </Head>
      <div className={styles.chat_profile}>
        {/* chat avatar */}
        <Avatar src={avatar_url} size={'2xl'} />
        {/* name */}
        <Text fontSize={'2xl'} fontWeight={'black'}>
          {chatPorfile?.name}
        </Text>
        {/* chat email */}
        <Text marginBottom={'10px'} textColor={'gray'}>
          {chatPorfile?.email}
        </Text>
        {/* chat calls */}
        <ChatCalls />
        {/* media links and docs */}
        <List className={styles.list_content_type_container}>
          {/* Content Type media photos, videos */}
          <ListItem
            id={PHOTO}
            className={styles.list_content_type}
            is-active={displayedMsgsTypes === PHOTO ? 'true' : 'false'}
            onClick={listContentTypeHandler}
          >
            {t('content_list.photos')}
          </ListItem>
          {/* video */}
          <ListItem
            id={VIDEO}
            className={styles.list_content_type}
            is-active={displayedMsgsTypes === VIDEO ? 'true' : 'false'}
            onClick={listContentTypeHandler}
          >
            {t('content_list.video')}
          </ListItem>
          {/* Content type docs */}
          <ListItem
            id={FILE}
            is-active={displayedMsgsTypes === FILE ? 'true' : 'false'}
            className={styles.list_content_type}
            onClick={listContentTypeHandler}
          >
            {t('content_list.docs')}
          </ListItem>
          {/* voice notes */}
          <ListItem
            id={VOICENOTE}
            className={styles.list_content_type}
            is-active={displayedMsgsTypes === VOICENOTE ? 'true' : 'false'}
            onClick={listContentTypeHandler}
          >
            {t('content_list.voice_notes')}
          </ListItem>
        </List>
        {/* list content */}
        <Box className={styles.list_content} msgs-type={displayedMsgsTypes}>
          {/* loop throwght content list it maybe PHOTS, FILE, Video */}
          {contentList.map((msg) => {
            // destruct message
            const { content, sender, date, voiceNoteDuration, fileSize, fileName, _id } = msg;
            return (
              <Box className={styles.list_content_item} key={_id}>
                {/* display images */}
                {displayedMsgsTypes === PHOTO ? <ImageMsgViewer data={{ content, sender, date, _id }} /> : ''}
                {/* display video */}
                {displayedMsgsTypes === VIDEO ? <VideoMsgPlayer data={{ content, sender, date, _id }} /> : ''}
                {/* display voice notes */}
                {displayedMsgsTypes === VOICENOTE ? <VoiceMemoPlayer data={{ content, sender, voiceNoteDuration }} /> : ''}
                {/* display flie */}
                {displayedMsgsTypes === FILE ? <FileMsgViewer data={{ content, fileName, fileSize }} /> : ''}
              </Box>
            );
          })}
        </Box>
      </div>
    </>
  );
};

export default ChatProfile;
