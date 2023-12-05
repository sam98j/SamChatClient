import Head from 'next/head';
import React from 'react';
import styles from './index.module.scss';
import { Box, Button, Text } from '@chakra-ui/react';
import Image from 'next/image';
import IllusSVG from '@/../assets/vectors/undraw_in_sync_re_jlqd.svg';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

const Home = () => {
  const { t } = useTranslation('home');
  return (
    <>
      <>
        <Head>
          <title>{t('pageName')}</title>
        </Head>
        <div className={styles.home}>
          <Box className={styles.container} padding={['20px', null, 100, 100]}>
            <Box fontSize={'4xl'} fontWeight={'black'}>
              {t('welcome_text')}{' '}
              <Text textColor={'messenger.500'} fontWeight={'black'}>
                {t('appName')}
              </Text>
              <Text>{t('features')}</Text>
            </Box>
            <Text textColor={'gray.600'} width={[null, null, null, '50%']}>
              {t('disc')}
            </Text>
            <Button colorScheme='blue' marginTop={'20px'} width={'10rem'}>
              <Link href={'/login'}>{t('start_now_txt')}</Link>
            </Button>
          </Box>
          {/* illustration */}
          <Box
            className={styles.illustration}
            height={'calc(100dvh - 50px)'}
            display={'flex'}
            flexDirection={'column'}
            padding={'50px'}
            alignItems={'center'}
          >
            <Image src={IllusSVG} alt='svg' />
            <Text textColor={'gray'}>Sam WebServices &copy;2023</Text>
          </Box>
        </div>
      </>
    </>
  );
};

export default Home;
