import React, { useState } from 'react';
import { 
  Server, 
  Code, 
  Cpu, 
  ShieldCheck, 
  Briefcase, 
  Coins, 
  TrendingUp, 
  Palette, 
  Compass, 
  Languages, 
  BookOpen, 
  Sparkles,
  ArrowLeft,
  Building2,
  Wrench,
  UserCheck,
  Workflow,
  Truck,
  Scale,
  Landmark,
  Megaphone,
  HardHat,
  Stethoscope,
  HeartHandshake,
  Microscope,
  Award,
  GraduationCap,
  Globe,
  Calendar,
  Camera,
  CheckCircle2,
  ShoppingBag,
  Sprout,
  Flame
} from 'lucide-react';
import { Specialty } from '../types';

interface SpecialtiesSectionProps {
  specialties: Specialty[];
  onSelectSpecialty: (specialtyName: string) => void;
}

export const SpecialtiesSection: React.FC<SpecialtiesSectionProps> = ({
  specialties,
  onSelectSpecialty,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('الكل');

  // Map icon strings to Lucide icon components
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Server,
    Code,
    Cpu,
    ShieldCheck,
    Briefcase,
    Coins,
    TrendingUp,
    Palette,
    Building2,
    Compass,
    Wrench,
    Sparkles,
    UserCheck,
    Workflow,
    Truck,
    Scale,
    Landmark,
    Languages,
    Megaphone,
    HardHat,
    Stethoscope,
    HeartHandshake,
    Microscope,
    Award,
    GraduationCap,
    BookOpen,
    Globe,
    Calendar,
    Camera,
    CheckCircle2,
    ShoppingBag,
    Sprout,
    Flame,
  };

  const getIconComponent = (iconName?: string, name?: string) => {
    if (iconName && iconMap[iconName]) return iconMap[iconName];
    if (name?.includes('تقنية') || name?.includes('شبكات')) return Server;
    if (name?.includes('برمج') || name?.includes('كود')) return Code;
    if (name?.includes('ذكاء')) return Cpu;
    if (name?.includes('أمن')) return ShieldCheck;
    if (name?.includes('إدارة') || name?.includes('أعمال')) return Briefcase;
    if (name?.includes('محاسبة') || name?.includes('مالي')) return Coins;
    if (name?.includes('تسويق')) return TrendingUp;
    if (name?.includes('تصميم') || name?.includes('فوتو')) return Palette;
    if (name?.includes('بناء') || name?.includes('مدني')) return Building2;
    if (name?.includes('معمار')) return Compass;
    if (name?.includes('ميكانيك')) return Wrench;
    if (name?.includes('طاقة') || name?.includes('كهرباء')) return Sparkles;
    if (name?.includes('موارد')) return UserCheck;
    if (name?.includes('مشاريع')) return Workflow;
    if (name?.includes('إمداد') || name?.includes('نقل')) return Truck;
    if (name?.includes('قانون')) return Scale;
    if (name?.includes('مصرف') || name?.includes('دبلوماس')) return Landmark;
    if (name?.includes('لغات') || name?.includes('ترجمة')) return Languages;
    if (name?.includes('إعلام') || name?.includes('صحافة')) return Megaphone;
    if (name?.includes('سلامة')) return HardHat;
    if (name?.includes('مستشفى') || name?.includes('صحي')) return Stethoscope;
    if (name?.includes('تمريض') || name?.includes('نفسي')) return HeartHandshake;
    if (name?.includes('مختبر') || name?.includes('تحليلات')) return Microscope;
    if (name?.includes('صيدلة')) return Award;
    if (name?.includes('تعليم') || name?.includes('تدريس')) return GraduationCap;
    if (name?.includes('سياحة') || name?.includes('فنادق')) return Globe;
    if (name?.includes('فعاليات') || name?.includes('مؤتمر')) return Calendar;
    if (name?.includes('كاميرا') || name?.includes('تصوير')) return Camera;
    if (name?.includes('جودة') || name?.includes('آيزو')) return CheckCircle2;
    if (name?.includes('تجارة')) return ShoppingBag;
    if (name?.includes('زراع')) return Sprout;
    if (name?.includes('نفط') || name?.includes('غاز')) return Flame;
    return BookOpen;
  };

  const categories = ['الكل', ...Array.from(new Set(specialties.map(s => s.category || 'عام')))];

  const filteredSpecialties = activeCategory === 'الكل'
    ? specialties
    : specialties.filter(s => (s.category || 'عام') === activeCategory);

  return (
    <section 
      id="specialties-section" 
      className="py-20 relative transition-colors duration-300"
      style={{ backgroundColor: 'var(--secondary-color, #0b192c)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>مسارات الاعتماد</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            التخصصات <span className="text-blue-400">المتاحة</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            نوفر شهادات خبرة دولية موثقة في طيف واسع من المجالات الحيوية لمساعدتك على تعزيز سيرتك الذاتية.
          </p>
        </div>

        {/* Categories Pills */}
        {categories.length > 2 && (
          <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                    : 'bg-[#071322] text-slate-200 hover:text-white hover:bg-slate-800 border border-blue-500/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Specialties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredSpecialties.map((spec) => {
            const Icon = getIconComponent(spec.icon, spec.name);
            return (
              <div
                key={spec.id}
                className="rounded-2xl p-6 bg-[#071322] border border-blue-500/30 hover:border-blue-400 shadow-lg hover:shadow-xl transition flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-4 transition transform group-hover:scale-110">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition">
                    {spec.name}
                  </h3>

                  <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {spec.description || `شهادة خبرة وتوثيق كفاءة معتمدة دولياً في مجال ${spec.name}.`}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-blue-500/20">
                  <button
                    onClick={() => onSelectSpecialty(spec.name)}
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 active:scale-95 shadow-md"
                  >
                    <span>طلب شهادة بهذا التخصص</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
