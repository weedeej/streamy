import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux';
import { store } from "@/state/store";
import { StoreValuesProvider } from '@/components';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>SStreamy - Download Movies in Torrent</title>
      </Head>
      <Provider store={store}>
        <StoreValuesProvider>
          <Component {...pageProps} />
        </StoreValuesProvider>
      </Provider>
    </>
  )
}
