export type Song = {
    id: string;
    title: string;
    lyrics: string;
    author: string;
  };

  export type SongData = {
    title: string;
    lyrics: string;
    author: string;
  };
  
  const SONG_URL = "https://hayback.onrender.com/api/song/getAll";
  
  // 🔽 Récupération depuis le cache
  export const getSongsFromCache = async (): Promise<Song[] | null> => {
    try {
      const response = await caches.match(SONG_URL);
      if (response) {
        const data = await response.json();
        return data;
      } else {
        console.warn("Pas de cache trouvé pour les chansons");
        return null;
      }
    } catch (err) {
      console.error("Erreur lecture cache :", err);
      return null;
    }
  };
  
  // 🔽 Requête à l’API
  export const getSongsFromApi = async (): Promise<Song[]> => {
    try {
      const res = await fetch(SONG_URL, { mode: "cors" });
      if (!res.ok) throw new Error("Erreur réseau");
      return await res.json();
    } catch (err) {
      console.error("Erreur de récupération :", err);
      return [];
    }
  };

  
  
  export const saveSong = async (song: SongData): Promise<boolean> => {
    try {
      const response = await fetch("https://hayback.onrender.com/api/song/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(song),
      });
  
      if (!response.ok) {
        console.error("Erreur lors de l'envoi :", await response.text());
        return false;
      }
  
      return true;
    } catch (err) {
      console.error("Erreur réseau :", err);
      return false;
    }
  };
  