import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Printer, 
  Copy, 
  Check, 
  MessageCircle, 
  Award, 
  Calendar, 
  User,
  Search,
  Eye,
  KeyRound,
  ExternalLink
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Certificate, AcademySettings } from '../types';
import confetti from 'canvas-confetti';

interface VerifySectionProps {
  settings?: AcademySettings;
  onViewFullCertificate?: (cert: Certificate) => void;
  onVerifyToPage?: (certNum: string) => void;
  initialCode?: string;
}

export const VerifySection: React.FC<VerifySectionProps> = ({
  settings,
  onVerifyToPage,
  initialCode = '',
}) => {
  // Input starts strictly empty with no default numbers or prefilled values
  const [certInput, setCertInput] = useState(initialCode);
  const [loading, setLoading] = useState(false);

  // Master code results (35 certificates)
  const [masterData, setMasterData] = useState<{
    code: string;
    total: number;
    certificates: Certificate[];
  } | null>(null);
  const [masterSearch, setMasterSearch] = useState('');

  // Selected single certificate modal (either from direct lookup or from clicking a card in the 35 list)
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  // Error message state (both inline and modal)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  const [copied, setCopied] = useState(false);
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);

  // React to initialCode changes (e.g. from Hero input)
  React.useEffect(() => {
    if (initialCode) {
      setCertInput(initialCode);
      executeVerification(initialCode);
    }
  }, [initialCode]);

  const executeVerification = async (codeToVerify: string) => {
    const trimmed = codeToVerify.trim();
    if (!trimmed) {
      setErrorMessage('رمز الشهادة غير صحيح، يرجى التأكد من الرمز والمحاولة مرة أخرى.');
      setErrorModalOpen(true);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setErrorModalOpen(false);

    try {
      const res = await fetch(`/api/certificates/verify/${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (res.ok && data.found) {
        // Master code with multiple certificates (e.g. 71110203328 with 35 certificates)
        if (data.isMasterCode || data.isMasterAdmin || (Array.isArray(data.certificates) && data.certificates.length > 0)) {
          setMasterData({
            code: trimmed,
            total: data.total || data.certificates.length,
            certificates: data.certificates
          });
          setSelectedCert(null);
          setErrorMessage(null);
          setErrorModalOpen(false);
          confetti({
            particleCount: 60,
            spread: 80,
            origin: { y: 0.6 },
          });

          // Scroll smoothly to results
          setTimeout(() => {
            const el = document.getElementById('verification-results-container');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 150);
          return;
        }

        // Single individual certificate
        if (data.certificate) {
          setMasterData(null);
          setSelectedCert(data.certificate);
          setErrorMessage(null);
          setErrorModalOpen(false);
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } else {
        setMasterData(null);
        setSelectedCert(null);
        setErrorMessage('رمز الشهادة غير صحيح، يرجى التأكد من الرمز والمحاولة مرة أخرى.');
        setErrorModalOpen(true);
      }
    } catch (err) {
      console.error(err);
      setMasterData(null);
      setSelectedCert(null);
      setErrorMessage('رمز الشهادة غير صحيح، يرجى التأكد من الرمز والمحاولة مرة أخرى.');
      setErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    executeVerification(certInput);
  };

  const handleCopyLink = (certNum: string) => {
    const url = `${window.location.origin}/verify/${certNum}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCardCert = (certNum: string) => {
    const url = `${window.location.origin}/verify/${certNum}`;
    navigator.clipboard.writeText(url);
    setCopiedCardId(certNum);
    setTimeout(() => setCopiedCardId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredCertificates = masterData?.certificates.filter((c) => {
    if (!masterSearch) return true;
    const term = masterSearch.toLowerCase();
    return (
      c.certificateNumber.toLowerCase().includes(term) ||
      c.holderName.toLowerCase().includes(term) ||
      (c.specialty && c.specialty.toLowerCase().includes(term))
    );
  }) || [];

  return (
    <section 
      id="verify-section" 
      className="py-20 lg:py-24 text-white relative overflow-hidden transition-colors duration-300"
      style={{ 
        backgroundColor: 'var(--secondary-color, #0b192c)',
        borderTop: '1px solid rgba(147, 197, 253, 0.25)',
        borderBottom: '1px solid rgba(147, 197, 253, 0.25)'
      }}
    >
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-10">
        
        {/* Exact Title: أدخل رمز الشهادة للتحقق */}
        <div className="max-w-4xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-4xl lg:text-4xl font-extrabold text-white leading-snug tracking-tight">
            أدخل رمز الشهادة للتحقق
          </h2>
          <p className="text-xs sm:text-sm text-blue-200/90 font-medium">
            قم بإدخال رمز الشهادة للتحقق الفوري من صحة وموثوقية الشهادة الصادرة
          </p>
        </div>

        {/* Verification Form: [ أدخل رمز الشهادة للتحقق ] [ تحقق ] */}
        <div className="max-w-2xl mx-auto text-right">
          <form onSubmit={handleVerify}>
            <label htmlFor="cert-code-input" className="block text-sm sm:text-base font-bold text-white mb-2">
              أدخل رمز الشهادة للتحقق
            </label>
            <div 
              className="flex flex-col sm:flex-row items-center bg-white rounded-xl p-2 shadow-2xl transition gap-2"
              style={{ border: '2px solid var(--border-color, #93c5fd)' }}
            >
              <input
                id="cert-code-input"
                type="text"
                value={certInput}
                onChange={(e) => {
                  setCertInput(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="أدخل رمز الشهادة للتحقق"
                className="w-full flex-1 px-4 py-3.5 text-base sm:text-lg bg-transparent text-[#0f172a] placeholder-slate-400 focus:outline-none font-bold text-center sm:text-right"
                dir="ltr"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-white font-bold text-base transition shadow-md whitespace-nowrap flex items-center justify-center gap-2 hover:brightness-110 active:scale-95"
                style={{ backgroundColor: 'var(--button-color, #1d4ed8)' }}
              >
                {loading ? (
                  <span>جاري التحقق...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-amber-300" />
                    <span>تحقق</span>
                  </>
                )}
              </button>
            </div>

            {/* Inline Error Message according to item 5 */}
            {errorMessage && (
              <div className="mt-3.5 p-3.5 bg-red-900/80 border-2 border-red-500 text-white rounded-xl flex items-center justify-start gap-2.5 text-sm sm:text-base font-bold animate-in fade-in duration-200 shadow-xl">
                <AlertCircle className="w-5 h-5 text-red-300 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>
        </div>

        {/* ========================================================================= */}
        {/* RESULTS: APPEAR ONLY AFTER USER CLICKS "تحقق من الشهادة" */}
        {/* ========================================================================= */}

        {/* 1. MASTER CODE RESULT: Displays the 35 certificates clearly and neatly */}
        {masterData && (
          <div 
            id="verification-results-container"
            className="text-right space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 pt-6"
          >
            {/* Header Banner */}
            <div 
              className="rounded-2xl p-6 sm:p-8 text-white shadow-2xl space-y-4"
              style={{ 
                backgroundColor: 'var(--header-color, #091424)',
                border: '2px solid var(--border-color, #93c5fd)'
              }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-blue-900/50">
                <div className="space-y-1.5 text-right">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/40 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4 text-blue-300" />
                    <span>رمز تحقق رئيسي معتمد وموثق</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    نتائج التحقق للرمز الرئيسي: <span className="text-amber-400 font-mono">{masterData.code}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    تم توثيق الرمز بنجاح وعرض الشهادات الـ ({masterData.certificates.length}) المعتمدة المرتبطة به
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div 
                    className="px-4 py-2 rounded-xl text-left"
                    style={{ 
                      backgroundColor: 'rgba(11, 25, 44, 0.8)',
                      border: '1px solid var(--border-color, #93c5fd)'
                    }}
                  >
                    <span className="text-[11px] text-blue-200 block">إجمالي الشهادات:</span>
                    <span className="text-xl font-bold font-mono text-amber-300">
                      {masterData.certificates.length} شهادة
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Search within the 35 certificates */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    value={masterSearch}
                    onChange={(e) => setMasterSearch(e.target.value)}
                    placeholder="بحث في الشهادات بالاسم أو الرقم أو التخصص..."
                    className="w-full pl-3 pr-9 py-2 rounded-xl text-white placeholder-slate-400 text-xs focus:outline-none focus:border-amber-400"
                    style={{ 
                      backgroundColor: 'var(--secondary-color, #0b192c)',
                      border: '1px solid var(--border-color, #93c5fd)'
                    }}
                  />
                  <Search className="w-4 h-4 text-blue-300 absolute right-3 top-2.5" />
                </div>
                <span className="text-xs text-blue-200">
                  المعروض: {filteredCertificates.length} من أصل {masterData.certificates.length} شهادة
                </span>
              </div>
            </div>

            {/* 35 Certificates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCertificates.map((cert, index) => (
                <div
                  key={cert.id || index}
                  className="rounded-xl p-5 shadow-lg transition-all duration-200 flex flex-col justify-between text-right space-y-4 hover:shadow-xl"
                  style={{ 
                    backgroundColor: 'var(--card-color, #ffffff)',
                    border: '1px solid var(--border-color, #93c5fd)',
                    color: 'var(--text-color, #0f172a)'
                  }}
                >
                  <div className="space-y-3">
                    {/* Top Row: Reg number & Status badge */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-sm text-blue-700" dir="ltr">
                          {cert.certificateNumber}
                        </span>
                        <button
                          onClick={() => handleCopyCardCert(cert.certificateNumber)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 transition"
                          title="نسخ رابط الشهادة"
                        >
                          {copiedCardId === cert.certificateNumber ? (
                            <Check className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        {cert.status} وموثقة
                      </span>
                    </div>

                    {/* Specialty */}
                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <Award className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-semibold text-slate-800">التخصص:</span>
                      <span className="text-slate-900 font-medium">{cert.specialty}</span>
                    </div>

                    {/* Issue Date */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 pt-1 border-t border-slate-100">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{cert.issueDate}</span>
                    </div>
                  </div>

                  {/* Card Actions: Open separate certificate view */}
                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="w-full py-2.5 px-4 rounded-xl text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm hover:brightness-110 cursor-pointer"
                      style={{ backgroundColor: 'var(--button-color, #1d4ed8)' }}
                    >
                      <Eye className="w-4 h-4 text-amber-300" />
                      <span>عرض تفاصيل الشهادة</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* SEPARATE CERTIFICATE DETAILS MODAL (FOR ANY OF THE 35 CERTIFICATES) */}
      {/* ========================================================================= */}
      {selectedCert && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedCert(null)}
        >
          <div 
            className="relative max-w-lg w-full bg-white rounded-2xl shadow-2xl overflow-hidden text-right border-4 border-blue-600 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 left-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition z-10"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6">
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  تم توثيق الشهادة من أكاديمية الأفق - ماليزيا!
                </h3>

                <p className="text-xs sm:text-sm font-semibold text-blue-700 bg-blue-50 py-1.5 px-3 rounded-full inline-block border border-blue-200">
                  الشهادة مسجلة وموثقة رسمياً
                </p>
              </div>

              {/* Certificate Information Card */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3.5 text-sm text-slate-800">
                
                {/* Registration Number */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">رقم التسجيل:</span>
                  <span className="font-mono font-bold text-blue-700 text-base" dir="ltr">
                    {selectedCert.certificateNumber}
                  </span>
                </div>

                {/* Specialty */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-blue-600" />
                    التخصص:
                  </span>
                  <span className="font-semibold text-slate-900">
                    {selectedCert.specialty}
                  </span>
                </div>

                {/* Issue Date */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    تاريخ الإصدار:
                  </span>
                  <span className="font-medium text-slate-700 font-mono">
                    {selectedCert.issueDate}
                  </span>
                </div>

                {/* Grade */}
                {selectedCert.grade && (
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">التقدير:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedCert.grade}
                    </span>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">حالة الشهادة:</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                    {selectedCert.status} وموثقة رسمياً
                  </span>
                </div>

              </div>

              {/* QR Code & Official Verification Link */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200 gap-4">
                <div className="space-y-1 text-center sm:text-right">
                  <span className="text-sm font-bold text-blue-950 block">رمز التحقق الذكي (QR Code)</span>
                  <span className="text-xs text-slate-600 block">امسح الرمز بكاميرا الهاتف للتحقق المباشر</span>
                  <span className="text-[11px] font-mono text-blue-700 block dir-ltr" dir="ltr">
                    {selectedCert.certificateNumber}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border-2 border-blue-300 shadow-md shrink-0">
                  <QRCodeSVG
                    value={`${window.location.origin}/verify/${selectedCert.certificateNumber}`}
                    size={110}
                    level="M"
                    includeMargin={true}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleCopyLink(selectedCert.certificateNumber)}
                  className="flex-1 py-2.5 px-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-1.5"
                >
                  {copied ? <Check className="w-4 h-4 text-blue-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'تم النسخ' : 'نسخ رابط التوثيق'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="py-2.5 px-4 rounded-lg text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 shadow hover:brightness-110"
                  style={{ backgroundColor: 'var(--button-color, #1d4ed8)' }}
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>طباعة الوثيقة</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ERROR MODAL: «رمز الشهادة غير صحيح، يرجى التأكد من الرمز والمحاولة مرة أخرى.» */}
      {/* ========================================================================= */}
      {errorModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setErrorModalOpen(false)}
        >
          <div 
            className="relative max-w-lg w-full bg-white rounded-2xl shadow-2xl overflow-hidden text-right border-4 border-red-500 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setErrorModalOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition z-10"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8 space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
                <AlertCircle className="w-10 h-10" />
              </div>

              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-red-600">
                  رمز الشهادة غير صحيح
                </h3>
                <p className="text-base text-slate-700 font-semibold leading-relaxed max-w-sm mx-auto">
                  رمز الشهادة غير صحيح، يرجى التأكد من الرمز والمحاولة مرة أخرى.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="https://wa.me/+9647853331053"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>تواصل مع الدعم عبر واتساب</span>
                </a>

                <button
                  onClick={() => setErrorModalOpen(false)}
                  className="w-full sm:w-auto px-5 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
