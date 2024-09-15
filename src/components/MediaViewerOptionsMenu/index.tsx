import React, { FC } from 'react';
import styles from './styles.module.scss';
import Link from 'next/link';
import { Box } from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import {
  DownloadCloudIcon,
  Edit3Icon,
  ForwardIcon,
  ImageIcon,
  ReplyIcon,
  ShareIcon,
} from 'lucide-react';

// props types
type Props = { mediaUrl: string; isOpen: boolean };

const MediaViewerOptionsMenu: FC<Props> = ({ mediaUrl, isOpen }) => {
  // api url
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // translations method
  const { t } = useTranslation('chatScreen');
  // lang
  const { locale } = useRouter();
  //   set bottom proberty of menu
  return (
    <Box
      is-open={String(isOpen)}
      pref-lang={locale}
      className={`${styles.menu_container} absolute p-4 rounded-lg w-1/2`}
    >
      <ul className="text-lg">
        <li>
          <DownloadCloudIcon />
          <Link href={apiUrl + mediaUrl} download={mediaUrl}>
            {t('mediaViewer.optionsMenu.downloadLink')}
          </Link>
        </li>
        <li>
          <ForwardIcon />
          <button>{t('mediaViewer.optionsMenu.forwardBtn')}</button>
        </li>
        <li>
          <Edit3Icon />
          <button>{t('mediaViewer.optionsMenu.editBtn')}</button>
        </li>
        <li>
          <ReplyIcon />
          <button>{t('mediaViewer.optionsMenu.ReplyBtn')}</button>
        </li>
        <li>
          <ShareIcon />
          <button>{t('mediaViewer.optionsMenu.ShareBtn')}</button>
        </li>
        <li>
          <ImageIcon />
          <button>{t('mediaViewer.optionsMenu.MakeAsBtn')}</button>
        </li>
      </ul>
    </Box>
  );
};

export default MediaViewerOptionsMenu;
