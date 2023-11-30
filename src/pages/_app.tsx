import '@/styles/globals.css'
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux';
import { store } from "@/state/store";
import { StoreValuesProvider } from '@/components';
import { ToastContainer } from 'react-toastify';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>SStreamy - Download Movies in Torrent</title>
      </Head>
      <Provider store={store}>
        <StoreValuesProvider>
          <Component {...pageProps} />
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable
            theme="dark" />
        </StoreValuesProvider>
      </Provider>
    </>
  )
}
