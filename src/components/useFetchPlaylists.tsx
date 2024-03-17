import { useEffect, useState } from "react";

const useFetchPlaylists = (accessToken: string) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch(
          "https://api.spotify.com/v1/me/playlists?limit=50",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const data = await response.json();
        setPlaylists(data.items);
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
       fetchPlaylists();
    }
  }, [accessToken]);

  return { playlists, loading };
};

export default useFetchPlaylists;