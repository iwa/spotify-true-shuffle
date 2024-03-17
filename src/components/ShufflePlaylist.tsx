import { signIn, signOut, useSession } from "next-auth/react";
import useFetchPlaylists from "./useFetchPlaylists";
import { useState } from "react";

const ShufflePlaylist = () => {
  const { data: session } = useSession();
  const { playlists, loading } = useFetchPlaylists(session?.accessToken || "");

  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");

  const fetchPlaylistTracks = async (
    playlistId: string,
    accessToken: string,
  ) => {
    let tracks: string[] = [];
    let offset = 0;
    let limit = 50; // Maximum limit per request
    let totalTracks = 0;

    do {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const data = await response.json();

      // Extract track URIs
      const trackUris = data.items.map((item: any) => item.track.uri);
      tracks = [...tracks, ...trackUris];

      // Update offset for the next batch of tracks
      offset += limit;

      // Check if all tracks have been fetched
      totalTracks = data.total;
    } while (tracks.length < totalTracks);

    return tracks;
  };

  const addTracksToQueue = async (trackUris: string[], accessToken: string) => {
    const response = await fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris: trackUris }),
    });

    if (!response.ok) {
      throw new Error("Failed to add tracks to the queue");
    }
  };

  // Fisher-Yates shuffle algorithm
  function shuffleArray(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j]!, array[i]!];
    }
    return array;
  }

  const handlePlayPlaylist = async () => {
    if (!selectedPlaylistId || !session?.accessToken) {
      alert("Please select a playlist and ensure you are signed in.");
      return;
    }

    try {
      const allTracks = await fetchPlaylistTracks(
        selectedPlaylistId,
        session.accessToken,
      );

      let trackUris = allTracks.filter((uri: any) =>
        uri.startsWith("spotify:track:"),
      );

      trackUris = shuffleArray(trackUris);

      await addTracksToQueue(trackUris, session.accessToken);
      alert("Tracks added to the queue!");
    } catch (error) {
      console.error("Failed to add tracks to the queue:", error);
      alert("Failed to add tracks to the queue.");
    }
  };

  return (
    <div>
      {session ? (
        <div className="flex flex-col gap-4">
          <p className="text-white">Welcome {session?.user.name}!</p>
          <select
            value={selectedPlaylistId}
            onChange={(e) => setSelectedPlaylistId(e.target.value)}
          >
            {playlists.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20" onClick={handlePlayPlaylist}>Shuffle!</button>;
        </div>
      ) : (
        ""
      )}

      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={session ? () => void signOut() : () => void signIn()}
      >
        {session ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

export default ShufflePlaylist;
