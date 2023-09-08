import React from 'react';
import styles from './styles.module.scss';
import { Text } from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';

const RecVoiceInd = () => {
    // translation
    const {t} = useTranslation('appHeader');
    return (
        <div className={styles.rec_voice_ind}>
            <span className={styles.first}></span>
            <span className={styles.second}></span>
            <span className={styles.third}></span>
            <Text display={'inline-block'} margin={'0 5px'}>{t('recording_voice')}</Text>
        </div>
    );
};

export default RecVoiceInd;