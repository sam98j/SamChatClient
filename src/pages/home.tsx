import Head from "next/head";
import React from "react";
import styles from "./index.module.scss";
import AppHeader from "@/components/AppHeader";
import { Box, Text } from "@chakra-ui/react";

const Home = () => {
  return (
    <>
      <>
        <Head>
          <title>SamChat | Home</title>
        </Head>
        <div className={styles.home}>
          <div className={styles.container}>
            {/* <Text fontSize={"3xl"} fontWeight={"black"}>
              Welcome to <Text textColor={"messenger.500"}>SamChat</Text>
              <Text>Fast, Secure, easy Chat App</Text>
            </Text>
            <Text textColor={"gray"}>
              SamChat is a free, web-based messaging app that allows you to stay
              in touch with friends and family from anywhere in the world. With
              SamChat, you can send text messages, make voice calls, and video
              chat. You can also share photos, videos, and files.
            </Text> */}
          </div>
        </div>
      </>
    </>
  );
};

export default Home;
