import React from 'react';
import { 
  X, 
  MessageCircle, 
  Send, 
  Phone, 
  Mail, 
  HelpCircle, 
  ShieldCheck, 
  Clock,
  ExternalLink
} from 'lucide-react';
import { AcademySettings } from '../types';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: AcademySettings;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  if (!isOpen) return null;

  const whatsappLink = settings?.whatsapp 
    ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('مرحباً أكاديمية الأفق، أود الاستفسار بخصوص خدمات الشهادات والتحقق.')}`
    : 'https://wa.me/9647701234567';

  const telegramLink = settings?.telegram || 'https://t.me/alofuk_support';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 my-8"
        style={{ 
          backgroundColor: 'var(--header-color, #091424)',
          border: '1px solid var(--border-color, #93c5fd)'
        }}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-blue-900/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">الدعم الفني والمساعدة</h3>
              <p className="text-xs text-slate-400">فريق خدمة المستفيدين بأكاديمية الأفق</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Contact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* WhatsApp */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 hover:border-blue-400 hover:bg-blue-950/70 transition group flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block group-hover:text-blue-300">
                محادثة واتساب مباشرة
              </span>
              <span className="text-[11px] text-blue-300 font-mono">
                رد سريع خلال دقائق
              </span>
            </div>
          </a>

          {/* Telegram */}
          <a
            href={telegramLink}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 hover:border-blue-400 hover:bg-blue-950/70 transition group flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block group-hover:text-blue-300">
                قناة تليغرام الرسمية
              </span>
              <span className="text-[11px] text-blue-300 font-mono">
                @alofuk_academy
              </span>
            </div>
          </a>

          {/* Phone */}
          <a
            href={`tel:${settings?.phone || '+9647701234567'}`}
            className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/20 hover:border-amber-500/40 transition group flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">الاتصال المباشر</span>
              <span className="text-[11px] text-slate-300 font-mono" dir="ltr">
                {settings?.phone || '+964 770 123 4567'}
              </span>
            </div>
          </a>

          {/* Email */}
          <a
            href={`mailto:${settings?.email || 'contact@alofuk.com'}`}
            className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/20 hover:border-amber-500/40 transition group flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">البريد الإلكتروني</span>
              <span className="text-[11px] text-slate-300 font-mono" dir="ltr">
                {settings?.email || 'contact@alofuk.com'}
              </span>
            </div>
          </a>

        </div>

        {/* Common Questions */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            الأسئلة الأكثر شيوعاً
          </h4>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/20">
              <span className="font-bold text-white block mb-1">كيف يمكنني التحقق من صحة شهادتي؟</span>
              <p className="text-slate-300 leading-relaxed">
                من خلال الدخول إلى صفحة "التحقق من الشهادة" وإدخال الرقم التسلسلي المطبوع، أو مباشرة بمسح رمز QR بكاميرا الهاتف.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/20">
              <span className="font-bold text-white block mb-1">كم تستغرق مراجعة وإصدار الطلب؟</span>
              <p className="text-slate-300 leading-relaxed">
                تستغرق المراجعة والتقييم من 24 إلى 48 ساعة عمل كحد أقصى، ويتم إشعارك فوراً بالنتيجة عبر واتساب.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-blue-900/50 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>ساعات العمل: السبت - الخميس (9:00 ص - 8:00 م)</span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:underline font-semibold"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
