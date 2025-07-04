import {nananjyDescription} from '../../data/nananjyDescription';

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
  // Construire l'historique des messages pour l'API

  console.log(nananjyDescription)
  const apiMessages: APIMessage[] = [
    {
      role: 'system',
      content: "Ton nom est Nananjy et tu trouvera ton information ici "+nananjyDescription + "Tu repond de maniere irritable mais pas trop",
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
        Authorization: 'Bearer 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', // Remplacez par votre clé API
        'HTTP-Referer': 'VOTRE_SITE_URL', // Remplacez par l'URL de votre site
        'X-Title': 'VOTRE_NOM_SITE', // Remplacez par le nom de votre site
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout:free',
        messages: apiMessages,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'Désolé, pas de réponse.';

    return {
      id: messageId,
      text: aiResponse,
      sender: 'ai',
    };
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API:', error);
    alert("Verifier votre connexion internet ou revener plus ")
    // return {
    //   id: messageId,
    //   text: 'Erreur: Impossible de contacter l\'IA.',
    //   sender: 'ai',
    // };
  }
};