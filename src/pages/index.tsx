import Head from 'next/head';
import React from 'react';
import styles from './index.module.scss';
import { Box, Button, Text } from '@chakra-ui/react';
import Image from 'next/image';
import IllusSVG from '@/../assets/vectors/undraw_in_sync_re_jlqd.svg';
import Link from 'next/link';

const Home = () => {
    return (
        <>
            <>
                <Head>
                    <title>SamChat | Home</title>
                </Head>
                <div className={styles.home}>
                    <Box
                        className={styles.container}
                        padding={['20px', null, 100, 100]}
                    >
                        <Box fontSize={'4xl'} fontWeight={'black'}>
                            Welcome to{' '}
                            <Text textColor={'messenger.500'}>SamChat</Text>
                            <Text>Fast, Secure, easy Chat App</Text>
                        </Box>
                        <Text
                            textColor={'gray.600'}
                            width={[null, null, null, '50%']}
                        >
                            SamChat is a free, web-based messaging app that
                            allows you to stay in touch with friends and family
                            from anywhere in the world. With SamChat, you can
                            send text messages, make voice calls, and video
                            chat. You can also share photos, videos, and files.
                        </Text>
                        <Button
                            colorScheme='blue'
                            marginTop={'20px'}
                            width={'10rem'}
                        >
                            <Link href={'/login'}>Start Now</Link>
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
                        <Text textColor={'gray'}>
                            Sam WebServices &copy;2023
                        </Text>
                    </Box>
                </div>
            </>
        </>
    );
};

export default Home;
