import Head from "next/head";
import "../styles/globals.css";
import toast, { Toaster } from "react-hot-toast";

import { StateContextProvider } from "../Context/index";

export default function App({ Component, pageProps }) {
  return (
    <>
      <StateContextProvider>
        <Component {...pageProps} />
        <Toaster />
      </StateContextProvider>
    </>
  );
}
