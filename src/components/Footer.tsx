import React from 'react';
import { 
  ArrowUp, 
  MessageCircle,
  ShieldCheck,
  Award,
  HelpCircle,
  Lock,
  Send
} from 'lucide-react';
import { AcademySettings } from '../types';
import { Logo } from './Logo';

interface FooterProps {
  settings?: AcademySettings;
  onNavigate: (view: 'home' | 'verify' | 'apply' | 'admin', sectionId?: string) => void;
  onOpenSupport: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onOpenSupport,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const facebookLink = settings?.facebook || "https://www.facebook.com/alofuk.academy?mibextid=LQQJ4d";
  const instagramLink = settings?.instagram || "https://instagram.com/alofuk.academy?igshid=MmVlMjlkMTBhMg==";
  const whatsappLink = "https://wa.me/+9647853331053";

  return (
    <footer 
      className="text-white relative pt-14 pb-10 text-right transition-colors duration-300"
      style={{ 
        backgroundColor: 'var(--header-color, #091424)',
        borderTop: '1px solid rgba(147, 197, 253, 0.25)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          
          {/* Main Info Column matching alofuk.com */}
          <div className="md:col-span-8 space-y-4">
            <Logo size="lg" className="mb-3" />

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              {settings?.aboutFull || "هي وكالة من اكاديمية ماليزية الأولى من صنفها في العراق تعمل على منح شهادة الخبرة الدولية الموثوقة للخبراء المستحقين بعد اجتياز الاختبار ، دعماً من المؤسسين وُ خدمة للصالح العام سيتم عمل خصومات لفترة محدودة على رسوم منح الشهادة .."}
            </p>

            {/* Social Icons matching alofuk.com */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={settings?.telegram || "https://t.me/alofuk_support"}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-blue-600 hover:text-white text-blue-300 border border-white/20 flex items-center justify-center transition shadow text-sm"
                title="Telegram Support"
              >
                <Send className="w-4 h-4" />
              </a>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-blue-600 hover:text-white text-white border border-white/20 flex items-center justify-center transition shadow"
                title="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>

              <a
                href={facebookLink}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-blue-600 hover:text-white text-white border border-white/20 flex items-center justify-center transition shadow font-bold text-base"
                title="Facebook"
              >
                f
              </a>

              <a
                href={instagramLink}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-blue-600 hover:text-white text-white border border-white/20 flex items-center justify-center transition shadow font-bold text-xs"
                title="Instagram"
              >
                IG
              </a>
            </div>
          </div>

          {/* Quick Navigation column */}
          <div className="md:col-span-4 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                روابط سريعة
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>
                  <button 
                    onClick={() => onNavigate('home')} 
                    className="hover:text-blue-300 transition"
                  >
                    الرئيسيه
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate('home', 'about-section')} 
                    className="hover:text-blue-300 transition"
                  >
                    عن الافق
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate('home', 'discover-section')} 
                    className="hover:text-blue-300 transition"
                  >
                    مميزات الشهادة
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onNavigate('home', 'verify-section')} 
                    className="hover:text-blue-300 transition flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    التحقق من الشهادة
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onOpenSupport} 
                    className="hover:text-blue-300 transition flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-4 h-4 text-blue-400" />
                    الدعم الفني المباشر
                  </button>
                </li>
              </ul>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => onNavigate('admin')}
                className="text-xs text-slate-400 hover:text-blue-300 flex items-center gap-1 opacity-70 hover:opacity-100 transition"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>لوحة التحكم الإدارية</span>
              </button>

              <button
                onClick={scrollToTop}
                className="p-2.5 rounded-lg bg-white/10 hover:bg-blue-600 text-white transition border border-white/20"
                title="العودة لأعلى الصفحة"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Bottom Copyright & Official Domain */}
        <div className="pt-6 text-center sm:text-right flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} أكاديمية الأفق - ماليزيا (Alofuk Academy). جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">الرابط المعتمد:</span>
            <a 
              href="https://alofuk.IPAF.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-cyan-400 hover:text-cyan-300 font-mono font-bold underline transition" 
              dir="ltr"
            >
              https://alofuk.IPAF.com
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
