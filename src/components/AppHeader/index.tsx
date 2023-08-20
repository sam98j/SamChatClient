import React from "react";
import styles from "./styles.module.scss";
import {
  ChevronLeftIcon,
  EditIcon,
  HamburgerIcon,
  Icon,
} from "@chakra-ui/icons";
import { Avatar, Box, ResponsiveValue, Text } from "@chakra-ui/react";
import Link from "next/link";
import { changeNewChatScrStatus } from "@/redux/system.slice";
import { useDispatch } from "react-redux";
import { BsTelephone } from "react-icons/bs";
import { IoVideocamOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { HiOutlineChevronLeft } from "react-icons/hi";
const AppHeader = () => {
  // get opened chat status
  const { openedChat, isChatUsrTyping, chatUsrStatus } = useSelector(
    (state: RootState) => {
      return {
        openedChat: state.chat.openedChat,
        isChatUsrTyping: state.chat.isChatUsrTyping,
        chatUsrStatus: state.chat.chatUsrStatus,
      };
    }
  );
  // Screen Header Name align
  const isChatOpen = Boolean(openedChat) ? "true" : "false";
  // dispach
  const dispatch = useDispatch();
  return (
    <Box
      className={styles.appHeader}
      display={"flex"}
      alignItems={"center"}
      overflowY={"hidden"}
      is-chat-open={isChatOpen}
      gap={"5"}
    >
      {/* back Arr */}
      <Box>
        {Boolean(openedChat) ? (
          <Link
            href={"/chats"}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon
              as={HiOutlineChevronLeft}
              color={"messenger.500"}
              boxSize={"6"}
            />
            <Text marginTop={"5px"} textColor={"messenger.500"}>
              Chats
            </Text>
          </Link>
        ) : (
          ""
        )}
      </Box>
      {/* Screen name */}
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        flexGrow={"1"}
        gap={"20px"}
        className={styles.screen_name_container}
      >
        {/* Chat Name */}
        <Text className={styles.screen_name} fontSize={"lg"}>
          {openedChat === undefined ? "Chats" : openedChat?.usrname}
        </Text>
        {/* is Chat User Typing */}
        <Box
          fontSize={"sm"}
          className={styles.usr_status}
          is-typing={String(isChatUsrTyping)}
          is-online="false"
        >
          <span className={styles.typing}>typing ...</span>
          <span className={styles.online}>{chatUsrStatus}</span>
        </Box>
      </Box>
      {openedChat === undefined ? (
        <EditIcon
          boxSize={"6"}
          color={"messenger.500"}
          onClick={() => dispatch(changeNewChatScrStatus(true))}
        />
      ) : (
        <Box display={"flex"} alignItems={"center"} gap={5}>
          <Avatar
            name="Hosam Alden"
            size={"sm"}
            src="https://xsgames.co/randomusers/avatar.php?g=male"
          ></Avatar>
          <Icon as={BsTelephone} boxSize={"5"} color={"messenger.500"} />
          <Icon as={IoVideocamOutline} boxSize={"6"} color={"messenger.500"} />
        </Box>
      )}
    </Box>
  );
};

export default AppHeader;
