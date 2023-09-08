import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Box, Heading, SkeletonCircle, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SingleChat, setOpenedChat } from '@/redux/chats.slice';
import { useDispatch, useSelector } from 'react-redux';
import useChatsApi from './getData.hook';
import useTranslation from 'next-translate/useTranslation';
import { Icon } from '@chakra-ui/icons';
import { BsMic } from 'react-icons/bs';
import { secondsToDurationConverter } from '@/utils/voiceMemoRec';
import MessageStatusIcon from '../MessageStatus';
import { MessageStatus } from '@/interfaces/chat.interface';
import { RootState } from '@/redux/store';

const ChatCard: React.FC<{ avataruri: string; chat: SingleChat }> = ({avataruri, chat}) => {
    const searchParams = useSearchParams();
    // get data from store
    const newIncomingMsg = useSelector((state: RootState) => state.system.newIncomingMsg);
    const {t} = useTranslation('chatCard');
    const [previewData, setPreveiwData] = useState<{
        date: string;
        lastMsgText: string;
        unReadedMsgs: number;
        isItTextMsg: boolean,
        voiceNoteDuration: string,
        senderId: string;
        status: MessageStatus | null
    }>();
    const { fetchChatPreviewData } = useChatsApi();
    // store dispatch function
    const dispatch = useDispatch();
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams);
            params.set(name, value);

            return params.toString();
        },
        [searchParams]
    );
    // listen for the new incoming msg
    useEffect(() => {
        if(!newIncomingMsg || newIncomingMsg.senderId !== chat.usrid) return;
        const {date, senderId, text: lastMsgText, isItTextMsg, status, voiceNoteDuration} = newIncomingMsg;
        // incoming msg date
        const incomingMsgDate = new Date(date);
        setPreveiwData({
            ...previewData,
            senderId, lastMsgText, isItTextMsg, status: status, voiceNoteDuration,
            unReadedMsgs: previewData?.unReadedMsgs as number,
            date: `${incomingMsgDate.getHours()}:${incomingMsgDate.getMinutes()}`
        });
    }, [newIncomingMsg]);
    // componet did mount
    useEffect(() => {
        (async () => {
            const data = await fetchChatPreviewData(chat.usrid);
            if (!data) return;
            setPreveiwData({...data});
        })();
    }, []);
    return (
        <Link
            href={`/chat?${createQueryString('id', chat.usrid)}`}
            onClick={() => dispatch(setOpenedChat({ id: chat.usrid, usrname: chat.usrname }))}
        >
            <Box
                display={'flex'}
                gap={'3'}
                padding={'1.25rem 1.25rem 0rem 1.25rem'}
                border={''}
            >
                <Avatar name='Hosam Alden' src={avataruri} />
                <Box flexGrow={'1'}>
                    <Heading
                        size={'sm'}
                        marginBottom={'5px'}
                        textColor={'messenger.500'}
                        fontFamily={'effra'}
                    >
                        {chat.usrname}
                    </Heading>
                    <Text textColor={'gray.500'} display={'flex'} alignItems={'center'}>
                        <MessageStatusIcon data={{msgStatus: previewData?.status as MessageStatus, senderId: previewData?.senderId as string}}/>
                        {previewData && previewData?.isItTextMsg ? previewData?.lastMsgText : previewData && !previewData.isItTextMsg ? (<><Icon as={BsMic} />{t('voiceMsg')} {secondsToDurationConverter(Number(previewData?.voiceNoteDuration))}</>) : ''}
                        {/* loading */}
                        {!previewData ? <Box height={'10px'} width={'100%'} bgColor={'gray.100'} borderRadius={'10px'}></Box> : ''}
                    </Text>
                </Box>
                <Box>
                    {/* loading msg time */}
                    <Text width={'fit-content'}>
                        {previewData ? previewData?.date : <Box height={'10px'} width={'50px'} bgColor={'gray.100'} borderRadius={'10px'}></Box>}
                    </Text>
                    {previewData && previewData?.unReadedMsgs !== 0 ? (
                        <Text
                            bgColor={'messenger.500'}
                            textColor={'white'}
                            width={'1.25rem'}
                            height={'1.25rem'}
                            borderRadius={'50%'}
                            textAlign={'center'}
                            marginLeft={'auto'}
                        >
                            {previewData?.unReadedMsgs}
                        </Text>
                    ) : ''}
                    {/* loading */}
                    {!previewData ? <SkeletonCircle size='5' marginLeft={'auto'} marginTop={'10px'}/> : ''}
                </Box>
            </Box>
        </Link>
    );
};

export default ChatCard;
