/* eslint-disable react/no-unknown-property */
import {
    FormControl,
    FormHelperText,
    Input,
    Button,
    Checkbox,
    InputLeftElement,
    InputGroup,
} from '@chakra-ui/react';
import { HiOutlineMail, HiLockOpen } from 'react-icons/hi';
import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import Logo from '../../../assets/vectors/chat-round-check-svgrepo-com.svg';
import Vector from '../../../assets/vectors/undraw_login_re_4vu2.svg';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { loginUser } from '@/apis/auth.api';
import { Spinner } from '@chakra-ui/react';
import LoginAlerts from '@/components/LoginAlerts/LoginAlerts';
import { useRouter } from 'next/router';
import LanguageSwitcher from '@/components/LangSwitcher/LangSwitcher';
import useTranslation from 'next-translate/useTranslation';
import { AnyAction } from '@reduxjs/toolkit';
import Link from 'next/link';
import { Icon } from '@chakra-ui/icons';
import { resetAuthApiRes } from '@/redux/auth.slice';

const Login = () => {
    // translation
    const {locale, push} = useRouter();
    const { t } = useTranslation('login');
    // component Local state
    const [userCred, setUserCred] = useState<{
        email: string;
        password: string;
    }>({ email: '', password: '' });
    // is loading
    const [isLoading, setIsLoading] = useState(false);
    // get data from the redux store
    const {apiResMessage } = useSelector(
        (state: RootState) => state.auth
    );
    // Router
    // handle Input Change
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setUserCred({
            ...userCred,
            [event.target.name]: event.target.value,
        });
    };
    // handle form Submition
    const handleFormSubmition = (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        Dispatch(loginUser(userCred) as unknown as AnyAction);
    };
    // redirec the user when loggedIn succ
    useEffect(() => {
        if(apiResMessage) {
            setIsLoading(false);
        }
        // check if the current user is logged in
        if (apiResMessage?.err === false) {
            push('/chats');
            Dispatch(resetAuthApiRes());
            return;
        }
    }, [apiResMessage]);
    // React Redux Dispatch Function
    const Dispatch = useDispatch();
    return (
        <>
            <Head>
                <title>{t('pageName')}</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <div className={styles.login} pref-lang={locale}>
                {apiResMessage ? <LoginAlerts response={apiResMessage} /> : ''}
                {/* Login Form */}
                <form onSubmit={handleFormSubmition}>
                    <div className={styles.formHeader}>
                        {/* form Header */}
                        <h1>
                            <Image src={Logo} alt='logo' /> {t('app_name')}
                        </h1>
                        <h2>{t('welcome_text')}</h2>
                        <p>{t('login_with_oauth')}</p>
                    </div>
                    {/* email input */}
                    <InputGroup>
                        <FormControl className={styles.FormControl}>
                            <InputLeftElement className={styles.inputIcon}>
                                <Icon as={HiOutlineMail}/>
                            </InputLeftElement>
                            <Input
                                type='email'
                                placeholder={t('emailPlaceholder')}
                                value={userCred.email}
                                name='email'
                                onChange={handleInputChange}
                            />
                            <FormHelperText>{t('email_input_msg')}</FormHelperText>
                        </FormControl>
                    </InputGroup>
                    {/* password input */}
                    <InputGroup>
                        <FormControl className={styles.FormControl}>
                            <InputLeftElement className={styles.inputIcon}>
                                <Icon as={HiLockOpen}/>
                            </InputLeftElement>
                            <Input
                                type='password'
                                placeholder={t('passwordPlaceholder')}
                                value={userCred.password}
                                name='password'
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </InputGroup>
                    <div className={styles.areaContainer}>
                        <Checkbox className={styles.checkBox}>
                            {t('remember_me_btn_text')}
                        </Checkbox>
                        <a href=''>{t('forget_password_link_text')}</a>
                    </div>
                    {/* submit btn */}
                    <div className={styles.btnArea}>
                        <Button
                            colorScheme='blue'
                            className={styles.formSubmitionBtn}
                            type='submit'
                            variant={'outline'}
                            isDisabled={isLoading}
                        >
                            {!isLoading ? <p>{t('login_btn_text')}</p> : 
                                <Spinner
                                    thickness='2px'
                                    speed='0.65s'
                                    emptyColor='white'
                                    color='blue'
                                    size='sm'
                                />}
                        </Button>
                    </div>
                    <p className={styles.createAccountLink}>
                        {t('dont_have_account_msg')}{' '}
                        <Link href='/signup'>{t('create_account_link_text')}</Link>
                    </p>
                    {/* bottom area */}
                    <div className=''>
                        <LanguageSwitcher path='login'/>
                    </div>
                </form>
                {/* vector section */}
                <div className={styles.vectorSection}>
                    <Image src={Vector} alt='vector image' />
                </div>
            </div>
        </>
    );
};

export default Login;
