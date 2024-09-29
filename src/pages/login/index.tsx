/* eslint-disable react/no-unknown-property */
import {
  FormControl,
  FormHelperText,
  Input,
  Button,
  Checkbox,
  InputLeftElement,
  InputGroup,
  Box,
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
import { useRouter } from 'next/router';
import LanguageSwitcher from '@/components/LangSwitcher/LangSwitcher';
import useTranslation from 'next-translate/useTranslation';
import { AnyAction } from '@reduxjs/toolkit';
import Link from 'next/link';
import { Icon } from '@chakra-ui/icons';
import { resetAuthApiRes } from '@/redux/auth.slice';
import { BsGoogle } from 'react-icons/bs';
import { signIn, useSession } from 'next-auth/react';
import { GoogleSignInSession } from '@/interfaces/auth.interface';
import { LoginDTO } from '@/interfaces/pages.interface';
import { setSystemNotification } from '@/redux/system.slice';

const Login = () => {
  // React Redux dispatch Function
  const dispatch = useDispatch();
  // google sign in session
  const { data: session } = useSession();
  // sign in With Google Handler
  const googleSignInHandler = () => {
    // session with authToken
    const { authToken } = { ...session } as GoogleSignInSession;
    // terminate if no access token
    if (!authToken) return;
    // store token in local storage
    localStorage.setItem('access_token', `Bearer ${authToken}`);
    // redirect the usr to chats screen
    push('/chats');
  };
  // translation
  const { t } = useTranslation('login');
  // router
  const { locale, push } = useRouter();
  // component Local state
  const [userCred, setUserCred] = useState<LoginDTO>({
    email: '',
    password: '',
  });
  // is loading
  const [isLoading, setIsLoading] = useState(false);
  // is loading
  const [isOauthWitGoogleLoading, setOauthWitGoogleLoading] = useState(false);
  // get data from the redux store
  const { apiResponse } = useSelector((state: RootState) => state.auth);
  // handle Input Change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    // set component state
    setUserCred({ ...userCred, [event.target.name]: event.target.value });
  };
  // handle form Submition
  const handleFormSubmition = (event: React.FormEvent) => {
    event.preventDefault();
    // loading spinner
    setIsLoading(true);
    // call login api
    dispatch(loginUser(userCred) as unknown as AnyAction);
  };
  // oauth with google btn click handler
  const googleAuthBtnClickHandler = () => {
    // loading spinner
    setOauthWitGoogleLoading(true);
    signIn('google');
  };
  // redirec the user when loggedIn succ
  useEffect(() => {
    // stop loading spinner
    if (apiResponse) setIsLoading(false);
    // check for error
    if (apiResponse?.err)
      dispatch(setSystemNotification({ err: true, msg: apiResponse.msg }));
    // if login is successfly
    if (apiResponse?.err === false) push('/chats');
    // reset api response
    dispatch(resetAuthApiRes());
  }, [apiResponse]);
  // google sign in session observer
  useEffect(() => {
    // terminate the proccess if no usr
    if (!session?.user) return;
    console.log(apiResponse);
    // handle google sign in
    googleSignInHandler();
  }, [session, apiResponse]);

  return (
    <>
      <Head>
        <title>{t('pageName')}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.login} pref-lang={locale}>
        {/* Login Form */}
        <div className={styles.form_container}>
          {/* for header */}
          <div className={styles.formHeader}>
            {/* form Header */}
            <h1>
              <Image src={Logo} alt="logo" /> {t('app_name')}
            </h1>
            {/* text */}
            <p>{t('login_with_oauth')}</p>
            {/* google oatuh btn */}
            <Box>
              <Button
                display={'flex'}
                alignItems={'center'}
                width={'full'}
                fontWeight={'normal'}
                isDisabled={isOauthWitGoogleLoading}
                backgroundColor={'transparent'}
                border={'1px solid gray'}
                justifyContent={'center'}
                gap={'20px'}
                onClick={googleAuthBtnClickHandler}
                className={styles.signup_with_google_btn}
              >
                <BsGoogle />
                {t('signInWithSocialMedia.signInWithGoogle')}
              </Button>
            </Box>
          </div>
          <form onSubmit={handleFormSubmition}>
            {/* or seperator */}
            <p className="text-center text-gray-500" id={styles.or_seperator}>
              {t('or_seperator')}
            </p>
            {/* email input */}
            <InputGroup>
              <FormControl className={styles.FormControl}>
                <InputLeftElement className={styles.inputIcon}>
                  <Icon as={HiOutlineMail} />
                </InputLeftElement>
                <Input
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  value={userCred.email}
                  variant={'filled'}
                  bg={'blackAlpha.200'}
                  name="email"
                  onChange={handleInputChange}
                />
                <FormHelperText>{t('email_input_msg')}</FormHelperText>
              </FormControl>
            </InputGroup>
            {/* password input */}
            <InputGroup>
              <FormControl className={styles.FormControl}>
                <InputLeftElement className={styles.inputIcon}>
                  <Icon as={HiLockOpen} />
                </InputLeftElement>
                <Input
                  type="password"
                  variant={'filled'}
                  bg={'blackAlpha.200'}
                  placeholder={t('passwordPlaceholder')}
                  value={userCred.password}
                  name="password"
                  onChange={handleInputChange}
                />
              </FormControl>
            </InputGroup>
            {/* remember me */}
            <div className={styles.areaContainer}>
              <Checkbox className={styles.checkBox}>
                {t('remember_me_btn_text')}
              </Checkbox>
              <a href="">{t('forget_password_link_text')}</a>
            </div>
            {/* submit btn */}
            <div className={styles.btnArea}>
              <Button
                color={'white'}
                className={styles.formSubmitionBtn}
                type="submit"
                backgroundColor={'black'}
                colorScheme={'blackAlpha'}
                variant={'solid'}
                isDisabled={isLoading}
              >
                {!isLoading ? (
                  <p>{t('login_btn_text')}</p>
                ) : (
                  <Spinner
                    thickness="2px"
                    speed="0.65s"
                    emptyColor="white"
                    color="blue"
                    size="sm"
                  />
                )}
              </Button>
            </div>
            {/* do not have an account */}
            <p className={styles.createAccountLink}>
              {t('dont_have_account_msg')}{' '}
              <Link href="/signup">{t('create_account_link_text')}</Link>
            </p>
            {/* bottom area */}
            <div className="">
              <LanguageSwitcher path="login" />
            </div>
          </form>
        </div>
        {/* vector section */}
        <div className={styles.vectorSection}>
          <Image src={Vector} alt="vector image" />
        </div>
      </div>
    </>
  );
};

export default Login;
