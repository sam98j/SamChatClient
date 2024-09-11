import { setResponseToMessage } from '@/redux/chats.slice';
import { RootState } from '@/redux/store';
import { Reply } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { BsReply } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import styles from './styles.module.scss';

const ResponseToMessage = () => {
  // dispatch
  const dispatch = useDispatch();
  // translatios
  const { t } = useTranslation('chatScreen');
  // ref
  const componentRef = useRef<HTMLDivElement>(null);
  // lang
  const { locale } = useRouter();
  //   redux store
  const { responseToMessage } = useSelector((state: RootState) => {
    return {
      responseToMessage: state.chat.responseToMessage,
    };
  });
  const [isModalOpen, setIsModalOpen] = useState(Boolean(responseToMessage));
  // closeModalHandler
  const closeModalHandler = () => {
    setIsModalOpen(false);
    componentRef.current?.addEventListener(
      'transitionend',
      (e: TransitionEvent) => {
        dispatch(setResponseToMessage(null));
      },
    );
  };
  return (
    <div
      className={`bg-gray-100 p-2 rounded-md relative ${styles.response_to_msg}`}
      is-modal-open={String(isModalOpen)}
      ref={componentRef}
    >
      {/* close response to message */}
      <button
        className={`absolute top-2 ${locale === 'ar' ? 'left-2' : 'right-2'} text-sm`}
        onClick={closeModalHandler}
      >
        X
      </button>
      <h3 className="text-blue-500 flex items-center gap-1">
        <span className="text-gray-600 flex items-center gap-2">
          <BsReply />
          {t('replyTo')}
        </span>
        {responseToMessage?.sender.name}
      </h3>
      <p className="text-gray-500">{responseToMessage?.content}</p>
    </div>
  );
};

export default ResponseToMessage;
