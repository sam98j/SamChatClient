import { RootState, store, wrapper } from "@/redux/store";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import localFont from "next/font/local";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import { useDispatch } from "react-redux";
import { getUserChats } from "@/apis/chats.api";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import CreateChat from "@/components/CreateChat";
// import the lcoal font
const effraFont = localFont({
  src: "../../public/efrraweb/alfont_com_alfont_com_effra_md-1-webfont.woff2",
});

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.currentUser);
  // store dispatch func
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);
  useEffect(() => {
    const userToken = localStorage.getItem("access_token");
    dispatch(getUserChats(userToken) as any);
  }, []);
  return (
    <ChakraProvider>
      <Provider store={store}>
        <div
          className={effraFont.className}
          style={{
            height: "100dvh",
            overflow: "hidden",
          }}
        >
          {user ? <AppHeader /> : ""}
          <Component {...pageProps} />
          <CreateChat />
        </div>
      </Provider>
    </ChakraProvider>
  );
}

export default wrapper.withRedux(App);
