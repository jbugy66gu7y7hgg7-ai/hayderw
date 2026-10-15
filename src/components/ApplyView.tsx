import React, { useState } from 'react';
import { 
  FileText, 
  Send, 
  Upload, 
  CheckCircle2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Layers, 
  Award, 
  FileCheck, 
  Image as ImageIcon,
  ArrowRight,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { Specialty, AcademySettings } from '../types';
import confetti from 'canvas-confetti';

interface ApplyViewProps {
  specialties?: Specialty[];
  selectedSpecialty?: string;
  onBackToHome?: () => void;
  settings?: AcademySettings;
}

export const ApplyView: React.FC<ApplyViewProps> = ({
  selectedSpecialty = '',
  onBackToHome,
  settings,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [governorate, setGovernorate] = useState('بغداد');
  const [specialty, setSpecialty] = useState(selectedSpecialty || '');
  const [certificateType, setCertificateType] = useState('شهادة خبرة دولية معتمدة');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [docName, setDocName] = useState<string>('');
  const [docData, setDocData] = useState<string>('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ id: string; message: string } | null>(null);

  const governorates = [
    'بغداد', 'البصرة', 'أربيل', 'النجف الأشرف', 'كربلاء المقدسة', 
    'نينوى', 'السليمانية', 'كركوك', 'بابل', 'الأنبار', 
    'ذي قار', 'ديالى', 'واسط', 'صلاح الدين', 'المثنى', 
    'ميسان', 'دهوك', 'القادسية (الديوانية)', 'دولة أخرى / مقيم بالخارج'
  ];

  const certificateTypes = [
    'شهادة خبرة دولية معتمدة',
    'شهادة خبرة مهنية متقدمة',
    'شهادة كفاءة تخصصية واحترافية',
    'شهادة تدريب وإنجاز ميداني'
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميغابايت");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
        setErrorMsg(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg("حجم ملف المستمسكات كبير، يرجى اختيار ملف أقل من 10 ميغابايت");
        return;
      }
      setDocName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setDocData(event.target?.result as string);
        setErrorMsg(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Form Validation
    if (!fullName.trim()) {
      setErrorMsg("يرجى إدخال الاسم الكامل الثلاثي أو الرباعي");
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("يرجى إدخال رقم الهاتف النشط (واتساب)");
      return;
    }
    if (!specialty.trim()) {
      setErrorMsg("يرجى كتابة التخصص المهني المطلوب");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          governorate,
          specialty,
          certificateType,
          photoUrl: photoPreview,
          documentsUrl: docData,
          notes
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessData({
          id: data.applicationId,
          message: data.message || "تم استلام طلبك بنجاح"
        });
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        setErrorMsg(data.error || "فشل إرسال الطلب، يرجى المحاولة لاحقاً");
      }
    } catch (err) {
      console.error("Apply error:", err);
      setErrorMsg("حدث خطأ أثناء إرسال البيانات، يرجى التحقق من اتصالك بالإنترنت");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition mb-2"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة إلى الصفحة الرئيسية</span>
          </button>
        )}

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>استمارة التقديم الإلكترونية</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
          تقديم طلب <span className="gold-gradient-text">شهادة خبرة</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
          يرجى تعبئة النموذج التالي بالبيانات الحقيقية والمطابقة لوثائقك الشخصية لتسهيل إجراءات التدقيق والاعتماد المهني.
        </p>
      </div>

      {/* Success View */}
      {successData ? (
        <div 
          className="rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-300"
          style={{ 
            backgroundColor: 'var(--header-color, #091424)',
            border: '2px solid var(--border-color, #93c5fd)'
          }}
        >
          <div className="w-20 h-20 rounded-full bg-blue-500/15 border-2 border-blue-400/40 text-blue-300 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {successData.message}
            </h2>
            <p className="text-slate-200 text-base max-w-lg mx-auto">
              تم تسجيل طلبك وحفظه بنجاح في قاعدة بيانات الأكاديمية تحت رقم المراجعة:
            </p>
            <div 
              className="inline-block px-5 py-2 rounded-xl font-mono text-xl font-bold text-amber-300 mt-2"
              style={{ 
                backgroundColor: 'var(--secondary-color, #0b192c)',
                border: '1px solid var(--border-color, #93c5fd)'
              }}
            >
              {successData.id}
            </div>
          </div>

          {/* Steps breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-right pt-4">
            <div 
              className="p-4 rounded-xl text-xs space-y-1"
              style={{ 
                backgroundColor: 'rgba(11, 25, 44, 0.9)',
                border: '1px solid rgba(147, 197, 253, 0.3)'
              }}
            >
              <span className="font-bold text-amber-400 block">1. التدقيق والتقييم</span>
              <p className="text-blue-200/70">تقوم اللجنة بمطابقة الخبرات مع معايير الشهادة.</p>
            </div>
            <div 
              className="p-4 rounded-xl text-xs space-y-1"
              style={{ 
                backgroundColor: 'rgba(11, 25, 44, 0.9)',
                border: '1px solid rgba(147, 197, 253, 0.3)'
              }}
            >
              <span className="font-bold text-amber-400 block">2. التواصل عبر واتساب</span>
              <p className="text-blue-200/70">سيتم التواصل معك على الرقم المدخل لتأكيد الاعتماد.</p>
            </div>
            <div 
              className="p-4 rounded-xl text-xs space-y-1"
              style={{ 
                backgroundColor: 'rgba(11, 25, 44, 0.9)',
                border: '1px solid rgba(147, 197, 253, 0.3)'
              }}
            >
              <span className="font-bold text-amber-400 block">3. إصدار الشهادة والـ QR</span>
              <p className="text-blue-200/70">تصلك نسختك الرقمية الموثقة مع إمكانية التحقق الفوري.</p>
            </div>
          </div>

          {/* WhatsApp Follow-up CTA */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            {settings?.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`مرحباً أكاديمية الأفق، قمت بتقديم طلب شهادة خبرة رقم (${successData.id}) وأود المتابعة.`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>متابعة الطلب عبر واتساب</span>
              </a>
            )}

            <button
              onClick={() => {
                setSuccessData(null);
                setFullName('');
                setPhone('');
                setEmail('');
                setPhotoPreview('');
                setDocName('');
                setNotes('');
              }}
              className="px-6 py-3 rounded-xl text-slate-200 text-sm font-medium border border-blue-500/40 hover:bg-blue-900/40 transition"
              style={{ backgroundColor: 'var(--secondary-color, #0b192c)' }}
            >
              تقديم طلب جديد
            </button>
          </div>
        </div>
      ) : (
        /* Form View */
        <div 
          className="rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8"
          style={{ 
            backgroundColor: 'var(--header-color, #091424)',
            border: '1px solid var(--border-color, #93c5fd)'
          }}
        >
          
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-sm flex items-center gap-2">
              <span className="font-bold">تنبيه:</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Group 1: Personal Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-blue-900/50 pb-2">
                <User className="w-5 h-5 text-amber-400" />
                <span>البيانات الشخصية</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-blue-200 mb-1.5">
                    الاسم الكامل (كما ترغب بظهوره بالشهادة) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: حيدر علي عبد الحسين"
                      className="w-full px-4 py-3 rounded-xl bg-[#0b192c] border border-blue-500/40 text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none transition text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-blue-200 mb-1.5">
                    رقم الهاتف (مع واتساب للتواصل) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+964 770 000 0000"
                      className="w-full px-4 py-3 rounded-xl bg-[#0b192c] border border-blue-500/40 text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none transition text-sm font-mono"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-blue-200 mb-1.5">
                    البريد الإلكتروني (اختياري)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#0b192c] border border-blue-500/40 text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none transition text-sm"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Governorate */}
                <div>
                  <label className="block text-xs font-semibold text-blue-200 mb-1.5">
                    المحافظة / الإقامة <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0b192c] border border-blue-500/40 text-white focus:border-amber-400 focus:outline-none transition text-sm"
                  >
                    {governorates.map((gov) => (
                      <option key={gov} value={gov} className="bg-[#0b192c] text-white">
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Group 2: Certificate details */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-blue-900/50 pb-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>بيانات الشهادة المطلوبة</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Specialty */}
                <div>
                  <label className="block text-xs font-semibold text-blue-200 mb-1.5">
                    التخصص المهني المطلوب <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="مثال: هندسة الكهرباء، المحاسبة المالية، تقنية المعلومات..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0b192c] border border-blue-500/40 text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none transition text-sm"
                    required
                  />
                </div>

                {/* Certificate Type */}
                <div>
                  <label className="block text-xs font-semibold text-blue-200 mb-1.5">
                    نوع الشهادة <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={certificateType}
                    onChange={(e) => setCertificateType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0b192c] border border-blue-500/40 text-white focus:border-amber-400 focus:outline-none transition text-sm"
                  >
                    {certificateTypes.map((type) => (
                      <option key={type} value={type} className="bg-[#0b192c] text-white">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Group 3: File Uploads */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-blue-900/50 pb-2">
                <Upload className="w-5 h-5 text-amber-400" />
                <span>المرفقات والوثائق</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Personal Photo */}
                <div className="p-4 rounded-xl bg-[#0b192c] border border-blue-500/30 flex flex-col justify-between">
                  <div>
                    <label className="block text-xs font-semibold text-blue-200 mb-1">
                      رفع صورة شخصية (اختياري للشهادة)
                    </label>
                    <p className="text-[11px] text-slate-400 mb-3">
                      صورة واضحة بخلفية رسمية بيضاء أو زرقاء.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {photoPreview ? (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-amber-400/50 shrink-0">
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setPhotoPreview('')}
                          className="absolute inset-0 bg-black/80 text-rose-400 text-xs flex items-center justify-center opacity-0 hover:opacity-100 transition"
                        >
                          حذف
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-[#07111e] border border-dashed border-blue-500/40 flex items-center justify-center text-blue-300/60 shrink-0">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}

                    <label className="cursor-pointer px-4 py-2 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-slate-200 text-xs font-semibold border border-blue-500/40 transition">
                      <span>اختر صورة</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Documents Upload */}
                <div className="p-4 rounded-xl bg-[#0b192c] border border-blue-500/30 flex flex-col justify-between">
                  <div>
                    <label className="block text-xs font-semibold text-blue-200 mb-1">
                      رفع المستمسكات (هوية / سيرة ذاتية / شهادات سابقة)
                    </label>
                    <p className="text-[11px] text-slate-400 mb-3">
                      ملف صورة أو مستند PDF يثبت هويتك أو خبرتك المهنية.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-[#07111e] border border-dashed border-blue-500/40 flex items-center justify-center text-slate-400 shrink-0">
                      <FileCheck className="w-6 h-6 text-amber-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {docName ? (
                        <div className="text-xs text-amber-400 truncate font-mono mb-1">
                          {docName}
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400 mb-1">
                          لم يتم اختيار ملف بعد
                        </div>
                      )}

                      <label className="cursor-pointer inline-block px-4 py-2 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-slate-200 text-xs font-semibold border border-blue-500/40 transition">
                        <span>{docName ? 'تغيير الملف' : 'رفع المستند'}</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleDocUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-blue-200 mb-1.5">
                ملاحظات أو نبذة عن سنوات الخبرة (اختياري)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="اكتب هنا أي تفاصيل إضافية عن سنوات عملك ومشاريعك السابقة..."
                className="w-full px-4 py-3 rounded-xl bg-[#0b192c] border border-blue-500/40 text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none transition text-sm"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-blue-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400">
                بالضغط على إرسال، فإنك تؤكد صحة البيانات المدخلة وتوافق على سياسة التقييم في الأكاديمية.
              </p>

              <button
                id="apply-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-base bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>جاري حفظ الطلب...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>إرسال الطلب</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};
