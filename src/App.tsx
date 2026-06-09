import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { TutorPage } from './pages/TutorPage';
import { SummarizerPage } from './pages/SummarizerPage';
import { PracticePage } from './pages/PracticePage';
import { LibraryPage } from './pages/LibraryPage';

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tutor" element={<TutorPage />} />
        <Route path="/summarizer" element={<SummarizerPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/library" element={<LibraryPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
