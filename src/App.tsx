import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Chat from './pages/Chat';
import Songs from './pages/SongList';
import Lyrics from './pages/Lyrics';


const App: React.FC = () => {


  return (
    <Router>

      <Routes>
        <Route path="/" element={<Songs />} />
        <Route path="/lyrics/:id" element={<Lyrics />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
};

export default App;
