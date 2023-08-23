import Head from "next/head";
import React, { useEffect } from "react";
import styles from "./styles.module.scss";
import { Avatar, Badge, Box, Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/auth.slice";
import { setCurrentRoute } from "@/redux/system.slice";
import useTranslation from "next-translate/useTranslation";

const Profile = () => {
  const { t } = useTranslation("routesNames");
  // router
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  useEffect(() => {
    dispatch(setCurrentRoute(t("profile")));
  }, []);
  // handleClick
  const handleClick = () => {
    dispatch(logout());
    // check for current user auth state
    if (!currentUser) {
      router.push("/home");
    }
  };
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <div className={styles.profile}>
        {/* main */}
        <Box
          height="calc(100% - 50px)"
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          padding={"30px"}
          gap={5}
        >
          <Avatar
            src="https://xsgames.co/randomusers/avatar.php?g=female"
            size={"2xl"}
          />
          <Text fontSize={"2xl"} fontWeight={"black"}>
            Hosam Alden
          </Text>
        </Box>
        {/* signout btn */}
        <Box
          position={"absolute"}
          bottom={"0px"}
          left={"0"}
          width={"100%"}
          padding={"20px"}
        >
          <Button colorScheme="red" width={"100%"} onClick={handleClick}>
            SingOut
          </Button>
        </Box>
      </div>
    </>
  );
};

export default Profile;
