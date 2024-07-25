import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import Head from 'next/head';
import { Box, Button, FormControl, Icon, Input, InputGroup, InputLeftElement, Text } from '@chakra-ui/react';
import AppLogo from '@/components/AppLogo';
import { HiOutlineCamera, HiOutlineKey, HiOutlineMail } from 'react-icons/hi';
import { BsPersonCircle } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';
import { SignUpDto } from '@/interfaces/auth.interface';
import { useDispatch } from 'react-redux';
import { signUpApi } from '@/apis/auth.api';
import { AnyAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/router';
import LanguageSwitcher from '@/components/LangSwitcher/LangSwitcher';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { signIn, useSession, signOut } from 'next-auth/react';

const SignUp = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('signUp');
  const { data, status } = useSession();
  console.log(status, data?.user);
  const { push, locale } = useRouter();
  const user = useSelector((state: RootState) => state.auth.currentUser);
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
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
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
  // handleSubmition
  const handleSubmition = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(signUpApi(state) as unknown as AnyAction);
    setIsLoading(true);
  };
  useEffect(() => {
    if (user) {
      push('/chats');
    }
  }, [user]);
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
          border={'1px solid lightgray'}
          borderRadius={'5px'}
          padding={'.5rem 0'}
          gap={'5px'}
        >
          <FcGoogle />
          <button onClick={async () => await signIn('google')} className={styles.signup_with_google_btn}>
            {t('signUpWithSocialMedia.signUpWithGoogle')}
          </button>
        </Box>
        <Box
          width={'100%'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          border={'1px solid lightgray'}
          borderRadius={'5px'}
          padding={'.5rem 0'}
          gap={'5px'}
        >
          <button onClick={() => signOut()} className={styles.signup_with_google_btn}>
            sign out
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
