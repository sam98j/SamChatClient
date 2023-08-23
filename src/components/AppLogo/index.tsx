import { Box, Spinner, Text } from "@chakra-ui/react";
import React from "react";
import logoSVG from "../../../assets/vectors/chat-round-check-svgrepo-com.svg";
import Image from "next/image";
import styles from "./styles.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const AppLogo = () => {
  const user = useSelector((state: RootState) => state.auth.currentUser);
  return (
    <Box
      className={styles.logo_container}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      flexDirection={"column"}
      gap={5}
      flexGrow={1}
      is-app-loading={String(user === null)}
    >
      <Box display={"flex"} alignItems={"center"} gap={2}>
        <Image alt="logo" src={logoSVG} className={styles.img} />
        <Text fontSize={"lg"}>SamChat</Text>
      </Box>
      {user === null ? <Spinner color="blue" display={"block"} /> : ""}
    </Box>
  );
};

export default AppLogo;
