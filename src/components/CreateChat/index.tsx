/* eslint-disable react/no-unknown-property */
import React, { useState } from 'react';
import styles from './styles.module.scss';
import NewChatUser from '../NewChatUser';
import useUsersApi from './getUsrs.hook';
import { LoggedInUserData } from '@/redux/auth.slice';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { changeNewChatScrStatus } from '@/redux/system.slice';
import SearchInput from '../SearchInput/SearchInput';

const CreateChat = () => {
    // redux store dispatch function
    const dispatch = useDispatch();
    // redux store
    const isModalOpen = useSelector((state: RootState) => state.system.isNewChatScreenOpen);
    const { fetchUsers } = useUsersApi();
    // use effect
    // componet state
    const [state, setState] = useState<{
        searchqr: string;
        fetchedUsers: Omit<LoggedInUserData, 'email'>[];
        loading: boolean;
    }>({
        searchqr: '',
        fetchedUsers: [],
        loading: false,
    });
    // handleFormChange
    const handleFormChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setState({
                ...state,
                loading: true,
            });
        }
        const fetchedUsers = await fetchUsers(e.target.value);
        setState({
            ...state,
            searchqr: e.target.value,
            fetchedUsers,
            loading: false,
        });
    };
    return (
        <div className={styles.create_chat_container} is-opened={String(isModalOpen)}>
            {/* close modal  */}
            <div style={{ height: '100%' }} onClick={() => dispatch(changeNewChatScrStatus(false))}></div>
            {/* create chat modal */}
            <div className={styles.create_chat}>
                {/* Search Input */}
                <SearchInput data={{handleFormChange, loadingState: state.loading}}/>
                {/* new Chat User */}
                {state.fetchedUsers.map((usr) => (<NewChatUser key={usr._id} usr={usr} searchqr={state.searchqr}/>))}
            </div>
        </div>
    );
};

export default CreateChat;
