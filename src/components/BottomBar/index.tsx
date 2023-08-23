import { Icon } from "@chakra-ui/icons";
import { Box, Text, flexbox } from "@chakra-ui/react";
import React from "react";
import {
  BsGearWideConnected,
  BsPersonCircle,
  BsTelephone,
} from "react-icons/bs";
import styles from "./styles.module.scss";
import { IoChatbubbles } from "react-icons/io5";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

const BottomBar = () => {
  const { t } = useTranslation("bottomBar");
  return (
    <Box
      position={"absolute"}
      bottom={"0px"}
      left={"0px"}
      height={"50px"}
      width={"100%"}
      backgroundColor={"gray.50"}
      display={"flex"}
      justifyContent={"space-around"}
      className={styles.bottom_bar}
    >
      <Link href={"/profile"}>
        <Box className={styles.icon_box}>
          <Icon as={BsPersonCircle} boxSize={"6"} />
          <Text>{t("profile")}</Text>
        </Box>
      </Link>
      <Box className={styles.icon_box}>
        <Icon as={IoChatbubbles} boxSize={"6"} color={"messenger.500"} />
        <Text textColor={"messenger.500"}>{t("chats")}</Text>
      </Box>
      <Box className={styles.icon_box}>
        <Icon as={BsTelephone} boxSize={"6"} />
        <Text>{t("calls")}</Text>
      </Box>
      <Link href={"/settings"}>
        <Box className={styles.icon_box}>
          <Icon as={BsGearWideConnected} boxSize={"6"} />
          <Text>{t("settings")}</Text>
        </Box>
      </Link>
    </Box>
  );
};

export default BottomBar;
