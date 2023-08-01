import { store, wrapper } from "@/redux/store";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import localFont from "next/font/local";
// import the lcoal font
const effraFont = localFont({
  src: "../../public/efrraweb/alfont_com_alfont_com_effra_md-1-webfont.woff2",
  display: "swap",
  // @ts-ignore
  subsets: ["arabic"],
});

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Provider store={store}>
        <div className={effraFont.className}>
          <Component {...pageProps} />
        </div>
      </Provider>
    </ChakraProvider>
  );
}

export default wrapper.withRedux(App);
