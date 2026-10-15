import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { StatsSection } from './components/StatsSection';
import { CertificatesShowcase } from './components/CertificatesShowcase';
import { VerifySection } from './components/VerifySection';
import { VerifyView } from './components/VerifyView';
import { ApplyView } from './components/ApplyView';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { SupportModal } from './components/SupportModal';
import { AcademySettings, Statistics, ThemeSettings, DEFAULT_THEME, applyThemeToDocument } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'verify' | 'apply' | 'admin'>('home');
  const [verifyCertNumber, setVerifyCertNumber] = useState<string>('');
  const [homeVerifyCode, setHomeVerifyCode] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  // Dynamic Public Academy Data & Theme
  const [settings, setSettings] = useState<AcademySettings | undefined>(undefined);
  const [statistics, setStatistics] = useState<Statistics | undefined>(undefined);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);

  // Apply default theme on first mount
  useEffect(() => {
    applyThemeToDocument(DEFAULT_THEME);
  }, []);

  // Parse path on initial load & handle browser history
  const syncRouteFromLocation = () => {
    const path = window.location.pathname;
    if (path.startsWith('/verify')) {
      setCurrentView('verify');
      const parts = path.split('/');
      if (parts[2]) {
        setVerifyCertNumber(decodeURIComponent(parts[2]));
      }
    } else if (path.startsWith('/apply')) {
      setCurrentView('apply');
    } else if (path.startsWith('/admin')) {
      setCurrentView('admin');
    } else {
      setCurrentView('home');
    }
  };

  const fetchPublicData = async () => {
    try {
      const res = await fetch('/api/public/data');
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        setStatistics(data.statistics);
        if (Array.isArray(data.galleryImages)) {
          setGalleryImages(data.galleryImages);
        }
        if (data.theme) {
          setTheme(data.theme);
          applyThemeToDocument(data.theme);
        }
      }
    } catch (err) {
      console.error("Error loading public data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicData();
    syncRouteFromLocation();

    const handlePopState = () => {
      syncRouteFromLocation();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view: 'home' | 'verify' | 'apply' | 'admin', sectionId?: string) => {
    setCurrentView(view);
    
    // Update browser URL without reload
    let targetPath = '/';
    if (view === 'verify') targetPath = verifyCertNumber ? `/verify/${verifyCertNumber}` : '/verify';
    if (view === 'apply') targetPath = '/apply';
    if (view === 'admin') targetPath = '/admin';
    window.history.pushState({}, '', targetPath);

    if (view === 'home') {
      if (sectionId) {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleQuickVerify = (certNumber: string) => {
    setHomeVerifyCode(certNumber);
    const verifyEl = document.getElementById('verify-section');
    if (verifyEl) {
      verifyEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      setVerifyCertNumber(certNumber);
      setCurrentView('verify');
      window.history.pushState({}, '', `/verify/${certNumber}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectSpecialty = (specName: string) => {
    setSelectedSpecialty(specName);
    navigateTo('apply');
  };

  const handleThemeChange = (newTheme: ThemeSettings) => {
    setTheme(newTheme);
    applyThemeToDocument(newTheme);
  };

  return (
    <div 
      className="min-h-screen flex flex-col selection:bg-blue-500/30 selection:text-blue-900 transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
    >
      
      {/* Persistent Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        onOpenSupport={() => setSupportModalOpen(true)}
        isLoggedIn={Boolean(localStorage.getItem('alofuk_admin_token'))}
        telegramUrl={settings?.telegram || 'https://t.me/alofuk_support'}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME PAGE */}
        {currentView === 'home' && (
          <>
            <Hero
              onNavigate={navigateTo}
              onQuickVerify={handleQuickVerify}
            />

            <VerifySection 
              settings={settings} 
              onVerifyToPage={handleQuickVerify}
              initialCode={homeVerifyCode}
            />

            <CertificatesShowcase galleryImages={galleryImages} onApplyClick={() => navigateTo('apply')} />

            <AboutSection settings={settings} />

            <StatsSection stats={statistics} />
          </>
        )}

        {/* VIEW 2: VERIFY PAGE (/verify & /verify/:id) */}
        {currentView === 'verify' && (
          <VerifyView
            initialCertNumber={verifyCertNumber}
            onBackToHome={() => navigateTo('home')}
            settings={settings}
          />
        )}

        {/* VIEW 3: APPLY PAGE (/apply) */}
        {currentView === 'apply' && (
          <div className="w-full">
            <ApplyView
              selectedSpecialty={selectedSpecialty}
              onBackToHome={() => navigateTo('home')}
              settings={settings}
            />
          </div>
        )}

        {/* VIEW 4: ADMIN DASHBOARD (/admin) */}
        {currentView === 'admin' && (
          <div className="w-full">
            <AdminDashboard
              onBackToHome={() => navigateTo('home')}
              onDataUpdated={fetchPublicData}
              currentTheme={theme}
              onThemeChange={handleThemeChange}
            />
          </div>
        )}

      </main>

      {/* Persistent Footer */}
      <Footer
        settings={settings}
        onNavigate={navigateTo}
        onOpenSupport={() => setSupportModalOpen(true)}
      />

      {/* Support & Contact Dialog */}
      <SupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
        settings={settings}
      />

    </div>
  );
}
