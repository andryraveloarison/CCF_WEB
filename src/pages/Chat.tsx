import { useState, useEffect, useRef } from 'react';
import ChatMessage from '../components/ChatMessage';
import { getMessages, saveMessages } from '../services/chat/ManageMessage';
import { sendMessageToAI } from '../services/chat/SendMessageToAI';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(getMessages());
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Enregistrer les messages dans localStorage à chaque mise à jour
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);



  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',  
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    // Appeler l'API avec l'historique des messages
    try {
      setIsThinking(true);
      const aiMessage = await sendMessageToAI(input, messages.length + 2, messages);
    
      aiMessage && setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API:', error);
    } finally {
      setIsLoading(false);
      setIsThinking(false);
    }
  };

;

  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  

  return (
    <div className="flex flex-col h-screen bg-[#121212] text-gray-100">
    
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
      {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center p-8 max-w-2xl">
              <h1 className="text-3xl font-bold mb-2">Nananjy</h1>
              <h2 className="text-2xl text-gray-300 mb-12">Comment puis-je vous aider aujourd'hui ?</h2>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
              <button className="flex items-center justify-center cursor-pointer space-x-2 p-4 rounded-lg border border-gray-700 hover:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 8v4l2 2"></path>
                  </svg>
                  <span>Rechercher une parole</span>
                </button>
                <button className="flex items-center justify-center cursor-pointer space-x-2 p-4 rounded-lg border border-gray-700 hover:bg-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                  <span>Titre d'une chanson</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-[21vw] space-y-6 bg-red">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className=" rounded-lg p-4 max-w-3xl">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />

          </div>
          
        )}
      </div>
      <div className="">
        <div className="mx-auto max-w-4xl flex justify-center">
          <div className="relative w-[55vw] ">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Posez une question"
              className="w-full h-25 p-4 pr-12 bg-grey-600 border border-gray-700 rounded-xl focus:outline-none focus:border-grey-500 resize-none text-white placeholder-gray-400"
              rows={1}
            />
            <div className="absolute right-2 bottom-2 flex space-x-1">
              <button
                onClick={handleSend}
                disabled={isLoading || input.trim() === ''}
                className="p-2 rounded-full bg-grey-600 hover:bg-grey-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
  </div>
  );
};

export default App;
