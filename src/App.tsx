import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { TutorPage } from './pages/TutorPage';
import { SummarizerPage } from './pages/SummarizerPage';
import { PracticePage } from './pages/PracticePage';
import { LibraryPage } from './pages/LibraryPage';

function App() {
  useEffect(() => {
    const cursor = document.getElementById('custom-mouse-cursor');
    const dot = document.getElementById('custom-mouse-dot');
    if (!cursor || !dot) return;

    const onMouseMove = (e: MouseEvent) => {
      cursor.style.transform = `translate3d(${e.clientX - 16}px, ${e.clientY - 16}px, 0)`;
      dot.style.transform = `translate3d(${e.clientX - 3}px, ${e.clientY - 3}px, 0)`;
      
      // Add subtle hover enlargement
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a')
      ) {
        cursor.classList.add('cursor-hover');
      } else {
        cursor.classList.remove('cursor-hover');
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <BrowserRouter>
      {/* Custom Mouse Cursor Followers */}
      <div id="custom-mouse-cursor" className="hidden md:block" />
      <div id="custom-mouse-dot" className="hidden md:block" />

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
