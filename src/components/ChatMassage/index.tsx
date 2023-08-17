import React, { useState } from "react";
import styles from "./styles.module.scss";
import { ChatMessage } from "@/pages/chat/chat.interface";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const ChatMassage: React.FC<{ messageData: ChatMessage }> = ({
  messageData,
}) => {
  const { text, senderId } = messageData;
  // get data from redux store
  const currentUsrId = useSelector(
    (state: RootState) => state.auth.currentUser
  );
  const [state, setState] = useState({
    sendedByme: currentUsrId === senderId,
  });
  return (
    <div className={styles.bubble} sended-by-me={`${String(state.sendedByme)}`}>
      {text}
    </div>
  );
};

export default ChatMassage;
