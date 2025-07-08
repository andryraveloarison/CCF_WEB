import songs from "../../data/lyrics.json";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

interface APIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const sendMessageToAI = async (
  userMessage: string,
  messageId: number,
  history: Message[]
): Promise<Message | undefined> => {
  // 🧠 Contexte des chansons (limité à 300 caractères par chanson)
  const songContext = songs.map(song =>
    `Titre: ${song.title}\nParoles: ${song.lyrics
      .slice(0, 10000)
      .replace(/<br\s*\/?>/gi, '\n') // remplacer <br> ou <br /> par des retours à la ligne
      .replace(/\*/g, '') // retirer les *
      .replace(/<\/?[^>]+(>|$)/g, '') // retirer toutes les balises HTML restantes
    }\n`
  ).join('\n');

  // 📜 Messages pour l'API
  const apiMessages: APIMessage[] = [
    {
      role: 'system',
      content: `Tu es une assistante spécialisée dans les chants du CCF. Voici les chansons que tu connais :\n\n${songContext}\n\nQuand on te donne un extrait de paroles, retrouve le titre exact de la chanson. Réponds avec des phrases si tu es sûre, et ne mets pas de * dans tes réponses.`,
    },
    ...history.map((msg): APIMessage => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    })),
    {
      role: 'user',
      content: userMessage,
    },
  ];

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer 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',
        'HTTP-Referer': 'https://ton-site.com/',
        'X-Title': 'Nananjy Assistant',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: apiMessages,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    let aiResponse = data.choices?.[0]?.message?.content || "Désolé, je n’ai pas trouvé.";

    // Nettoyer la réponse de l’IA
    aiResponse = aiResponse
      .replace(/<br\s*\/?>/gi, '\n')   // convertit les <br> en \n
      .replace(/\*/g, '')             // retire les *
      .replace(/<\/?[^>]+(>|$)/g, '') // retire le HTML s'il y en a

    return {
      id: messageId,
      text: aiResponse,
      sender: 'ai',
    };
  } catch (error) {
    console.error("Erreur API :", error);
    alert("Vérifie ta connexion ou réessaie plus tard.");
    return {
      id: messageId,
      text: "Erreur : impossible de contacter l'IA.",
      sender: 'ai',
    };
  }
};
