/* eslint-disable react/no-unknown-property */
import Image from 'next/image';
import React, { FC, useState } from 'react';
import styles from './styles.module.scss';
import { useRouter } from 'next/router';
import { Box, Text } from '@chakra-ui/react';
import {
  IoShareOutline,
  IoReturnUpForward,
  IoArrowBack,
} from 'react-icons/io5';
import { CiMenuKebab } from 'react-icons/ci';
import useTranslation from 'next-translate/useTranslation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { TimeUnits, getTime } from '@/utils/time';
import { ChatMessage } from '@/interfaces/chat.interface';
import FileMsgUploadIndicator from '../FileMsgUploadIndicator';
import MediaViewerOptionsMenu from '../MediaViewerOptionsMenu';
import { useDispatch } from 'react-redux';
import { setSystemNotification } from '@/redux/system.slice';
import {
  MessagesToBeForwarded,
  setMessagesToBeForwared,
} from '@/redux/chats.slice';
import MediaViewerHeader from '../MediaViewerHeader';

type Props = ChatMessage;

const ImageMsgViewer: FC<{ data: Props }> = ({ data }) => {
  // redux dispatch functinon
  const dispatch = useDispatch();
  // api url
  const apiHost = process.env.NEXT_PUBLIC_API_URL;
  // destruct props
  const { content, date, sender, _id } = data;
  // redux store
  const loggedInUser = useSelector(
    (state: RootState) => state.auth.currentUser,
  );
  // is Message sended by the current usr
  const sendedByMe = loggedInUser?._id === sender._id;
  // photo's sender name
  const photoSenderName = data.sender.name;
  // image url
  const imgUrl = content.includes('data:') ? content : `${apiHost}${content}`;
  // state
  const [isOpen, setIsOpen] = useState(false);
  console.log(isOpen);
  // is menu options is opened
  const [isMenuOptionsOpen, setIsMenuOptionsOpen] = useState(false); //TODO:
  // localiztion method
  const { t } = useTranslation('chatScreen');
  // app lang
  const { locale } = useRouter();
  // handle onclick
  const handleClick = () => !isOpen && setIsOpen(true);
  // handle close TODO:
  const handleClose = () =>
    isMenuOptionsOpen ? setIsMenuOptionsOpen(false) : setIsOpen(false);
  // optionsMenuClickHandler TODO:
  const optionsMenuClickHandler = () =>
    setIsMenuOptionsOpen(!isMenuOptionsOpen);
  // handle share btn TODO:
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
  // handleForwardMsg // TODO:
  const handleForwardMsg = () => {
    const messagesToBeForwared: MessagesToBeForwarded = {
      messages: [data._id],
      chats: [],
    };
    dispatch(setMessagesToBeForwared(messagesToBeForwared));
  };
  return (
    <div
      className={styles.imageMsgViewer}
      key={_id}
      is-open={String(isOpen)}
      pref-lang={locale}
    >
      {/* photo upload indicator */}
      <FileMsgUploadIndicator _id={_id} />
      {/* menu */}
      <MediaViewerOptionsMenu mediaUrl={content} isOpen={isMenuOptionsOpen} />
      {/* viewer header */}
      <MediaViewerHeader msg={data} setIsOpen={setIsOpen} isOpen={isOpen} />
      {/* viewer body */}
      <div className={styles.viewerBody}>
        <Image
          src={imgUrl}
          alt="msg"
          width={250}
          height={300}
          onClick={handleClick}
        />
      </div>
      {/* viewer footer */}
      <div className={styles.viewerFooter}></div>
    </div>
  );
};

export default ImageMsgViewer;
