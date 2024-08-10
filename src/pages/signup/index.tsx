import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import Head from 'next/head';
import { Box, Button, FormControl, Icon, Input, InputGroup, InputLeftElement, Text } from '@chakra-ui/react';
import AppLogo from '@/components/AppLogo';
import { HiOutlineCamera, HiOutlineKey, HiOutlineMail } from 'react-icons/hi';
import { BsPersonCircle, BsGoogle } from 'react-icons/bs';
import { GoogleSignInSession, SignUpDto } from '@/interfaces/auth.interface';
import { useDispatch } from 'react-redux';
import { signUpApi } from '@/apis/auth.api';
import { AnyAction } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import LanguageSwitcher from '@/components/LangSwitcher/LangSwitcher';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { signIn, useSession, signOut } from 'next-auth/react';

const SignUp = () => {
  // dispatch store function
  const dispatch = useDispatch();
  // google sign up session
  const { data: session } = useSession();
  // signUp With Google Handler
  const googleSignUpHandler = () => {
    // session with authToken
    const { authToken } = { ...session } as GoogleSignInSession;
    // store token in local storage
    localStorage.setItem('access_token', `Bearer ${authToken}`);
    // terminate if no access token
    if (!authToken) return;
    // set Oauth Activation status
    // dispatch(setOAuthActivationStatus(true));
    // redirect the usr to chats screen
    push('/chats');
  };
  // localization method
  const { t } = useTranslation('signUp');
  const { push, locale } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserImage, seTselectedUserImage] = useState('');
  const [state, setState] = useState<SignUpDto>({
    email: '',
    usrname: '',
    password: '',
    avatar: null,
    name: '',
  });
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
      <Box
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        padding={'40px'}
        gap={5}
        pref-lang={locale}
        className={styles.signup}
      >
        <AppLogo />
        <Text fontWeight={'bold'} fontSize={'x-large'}>
          {t('greeting')}
        </Text>
        {/* social media auth providers */}
        <Box
          width={'100%'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          borderRadius={'5px'}
          padding={'.5rem 0'}
          backgroundColor={'blue.100'}
          gap={'20px'}
        >
          <BsGoogle />
          <button onClick={async () => await signIn('google')} className={styles.signup_with_google_btn}>
            {t('signUpWithSocialMedia.signUpWithGoogle')}
          </button>
        </Box>
        <Text fontSize={'lg'}>{t('createYourAccountText')}</Text>
        {/* form */}
        <form onSubmit={handleSubmition} id='form'>
          {/* email */}
          <InputGroup>
            <FormControl>
              <InputLeftElement className={styles.inputIcon}>
                <Icon as={HiOutlineMail} />
              </InputLeftElement>
              <Input
                placeholder={t('emailPlaceholder')}
                type='email'
                name='email'
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
                type='text'
                name='name'
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
                type='password'
                name='password'
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
                type='password'
                name='password'
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
                type='text'
                name='usrname'
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
                type='file'
                accept='image/png, image/jpeg'
                id='profile_img'
                name='profile_img'
                selected-file-name={selectedUserImage ? selectedUserImage : t('chosenImageText')}
                input-placeholder={t('choseImageInputPlaceholder')}
                onChange={handleInputChange}
              />
            </FormControl>
          </InputGroup>
          <Button
            colorScheme='messenger'
            width={'fit-content'}
            marginTop={'20px'}
            marginBottom={'20px'}
            type='submit'
            isDisabled={isLoading}
          >
            {t('signUpBtnText')}
          </Button>
          <Text>
            {t('loginText')} <Link href={'/login'}>{t('loginLinkText')}</Link>
          </Text>
          <LanguageSwitcher path='signup' />
        </form>
      </Box>
    </>
  );
};

export default SignUp;
