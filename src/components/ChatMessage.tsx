import React from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`${isUser ? 'flex justify-end' : 'flex justify-start'}`}>
      <div 
        className={` ${
          isUser 
            ? 'bg-gray-600 rounded-2xl rounded-br-sm text-white' 
            : ' rounded-2xl rounded-bl-sm text-gray-100'
        } p-4`}
      >
        <div className="mb-1 flex items-center">
        
          <span className="text-sm font-medium">
          </span>
        </div>
        <div className="whitespace-pre-wrap">
          {message.text}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

