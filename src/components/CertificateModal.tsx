import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { Certificate } from '../types';
import { getCertificateVerifyUrl } from '../utils/verificationUrl';

interface CertificateModalProps {
  certificate: Certificate | null;
  index: number;
  onClose: () => void;
  onVerifyDirect?: (certNumber: string) => void;
}

const CERTIFICATE_TEMPLATES = [
  '/assets/img/c1.jpg?v=blue',
  '/assets/img/c2.jpg?v=blue',
  '/assets/img/c3.jpg?v=blue',
  '/assets/img/c4.jpg?v=blue',
  '/assets/img/55.PNG?v=blue',
];

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  index,
  onClose,
  onVerifyDirect,
}) => {
  const [copied, setCopied] = useState(false);

  if (!certificate) return null;

  const certImage =
    certificate.imageUrl ||
    certificate.certificateImageUrl ||
    CERTIFICATE_TEMPLATES[index % CERTIFICATE_TEMPLATES.length];

  const verifyUrl = getCertificateVerifyUrl(certificate.certificateNumber);

  const handleCopy = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full bg-[#031d15] border-2 border-emerald-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 my-auto text-right text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-600/30">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#F5C85A]" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              معاينة وثيقة الشهادة المعتمدة
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Display Area */}
        <div className="relative max-h-[70vh] flex items-center justify-center bg-black/40 rounded-2xl p-2 sm:p-4 overflow-hidden border border-emerald-700/30">
          <div className="relative max-h-[65vh] aspect-[9/16]">
            <img
              src={certImage}
              alt="وثيقة الشهادة"
              className="max-h-[65vh] w-auto object-contain rounded-lg shadow-2xl"
            />

            {/* Functional Scannable QR Code placed on certificate */}
            <div className="absolute bottom-[4%] left-[4%] bg-white/95 backdrop-blur-sm p-2 rounded-xl shadow-2xl border-2 border-emerald-700/60 flex flex-col items-center">
              <div className="bg-white p-1 rounded">
                <QRCodeSVG
                  value={verifyUrl}
                  size={92}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#042017"
                  includeMargin={false}
                />
              </div>
              <span className="text-[10px] font-extrabold text-emerald-950 tracking-tight mt-1 font-sans">
                امسح للتحقق المباشر
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>الـ QR Code مفعّل ويعمل مباشرة عند مسحه بكاميرا الهاتف</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition flex items-center gap-1.5 border border-slate-700"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم نسخ الرابط' : 'نسخ رابط التحقق'}</span>
            </button>

            {onVerifyDirect && (
              <button
                onClick={() => {
                  onClose();
                  onVerifyDirect(certificate.certificateNumber);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition flex items-center gap-1.5 border border-slate-700"
              >
                <ExternalLink className="w-4 h-4 text-[#F5C85A]" />
                <span>صفحة التحقق</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الشهادة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
