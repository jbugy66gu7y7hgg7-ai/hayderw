import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  MapPin,
  Clock,
  ExternalLink
} from 'lucide-react';
import { AcademySettings } from '../types';

interface ContactSectionProps {
  settings: AcademySettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'استفسار عن شهادة خبرة',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setErrorMessage('يرجى ملء الاسم ورقم الهاتف ومحتوى الرسالة.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشل إرسال الرسالة، يرجى المحاولة لاحقاً');
      }

      setSuccessMessage(data.message || 'تم استلام رسالتك بنجاح وسيتواصل معك فريق الدعم قريباً.');
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: 'استفسار عن شهادة خبرة',
        message: ''
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'تعذر الاتصال بالخادم، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact-section" 
      className="py-20 lg:py-28 border-b relative transition-colors duration-300"
      style={{ 
        backgroundColor: 'var(--secondary-color, #0b192c)',
        borderColor: 'rgba(147, 197, 253, 0.25)' 
      }}
    >
      {/* Glow Effects */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>خدمة المستفيدين على مدار الساعة</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            <span>تواصل معنا</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            فريق أكاديمية الأفق متاح للإجابة عن استفساراتكم حول متطلبات التقديم، التحقق من الشهادات، والدعم المهني المباشر.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details & Direct Channels (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Quick Action Card */}
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="block p-6 rounded-3xl bg-blue-950/40 border border-blue-500/30 hover:border-blue-400 shadow-xl transition duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">المحادثة الفورية عبر واتساب</h3>
                    <p className="text-xs text-slate-300 mt-0.5">رد سريع خلال دقائق من المستشارين</p>
                    <span className="text-xs font-mono font-bold text-blue-300 block mt-1" dir="ltr">
                      {settings.whatsapp}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-blue-400 opacity-60 group-hover:opacity-100 transition" />
              </div>
            </a>

            {/* Direct Phone & Email Cards */}
            <div className="rounded-3xl bg-[#071322] border border-blue-500/25 p-6 space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-medium text-slate-400">الاتصال الهاتفي المباشر</h4>
                  <a href={`tel:${settings.phone}`} className="text-sm font-bold text-white hover:text-blue-300 transition font-mono" dir="ltr">
                    {settings.phone}
                  </a>
                  <p className="text-xs text-slate-400">متاح يومياً من 9:00 صباحاً حتى 9:00 مساءً</p>
                </div>
              </div>

              <div className="border-t border-blue-500/20 pt-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-medium text-slate-400">البريد الإلكتروني الرسمي</h4>
                  <a href={`mailto:${settings.email}`} className="text-sm font-bold text-white hover:text-blue-300 transition font-mono" dir="ltr">
                    {settings.email}
                  </a>
                  <p className="text-xs text-slate-400">للمراسلات الرسمية واعتماد الشركات</p>
                </div>
              </div>

              <div className="border-t border-blue-500/20 pt-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-medium text-slate-400">المقر الإقليمي</h4>
                  <p className="text-sm font-semibold text-slate-200 leading-snug">
                    {settings.address}
                  </p>
                </div>
              </div>

            </div>

            {/* Social Links Badge Row */}
            <div className="p-4 rounded-2xl bg-[#071322] border border-blue-500/25 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">تابع قنواتنا الرسمية:</span>
              <div className="flex items-center gap-3">
                {settings.telegram && (
                  <a
                    href={settings.telegram}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-300 hover:bg-blue-500/25 text-xs font-medium transition"
                  >
                    تيليجرام
                  </a>
                )}
                {settings.facebook && (
                  <a
                    href={settings.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-blue-600/15 text-blue-400 hover:bg-blue-600/25 text-xs font-medium transition"
                  >
                    فيسبوك
                  </a>
                )}
                {settings.instagram && (
                  <a
                    href={settings.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-pink-500/15 text-pink-400 hover:bg-pink-500/25 text-xs font-medium transition"
                  >
                    إنستغرام
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Contact Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-[#071322] border border-blue-500/30 p-8 sm:p-10 shadow-2xl space-y-6">
              
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">أرسل استفسارك أو رسالتك</h3>
                <p className="text-xs sm:text-sm text-slate-400">يرجى تعبئة النموذج وسيقوم المستشار المخصص بمتابعة طلبك.</p>
              </div>

              {/* Status alerts */}
              {successMessage && (
                <div className="p-4 rounded-2xl bg-blue-500/15 border border-blue-400/40 text-blue-300 text-sm flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      الاسم الكامل <span className="text-blue-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="مثال: حيدر علي حسن"
                      className="w-full px-4 py-3 rounded-xl bg-[#0b192c] border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      رقم الهاتف / واتساب <span className="text-blue-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="07XXXXXXXXX"
                      className="w-full px-4 py-3 rounded-xl bg-[#0b192c] border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-400 transition"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      البريد الإلكتروني (اختياري)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#0b192c] border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-400 transition"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      موضوع الرسالة
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0b192c] border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-400 transition"
                    >
                      <option value="استفسار عن شهادة خبرة">استفسار عن شهادة خبرة</option>
                      <option value="التحقق من شهادة">التحقق من صحة شهادة</option>
                      <option value="شراكة أو اعتماد مؤسسي">شراكة أو اعتماد مؤسسي</option>
                      <option value="طلب دعم فني">طلب دعم فني</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    الرسالة أو الاستفسار <span className="text-blue-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="اكتب تفاصيل استفسارك هنا وسيقوم المستشار بالرد عليك..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0b192c] border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-400 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: 'var(--button-color, #1d4ed8)' }}
                  className="w-full py-4 rounded-xl font-bold text-sm text-white shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 hover:brightness-110 active:scale-95"
                >
                  {isSubmitting ? (
                    <span>جارٍ إرسال الرسالة...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>إرسال الرسالة الآن</span>
                    </>
                  )}
                </button>

              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
