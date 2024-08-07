import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface Props {
  _id: string;
}

const FileMsgUploadIndicator: FC<Props> = ({ _id }) => {
  // file msg upload indicator ref
  const fileMsgUploadProgressRef = useRef<HTMLDivElement>(null);
  // redux store
  const { lastChatMessage, fileMessageUploadIndicator } = useSelector((state: RootState) => ({
    fileMessageUploadIndicator: state.chat.fileMessageUploadIndicator,
    lastChatMessage: state.chat.chatMessages![state.chat.chatMessages!.length! - 1],
  }));
  // is photo upload progress visible
  const [isUploadProgressVisable, setIsUploadProgressVisable] = useState(
    () => _id === lastChatMessage._id && lastChatMessage.status === null
  );
  // last message obsserver
  useEffect(() => {
    // terminate if no last message
    if (!lastChatMessage) return;
    setIsUploadProgressVisable(_id === lastChatMessage._id && lastChatMessage.status === null);
  }, [lastChatMessage]);
  // fileMessageUploadProgress observer
  useEffect(() => {
    // terminate if it's not avilable
    if (!fileMessageUploadIndicator) return;
    // photoMessageUploadProgressElement
    const photoMessageUploadProgressElement = fileMsgUploadProgressRef.current;
    // set the width of the element
    photoMessageUploadProgressElement?.style.setProperty('width', `${fileMessageUploadIndicator}%`);
  }, [fileMessageUploadIndicator]);
  return (
    <div className={styles.photoUploadIndicator} style={{ display: isUploadProgressVisable ? 'initial' : 'none' }}>
      <div className={styles.photoUploadProgress} ref={fileMsgUploadProgressRef}></div>
    </div>
  );
};

export default FileMsgUploadIndicator;
