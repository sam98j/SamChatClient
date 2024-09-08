import { ChatMember } from '@/redux/chats.slice';
import { Box, Button, List } from '@chakra-ui/react';
import React, { FC } from 'react';
import { BsPersonAdd } from 'react-icons/bs';
import GroupMember from '../GroupMember';
import useTranslation from 'next-translate/useTranslation';
import { useDispatch } from 'react-redux';
import { setVisablityOfCreateChatGroupMenu } from '@/redux/system.slice';

// props
type Props = { members: ChatMember[] };

const GroupMembersList: FC<Props> = ({ members }) => {
  // dispatch
  const dispatch = useDispatch();
  // add member handler
  const addMembersHandler = () => dispatch(setVisablityOfCreateChatGroupMenu(true));
  // translation method
  const { t } = useTranslation('chatProfile');

  return (
    <Box backgroundColor={'gray.50'} width={'full'} padding={'10px'}>
      <Button display={'flex'} gap={'10px'} padding={0} backgroundColor={'transparent'} onClick={addMembersHandler}>
        <BsPersonAdd size={'1.5rem'} />
        {t('group_chat.add_members_btn')}
      </Button>
      {/* loop throw members */}
      <List display={'flex'} flexDirection={'column'} gap={'10px'}>
        {members.map((member) => (
          <GroupMember member={member} key={member._id} />
        ))}
      </List>
    </Box>
  );
};

export default GroupMembersList;
