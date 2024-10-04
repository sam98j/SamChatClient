/* eslint-disable react/no-unknown-property */
import Image from 'next/image';
import React, { FC, useState } from 'react';
import styles from './styles.module.scss';
import { useRouter } from 'next/router';
import { ChatMessage } from '@/interfaces/chat.interface';
import FileMsgUploadIndicator from '../FileMsgUploadIndicator';
import MediaViewerOptionsMenu from '../MediaViewerOptionsMenu';
import MediaViewerHeader from '../MediaViewerHeader';

type Props = ChatMessage;

const ImageMsgViewer: FC<{ data: Props }> = ({ data }) => {
  // api url
  const apiHost = process.env.NEXT_PUBLIC_API_URL;
  // destruct props
  const { content, _id } = data;
  // image url
  const imgUrl = content.includes('data:') ? content : `${apiHost}${content}`;
  // state
  const [isOpen, setIsOpen] = useState(false);
  // is menu options is opened
  const [isMenuOptionsOpen, setIsMenuOptionsOpen] = useState(false);
  // app lang
  const { locale } = useRouter();
  // handle onclick
  const handleClick = () => !isOpen && setIsOpen(true);
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
      <MediaViewerHeader
        data={{
          msg: data,
          isMenuOptionsOpen,
          setIsMenuOptionsOpen,
          isOpen,
          setIsOpen,
        }}
      />
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
