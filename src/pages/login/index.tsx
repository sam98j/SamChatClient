import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Button,
  Checkbox,
  CheckboxGroup,
} from "@chakra-ui/react";
import { HiOutlineMail, HiLockOpen } from "react-icons/hi";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Logo from "../../../assets/vectors/chat-round-check-svgrepo-com.svg";
import Vector from "../../../assets/vectors/undraw_login_re_4vu2.svg";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { loginUser } from "@/apis/auth.api";
import { Spinner } from "@chakra-ui/react";
import LoginAlerts from "@/components/LoginAlerts/LoginAlerts";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "@/components/LangSwitcher/LangSwitcher";
import useTranslation from "next-translate/useTranslation";

const Login: React.FC<any> = () => {
  // translation
  const { t } = useTranslation("login");
  // component Local state
  const [userCred, setUserCred] = useState<{ email: string; password: string }>(
    { email: "", password: "" }
  );
  // get data from the redux store
  const { currentUser, apiResMessage } = useSelector(
    (state: RootState) => state.auth
  );
  // Router
  const router = useRouter();
  // handle Input Change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setUserCred({
      ...userCred,
      [event.target.name]: event.target.value,
    });
  };
  // handle form Submition
  const handleFormSubmition = (event: React.FormEvent) => {
    event.preventDefault();
    Dispatch(loginUser(userCred) as any);
  };
  // redirec the user when loggedIn succ
  useEffect(() => {
    // check if the current user is logged in
    if (currentUser) {
      router.push("/");
      return;
    }
  }, [currentUser]);
  // React Redux Dispatch Function
  const Dispatch = useDispatch();
  return (
    <>
      <Head>
        <title>Login to Your Account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.login}>
        {apiResMessage ? <LoginAlerts response={apiResMessage} /> : ""}
        {/* Login Form */}
        <form onSubmit={handleFormSubmition}>
          <div className={styles.formHeader}>
            {/* form Header */}
            <h1>
              <Image src={Logo} alt="logo" /> SamChat
            </h1>
            <h2>{t("app_name")}</h2>
            <p>welcome back! select method to log in</p>
          </div>
          {/* email input */}
          <FormControl className={styles.FormControl}>
            {/* <FormLabel>Email address</FormLabel> */}
            <i>
              <HiOutlineMail size={"20px"} />
            </i>
            <Input
              type="email"
              placeholder="Eamil"
              value={userCred.email}
              name="email"
              onChange={handleInputChange}
            />
            <FormHelperText>We'll never share your email.</FormHelperText>
          </FormControl>
          {/* password input */}
          <FormControl className={styles.FormControl}>
            <i>
              <HiLockOpen />
            </i>
            <Input
              type="password"
              placeholder="Password"
              value={userCred.password}
              name="password"
              onChange={handleInputChange}
            />
          </FormControl>
          <div className={styles.areaContainer}>
            <Checkbox className={styles.checkBox}>Remember Me</Checkbox>
            <a href="">Forget Your Password ?</a>
          </div>
          {/* submit btn */}
          <div className={styles.btnArea}>
            <Button
              colorScheme="green"
              className={styles.formSubmitionBtn}
              type="submit"
            >
              {currentUser ? (
                <p>Log In</p>
              ) : currentUser === undefined ? (
                <p>Login</p>
              ) : (
                <Spinner
                  thickness="2px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="green.300"
                  size="md"
                />
              )}
            </Button>
          </div>
          <p className={styles.createAccountLink}>
            Don't hava an account? <a href="">Create an account</a>
          </p>
          {/* bottom area */}
          <div className="">
            <LanguageSwitcher />
          </div>
        </form>
        {/* vector section */}
        <div className={styles.vectorSection}>
          <Image src={Vector} alt="vector image" />
        </div>
      </div>
    </>
  );
};

export default Login;
