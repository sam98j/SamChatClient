/* eslint-disable react/no-unknown-property */

import { RootState } from '@/redux/store';
import { ChevronLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ChatCard from '../ChatCard';
import { Button, Spinner } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { setMessagesToBeForwared } from '@/redux/chats.slice';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import styles from './styles.module.scss';
import SearchInput from '../SearchInput/SearchInput';
import { setSystemNotification } from '@/redux/system.slice';

const ForwardMsgMenu = () => {
  const { chats, messagesToBeForwared } = useSelector(
    (state: RootState) => state.chat,
  );
  // translate message
  const { t } = useTranslation('chatScreen');
  // is loading
  const [isLoading, setIsLoading] = useState(false);
  // dispatch redux function
  const dispatch = useDispatch();
  // lang
  const { locale } = useRouter();
  // selected chats
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  // is forward btn disabled
  const [isForwardBtnDisabled, setIsForwardBtnDisabled] = useState(
    Boolean(selectedChats.length === 0),
  );
  // TODO: need to erase un nessesery rerendering
  // selected chats lenght observer
  useEffect(() => {
    setIsForwardBtnDisabled(selectedChats.length === 0);
  }, [selectedChats]);
  // component mount
  useEffect(() => {
    return function cleanUp() {
      dispatch(
        setSystemNotification({
          err: false,
          msg: t('forwardMessageMenu.forwardDoneAlert'),
        }),
      );
    };
  }, []);
  // forward message btn handler
  const forwardMessageBtnHandler = () => {
    // make loading
    setIsLoading(true);
    setIsForwardBtnDisabled(true);
    const { messages } = messagesToBeForwared!;
    dispatch(setMessagesToBeForwared({ messages, chats: selectedChats }));
    console.log('clicked');
  };
  // ui
  return (
    <div
      id={styles.forward_menu}
      className="h-full bg-white flex absolute w-full top-0 left-0 z-10 p-3 flex-col"
      pref-lang={locale}
    >
      {/* header */}
      <div className="forward__msg__header flex items-center gap-2 mb-5">
        <ChevronLeft color="dodgerblue" className={styles.back_arrow_icon} />
        <span className="flex-grow">{t('forwardMessageMenu.forwardTo')}</span>
      </div>
      <SearchInput data={{ loadingState: false, handleFormChange: () => {} }} />
      {/* title */}
      <p className="mt-5 text-gray-500 text-sm">
        {t('forwardMessageMenu.selectChatsToForward')}
      </p>
      {/* chats */}
      <div className="flex-grow overflow-y-scroll overflow-x-hidden mx-[-0.75rem] p-3">
        {chats?.map((chat) => (
          <ChatCard key={chat._id} chat={chat} selectChat={setSelectedChats} />
        ))}
      </div>
      {/* submit btn */}
      <div>
        <Button
          className="w-full"
          bgColor={'dodgerblue'}
          isDisabled={isForwardBtnDisabled}
          color={'white'}
          onClick={forwardMessageBtnHandler}
        >
          {isLoading ? <Spinner /> : t('forwardMessageMenu.submitBtn')}
        </Button>
      </div>
    </div>
  );
};

export default ForwardMsgMenu;
