export type Song = {
    title: string;
    author: string;
    lyrics: string;
  };
  
  export const saveSong = async (song: Song): Promise<boolean> => {
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
  