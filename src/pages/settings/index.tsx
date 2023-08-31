import LanguageSwitcher from '@/components/LangSwitcher/LangSwitcher';
import { setCurrentRoute } from '@/redux/system.slice';
import { Box, Text } from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const Settings = () => {
    const { t: tRoutes } = useTranslation('routesNames');
    const { t: tSettings } = useTranslation('settings');
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setCurrentRoute(tRoutes('settings')));
    }, []);
    return (
        <>
            <Head>
                <title>Setting</title>
            </Head>
            <Box padding={'20px'}>
                <Box>
                    <Text textColor={'gray'}>{tSettings('select_lang')}</Text>
                    <LanguageSwitcher path='settings'/>
                </Box>
            </Box>
        </>
    );
};

export default Settings;
