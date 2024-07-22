/* eslint-disable react/no-unknown-property */
import React, { ChangeEvent } from 'react';
import styles from './styles.module.scss';
import { FormControl, IconButton, Input, InputGroup } from '@chakra-ui/react';
import { BsCameraVideo, BsFilePdf, BsImage, BsMusicNote } from 'react-icons/bs';
import useTranslation from 'next-translate/useTranslation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { ChatMessage, MessagesTypes } from '@/interfaces/chat.interface';
import { v4 as uuid } from 'uuid';
import { useSearchParams } from 'next/navigation';
import { addMessageToChat } from '@/redux/chats.slice';
import { setAttchFileMenuOpen } from '@/redux/system.slice';
import { getFileSize } from '@/utils/files';

const AttachFile = () => {
  // attach file menu ref
  // localiztion method
  const { t } = useTranslation('chatScreen');
  // dispatch store method
  const dispatch = useDispatch();
  // url parmas
  const params = useSearchParams();
  // store
  const { attachFileMenuOpen, currentUser } = useSelector((state: RootState) => {
    return {
      attachFileMenuOpen: state.system.attchFileMenuOpen,
      currentUser: state.auth.currentUser,
    };
  });
  // handleFileSelection
  const handleFileSelection = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    // selected file
    const file = changeEvent.target.files![0];
    // create reader object
    const fileReader = new FileReader();
    // read file as data url
    fileReader.readAsDataURL(file);
    // // when file load
    fileReader.addEventListener('load', fileLoadHandler);
    // // file load handler
    function fileLoadHandler(e: ProgressEvent<FileReader>) {
      //   // get file row data
      const rowFile = e.target?.result;
      //   // create message
      const message: ChatMessage = {
        _id: uuid(),
        date: new Date().toString(),
        receiverId: params.get('id') as string,
        senderId: currentUser as string,
        fileName: file.name,
        fileSize: getFileSize(rowFile as string),
        status: null,
        content: rowFile as string,
        type: changeEvent.target.name as MessagesTypes,
        voiceNoteDuration: '',
      };
      //   // dispatch a message
      dispatch(addMessageToChat(message));
      //   // hide attach file menu
      dispatch(setAttchFileMenuOpen(false));
    }
  };
  return (
    <div className={styles.attach_file_menu} is-menu-open={String(attachFileMenuOpen)}>
      {/* insert Photo */}
      <InputGroup className={styles.input_group}>
        <FormControl className={styles.form_control}>
          <IconButton aria-label='imagebtn' isRound={true}>
            <BsImage color='orange' />
          </IconButton>
          <Input
            type='file'
            name={MessagesTypes.PHOTO}
            placeholder={t('insertPhoto')}
            accept='image/png, image/jpeg'
            onChange={handleFileSelection}
          />
        </FormControl>
      </InputGroup>
      {/* Insert Video */}
      <InputGroup className={styles.input_group}>
        <FormControl className={styles.form_control}>
          <IconButton aria-label='imagebtn' isRound={true}>
            <BsCameraVideo color='blue' />
          </IconButton>
          <Input
            type='file'
            placeholder={t('insertVideo')}
            accept='video/mp4, video/webm, video/*,.mkv'
            name={MessagesTypes.VIDEO}
            onChange={handleFileSelection}
          />
        </FormControl>
      </InputGroup>
      {/* Insert File */}
      <InputGroup className={styles.input_group}>
        <FormControl className={styles.form_control}>
          <IconButton aria-label='imagebtn' isRound={true}>
            <BsFilePdf color='green' />
          </IconButton>
          <Input
            type='file'
            placeholder={t('insertFile')}
            name={MessagesTypes.FILE}
            onChange={handleFileSelection}
            accept='application/pdf'
          />
        </FormControl>
      </InputGroup>
      {/* insert voice file */}
      {/* insert Photo */}
      <InputGroup className={styles.input_group}>
        <FormControl className={styles.form_control}>
          <IconButton aria-label='imagebtn' isRound={true}>
            <BsMusicNote color='red' />
          </IconButton>
          <Input
            type='file'
            name={MessagesTypes.VOICENOTE}
            placeholder={t('insertSoundFile')}
            accept='image/png, image/jpeg'
            onChange={handleFileSelection}
          />
        </FormControl>
      </InputGroup>
    </div>
  );
};

export default AttachFile;
