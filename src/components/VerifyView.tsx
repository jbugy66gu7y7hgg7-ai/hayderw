import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Copy, 
  Check, 
  Calendar, 
  Award, 
  User, 
  ArrowRight,
  MessageCircle,
  KeyRound,
  Search,
  ExternalLink,
  FileText,
  Eye
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Certificate, AcademySettings } from '../types';
import confetti from 'canvas-confetti';

interface VerifyViewProps {
  initialCertNumber?: string;
  onBackToHome?: () => void;
  settings?: AcademySettings;
}

export const VerifyView: React.FC<VerifyViewProps> = ({
  initialCertNumber = '',
  onBackToHome,
  settings,
}) => {
  const [certInput, setCertInput] = useState(initialCertNumber);
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [masterAdminData, setMasterAdminData] = useState<{
    isMasterAdmin: boolean;
    total: number;
    certificates: Certificate[];
  } | null>(null);
  const [masterSearch, setMasterSearch] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedCertId, setCopiedCertId] = useState<string | null>(null);

  const executeVerify = async (numberToVerify: string) => {
    const trimmed = numberToVerify.trim();
    if (!trimmed) {
      setErrorMsg("رمز الشهادة غير صحيح، يرجى التأكد من الرمز والمحاولة مرة أخرى.");
      setCertificate(null);
      setMasterAdminData(null);
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setCertificate(null);

    try {
      const response = await fetch(`/api/certificates/verify/${encodeURIComponent(trimmed)}`);
      const data = await response.json();

      if (response.ok && data.found) {
        // Special Master Code (e.g. 71110203328 with 35 certificates)
        if ((data.isMasterCode || data.isMasterAdmin) && Array.isArray(data.certificates)) {
          setMasterAdminData({
            isMasterAdmin: true,
            total: data.total !== undefined ? data.total : data.certificates.length,
            certificates: data.certificates
          });
          setCertificate(null);
          setErrorMsg(null);
          window.history.pushState({}, '', `/verify/${encodeURIComponent(trimmed)}`);
          return;
        }

        // Individual single certificate
        if (data.certificate) {
          setCertificate(data.certificate);
          setMasterAdminData(null);
          setErrorMsg(null);
          if (data.certificate.status === 'صالحة') {
            confetti({
              particleCount: 50,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
          window.history.pushState({}, '', `/verify/${encodeURIComponent(trimmed)}`);
        }
      } else {
        setCertificate(null);
        setMasterAdminData(null);
        setErrorMsg("رمز الشهادة غير صحيح، يرجى التأكد من الرمز والمحاولة مرة أخرى.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setCertificate(null);
      setMasterAdminData(null);
      setErrorMsg("رمز الشهادة غير صحيح، يرجى التأكد من الرمز والمحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCertNumber) {
      setCertInput(initialCertNumber);
      executeVerify(initialCertNumber);
    }
  }, [initialCertNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeVerify(certInput);
  };

  const handleCopyLink = () => {
    if (!certificate) return;
    const url = `${window.location.origin}/verify/${certificate.certificateNumber}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySingleCert = (certNum: string) => {
    const url = `${window.location.origin}/verify/${certNum}`;
    navigator.clipboard.writeText(url);
    setCopiedCertId(certNum);
    setTimeout(() => setCopiedCertId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredMasterCertificates = masterAdminData?.certificates.filter(c => {
    if (!masterSearch) return true;
    const term = masterSearch.toLowerCase();
    return (
      c.certificateNumber.toLowerCase().includes(term) ||
      c.holderName.toLowerCase().includes(term) ||
      (c.specialty && c.specialty.toLowerCase().includes(term)) ||
      (c.phone && c.phone.includes(term))
    );
  }) || [];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 text-right">
      
      {/* Top Breadcrumb & Title */}
      <div className="text-center space-y-3">
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-sm text-[#F5C85A] hover:underline font-semibold transition mb-2"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </button>
        )}

        <h1 className="text-3xl sm:text-4xl font-black text-white">
          أدخل رمز الشهادة <span className="text-[#F5C85A]">للتحقق</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          قم بإدخال رمز الشهادة للتحقق من صحتها وتوثيقها لدى أكاديمية الأفق - ماليزيا
        </p>
      </div>

      {/* Verification Input Box */}
      <div 
        className="rounded-2xl p-6 sm:p-8 shadow-2xl"
        style={{ 
          backgroundColor: 'var(--header-color, #091424)',
          border: '1px solid var(--border-color, #93c5fd)'
        }}
      >
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <label htmlFor="verify-view-input" className="block text-right text-sm sm:text-base font-bold text-white mb-2">
            أدخل رمز الشهادة للتحقق
          </label>
          <div 
            className="flex flex-col sm:flex-row items-center bg-white rounded-xl p-2 shadow-inner gap-2"
            style={{ border: '2px solid var(--border-color, #93c5fd)' }}
          >
            <input
              id="verify-view-input"
              type="text"
              value={certInput}
              onChange={(e) => {
                setCertInput(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="أدخل رمز الشهادة للتحقق"
              className="w-full flex-1 px-4 py-3.5 text-base sm:text-lg bg-transparent text-[#0f172a] placeholder-slate-400 focus:outline-none font-bold text-center sm:text-right"
              dir="ltr"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-white font-bold text-base transition shadow whitespace-nowrap flex items-center justify-center gap-2 hover:brightness-110 active:scale-95"
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
        </form>
      </div>

      {/* RESULT 0: MASTER ADMIN VIEW (ALL CERTIFICATES IN ONE PAGE) */}
      {masterAdminData && !certificate && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          {/* Header Banner */}
          <div 
            className="rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-right text-white"
            style={{ 
              backgroundColor: 'var(--header-color, #091424)',
              border: '2px solid var(--border-color, #93c5fd)'
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-blue-900/50">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>رمز التحقق الرئيسي المعتمد (71110203328)</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  عرض الشهادات الـ ({masterAdminData.certificates.length}) المعتمدة والموثقة
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  عرض كامل لجميع الشهادات المرتبطة برمز التحقق الرئيسي في قاعدة بيانات أكاديمية الأفق
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div 
                  className="text-left px-4 py-2.5 rounded-xl"
                  style={{ 
                    backgroundColor: 'rgba(11, 25, 44, 0.8)',
                    border: '1px solid var(--border-color, #93c5fd)'
                  }}
                >
                  <span className="text-[11px] text-blue-200 block">إجمالي السجلات:</span>
                  <span className="text-xl font-bold font-mono text-white">
                    {masterAdminData.certificates.length} شهادة
                  </span>
                </div>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow hover:brightness-110"
                  style={{ backgroundColor: 'var(--button-color, #1d4ed8)' }}
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>طباعة القائمة</span>
                </button>
              </div>
            </div>

            {/* Quick Search inside master list if certificates exist */}
            {masterAdminData.certificates.length > 0 && (
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    value={masterSearch}
                    onChange={(e) => setMasterSearch(e.target.value)}
                    placeholder="بحث سريع بالاسم أو الرقم أو التخصص..."
                    className="w-full pl-3 pr-9 py-2 rounded-xl text-white placeholder-slate-400 text-xs focus:outline-none focus:border-amber-400"
                    style={{ 
                      backgroundColor: 'var(--secondary-color, #0b192c)',
                      border: '1px solid var(--border-color, #93c5fd)'
                    }}
                  />
                  <Search className="w-4 h-4 text-blue-300 absolute right-3 top-2.5" />
                </div>
                <span className="text-xs text-blue-200">
                  المعروض: {filteredMasterCertificates.length} من {masterAdminData.certificates.length} شهادة
                </span>
              </div>
            )}
          </div>

          {/* Empty State if no certificates registered yet */}
          {masterAdminData.certificates.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-10 text-center space-y-4 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-slate-800">
                  تم تأكيد الرمز الإداري: لا توجد شهادات مسجلة حالياً
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  قاعدة البيانات خالية من أي شهادات حالياً. عند إضافة أي شهادة جديدة من لوحة التحكم، ستظهر فوراً في هذه الصفحة المجمعة لمدير النظام.
                </p>
              </div>
            </div>
          ) : (
            /* Display all certificates in a clean grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMasterCertificates.map((cert) => (
                <div 
                  key={cert.id}
                  className="rounded-2xl p-5 shadow-lg transition-all space-y-4 flex flex-col justify-between hover:shadow-xl"
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
                        <span className="font-mono font-bold text-base text-blue-700" dir="ltr">
                          {cert.certificateNumber}
                        </span>
                        <button
                          onClick={() => handleCopySingleCert(cert.certificateNumber)}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 transition"
                          title="نسخ رابط الشهادة"
                        >
                          {copiedCertId === cert.certificateNumber ? (
                            <Check className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        cert.status === 'صالحة' 
                          ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                          : cert.status === 'موقوفة'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {cert.status}
                      </span>
                    </div>

                    {/* Specialty */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                      <Award className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-semibold text-slate-800">التخصص:</span>
                      <span>{cert.specialty}</span>
                    </div>

                    {/* Details: Issue date & phone */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        {cert.issueDate}
                      </span>
                      {cert.phone && (
                        <span className="font-mono text-slate-600" dir="ltr">
                          {cert.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action Bar for this certificate */}
                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setCertificate(cert);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl text-white text-xs font-bold transition flex items-center justify-center gap-2 hover:brightness-110 shadow-sm cursor-pointer"
                      style={{ backgroundColor: 'var(--button-color, #1d4ed8)' }}
                    >
                      <Eye className="w-4 h-4 text-amber-300" />
                      <span>عرض تفاصيل الشهادة</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Back button from single certificate to master list if master was active */}
      {masterAdminData && certificate && (
        <div 
          className="flex items-center justify-between text-white p-4 rounded-xl"
          style={{ 
            backgroundColor: 'var(--header-color, #091424)',
            border: '1px solid var(--border-color, #93c5fd)'
          }}
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>عرض وثيقة فردية من قائمة رمز التحقق الرئيسي (71110203328)</span>
          </div>
          <button
            onClick={() => setCertificate(null)}
            className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-bold hover:brightness-105 transition flex items-center gap-1"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة لجميع الشهادات</span>
          </button>
        </div>
      )}

      {/* RESULT 1: SUCCESS CARD */}
      {certificate && (
        <div 
          id="printable-certificate"
          className="bg-white rounded-2xl border-4 shadow-2xl p-6 sm:p-10 text-slate-900 space-y-6 animate-in fade-in-50 duration-300"
          style={{ borderColor: 'var(--primary-color, #1d4ed8)' }}
        >
          <div className="text-center space-y-3 pb-6 border-b border-slate-200">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              تم توثيق الشهادة من اكادميه الافق - ماليزيا!
            </h2>

            <p className="text-sm font-bold text-blue-700 bg-blue-50 py-1.5 px-4 rounded-full inline-block border border-blue-200">
              الشهادة مسجلة لدى اكادميه الافق - ماليزيا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-slate-50 p-6 rounded-xl border border-slate-200">
            
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium block">رقم التسجيل:</span>
              <span className="text-lg font-mono font-bold text-blue-700 block" dir="ltr">
                {certificate.certificateNumber}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium block">التخصص المعتمد:</span>
              <span className="text-base font-bold text-slate-800 block flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-600" />
                {certificate.specialty}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium block">تاريخ الإصدار:</span>
              <span className="text-base font-mono font-medium text-slate-800 block flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                {certificate.issueDate}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium block">جهة الإصدار:</span>
              <span className="text-base font-bold text-slate-800 block">
                {certificate.academyName || "أكاديمية الأفق - ماليزيا"}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium block">حالة الشهادة:</span>
              <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                {certificate.status} وموثقة رسمياً
              </span>
            </div>

          </div>

          {/* QR Code */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-5 bg-blue-50/70 rounded-xl border border-blue-200 gap-4">
            <div className="space-y-1 text-center sm:text-right">
              <h4 className="font-bold text-blue-950 text-base">رمز التحقق الذكي المعتمد (QR Code)</h4>
              <p className="text-xs text-slate-600">هذا الرمز الرقمي يربط مباشرة بسجل التحقق الرسمي لأكاديمية الأفق.</p>
            </div>
            <div className="p-2.5 bg-white rounded-lg border-2 border-blue-300 shadow-sm shrink-0">
              <QRCodeSVG
                value={`${window.location.origin}/verify/${certificate.certificateNumber}`}
                size={84}
                level="M"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition flex items-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-blue-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم نسخ الرابط' : 'نسخ الرابط'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-lg text-white text-sm font-bold transition flex items-center gap-1.5 shadow hover:brightness-110"
                style={{ backgroundColor: 'var(--button-color, #1d4ed8)' }}
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>طباعة الوثيقة</span>
              </button>
            </div>

            <a
              href="https://wa.me/+9647853331053"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>تواصل مع الدعم</span>
            </a>
          </div>

        </div>
      )}

      {/* RESULT 2: ERROR / NOT FOUND */}
      {errorMsg && (
        <div className="bg-white rounded-2xl border-4 border-red-500 shadow-2xl p-8 sm:p-10 text-center space-y-6 animate-in fade-in-50 duration-300">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
            <AlertCircle className="w-10 h-10" />
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-red-600">
              رمز الشهادة غير صحيح
            </h3>
            <p className="text-slate-700 text-base font-semibold max-w-md mx-auto leading-relaxed">
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
              onClick={() => {
                setErrorMsg(null);
                setCertInput('');
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
