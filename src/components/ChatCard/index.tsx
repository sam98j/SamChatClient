import React, { useCallback, useEffect, useState } from "react";
import { Avatar, Box, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { usePathname, useSearchParams } from "next/navigation";
import { SingleChat, setOpenedChat } from "@/redux/chats.slice";
import { useDispatch } from "react-redux";
import useChatsApi from "./getData.hook";

const ChatCard: React.FC<{ avataruri: string; chat: SingleChat }> = ({
  avataruri,
  chat,
}) => {
  const searchParams = useSearchParams();
  const [previewData, setPreveiwData] = useState<{
    date: string;
    lastMsgText: string;
    unReadedMsgs: number;
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
  // componet did mount
  useEffect(() => {
    (async () => {
      const data = await fetchChatPreviewData(chat.usrid);
      if (!data) return;
      setPreveiwData({
        ...data,
      });
    })();
  }, []);
  return (
    <Link
      href={`/chat?${createQueryString("id", chat.usrid)}`}
      onClick={() =>
        dispatch(setOpenedChat({ id: chat.usrid, usrname: chat.usrname }))
      }
    >
      <Box
        display={"flex"}
        gap={"3"}
        padding={"1.25rem 1.25rem 0rem 1.25rem"}
        border={""}
      >
        <Avatar name="Hosam Alden" src={avataruri} />
        <Box flexGrow={"1"}>
          <Heading size={"sm"} marginBottom={"5px"} textColor={"messenger.500"}>
            {chat.usrname}
          </Heading>
          <Text textColor={"gray.500"}>{previewData?.lastMsgText}</Text>
        </Box>
        <Box>
          <Text width={"fit-content"}>{previewData?.date}</Text>
          {previewData?.unReadedMsgs === 0 ? (
            ""
          ) : (
            <Text
              bgColor={"messenger.500"}
              textColor={"white"}
              width={"1.25rem"}
              height={"1.25rem"}
              borderRadius={"50%"}
              textAlign={"center"}
              marginLeft={"auto"}
            >
              {previewData?.unReadedMsgs}
            </Text>
          )}
        </Box>
      </Box>
    </Link>
  );
};

export default ChatCard;
