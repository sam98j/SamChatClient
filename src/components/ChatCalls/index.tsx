import { Icon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';
import React from 'react';
import { BsTelephone } from 'react-icons/bs';
import { IoVideocamOutline } from 'react-icons/io5';

const ChatCalls = () => {
    return (
        <Box display={'flex'} alignItems={'center'} gap={5}>
            {/* voice call btn */}
            <Icon as={BsTelephone} boxSize={'5'} color={'messenger.500'}/>
            {/* video call btn */}
            <Icon as={IoVideocamOutline} boxSize={'6'} color={'messenger.500'}/>
        </Box>
    );
};

export default ChatCalls;