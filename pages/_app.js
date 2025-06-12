import Head from "next/head";
import "styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00acc1" />
        <link rel="apple-touch-icon" href="/icons/favicon-192x192.png" />
        <meta name="description" content="Versão PWA do App Finevo" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
