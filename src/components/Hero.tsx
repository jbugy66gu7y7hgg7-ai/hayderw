import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowDown, 
  Search, 
  Sparkles,
  MessageCircle,
  Award,
  CheckCircle2,
  Send
} from 'lucide-react';

interface HeroProps {
  onNavigate: (view: 'home' | 'verify' | 'apply' | 'admin', sectionId?: string) => void;
  onQuickVerify: (certNumber: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onQuickVerify }) => {
  const [quickCertNum, setQuickCertNum] = useState('');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickCertNum.trim()) {
      onQuickVerify(quickCertNum.trim());
    } else {
      const verifyEl = document.getElementById('verify-section');
      if (verifyEl) {
        verifyEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        onNavigate('verify');
      }
    }
  };

  const scrollToVerify = () => {
    const verifyEl = document.getElementById('verify-section');
    if (verifyEl) {
      verifyEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('verify');
    }
  };

  const scrollToAbout = () => {
    const aboutEl = document.getElementById('about-section');
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('home', 'about-section');
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden transition-colors duration-300" 
      style={{ backgroundColor: 'var(--secondary-color, #0b192c)' }}
      dir="rtl"
    >
      
      {/* Dynamic Royal Navy & Blue Hero Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Deep Royal Navy Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0e2547] via-[#0b192c] to-[#07111e]" />

        {/* Ambient Royal Blue Lighting & Atmosphere */}
        <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 w-[550px] h-[550px] bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/35 via-slate-900/70 to-[#07111e]/95" />

        {/* Background Graphic textured with luminosity blend */}
        <img 
          src="/assets/img/55.PNG?v=blue" 
          alt="أكاديمية الأفق في ماليزيا" 
          className="w-full h-full object-cover object-center mix-blend-screen opacity-15 filter contrast-125 brightness-90"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/assets/img/55.PNG';
          }}
        />

        {/* Seamless bottom transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color,#ffffff)]/20 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Content Column */}
          <div className="lg:col-span-7 text-right space-y-5 sm:space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-400/40 backdrop-blur-md shadow-sm">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-white text-xs sm:text-sm font-bold tracking-wide">
                امتلك شهادة الخبرة الدولية المعتمدة
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.25] tracking-tight drop-shadow-md">
              مع أكاديمية <span className="text-blue-300">الأفق</span> <br className="hidden sm:inline" />
              <span className="text-white drop-shadow-sm">في ماليزيا</span>
            </h1>

            {/* Subtext description */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-200/95 max-w-2xl font-normal leading-relaxed drop-shadow">
              الوكالة الأولى المعتمدة لمنح وتوثيق شهادات الخبرة الدولية للخبراء والكفاءات مع نظام تحقق إلكتروني فوري ذكي برقم التسجيل ورمز الاستجابة السريعة QR.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                id="hero-verify-cta-btn"
                onClick={scrollToVerify}
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-black/30 transition flex items-center gap-2 active:scale-95 border border-amber-400"
              >
                <ShieldCheck className="w-5 h-5 text-slate-950" />
                <span>التحقق من الشهادة</span>
              </button>

              <button
                id="hero-about-cta-btn"
                onClick={scrollToAbout}
                className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base bg-blue-800/80 hover:bg-blue-800 text-white border border-blue-400/40 transition flex items-center gap-2 active:scale-95"
              >
                <span>عن الأكاديمية</span>
                <ArrowDown className="w-4 h-4 text-blue-300" />
              </button>
            </div>

            {/* Quick in-hero verification input field */}
            <div className="pt-2 sm:pt-4 max-w-lg">
              <form onSubmit={handleQuickSubmit} className="relative">
                <div 
                  className="flex items-center rounded-xl backdrop-blur-md shadow-2xl p-1.5 transition"
                  style={{ 
                    backgroundColor: 'rgba(11, 25, 44, 0.95)',
                    border: '1px solid var(--border-color, #93c5fd)'
                  }}
                >
                  <div className="p-2 text-blue-300">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={quickCertNum}
                    onChange={(e) => setQuickCertNum(e.target.value)}
                    placeholder="أدخل رمز الشهادة للتحقق"
                    className="flex-1 bg-transparent border-0 text-white text-sm sm:text-base placeholder-slate-400 focus:outline-none px-2 font-medium"
                    dir="ltr"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg text-white font-bold text-sm transition whitespace-nowrap shadow active:scale-95 flex items-center gap-1.5 hover:brightness-110"
                    style={{ backgroundColor: 'var(--button-color, #1d4ed8)' }}
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-300" />
                    <span>تحقق</span>
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Official Academy Emblem Seal Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div 
              className="w-full max-w-md relative rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl p-6 sm:p-7 text-center overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(14, 37, 71, 0.9) 0%, rgba(11, 25, 44, 0.95) 100%)',
                border: '1px solid var(--border-color, #93c5fd)'
              }}
            >
              
              {/* Subtle gold top line accent */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

              {/* Official Seal Emblem Container */}
              <div className="relative inline-block mb-4">
                <div className="w-40 sm:w-48 h-48 sm:h-56 rounded-2xl p-[2px] bg-gradient-to-tr from-blue-600 via-blue-400 to-cyan-300 shadow-[0_8px_30px_rgba(29,78,216,0.35)] mx-auto transition-transform hover:scale-105 duration-300">
                  <div className="w-full h-full rounded-[14px] overflow-hidden bg-[#07111e] flex items-center justify-center p-1.5">
                    <img 
                      src="/assets/img/55.PNG?v=blue" 
                      alt="شهادة أكاديمية الأفق" 
                      className="w-full h-full object-contain object-center rounded-xl"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/assets/img/55.PNG';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Emblem Text & Accreditation */}
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                أكاديمية <span className="text-blue-300">الأفق</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-200/90 font-medium mt-1">
                للتدريب والاستشارات <span className="text-white">•</span> ماليزيا
              </p>
              <p className="text-[11px] text-blue-200/80 mt-0.5 font-normal">
                الوكالة الأولى المعتمدة لمنح شهادات الخبرة الدولية
              </p>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-white/10">
                <div className="p-2 rounded-lg bg-black/20 border border-white/5">
                  <span className="block text-white font-bold text-xs">دولي</span>
                  <span className="text-[10px] text-slate-300">توثيق معتمد</span>
                </div>
                <div className="p-2 rounded-lg bg-black/20 border border-white/5">
                  <span className="block text-white font-bold text-xs">QR كود</span>
                  <span className="text-[10px] text-slate-300">تحقق فوري</span>
                </div>
                <div className="p-2 rounded-lg bg-black/20 border border-white/5">
                  <span className="block text-white font-bold text-xs">24-48 ساعة</span>
                  <span className="text-[10px] text-slate-300">إصدار سريع</span>
                </div>
              </div>

              {/* Official Channels Row */}
              <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-center gap-2.5">
                <span className="text-[11px] text-slate-300 font-medium ml-1">
                  تواصل معنا:
                </span>

                {/* Telegram Direct Support */}
                <a
                  href="https://t.me/alofuk_support"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-blue-800/60 hover:bg-blue-700 text-amber-300 hover:text-white border border-blue-400/40 flex items-center justify-center transition shadow text-xs"
                  title="الدعم الفني عبر تليجرام"
                >
                  <Send className="w-4 h-4" />
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/+9647853331053"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-blue-800/60 hover:bg-blue-700 text-white hover:text-amber-300 border border-blue-400/30 flex items-center justify-center transition shadow"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/alofuk.academy?mibextid=LQQJ4d"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-blue-800/60 hover:bg-blue-700 text-white hover:text-amber-300 border border-blue-400/30 flex items-center justify-center transition shadow font-bold text-xs"
                  title="Facebook"
                >
                  f
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/alofuk.academy?igshid=MmVlMjlkMTBhMg=="
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-blue-800/60 hover:bg-blue-700 text-white hover:text-amber-300 border border-blue-400/30 flex items-center justify-center transition shadow font-bold text-xs"
                  title="Instagram"
                >
                  IG
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
};

