import React, { useState } from 'react';
import styles from './styles.module.scss';
import {
  IoArrowBack,
  IoReturnUpForward,
  IoShareOutline,
} from 'react-icons/io5';
import { Text } from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import { TimeUnits, getTime } from '@/utils/time';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { CiMenuKebab } from 'react-icons/ci';
import { useDispatch } from 'react-redux';
import { setSystemNotification } from '@/redux/system.slice';
import {
  MessagesToBeForwarded,
  setMessagesToBeForwared,
} from '@/redux/chats.slice';
import { ChatMessage } from '@/interfaces/chat.interface';
import MediaViewerOptionsMenu from '../MediaViewerOptionsMenu';

// props
type Props = {
  msg: ChatMessage;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MediaViewerHeader = (props: Props) => {
  // destruct props
  const { msg, setIsOpen, isOpen } = props;
  // destruct chat message
  const { content, date, sender, _id } = msg;
  // redux dispatch functinon
  const dispatch = useDispatch();
  // api url
  const apiHost = process.env.NEXT_PUBLIC_API_URL;
  // is menu options is opened
  const [isMenuOptionsOpen, setIsMenuOptionsOpen] = useState(false);
  // redux store
  const loggedInUser = useSelector(
    (state: RootState) => state.auth.currentUser,
  );
  // is Message sended by the current usr
  const sendedByMe = loggedInUser?._id === sender._id;
  // photo's sender name
  const photoSenderName = sender.name;
  // app lang
  const { locale } = useRouter();
  // localiztion method
  const { t } = useTranslation('chatScreen');
  // handle close
  const handleClose = () =>
    isMenuOptionsOpen ? setIsMenuOptionsOpen(false) : setIsOpen(false);
  // optionsMenuClickHandler
  const optionsMenuClickHandler = () =>
    setIsMenuOptionsOpen(!isMenuOptionsOpen);
  // handle share btn
  const shareMediaHandler = () => {
    try {
      // terminate if it's can't share
      navigator.share({
        text: 'SamChat Share Media',
        title: 'Greeting',
        url: apiHost + content,
      });
    } catch (err) {
      dispatch(setSystemNotification({ err: true, msg: 'You can not share' }));
    }
  };
  // handleForwardMsg //
  const handleForwardMsg = () => {
    const messagesToBeForwared: MessagesToBeForwarded = {
      messages: [_id],
      chats: [],
    };
    dispatch(setMessagesToBeForwared(messagesToBeForwared));
  };
  return (
    <div className={styles.viewerHeader} data-is-viewer-open={String(isOpen)}>
      {/* menu */}
      <MediaViewerOptionsMenu mediaUrl={content} isOpen={isMenuOptionsOpen} />
      {/* container */}
      <div className="flex items-center text-white gap-2" onClick={handleClose}>
        {/* back arrow */}
        <IoArrowBack size={'1.5rem'} className="cursor-pointer" />
        {/* message sender */}
        <div>
          {/* sender name */}
          <Text>{sendedByMe ? t('you') : photoSenderName}</Text>
          {/* message date */}
          <Text fontSize={'.8rem'}>
            {getTime(date, TimeUnits.fullTime, locale as never)}
          </Text>
        </div>
      </div>
      {/* container ends */}
      {/* options */}
      <div className="flex items-center justify-end flex-grow cursor-pointer gap-4">
        {/* share media btn */}
        <div onClick={shareMediaHandler}>
          <IoShareOutline size={'1.5rem'} color="white" />
        </div>
        {/* forward message btn */}
        <div onClick={handleForwardMsg}>
          <IoReturnUpForward size={'1.5rem'} color="white" />
        </div>
        {/* options menu */}
        <div onClick={optionsMenuClickHandler} className="relative">
          <CiMenuKebab size={'1.5rem'} color="white" />
        </div>
      </div>
      {/* options end */}
    </div>
  );
};

export default MediaViewerHeader;
