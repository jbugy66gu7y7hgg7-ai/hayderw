import React from 'react';
import { 
  FileText, 
  Award, 
  ScanLine, 
  Briefcase, 
  CheckCircle2, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const mainFeatures = [
    {
      title: "تعزيز السيرة الذاتية",
      subtitle: "Resume Enhancement",
      desc: "تمنح سيرتك الذاتية وزناً حقيقياً يبرز كفاءتك الميدانية بين المتقدمين، مع اعتماد رقمي رسمي يعكس جدية واحترافية مسارك المهني.",
      icon: FileText,
      color: "from-amber-500/20 to-amber-700/10",
      accent: "text-amber-400 border-amber-500/30",
      highlight: "أولوية في فرز المرشحين"
    },
    {
      title: "إثبات المهارة والخبرة",
      subtitle: "Skill & Experience Verification",
      desc: "وثيقة قانونية وفنية تثبت إتقانك العملي للتخصص بعد تقييم دقيق يبرهن للشركات والمؤسسات قدرتك على الإنجاز الفعلي.",
      icon: Award,
      color: "from-emerald-500/20 to-teal-700/10",
      accent: "text-emerald-400 border-emerald-500/30",
      highlight: "اعتماد كفاءة موثق"
    },
    {
      title: "التحقق الإلكتروني من الشهادة",
      subtitle: "Instant QR & Online Check",
      desc: "نظام إلكتروني لحظي يتيح لأصحاب العمل مسح رمز QR أو إدخال رقم الشهادة للتأكد من أصالتها ومطابقة البيانات الرسمية فورياً.",
      icon: ScanLine,
      color: "from-emerald-500/20 to-emerald-700/10",
      accent: "text-emerald-400 border-emerald-500/30",
      highlight: "تحقق فوري 24/7"
    },
    {
      title: "دعم فرصك المهنية",
      subtitle: "Career Advancement",
      desc: "فتح آفاق الترقي الوظيفي وزيادة الدخل والمنافسة بقوة على الفرص والتعاقدات المحلية والدولية والعمل عن بعد بثقة تامة.",
      icon: Briefcase,
      color: "from-purple-500/20 to-purple-700/10",
      accent: "text-purple-400 border-purple-500/30",
      highlight: "فرص وظيفية أوسع"
    }
  ];

  return (
    <section id="features-section" className="py-20 lg:py-28 bg-[#041d16] relative border-b border-amber-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header - Exact User Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>قيمة مضافة لمستقبلك</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            مميزات امتلاك <span className="gold-gradient-text">الشهادة</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            تمتاز شهادات أكاديمية الأفق ببنية رقمية متطورة تضمن لك المصداقية والقبول في مختلف المحافل المهنية وأسواق العمل.
          </p>
        </div>

        {/* Feature Cards Grid (4 Core Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-3xl p-7 bg-[#062920]/90 border border-amber-500/20 hover:border-amber-500/50 shadow-xl hover:shadow-amber-500/5 transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between"
              >
                <div>
                  {/* Icon + Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl p-3.5 bg-gradient-to-br ${feat.color} border ${feat.accent} flex items-center justify-center transition-transform group-hover:scale-110 shadow-md`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#063327] text-amber-400/90 border border-[#065f46]/40">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-white transition">
                    {feat.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#065f46]/40 flex items-center justify-between text-xs text-white font-semibold">
                  <span>{feat.highlight}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
