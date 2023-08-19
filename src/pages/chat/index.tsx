import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { ImAttachment } from "react-icons/im";
import { BsMic } from "react-icons/bs";
import { BiSticker } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import { Icon } from "@chakra-ui/icons";
import { Socket, io } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import NextImage from "next/image";
import NoMessageDrow from "../../../assets/vectors/undraw_new_message_re_fp03.svg";
import { useSearchParams } from "next/navigation";
import { v4 as uuid } from "uuid";
import { ChatMessage, MessageStatus } from "./chat.interface";
import { useDispatch } from "react-redux";
import {
  addMessageToChat,
  setChatUsrStatus,
  setChatUsrTyping,
  setMessageStatus,
  setOpenedChat,
} from "@/redux/chats.slice";
import { getChatMessages, getUsrOnlineStatus } from "@/apis/chats.api";
import ChatMassage from "@/components/ChatMassage";
import { playReceiveMessageSound, playSentMessageSound } from "./chat.utils";

interface ChatInterface {
  msgText: string;
  opened_socket: Socket | null;
}

const Chat = () => {
  // redux store dispatch function
  const dispatch = useDispatch();
  // use ref
  const chatRef = useRef<HTMLDivElement>(null);
  const { currentUsr, openedChat, chatMessages } = useSelector(
    (state: RootState) => {
      return {
        currentUsr: state.auth.currentUser!,
        openedChat: state.chat.openedChat,
        chatMessages: state.chat.chatMessages,
      };
    }
  );
  const parmas = useSearchParams();
  // get url params
  const [state, setState] = useState<ChatInterface>({
    msgText: "",
    opened_socket: null,
  });
  // handleInputFocus
  const handleInputFocus = () =>
    state.opened_socket?.emit("chatusr_typing_status", {
      chatUsrId: parmas.get("id"),
      status: true,
    });
  // handleInputBlur
  const handleInputBlur = () =>
    state.opened_socket?.emit("chatusr_typing_status", {
      chatUsrId: parmas.get("id"),
      status: false,
    });
  // opened socket
  // inputChangeHandler
  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };
  // handleSendBtnClick
  const handleSendBtnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // create meassge
    const message = {
      _id: uuid(),
      receiverId: parmas.get("id"),
      senderId: currentUsr,
      text: state.msgText,
      date: new Date().toString(),
      status: null,
    } as ChatMessage;
    dispatch(addMessageToChat(message));
    // send message with web sockets
    state.opened_socket?.emit("send_msg", message);
    // clear the input
    setState({
      ...state,
      msgText: "",
    });
  };
  // mark maessage as readed
  const markMessageAsReaded = (msgId: string, senderId: string) => {
    state.opened_socket?.emit("message_readed", { msgId, senderId });
  };
  // scroll to the bottom of the view
  useEffect(() => {
    // scroll view to the end after send msg
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [chatMessages]);
  // component did mount life cicle hook
  useEffect(() => {
    // get usr online status
    dispatch(getUsrOnlineStatus(parmas.get("id")!) as any);
    // check for chat opened
    if (openedChat) {
      // load chat messages
      dispatch(getChatMessages(parmas.get("id")!) as any);
    }
    // // open websocket connection
    const socket = io("http://localhost:2000/", {
      query: { client_id: currentUsr },
    });
    // chatusr_start_typing
    socket.on("chatusr_typing_status", (status) =>
      dispatch(setChatUsrTyping(status))
    );
    // receive msg
    socket.on("message", (message: ChatMessage) => {
      socket.emit("message_delevered", {
        msgId: message._id,
        senderId: message.senderId,
      });
      // check if the msg releated to current chat
      if (message.senderId !== openedChat?.id) {
        return;
      }
      dispatch(addMessageToChat(message));
      playReceiveMessageSound();
    });
    // usr_online_status
    socket.on("usr_online_status", (data) => {
      if (parmas.get("id") === data.id) {
        dispatch(setChatUsrStatus(data.status));
      }
    });
    // on new chat create
    socket.on("chat_created", (chatId) => dispatch(setOpenedChat(chatId)));
    // receive message status
    socket.on(
      "message_status",
      (data: { msgId: string; status: MessageStatus }) => {
        dispatch(setMessageStatus(data));
        // check for message sent status
        if (data.status === MessageStatus.SENT) {
          playSentMessageSound();
        }
      }
    );
    setState({
      ...state,
      opened_socket: socket,
    });
    // clean up when component unmount
    return function cleanUp() {
      dispatch(setOpenedChat(undefined));
    };
  }, []);
  // dummy messages
  return (
    <>
      <Head>
        <title>Hosam Alden</title>
      </Head>
      <div className={styles.chat} ref={chatRef}>
        {/* chat messages */}
        {chatMessages.length ? (
          chatMessages.map((msg) => (
            <ChatMassage
              messageData={msg}
              key={Math.random()}
              markMsgAsReaded={markMessageAsReaded}
            />
          ))
        ) : (
          <Box className={styles.imgContainer}>
            <NextImage src={NoMessageDrow} alt="" />
            <Text textColor={"gray"} fontSize={"1.5rem"}>
              No Messages Yet
            </Text>
          </Box>
        )}
        {/* chat footer */}
        <Box
          className={styles.footer}
          bgColor={"gray.50"}
          gap={4}
          padding={"10px"}
          display={"flex"}
          alignItems={"center"}
        >
          <Icon as={ImAttachment} boxSize={5} color={"messenger.500"} />
          <InputGroup>
            <InputRightElement>
              <Icon as={BiSticker} boxSize={5} color={"messenger.500"} />
            </InputRightElement>
            <Input
              variant="filled"
              placeholder="Type Your Message"
              borderRadius={"20px"}
              value={state?.msgText}
              name="msgText"
              onChange={inputChangeHandler}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </InputGroup>
          <IconButton
            onClick={handleSendBtnClick}
            isRound={true}
            icon={
              <Icon
                as={state?.msgText ? IoSend : BsMic}
                boxSize={5}
                color={"white"}
              />
            }
            aria-label=""
            colorScheme={"messenger"}
          />
        </Box>
      </div>
    </>
  );
};

export default Chat;
