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

const ChatProfile = () => {
  // api url
  const apiHost = process.env.NEXT_PUBLIC_API_URL;
  // content list
  const [contentList, setContentList] = useState<ChatMessage[]>([]);
  // localization
  const { t } = useTranslation('chatProfile');
  // dispatch redux fun
  const dispatch = useDispatch();
  // get route name
  const { chatName, chatPorfile, chatMessages } = useSelector((state: RootState) => {
    return {
      chatName: state.system.currentRoute,
      chatPorfile: state.chat.currentChatPorfile,
      chatMessages: state.chat.chatMessages,
    };
  });
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
    const chatMessagesTypeBased = chatMessages.filter((msg) => msg.type === MessagesTypes.PHOTO);
    setContentList(chatMessagesTypeBased);
  }, []);
  // listContentTypeHandler
  const listContentTypeHandler: MouseEventHandler<HTMLLIElement> = (e) => {
    // terminate if no chatMessages
    if (!chatMessages) return;
    // list content type
    const listContentType = e.currentTarget.id;
    // filter chat messages based on message type
    const chatMessagesTypeBased = chatMessages.filter((msg) => msg.type === listContentType);
    setContentList(chatMessagesTypeBased);
    console.log(chatMessagesTypeBased);
  };
  return (
    <>
      <Head>
        <title>{chatName}</title>
      </Head>
      <Box
        height='calc(100% - 50px)'
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        padding={'30px'}
        gap={5}
        className={styles.chat_profile}
      >
        <Avatar src={chatPorfile?.avatar} size={'2xl'} />
        {/* name */}
        <Text fontSize={'2xl'} fontWeight={'black'} margin={'0'} lineHeight={'0'}>
          {chatPorfile?.name}
        </Text>
        <Text lineHeight={'0'} marginBottom={'10px'} textColor={'gray'}>
          {chatPorfile?.email}
        </Text>
        {/* chat calls */}
        <ChatCalls />
        {/* media links and docs */}
        <List
          display={'flex'}
          gap={2}
          width={'100%'}
          justifyContent={'space-between'}
          alignItems={'center'}
          marginTop={5}
          className={styles.list_content_type_container}
        >
          {/* Content Type media photos, videos */}
          <ListItem
            id={MessagesTypes.PHOTO}
            className={styles.list_content_type}
            is-active={'true'}
            onClick={listContentTypeHandler}
          >
            {t('content_list.media')}
          </ListItem>
          {/* Content type links */}
          <ListItem
            id={'linksId'}
            className={styles.list_content_type}
            is-active={'false'}
            onClick={listContentTypeHandler}
          >
            {t('content_list.links')}
          </ListItem>
          {/* Content type docs */}
          <ListItem
            id={MessagesTypes.FILE}
            className={styles.list_content_type}
            is-active={'false'}
            onClick={listContentTypeHandler}
          >
            {t('content_list.docs')}
          </ListItem>
          {/* voice notes */}
          <ListItem
            id={MessagesTypes.FILE}
            className={styles.list_content_type}
            is-active={'false'}
            onClick={listContentTypeHandler}
          >
            {t('content_list.voice_notes')}
          </ListItem>
        </List>
        {/* list content */}
        <Box display={'flex'} gap={'1'} flexWrap={'wrap'} margin={'5px -20px'} className={styles.list_content}>
          {contentList.map((msg) => (
            <Box className={styles.list_content_item} key={msg._id}>
              <ImageMsgViewer url={apiHost + msg.content} date={msg.date} sendedByMe={true} />
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default ChatProfile;
