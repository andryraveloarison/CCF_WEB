interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

export const getMessages = (): Message[] => {
  const savedMessages = localStorage.getItem('chatMessages');
  return savedMessages ? JSON.parse(savedMessages) : [];
};

export const saveMessages = (messages: Message[]): void => {
  localStorage.setItem('chatMessages', JSON.stringify(messages));
};

export const clearMessages = (): void => {
  localStorage.removeItem('chatMessages');
};
