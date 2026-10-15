import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Menu, 
  X, 
  Lock, 
  Sparkles,
  Award,
  Info,
  Send
} from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'verify' | 'apply' | 'admin';
  onNavigate: (view: 'home' | 'verify' | 'apply' | 'admin', sectionId?: string) => void;
  onOpenSupport: () => void;
  isLoggedIn?: boolean;
  telegramUrl?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isLoggedIn = false,
  telegramUrl = 'https://t.me/alofuk_support',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleNavClick = (view: 'home' | 'verify' | 'apply' | 'admin', sectionId?: string) => {
    setMobileMenuOpen(false);
    onNavigate(view, sectionId);
  };

  return (
    <>
      {/* 1. Grand Centerpiece Header: Official Alofuk Academy Emblem Showcase */}
      <section 
        id="top-branding-header" 
        className="relative border-b overflow-hidden select-none"
        style={{ 
          background: 'linear-gradient(180deg, var(--header-color, #091424) 0%, var(--secondary-color, #0b192c) 100%)',
          borderColor: 'rgba(147, 197, 253, 0.25)'
        }}
        dir="rtl"
      >
        {/* Subtle royal blue ambient lighting behind emblem */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[220px] sm:h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.18)_0%,rgba(29,78,216,0.12)_45%,transparent_75%)] blur-2xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9 relative z-10">
          <div className="flex flex-col items-center justify-center text-center">
            
            {/* Main Emblem - High Resolution, Balanced Margins, Luxury Blue & Gold Bevel */}
            <div 
              onClick={() => handleNavClick('home')}
              className="group cursor-pointer transition-transform duration-300 hover:scale-[1.03] active:scale-95"
              title="أكاديمية الأفق - الصفحة الرئيسية"
            >
              <div className="relative mx-auto w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-2xl sm:rounded-3xl p-[2.5px] sm:p-[3px] bg-gradient-to-tr from-[#1d4ed8] via-[#60a5fa] to-[#dbeafe] shadow-[0_12px_35px_rgba(0,0,0,0.5),0_0_25px_rgba(59,130,246,0.3)]">
                <div className="w-full h-full rounded-[13px] sm:rounded-[21px] overflow-hidden bg-[#0b192c] flex items-center justify-center p-1">
                  {!imageError ? (
                    <img 
                      src="/assets/img/alofuk_logo.jpg" 
                      alt="شعار أكاديمية الأفق" 
                      className="w-full h-full object-cover object-center rounded-[10px] sm:rounded-[18px]"
                      onError={() => setImageError(true)}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1e40af] flex items-center justify-center text-[#60a5fa] font-bold text-3xl">
                      أ
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Official Academic Titles and Subtitles */}
            <div className="mt-4 sm:mt-5 space-y-1.5 text-center">
              <h1 
                onClick={() => handleNavClick('home')}
                className="cursor-pointer text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md flex items-center justify-center gap-2"
              >
                <span>أكاديمية</span>
                <span className="text-[#60a5fa] drop-shadow-[0_2px_10px_rgba(96,165,250,0.35)]">الأفق</span>
              </h1>

              <p className="text-xs sm:text-sm md:text-base font-bold text-blue-200 tracking-wide flex items-center justify-center gap-2">
                <span>للتدريب والاستشارات</span>
                <span className="text-white/40">•</span>
                <span className="text-slate-200 font-medium">معاً نحو مستقبل أفضل</span>
              </p>

              <p className="text-[11px] sm:text-xs text-blue-100/80 font-normal">
                الوكالة المعتمدة لتوثيق ومنح شهادات الخبرة الدولية — ماليزيا 🇲🇾
              </p>
            </div>

            {/* Subtle Luxury Divider */}
            <div className="mt-3.5 flex items-center justify-center gap-3">
              <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-blue-400/60 to-transparent" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
              <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-blue-400/60 to-transparent" />
            </div>

          </div>
        </div>
      </section>

      {/* 2. Integrated Sticky Navigation Bar */}
      <header 
        className="sticky top-0 z-50 backdrop-blur-md border-b shadow-xl transition-colors duration-200" 
        style={{ 
          backgroundColor: 'var(--header-color, #091424)',
          borderColor: 'rgba(147, 197, 253, 0.2)'
        }}
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
              <button
                id="nav-home-btn"
                onClick={() => handleNavClick('home')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition ${
                  currentView === 'home'
                    ? 'text-white bg-blue-600/40 shadow-inner border border-blue-400/40'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                الرئيسيه
              </button>

              <button
                id="nav-about-btn"
                onClick={() => handleNavClick('home', 'about-section')}
                className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 transition"
              >
                عن الافق
              </button>

              <button
                id="nav-discover-btn"
                onClick={() => handleNavClick('home', 'discover-section')}
                className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 transition"
              >
                مميزات الشهادة
              </button>

              <button
                id="nav-verify-btn"
                onClick={() => handleNavClick('home', 'verify-section')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                  currentView === 'verify'
                    ? 'text-white bg-blue-600/40 border border-blue-400/40'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-blue-300" />
                التحقق من الشهادة
              </button>

              <a
                id="nav-support-btn"
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 transition flex items-center gap-1.5"
                title="محادثة الدعم الفني عبر تليجرام"
              >
                <Send className="w-4 h-4 text-blue-300" />
                الدعم الفني
              </a>
            </nav>

            {/* Mobile Brand Indicator */}
            <div 
              className="flex lg:hidden items-center gap-2 cursor-pointer"
              onClick={() => handleNavClick('home')}
            >
              <div className="w-8 h-8 rounded-lg p-[1px] bg-gradient-to-tr from-blue-500 to-blue-300">
                <img 
                  src="/assets/img/alofuk_logo.jpg" 
                  alt="أكاديمية الأفق" 
                  className="w-full h-full object-cover rounded-[7px]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-bold text-white text-sm">
                أكاديمية <span className="text-blue-400">الأفق</span>
              </span>
            </div>

            {/* Action Buttons (Left side in RTL) */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <button
                id="nav-apply-cta"
                onClick={() => handleNavClick('apply')}
                style={{ backgroundColor: 'var(--button-color, #1d4ed8)' }}
                className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold text-white shadow-md hover:brightness-110 transition flex items-center gap-1.5 active:scale-95 border border-blue-400/30"
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-300" />
                تقديم طلب
              </button>

              <button
                id="nav-admin-btn"
                onClick={() => handleNavClick('admin')}
                className={`p-1.5 sm:p-2 rounded-lg border text-xs font-medium transition flex items-center gap-1.5 ${
                  currentView === 'admin'
                    ? 'bg-blue-600/30 text-blue-200 border-blue-400/50'
                    : 'bg-black/20 text-white/80 hover:text-white border-white/15 hover:border-white/30'
                }`}
                title="لوحة الإدارة"
              >
                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-300" />
                <span className="hidden sm:inline">{isLoggedIn ? 'لوحة التحكم' : 'الإدارة'}</span>
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 sm:p-2 rounded-lg text-white hover:text-blue-300 hover:bg-white/10 lg:hidden"
                aria-label="القائمة"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div 
            className="lg:hidden border-t px-4 pt-2 pb-5 space-y-1.5 shadow-2xl animate-in slide-in-from-top duration-200"
            style={{ 
              backgroundColor: 'var(--header-color, #0b192c)',
              borderColor: 'rgba(147, 197, 253, 0.25)' 
            }}
          >
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-right px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                currentView === 'home' ? 'bg-white/15 text-blue-300 font-bold' : 'text-white hover:bg-white/10'
              }`}
            >
              الرئيسيه
            </button>

            <button
              onClick={() => handleNavClick('home', 'about-section')}
              className="w-full text-right px-4 py-2.5 rounded-lg text-sm font-semibold text-white hover:bg-white/10 flex items-center gap-2"
            >
              <Info className="w-4 h-4 text-blue-300" />
              عن الافق
            </button>

            <button
              onClick={() => handleNavClick('home', 'discover-section')}
              className="w-full text-right px-4 py-2.5 rounded-lg text-sm font-semibold text-white hover:bg-white/10 flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-blue-300" />
              مميزات الشهادة
            </button>

            <button
              onClick={() => handleNavClick('home', 'verify-section')}
              className={`w-full text-right px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                currentView === 'verify' ? 'bg-white/15 text-blue-300 font-bold' : 'text-white hover:bg-white/10'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-blue-300" />
              التحقق من الشهادة
            </button>

            <a
              id="mobile-nav-support-btn"
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-right px-4 py-2.5 rounded-lg text-sm font-semibold text-white hover:bg-white/10 flex items-center gap-2"
              title="محادثة الدعم الفني عبر تليجرام"
            >
              <Send className="w-4 h-4 text-blue-300" />
              الدعم الفني (Telegram)
            </a>

            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('apply')}
                style={{ backgroundColor: 'var(--button-color, #1d4ed8)' }}
                className="w-full py-2.5 text-center rounded-lg text-white font-bold text-sm shadow-md hover:brightness-110 transition"
              >
                تقديم طلب جديد
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

