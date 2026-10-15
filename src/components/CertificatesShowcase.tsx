import React, { useState } from 'react';
import { Eye, X, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CertificatesShowcaseProps {
  galleryImages?: string[];
  onApplyClick?: () => void;
}

// Tailored metadata matching alofuk.com's prestigious identity and certificates
const CARD_METADATA: Array<{ badge: string; title: string; description: string }> = [
  {
    badge: 'الاعتماد الدولي المعتمد',
    title: 'شهادة الخبرة والاعتماد المهني (IPAF)',
    description: 'شهادة دولية موثقة ومعتمدة صادرة من ماليزيا تثبت الكفاءة والخبرة المهنية التخصصية للمستحقين بعد اجتياز متطلبات التقييم.',
  },
  {
    badge: 'ملف الدبلوم والعضوية',
    title: 'محفظة الاعتماد وبطاقة العضوية الدولية',
    description: 'ملف دبلوم جلدي فاخر يتضمن شهادة الخبرة وبطاقة الهوية المهنية الرقمية المزودة برمز QR للتحقق السريع عالمياً.',
  },
  {
    badge: 'المقر والخدمات الإدارية',
    title: 'صالة الاستقبال وقاعة التوثيق الرسمية',
    description: 'المقر المعتمد لأكاديمية الأفق لاستقبال المستفيدين، توثيق السجلات، وإصدار ملفات الاعتماد الأكاديمي والمهني.',
  },
  {
    badge: 'التوثيق المؤسسي',
    title: 'لوحة الاعتماد الجدارية المعتمدة',
    description: 'لوحة زجاجية رسمية معلقة توثق الاعتمادات الدولية المعترف بها في كبرى المؤسسات والشركات المعتمدة.',
  },
  {
    badge: 'درع التميز والكفاءة',
    title: 'درع الاستحقاق والكفاءة الدولية',
    description: 'درع تقديري زجاجي شفاف يمنح للخبراء والمتميزين كرمز رسمي للاعتراف بالخبرة والكفاءة الدولية.',
  },
];

export const CertificatesShowcase: React.FC<CertificatesShowcaseProps> = ({
  galleryImages = [],
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // If no images have been uploaded yet, render hidden anchor without any placeholder
  if (!galleryImages || galleryImages.length === 0) {
    return <div id="discover-section" className="hidden" />;
  }

  return (
    <section 
      id="discover-section" 
      className="py-16 lg:py-24 relative border-b transition-colors duration-300"
      style={{ 
        backgroundColor: 'var(--secondary-color, #0b192c)',
        borderColor: 'rgba(147, 197, 253, 0.25)' 
      }}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header styled after alofuk.com */}
        <div className="max-w-3xl mx-auto mb-12 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/40 border border-blue-400/30 text-cyan-300 text-xs sm:text-sm font-bold shadow-sm">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>معرض النماذج والشهادات المعتمدة</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
            نماذج ومميزات <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-200">شهادة الخبرة الدولية</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            توثيق مهني رسمي معتمد بنظام تحقق فوري بالباركود ورمز QR المباشر
          </p>

          <div className="pt-1">
            <a
              href="/admin?tab=gallery"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-950/80 hover:bg-blue-900 text-cyan-200 border border-cyan-400/40 transition shadow-sm hover:scale-105"
            >
              <span>إدارة وتحديث صور المعرض</span>
            </a>
          </div>
        </div>

        {/* Responsive Grid with equal heights, clean rounded cards, uniform dimensions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {galleryImages.map((imgSrc, idx) => {
            const meta = CARD_METADATA[idx % CARD_METADATA.length];
            return (
              <div
                key={idx}
                className="group flex flex-col h-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#0e213b] to-[#071322] border border-blue-500/30 hover:border-cyan-400/70 shadow-xl transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Image Container with UNIFIED HEIGHT & DIMENSIONS */}
                <div 
                  onClick={() => setSelectedImage(imgSrc)}
                  className="w-full h-64 sm:h-72 p-3 bg-gradient-to-b from-[#091526] to-[#060e1a] flex items-center justify-center relative overflow-hidden rounded-t-2xl border-b border-blue-500/20 cursor-pointer"
                >
                  <img
                    src={imgSrc}
                    alt={meta.title}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  {/* Hover Overlay with View Icon */}
                  <div className="absolute inset-0 bg-blue-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white pointer-events-none">
                    <div className="p-2.5 rounded-full bg-blue-600/90 text-white shadow-xl flex items-center gap-1.5 px-4 text-xs font-bold border border-white/20">
                      <Eye className="w-4 h-4 text-cyan-200" />
                      <span>معاينة بالحجم الكامل</span>
                    </div>
                  </div>
                </div>

                {/* Details Section Beneath Image */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between text-right space-y-3">
                  <div className="space-y-2">
                    <span className="inline-block text-[11px] font-bold text-cyan-300 bg-cyan-950/70 px-2.5 py-1 rounded-md border border-cyan-500/30">
                      {meta.badge}
                    </span>

                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-200 transition-colors leading-snug">
                      {meta.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {meta.description}
                    </p>
                  </div>

                  {/* Card Footer Action */}
                  <div className="pt-3 border-t border-blue-500/20 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>موثق رسمياً</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedImage(imgSrc)}
                      className="text-cyan-300 hover:text-white font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>تكبير الصورة</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Lightbox / Full view Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-transparent rounded-2xl overflow-hidden flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 left-3 p-2 rounded-full bg-black/70 text-white hover:bg-black hover:text-cyan-300 transition z-10 cursor-pointer"
              title="إغلاق"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="معاينة بالحجم الكامل"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </section>
  );
};
