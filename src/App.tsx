import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Chat from './pages/Chat';
import Songs from './pages/SongList';
import Lyrics from './pages/Lyrics';
import About from './pages/About';
import AddSong from './pages/AddSong';
import BottomNav from './components/BottomNav';
import ManageSong from './pages/ManageSong';
import Verification from './pages/Verification';
import EditSong from './pages/UpdateSong';

const AppLayout = () => {
  const location = useLocation();
  const hideBottomNav = location.pathname === '/chat' || location.pathname === '/about';

  return (
    <div className="flex flex-col h-screen">
      <div className="h-[80vh]">
        <Routes>
          <Route path="/" element={<Songs />} />
          <Route path="/lyrics/:id" element={<Lyrics />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/about" element={<About />} />
          <Route path="/addSong" element={<AddSong />} />
          <Route path="/manageSong" element={<ManageSong />} />
          <Route path="/verify" element={<Verification />} />
          <Route path="/song/edit/:id" element={<EditSong />} />

        </Routes>
      </div>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;
