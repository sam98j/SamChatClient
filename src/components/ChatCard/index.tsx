import React, { useCallback } from "react";
import { Avatar, Box, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { usePathname, useSearchParams } from "next/navigation";
import { SingleChat, setOpenedChat } from "@/redux/chats.slice";
import { useDispatch } from "react-redux";

const ChatCard: React.FC<{ avataruri: string; chat: SingleChat }> = ({
  avataruri,
  chat,
}) => {
  const searchParams = useSearchParams();
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
  return (
    <Link
      href={`/chat?${createQueryString("id", chat.chatWith.usrid)}`}
      onClick={() =>
        dispatch(
          setOpenedChat({ id: chat.chatId, usrname: chat.chatWith.usrname })
        )
      }
    >
      <Box
        display={"flex"}
        gap={"3"}
        padding={"1.25rem 1.25rem 0rem 1.25rem"}
        border={""}
      >
        <Avatar name="Hosam Alden" src={avataruri} />
        <Box>
          <Heading size={"sm"} marginBottom={"5px"} textColor={"messenger.500"}>
            {chat.chatWith.usrname}
          </Heading>
          <Text textColor={"gray.500"}>
            Lorem, ipsum dolor sit amet consectetur adipisicing eli
          </Text>
        </Box>
        <Box>
          <Text width={"fit-content"}>10:30AM</Text>
          <Text
            bgColor={"messenger.500"}
            textColor={"white"}
            width={"1.25rem"}
            height={"1.25rem"}
            borderRadius={"50%"}
            textAlign={"center"}
            marginLeft={"auto"}
          >
            6
          </Text>
        </Box>
      </Box>
    </Link>
  );
};

export default ChatCard;
