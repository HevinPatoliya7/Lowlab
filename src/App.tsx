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
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
      
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isPointer = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('button') || 
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer';

      if (isPointer) {
        cursor.classList.add('cursor-hover');
      } else {
        cursor.classList.remove('cursor-hover');
      }
    };

    const onMouseDown = () => {
      cursor.classList.add('cursor-active');
      dot.classList.add('cursor-active');
    };

    const onMouseUp = () => {
      cursor.classList.remove('cursor-active');
      dot.classList.remove('cursor-active');
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
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
