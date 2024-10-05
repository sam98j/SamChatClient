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
import { ChatTypes } from '@/redux/chats.slice';
import GroupMembersList from '@/components/GroupMembersList';

const ChatProfile = () => {
  // api url
  const apiHost = process.env.NEXT_PUBLIC_API_URL;
  // data from redux store
  const { openedChat, chatMessages } = useSelector(
    (state: RootState) => state.chat,
  );
  // get loggedInUser
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  // chat name
  const chatUser =
    openedChat &&
    openedChat!.members.filter((member) => member._id !== currentUser?._id)[0];
  // chatName
  const chatName =
    chatUser && (openedChat!.name ? openedChat!.name : chatUser!.name);
  // chat avatar
  const [avatar_url, setAvataUrl] = useState('');
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
  // listen for opened chat chanegs
  useEffect(() => {
    // break if no opened chat
    if (!openedChat) return;
    // chatAvatarUrl
    const chatAvatarUrl =
      openedChat?.type === ChatTypes.GROUP
        ? openedChat.avatar
        : chatUser!.avatar;
    // if no avatar
    if (!chatAvatarUrl) return;
    // set avatar url
    setAvataUrl(`${apiHost}${chatAvatarUrl}`);
  }, [openedChat]);
  // component did mount
  useEffect(() => {
    // set current route
    dispatch(setCurrentRoute('chatProfile'));
    // dispatch an async action
    dispatch(
      getChatProfile(params.get('id') as string) as unknown as AnyAction,
    );
    // terminate if no chatMessages
    if (!chatMessages) return;
    // filter chat messages based on message type
    const chatMessagesTypeBased = chatMessages.filter(
      (msg) => msg.type === PHOTO,
    );
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
    const chatMessagesTypeBased = chatMessages.filter(
      (msg) => msg.type === listContentType,
    );
    // set content list
    setContentList(chatMessagesTypeBased);
    // set what kind of messages are displaing now
    setDisplayedMsgsTypes(listContentType);
  };
  return (
    <>
      <Head>
        <title>{`${chatName!} | ${t('profile')}`}</title>
      </Head>
      <div className={styles.chat_profile}>
        {/* chat avatar */}
        <Avatar src={avatar_url} size={'2xl'} />
        {/* name */}
        <Text fontSize={'2xl'} fontWeight={'black'}>
          {chatName}
        </Text>
        {/* chat calls */}
        <ChatCalls />
        {/* group members list */}
        {openedChat?.type === ChatTypes.GROUP ? (
          <GroupMembersList members={openedChat.members} />
        ) : (
          ''
        )}
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
            const {
              content,
              sender,
              voiceNoteDuration,
              fileSize,
              fileName,
              _id,
            } = msg;
            return (
              <Box className={styles.list_content_item} key={_id}>
                {/* display images */}
                {displayedMsgsTypes === PHOTO && <ImageMsgViewer data={msg} />}
                {/* display video */}
                {displayedMsgsTypes === VIDEO && <VideoMsgPlayer data={msg} />}
                {/* display voice notes */}
                {displayedMsgsTypes === VOICENOTE ? (
                  <VoiceMemoPlayer
                    data={{ content, sender, voiceNoteDuration }}
                  />
                ) : (
                  ''
                )}
                {/* display flie */}
                {displayedMsgsTypes === FILE ? (
                  <FileMsgViewer data={{ content, fileName, fileSize }} />
                ) : (
                  ''
                )}
              </Box>
            );
          })}
        </Box>
      </div>
    </>
  );
};

export default ChatProfile;
