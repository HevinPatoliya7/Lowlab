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
    const dot1 = document.getElementById('custom-mouse-dot-1');
    const dot2 = document.getElementById('custom-mouse-dot-2');
    const dot3 = document.getElementById('custom-mouse-dot-3');
    if (!cursor || !dot1 || !dot2 || !dot3) return;

    let mouseX = -100;
    let mouseY = -100;
    
    // Outer ring states
    let ringX = -100;
    let ringY = -100;
    let ringWidth = 24;
    let ringHeight = 24;
    
    // Comet trail states (lerp coords)
    let d1X = -100, d1Y = -100;
    let d2X = -100, d2Y = -100;
    let d3X = -100, d3Y = -100;
    
    let isMagnetized = false;
    let activeElement: HTMLElement | null = null;
    let isActive = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      const target = e.target as HTMLElement;
      if (!target) return;
      
      // Snaps to buttons, links, dropdowns, inputs, custom cursor-pointers
      const interactive = target.closest('button, a, input, textarea, select, [role="button"], .cursor-pointer') as HTMLElement;
      
      if (interactive) {
        isMagnetized = true;
        activeElement = interactive;
      } else {
        isMagnetized = false;
        activeElement = null;
      }
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

      // Initialize positions
      if (ringX === -100) {
        ringX = mouseX;
        ringY = mouseY;
        d1X = d2X = d3X = mouseX;
        d1Y = d2Y = d3Y = mouseY;
      }

      // 1. Comet trail calculations
      d1X += (mouseX - d1X) * 0.45;
      d1Y += (mouseY - d1Y) * 0.45;
      
      d2X += (d1X - d2X) * 0.35;
      d2Y += (d1Y - d2Y) * 0.35;
      
      d3X += (d2X - d3X) * 0.25;
      d3Y += (d2Y - d3Y) * 0.25;

      // 2. Snapping targets
      let targetX = mouseX;
      let targetY = mouseY;
      let targetWidth = 24;
      let targetHeight = 24;
      let targetRadius = '50%';

      if (isMagnetized && activeElement) {
        const rect = activeElement.getBoundingClientRect();
        targetX = rect.left + rect.width / 2;
        targetY = rect.top + rect.height / 2;
        targetWidth = rect.width + 12;
        targetHeight = rect.height + 12;
        
        // Inherit border radius of target button/link
        const style = window.getComputedStyle(activeElement);
        targetRadius = style.borderRadius === '50%' || (style.width === style.height && style.borderRadius.includes('50%'))
          ? '50%'
          : style.borderRadius || '12px';
      }

      // Physics based lerp for smooth snapping transition
      const snapLerp = isMagnetized ? 0.22 : 0.12;
      ringX += (targetX - ringX) * snapLerp;
      ringY += (targetY - ringY) * snapLerp;
      ringWidth += (targetWidth - ringWidth) * snapLerp;
      ringHeight += (targetHeight - ringHeight) * snapLerp;

      // Apply positions to comets
      dot1.style.transform = `translate3d(${d1X}px, ${d1Y}px, 0) translate3d(-50%, -50%, 0)`;
      dot2.style.transform = `translate3d(${d2X}px, ${d2Y}px, 0) translate3d(-50%, -50%, 0)`;
      dot3.style.transform = `translate3d(${d3X}px, ${d3Y}px, 0) translate3d(-50%, -50%, 0)`;

      // Apply coordinates, size, and styling to outer ring
      let scalePress = isActive ? ' scale(0.92)' : '';
      cursor.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate3d(-50%, -50%, 0)${scalePress}`;
      cursor.style.width = `${ringWidth}px`;
      cursor.style.height = `${ringHeight}px`;
      cursor.style.borderRadius = targetRadius;

      if (isMagnetized) {
        cursor.classList.add('cursor-hover');
      } else {
        cursor.classList.remove('cursor-hover');
      }

      if (isActive) {
        cursor.classList.add('cursor-active');
        dot1.classList.add('cursor-active');
      } else {
        cursor.classList.remove('cursor-active');
        dot1.classList.remove('cursor-active');
      }

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
      {/* Premium Magnetic Cursor & Comet Trail */}
      <div id="custom-mouse-cursor" className="hidden md:block" />
      <div id="custom-mouse-dot-1" className="custom-mouse-dot hidden md:block" />
      <div id="custom-mouse-dot-2" className="custom-mouse-dot hidden md:block" />
      <div id="custom-mouse-dot-3" className="custom-mouse-dot hidden md:block" />

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
