import { getToken } from "next-auth/jwt";
import Head from "next/head";
import Link from "next/link";

import ShufflePlaylist from '~/components/ShufflePlaylist';

export default function Home() {
  return (
    <>
      <Head>
        <title>Spotify True Shuffle</title>
        <meta
          name="description"
          content="Use a true shuffle algorithm for your Spotify playlists."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Spotify True Shuffle
          </h1>

          <div className="flex flex-col items-center gap-2">
                <ShufflePlaylist />
          </div>
        </div>
      </main>
    </>
  );
}
