import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Chat from './pages/Chat';
import Songs from './pages/SongList';
import Lyrics from './pages/Lyrics';
import About from './pages/About';

import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';

const AppLayout = () => {
  const location = useLocation();
  const hideBottomNav = location.pathname === '/chat' || location.pathname === '/about';

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="h-[80vh] bg-black">
        <Routes>
          <Route path="/" element={<Songs />} />
          <Route path="/lyrics/:id" element={<Lyrics />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/about" element={<About />} />
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
