import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { ChatMessage, MessageStatus } from "@/pages/chat/chat.interface";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Icon } from "@chakra-ui/icons";
import { BiCheck, BiCheckDouble } from "react-icons/bi";
import { Text } from "@chakra-ui/react";
import { HiOutlineClock } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { setMessageStatus } from "@/redux/chats.slice";

const ChatMassage: React.FC<{
  messageData: ChatMessage;
  markMsgAsReaded: (msgId: string, senderId: string) => void;
}> = ({ messageData, markMsgAsReaded }) => {
  // redux dispatch function
  const dispatch = useDispatch();
  const { text, senderId, status } = messageData;
  // fetch data from redux store
  const currentUsr = useSelector((state: RootState) => state.auth.currentUser);
  // get data from redux store
  const currentUsrId = useSelector(
    (state: RootState) => state.auth.currentUser
  );
  const [state, setState] = useState({
    sendedByme: currentUsrId === senderId,
  });
  // component mount
  useEffect(() => {
    // check if the current usr is not the sender
    if (currentUsr !== senderId) {
      dispatch(
        setMessageStatus({
          msgId: messageData._id,
          status: MessageStatus.READED,
        })
      );
      markMsgAsReaded(messageData._id, senderId);
    }
  }, []);
  return (
    <div
      className={styles.bubble}
      sended-by-me={`${String(state.sendedByme)}`}
      message-status={String(status)}
    >
      <Text>{text}</Text>
      {/* when status is null show clock icon */}
      <Icon
        as={HiOutlineClock}
        position={"absolute"}
        bottom={"7px"}
        right={"8px"}
        color={"gray"}
        boxSize={"4"}
        className={styles.time_icon}
      />
      <Icon
        as={BiCheck}
        position={"absolute"}
        bottom={"7px"}
        right={"8px"}
        boxSize={"5"}
        color={"gray"}
        className={styles.check_icon}
      />
      <Icon
        as={BiCheckDouble}
        position={"absolute"}
        bottom={"7px"}
        right={"8px"}
        boxSize={"5"}
        color={"gray"}
        className={styles.double_check_icon}
      />
    </div>
  );
};

export default ChatMassage;
