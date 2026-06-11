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

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let dotX = -100;
    let dotY = -100;
    
    let lastMouseX = -100;
    let lastMouseY = -100;
    
    let isHovering = false;
    let isActive = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isPointer = !!(
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('button') || 
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer'
      );

      isHovering = isPointer;
    };

    const onMouseDown = () => {
      isActive = true;
    };

    const onMouseUp = () => {
      isActive = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    let animationFrameId: number;

    const updateCursor = () => {
      if (mouseX === -100) {
        animationFrameId = requestAnimationFrame(updateCursor);
        return;
      }

      if (ringX === -100) {
        ringX = mouseX;
        ringY = mouseY;
        dotX = mouseX;
        dotY = mouseY;
      }

      // 1. Position Interpolation (Lerping)
      // Dot follows mouse very closely with a micro-ease
      dotX += (mouseX - dotX) * 0.45;
      dotY += (mouseY - dotY) * 0.45;

      // Outer ring follows with inertia lag
      const ringLerp = isHovering ? 0.2 : 0.12;
      ringX += (mouseX - ringX) * ringLerp;
      ringY += (mouseY - ringY) * ringLerp;

      // 2. Velocity calculation for squish effect
      const vx = mouseX - lastMouseX;
      const vy = mouseY - lastMouseY;
      lastMouseX = mouseX;
      lastMouseY = mouseY;

      const speed = Math.sqrt(vx * vx + vy * vy);
      
      // Update Dot Position
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate3d(-50%, -50%, 0)`;
      
      // Update Ring Position & Transform Styles
      let transformStr = `translate3d(${ringX}px, ${ringY}px, 0) translate3d(-50%, -50%, 0)`;

      if (isHovering) {
        cursor.classList.add('cursor-hover');
        const scaleVal = isActive ? 1.4 : 1.8;
        transformStr += ` scale(${scaleVal})`;
      } else {
        cursor.classList.remove('cursor-hover');
        if (isActive) {
          transformStr += ` scale(0.65)`;
        } else {
          // Dynamic squish/stretch along the vector of motion
          const stretch = Math.min(speed * 0.015, 0.4);
          const angle = Math.atan2(vy, vx) * (180 / Math.PI);
          
          if (speed > 1) {
            transformStr += ` rotate(${angle}deg) scale(${1 + stretch}, ${1 - stretch})`;
          }
        }
      }

      if (isActive) {
        cursor.classList.add('cursor-active');
        dot.classList.add('cursor-active');
      } else {
        cursor.classList.remove('cursor-active');
        dot.classList.remove('cursor-active');
      }

      cursor.style.transform = transformStr;

      animationFrameId = requestAnimationFrame(updateCursor);
    };

    updateCursor();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(animationFrameId);
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
