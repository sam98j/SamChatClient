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
import AppLogo from '@/components/AppLogo';
import { HiOutlineCamera, HiOutlineKey, HiOutlineMail } from 'react-icons/hi';
import { BsPersonCircle } from 'react-icons/bs';
import { SignUpDto } from '@/interfaces/auth.interface';
import { useDispatch } from 'react-redux';
import { signUpApi } from '@/apis/auth.api';
import { AnyAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/router';

const SignUp = () => {
    const dispatch = useDispatch();
    const {push} = useRouter();
    const user = useSelector((state: RootState) => state.auth.currentUser);
    const [isLoading, setIsLoading] = useState(false);
    const [state, setState] = useState<SignUpDto>({
        email: '',
        usrname: '',
        password: '',
        avatar: '',
        name: '',
    });
    // handleInputChange
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
        if (e.target.name === 'profile_img') {
            const formData = new FormData();
            formData.append('profile_img', e.target.files![0]);
            setState({
                ...state,
                avatar: '',
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
        if(user) {push('/chats');}
    }, [user]);
    return (
        <>
            <Head>
                <title>SignUp Page</title>
            </Head>
            {/* body */}
            <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                padding={'40px'}
                gap={5}
                className={styles.signup}
            >
                <AppLogo />
                <Text fontWeight={'black'} fontSize={'x-large'}>
          Welcome To SamChat
                </Text>
                {/* form */}
                <form onSubmit={handleSubmition}>
                    {/* email */}
                    <InputGroup>
                        <FormControl>
                            <InputLeftElement>
                                <Icon as={HiOutlineMail} />
                            </InputLeftElement>
                            <Input
                                placeholder="Email"
                                type="email"
                                name="email"
                                value={state.email}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </InputGroup>
                    {/* name */}
                    <InputGroup>
                        <FormControl>
                            <InputLeftElement>
                                <Icon as={BsPersonCircle} />
                            </InputLeftElement>
                            <Input
                                placeholder="Your name"
                                type="text"
                                name="name"
                                value={state.name}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </InputGroup>
                    {/* password */}
                    <InputGroup>
                        <FormControl>
                            <InputLeftElement>
                                <Icon as={HiOutlineKey} />
                            </InputLeftElement>
                            <Input
                                placeholder="password"
                                type="password"
                                name="password"
                                value={state.password}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </InputGroup>
                    <InputGroup>
                        {/* re-enter password */}
                        <FormControl>
                            <InputLeftElement>
                                <Icon as={HiOutlineKey} />
                            </InputLeftElement>
                            <Input
                                placeholder="re-enter your password"
                                type="password"
                                name="password"
                                value={state.password}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </InputGroup>
                    {/* usrname */}
                    <InputGroup>
                        <FormControl>
                            <InputLeftElement>
                                <Icon as={BsPersonCircle} />
                            </InputLeftElement>
                            <Input
                                placeholder="username"
                                type="text"
                                name="usrname"
                                value={state.usrname}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </InputGroup>
                    {/* file */}
                    <InputGroup>
                        <FormControl>
                            <InputLeftElement>
                                <Icon as={HiOutlineCamera} />
                            </InputLeftElement>
                            <Input
                                placeholder="username"
                                type="file"
                                accept="image/png, image/jpeg"
                                id="profile_img"
                                name="profile_img"
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </InputGroup>
                    <Button
                        colorScheme="messenger"
                        width={'fit-content'}
                        marginTop={'20px'}
                        type="submit"
                        isDisabled={isLoading}
                    >
                        {isLoading ? 'Signing Up ...' : 'Sign Up'}
                    </Button>
                </form>
            </Box>
        </>
    );
};

export default SignUp;
