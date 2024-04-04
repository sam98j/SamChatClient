import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { Avatar, Box, Button, Input, InputGroup, InputLeftElement, InputRightElement, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FiEdit2 } from 'react-icons/fi';
import { FaRegUserCircle } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { MdAlternateEmail } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/auth.slice';
import { setCurrentRoute } from '@/redux/system.slice';
import useTranslation from 'next-translate/useTranslation';
import { getUsrProfileData } from '@/apis/usrprofile.api';
import { PhoneIcon } from '@chakra-ui/icons';
import { IsProfileDataEditable } from './interface';

const Profile = () => {
  // local state
  const [isProfileDataEditable, setIsProfileDataEditable] = useState<IsProfileDataEditable>({
    fullname: true,
    email: true,
    phone: true,
    usrname: true,
  });
  // local state destruct
  const { fullname, email, phone, usrname } = isProfileDataEditable;
  // translation
  const { t } = useTranslation('routesNames');
  // router
  const { push } = useRouter();
  const dispatch = useDispatch();
  // get data from redux store
  const { currentUser, usrProfiledata } = useSelector((state: RootState) => {
    return {
      currentUser: state.auth.currentUser,
      usrProfiledata: state.usrProfile,
    };
  });
  useEffect(() => {
    dispatch(setCurrentRoute(t('profile')));
    dispatch(getUsrProfileData(currentUser!) as unknown as never);
  }, []);
  // handleClick signout
  const handleClick = () => {
    dispatch(logout());
    // check for current user auth state
    if (!currentUser) {
      console.log('push');
      push('/');
    }
  };
  // handle edit profile data field
  const editProfileDataFieldHandler = (e: React.MouseEvent<SVGAElement>) => {
    e.preventDefault();
    // console.log(e.currentTarget.id);
    // get profile data field name
    const fieldName = e.currentTarget.id;
    // set local state
    setIsProfileDataEditable((state) => ({ ...state, [fieldName]: false }));
  };
  // input blur handler
  const inputFieldBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    // set local state
    setIsProfileDataEditable((state) => ({ ...state, [e.target.name]: true }));
  };
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <div className={styles.profile}>
        {/* main */}
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} padding={'30px'} gap={5}>
          <Avatar src={usrProfiledata.usrProfile?.avatar} size={'2xl'} />
          {/* name */}
          <Text fontSize={'2xl'} fontWeight={'black'} margin={'0'} lineHeight={'0'}>
            {usrProfiledata.usrProfile?.name}
          </Text>
          <Text lineHeight={'0'} textColor={'gray'}>
            @{usrProfiledata.usrProfile?.usrname}
          </Text>
        </Box>
        {/* profile data */}
        <Box gap={5} display={'flex'} flexDirection={'column'}>
          {/* email */}
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <HiOutlineMail color='gray' />
            </InputLeftElement>
            <InputRightElement>
              <FiEdit2 onClick={editProfileDataFieldHandler} id='email' />
            </InputRightElement>
            <Input
              type='email'
              placeholder='hosam98j@gmail.com'
              isDisabled={email}
              name='email'
              onBlur={inputFieldBlurHandler}
            />
          </InputGroup>
          {/* name */}
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <FaRegUserCircle color='gray' />
            </InputLeftElement>
            <InputRightElement>
              <FiEdit2 onClick={editProfileDataFieldHandler} id='fullname' />
            </InputRightElement>
            <Input
              type='text'
              placeholder='HosamAlden Mustafa'
              isDisabled={fullname}
              name='fullname'
              onBlur={inputFieldBlurHandler}
            />
          </InputGroup>
          {/* usr name */}
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <MdAlternateEmail color='gray' />
            </InputLeftElement>
            <InputRightElement>
              <FiEdit2 onClick={editProfileDataFieldHandler} id='usrname' />
            </InputRightElement>
            <Input
              type='text'
              placeholder='sam_98j'
              isDisabled={usrname}
              name='usrname'
              onBlur={inputFieldBlurHandler}
            />
          </InputGroup>
          {/* phone number */}
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <PhoneIcon color='gray.300' />
            </InputLeftElement>
            <InputRightElement>
              <FiEdit2 onClick={editProfileDataFieldHandler} id='phone' />
            </InputRightElement>
            <Input
              type='tel'
              placeholder='00249126885569'
              isDisabled={phone}
              name='phone'
              onBlur={inputFieldBlurHandler}
            />
          </InputGroup>
        </Box>
        {/* signout btn */}
        <Box position={'absolute'} bottom={'0px'} left={'0'} width={'100%'} padding={'20px'}>
          <Button colorScheme='red' width={'100%'} onClick={handleClick}>
            SingOut
          </Button>
        </Box>
      </div>
    </>
  );
};

export default Profile;
