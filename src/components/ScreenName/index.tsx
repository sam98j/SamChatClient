/* eslint-disable react/no-unknown-property */
import { Text } from '@chakra-ui/react';
import React from 'react';
import styles from './styles.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ChatUsrActions from '../ChatUsrActions/ChatUsrActions';

const ScreenName = () => {
  // get data from redux store
  const { currentRoute, openedChat } = useSelector((state: RootState) => {
    return { currentRoute: state.system.currentRoute, openedChat: state.chat.openedChat };
  });
  return (
    <div className={styles.screen_name_container} is-chat-open={String(Boolean(openedChat))}>
      {/* Chat Name */}
      {/* do not display screen name when chat profile is opened */}
      <Text className={styles.screen_name} fontSize={'lg'}>
        {currentRoute !== 'chatProfile' ? currentRoute : ''}
      </Text>
      {/* show chatUsrAction only when chat is opened */}
      {openedChat ? <ChatUsrActions /> : ''}
    </div>
  );
};

export default ScreenName;
