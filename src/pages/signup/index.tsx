/* eslint-disable react/no-unknown-property */

import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import Head from 'next/head';
import {
  Box,
  Button,
  FormControl,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react';
import { HiOutlineCamera, HiOutlineKey, HiOutlineMail } from 'react-icons/hi';
import { BsPersonCircle, BsGoogle } from 'react-icons/bs';
import { GoogleSignInSession, SignUpDto } from '@/interfaces/auth.interface';
import { useDispatch } from 'react-redux';
import { signUpApi } from '@/apis/auth.api';
import { AnyAction } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import LanguageSwitcher from '@/components/LangSwitcher/LangSwitcher';
import useTranslation from 'next-translate/useTranslation';
import Logo from '../../../assets/vectors/chat-round-check-svgrepo-com.svg';
import Link from 'next/link';
import { signIn, useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

const SignUp = () => {
  // dispatch store function
  const dispatch = useDispatch();
  // google sign up session
  const { data: session } = useSession();
  // localization method
  const { t } = useTranslation('signUp');
  // router
  const { push, locale } = useRouter();
  // submit btn state
  const [isLoading, setIsLoading] = useState(false);
  // is loading
  const [isOauthWitGoogleLoading, setOauthWitGoogleLoading] = useState(false);
  // user image
  const [selectedUserImage, seTselectedUserImage] = useState('');
  // state
  const [state, setState] = useState<SignUpDto>({
    email: '',
    usrname: '',
    password: '',
    avatar: null,
    name: '',
  });
  // signUp With Google Handler
  const googleSignUpHandler = () => {
    // session with authToken
    const { authToken } = { ...session } as GoogleSignInSession;
    // terminate if no access token
    if (!authToken) return;
    // store token in local storage
    localStorage.setItem('access_token', `Bearer ${authToken}`);
    // redirect the usr to chats screen
    push('/chats');
  };
  // handleInputChange
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // set component state
    setState({ ...state, [e.target.name]: e.target.value });
    if (e.target.name === 'profile_img') {
      if (e.target.value) {
        const fileName = e.target.value.split('\\');
        seTselectedUserImage(fileName[fileName.length - 1]);
      }
      setState({
        ...state,
        avatar: e.target.files![0],
      });
    }
  };
  // when component did mount
  useEffect(() => {
    if (!session) return;
    signOut();
  }, []);
  // handleSubmition
  const handleSubmition = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(signUpApi(state) as unknown as AnyAction);
    setIsLoading(true);
  };
  // googleOauthBtnHandler
  const googleOauthBtnHandler = () => {
    setOauthWitGoogleLoading(true);
    signIn('google');
  };
  // google sign in session observer
  useEffect(() => {
    // terminate the proccess if no usr
    if (!session?.user) return;
    // handle google sign in
    googleSignUpHandler();
  }, [session]);
  return (
    <>
      <Head>
        <title>{t('pageName')}</title>
      </Head>
      {/* body */}
      <div
        className="flex flex-col gap-2 px-9 justify-center h-[100dvh]"
        pref-lang={locale}
        id={styles.signup}
      >
        {/* App Logo */}
        <div className="flex items-center justify-center" id={styles.app_logo}>
          <Image src={Logo} alt="logo" />
          <Text fontWeight={'bold'}>{t('appName')}</Text>
        </div>
        {/* text */}
        <p className="text-center">{t('loginWithOauth')}</p>
        {/* social media auth providers */}
        <Box width={'full'}>
          <Button
            display={'flex'}
            alignItems={'center'}
            width={'full'}
            fontWeight={'normal'}
            backgroundColor={'transparent'}
            isDisabled={isOauthWitGoogleLoading}
            border={'1px solid gray'}
            justifyContent={'center'}
            gap={'20px'}
            onClick={googleOauthBtnHandler}
            className={styles.signup_with_google_btn}
          >
            <BsGoogle />
            {t('signUpWithSocialMedia.signUpWithGoogle')}
          </Button>
        </Box>
        {/* form */}
        <form onSubmit={handleSubmition} id="form">
          {/* or seperator */}
          <p
            className="text-center text-gray-500 mt-5"
            id={styles.or_seperator}
          >
            {t('or_seperator')}
          </p>
          {/* email */}
          <InputGroup>
            <FormControl>
              <InputLeftElement className={styles.inputIcon}>
                <Icon as={HiOutlineMail} />
              </InputLeftElement>
              <Input
                placeholder={t('emailPlaceholder')}
                type="email"
                variant={'filled'}
                bg={'blackAlpha.200'}
                name="email"
                value={state.email}
                onChange={handleInputChange}
              />
            </FormControl>
          </InputGroup>
          {/* name */}
          <InputGroup>
            <FormControl>
              <InputLeftElement className={styles.inputIcon}>
                <Icon as={BsPersonCircle} />
              </InputLeftElement>
              <Input
                placeholder={t('namePlaceholder')}
                type="text"
                name="name"
                variant={'filled'}
                bg={'blackAlpha.200'}
                value={state.name}
                onChange={handleInputChange}
              />
            </FormControl>
          </InputGroup>
          {/* password */}
          <InputGroup>
            <FormControl>
              <InputLeftElement className={styles.inputIcon}>
                <Icon as={HiOutlineKey} />
              </InputLeftElement>
              <Input
                placeholder={t('passwordPlaceholder')}
                type="password"
                variant={'filled'}
                bg={'blackAlpha.200'}
                name="password"
                value={state.password}
                onChange={handleInputChange}
              />
            </FormControl>
          </InputGroup>
          {/* re-enter password */}
          <InputGroup>
            <FormControl>
              <InputLeftElement className={styles.inputIcon}>
                <Icon as={HiOutlineKey} />
              </InputLeftElement>
              <Input
                placeholder={t('re-enterPasswordPlaceholder')}
                type="password"
                name="password"
                variant={'filled'}
                bg={'blackAlpha.200'}
                value={state.password}
                onChange={handleInputChange}
              />
            </FormControl>
          </InputGroup>
          {/* usrname */}
          <InputGroup>
            <FormControl>
              <InputLeftElement className={styles.inputIcon}>
                <Icon as={BsPersonCircle} />
              </InputLeftElement>
              <Input
                placeholder={t('usernamePlaceholder')}
                type="text"
                name="usrname"
                variant={'filled'}
                bg={'blackAlpha.200'}
                value={state.usrname}
                onChange={handleInputChange}
              />
            </FormControl>
          </InputGroup>
          {/* file */}
          <InputGroup>
            <FormControl>
              <InputLeftElement className={styles.inputIcon}>
                <Icon as={HiOutlineCamera} />
              </InputLeftElement>
              <Input
                type="file"
                accept="image/png, image/jpeg"
                id="profile_img"
                name="profile_img"
                selected-file-name={
                  selectedUserImage ? selectedUserImage : t('chosenImageText')
                }
                input-placeholder={t('choseImageInputPlaceholder')}
                onChange={handleInputChange}
              />
            </FormControl>
          </InputGroup>
          {/* submit btn */}
          <Button
            colorScheme="blackAlpha"
            backgroundColor={'black'}
            width={'fit-content'}
            marginTop={'20px'}
            marginBottom={'20px'}
            type="submit"
            isDisabled={isLoading}
          >
            {t('signUpBtnText')}
          </Button>
        </form>
        {/* login link */}
        <div>
          <Text>
            {t('loginText')}{' '}
            <Link className="text-blue-500" href={'/login'}>
              {t('loginLinkText')}
            </Link>
          </Text>
          <LanguageSwitcher path="signup" />
        </div>
      </div>
    </>
  );
};

export default SignUp;
