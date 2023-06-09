import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { AnimatePresence } from "framer-motion";

import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <Head>
        <title>MedSpeak</title>
        <meta
          name="description"
          content="Streamline the conversation between doctors and patients with MedSpeak."
        />
        <link rel="icon" href="/favicons/favicon-32x32.png" />
        <link
          android-chrome-icon="android-chrome-icon"
          sizes="192x192"
          href="/favicons/android-chrome-192x192.png"
        />
        <link
          android-chrome-icon="android-chrome-icon"
          sizes="512x512"
          href="/favicons/android-chrome-512x512.png"
        />
        <link
          apple-touch-icon="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon.png"
        />
      </Head>

      <SessionProvider session={session}>
        <AnimatePresence>
          <div
            className={`cursor-default flex h-full w-full flex-col items-center mx-auto ${inter.className}`}
          >
            {session && (
              <div className="flex content-center justify-center sticky z-10 top-0 w-full bg-neutral-800/30 backdrop-blur-lg">
                <Navbar />
              </div>
            )}

            <Component {...pageProps} />
          </div>
        </AnimatePresence>
      </SessionProvider>
    </>
  );
}
