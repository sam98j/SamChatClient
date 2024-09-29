import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import {
  Avatar,
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import { FiEdit2 } from 'react-icons/fi';
import { FaRegUserCircle, FaRegCheckCircle } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { MdAlternateEmail } from 'react-icons/md';
import { VscError } from 'react-icons/vsc';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/auth.slice';
import { setCurrentRoute } from '@/redux/system.slice';
import useTranslation from 'next-translate/useTranslation';
import { getUsrProfileData, updateUsrProfileData } from '@/apis/usrprofile.api';
import { PhoneIcon } from '@chakra-ui/icons';
import { ImSpinner3 } from 'react-icons/im';
import { AnyAction } from '@reduxjs/toolkit';
import { setProfileFieldUpdateStatus } from '@/redux/profile.slice';
import { useSession, signOut } from 'next-auth/react';

export interface IsProfileDataEditDisabled {
  name: boolean;
  email: boolean;
  phone: boolean;
  usrname: boolean;
}

export interface IsProfileDataFieldLoading {
  name: boolean;
  email: boolean;
  phone: boolean;
  usrname: boolean;
}

const Profile = () => {
  // api url
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  // google sign in session
  const { data: googleSignInSession } = useSession();
  // get data from redux store
  const { currentUser, usrProfiledata, fieldUpdateStatus } = useSelector(
    (state: RootState) => {
      return {
        currentUser: state.auth.currentUser,
        usrProfiledata: state.usrProfile,
        fieldUpdateStatus: state.usrProfile.profileDataFieldUpdatingStatus,
      };
    },
  );
  // local state
  const [isProfileDataEditDisabled, setProfileDataEditDisabled] =
    useState<IsProfileDataEditDisabled>({
      name: true,
      email: true,
      phone: true,
      usrname: true,
    });
  // compute usr profile url
  const usrAvatarUrl = `${usrProfiledata.usrProfile?.avatar.includes('http') ? '' : API_URL}${usrProfiledata.usrProfile?.avatar}`;
  // local state destruct
  const { name, email, phone, usrname } = isProfileDataEditDisabled;
  // is profile data fields loading
  const [isProfileDataFieldLoading, setProfileDataFieldLoading] =
    useState<IsProfileDataFieldLoading>({
      name: false,
      email: false,
      phone: false,
      usrname: false,
    });
  // local state destruct
  const {
    usrname: isUsrnameLoading,
    phone: isPhoneLoading,
    name: isNameLoading,
    email: isEmailLoading,
  } = isProfileDataFieldLoading;
  // translation
  const { t } = useTranslation('routesNames');
  // dispatch
  const dispatch = useDispatch();
  // component did mount
  useEffect(() => {
    dispatch(setCurrentRoute(t('profile')));
    dispatch(getUsrProfileData(currentUser!._id) as unknown as never);
  }, []);
  // handleClick signout
  const handleSingoutBtnClick = async () => {
    // check for googleSignInSession
    if (googleSignInSession) await signOut();
    // there is no googleSignInSession
    dispatch(logout());
  };
  // handle edit profile data field
  const editProfileDataFieldHandler = (e: React.MouseEvent<SVGAElement>) => {
    e.preventDefault();
    // get profile data field name
    const fieldName = e.currentTarget.id;
    // set local state
    setProfileDataEditDisabled((state) => ({ ...state, [fieldName]: false }));
  };
  // input blur handler
  const inputFieldBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    // loading
    setProfileDataFieldLoading((state) => ({
      ...state,
      [e.target.name]: false,
    }));
    // set local state
    setProfileDataEditDisabled((state) => ({
      ...state,
      [e.target.name]: true,
    }));
    // clear profile field updating status
    dispatch(setProfileFieldUpdateStatus());
  };
  // input change event
  const inputChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // loading
    setProfileDataFieldLoading((state) => ({
      ...state,
      [e.target.name]: true,
    }));
    // dispatch an action
    dispatch(
      updateUsrProfileData({
        field: e.target.name,
        value: e.target.value,
      }) as unknown as AnyAction,
    );
    // clear profile field updating status
    dispatch(setProfileFieldUpdateStatus());
  };
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <div className={styles.profile}>
        {/* main */}
        <div className="flex flex-col items-center mb-5">
          {/* avatar */}
          <Avatar
            src={usrAvatarUrl}
            size={'2xl'}
            name={usrProfiledata.usrProfile?.name}
          />
          {/* name */}
          <Text fontSize={'2xl'} fontWeight={'black'} margin={'0'}>
            {usrProfiledata.usrProfile?.name}
          </Text>
          <Text textColor={'gray'}>@{usrProfiledata.usrProfile?.usrname}</Text>
        </div>
        {/* profile data */}
        <Box gap={5} display={'flex'} flexDirection={'column'}>
          {/* email */}
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <HiOutlineMail color="gray" />
            </InputLeftElement>
            <InputRightElement>
              {!isEmailLoading && !fieldUpdateStatus ? (
                <FiEdit2 onClick={editProfileDataFieldHandler} id="email" />
              ) : (
                ''
              )}
              {isEmailLoading && !fieldUpdateStatus ? (
                <ImSpinner3 color="blue" className={styles.loading_spinner} />
              ) : (
                ''
              )}
              {/* error icon */}
              {fieldUpdateStatus && fieldUpdateStatus.err ? (
                <VscError color="red" />
              ) : (
                ''
              )}
              {/* no error icon */}
              {fieldUpdateStatus && !fieldUpdateStatus.err ? (
                <FaRegCheckCircle color="green" />
              ) : (
                ''
              )}
            </InputRightElement>
            <Input
              type="email"
              placeholder={usrProfiledata.usrProfile?.email}
              isDisabled={email}
              name="email"
              onBlur={inputFieldBlurHandler}
              onChange={inputChangeHandler}
            />
          </InputGroup>
          {/* name */}
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FaRegUserCircle color="gray" />
            </InputLeftElement>
            <InputRightElement>
              {isNameLoading ? (
                ''
              ) : (
                <FiEdit2 onClick={editProfileDataFieldHandler} id="name" />
              )}
              {isNameLoading ? (
                <ImSpinner3 color="blue" className={styles.loading_spinner} />
              ) : (
                ''
              )}
            </InputRightElement>
            <Input
              type="text"
              placeholder={usrProfiledata.usrProfile?.name}
              isDisabled={name}
              name="name"
              onBlur={inputFieldBlurHandler}
              onChange={inputChangeHandler}
            />
          </InputGroup>
          {/* usr name */}
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <MdAlternateEmail color="gray" />
            </InputLeftElement>
            <InputRightElement>
              {isUsrnameLoading ? (
                ''
              ) : (
                <FiEdit2 onClick={editProfileDataFieldHandler} id="usrname" />
              )}
              {isUsrnameLoading ? (
                <ImSpinner3 color="blue" className={styles.loading_spinner} />
              ) : (
                ''
              )}
            </InputRightElement>
            <Input
              type="text"
              placeholder={usrProfiledata.usrProfile?.usrname}
              isDisabled={usrname}
              name="usrname"
              onBlur={inputFieldBlurHandler}
              onChange={inputChangeHandler}
            />
          </InputGroup>
          {/* phone number */}
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <PhoneIcon color="gray.300" />
            </InputLeftElement>
            <InputRightElement>
              {isPhoneLoading ? (
                ''
              ) : (
                <FiEdit2 onClick={editProfileDataFieldHandler} id="phone" />
              )}
              {isPhoneLoading ? (
                <ImSpinner3 color="blue" className={styles.loading_spinner} />
              ) : (
                ''
              )}
            </InputRightElement>
            <Input
              type="tel"
              placeholder="00249126885569"
              isDisabled={phone}
              name="phone"
              onBlur={inputFieldBlurHandler}
              onChange={inputChangeHandler}
            />
          </InputGroup>
        </Box>
        {/* signout btn */}
        <Box
          position={'absolute'}
          bottom={'0px'}
          left={'0'}
          width={'100%'}
          padding={'20px'}
        >
          <Button
            colorScheme="red"
            width={'100%'}
            onClick={handleSingoutBtnClick}
          >
            SingOut
          </Button>
        </Box>
      </div>
    </>
  );
};

export default Profile;
