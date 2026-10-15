import React from 'react';
import { AcademySettings } from '../types';
import { CheckCircle, Award, ShieldCheck } from 'lucide-react';

interface AboutSectionProps {
  settings?: AcademySettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings }) => {
  return (
    <section 
      id="about-section" 
      className="py-20 lg:py-24 relative border-b text-right transition-colors duration-300"
      style={{ 
        backgroundColor: 'var(--bg-color, #ffffff)', 
        borderColor: 'rgba(147, 197, 253, 0.3)',
        color: 'var(--text-color, #0f172a)'
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          
          {/* Tag / Subtitle */}
          <div className="inline-block">
            <span className="text-sm font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-3.5 py-1.5 rounded-lg border border-blue-200">
              عن الأكاديمية
            </span>
          </div>

          {/* Title from original site */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            معلومات اكثر عنا <br />
            <span className="text-blue-600">نحن اكاديميه الافق - ماليزيا</span>
          </h2>

          {/* Description from original site */}
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
            {settings?.aboutFull || "هي وكالة من اكاديمية ماليزية الأولى من صنفها في العراق تعمل على منح شهادة الخبرة الدولية الموثوقة للخبراء المستحقين بعد اجتياز الاختبار ، دعماً من المؤسسين وُ خدمة للصالح العام سيتم عمل خصومات لفترة محدودة على رسوم منح الشهادة .."}
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div 
              className="p-4 rounded-xl border flex items-start gap-3 shadow-sm"
              style={{ 
                backgroundColor: 'var(--card-color, #ffffff)',
                borderColor: 'var(--border-color, #93c5fd)'
              }}
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">توثيق دولي معتمد</h4>
                <p className="text-xs text-slate-500 mt-0.5">شهادات معتمدة صادرة من ماليزيا بأنظمة تحقق فورية</p>
              </div>
            </div>

            <div 
              className="p-4 rounded-xl border flex items-start gap-3 shadow-sm"
              style={{ 
                backgroundColor: 'var(--card-color, #ffffff)',
                borderColor: 'var(--border-color, #93c5fd)'
              }}
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">خبرة واعتراف مهني</h4>
                <p className="text-xs text-slate-500 mt-0.5">أكثر من 15 عاماً في تقييم واعتماد الكفاءات المهنية</p>
              </div>
            </div>
          </div>

          {/* Core Values / Bullet points */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <span>نظام تحقق إلكتروني فوري برقم التسجيل وكود الاستجابة السريعة (QR)</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <span>معايير جودة دولية متوافقة مع متطلبات سوق العمل العالمي والمحلي</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <span>خدمة عملاء ودعم استشاري مستمر للمستفيدين عبر قنوات تواصل مباشرة</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
