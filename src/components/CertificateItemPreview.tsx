import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Eye, Printer, Copy, Check, ExternalLink } from 'lucide-react';
import { Certificate } from '../types';
import { getCertificateVerifyUrl } from '../utils/verificationUrl';

interface CertificateItemPreviewProps {
  certificate: Certificate;
  index: number;
  onEnlarge: (cert: Certificate) => void;
}

const CERTIFICATE_TEMPLATES = [
  '/assets/img/c1.jpg?v=blue',
  '/assets/img/c2.jpg?v=blue',
  '/assets/img/c3.jpg?v=blue',
  '/assets/img/c4.jpg?v=blue',
  '/assets/img/55.PNG?v=blue',
];

export const CertificateItemPreview: React.FC<CertificateItemPreviewProps> = ({
  certificate,
  index,
  onEnlarge,
}) => {
  const [copied, setCopied] = useState(false);

  // Determine certificate image
  const certImage =
    certificate.imageUrl ||
    certificate.certificateImageUrl ||
    CERTIFICATE_TEMPLATES[index % CERTIFICATE_TEMPLATES.length];

  // Unique real verification URL for this specific certificate
  const verifyUrl = getCertificateVerifyUrl(certificate.certificateNumber);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEnlarge(certificate);
  };

  return (
    <div 
      onClick={() => onEnlarge(certificate)}
      className="group relative bg-[#021811] rounded-2xl p-2.5 sm:p-3 border-2 border-emerald-600/30 hover:border-[#F5C85A] shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer overflow-hidden"
    >
      {/* Visual Certificate Container */}
      <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center shadow-inner">
        {/* Certificate Image */}
        <img
          src={certImage}
          alt="وثيقة الشهادة المعتمدة"
          className="w-full h-full object-contain select-none transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />

        {/* 
          Official Dynamic QR Code overlay
          Placed in the designated verification area at the bottom-left corner of the certificate
          Crisp white background, high contrast, scannable by any mobile phone camera
        */}
        <div 
          className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-sm p-1.5 rounded-lg shadow-2xl border border-emerald-700/40 flex flex-col items-center select-none pointer-events-auto transition-transform group-hover:scale-105"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white p-0.5 rounded">
            <QRCodeSVG
              value={verifyUrl}
              size={64}
              level="M"
              bgColor="#ffffff"
              fgColor="#042017"
              includeMargin={false}
            />
          </div>
          <span className="text-[9px] font-bold text-emerald-950 tracking-tighter mt-1 block font-sans">
            امسح للتحقق
          </span>
        </div>

        {/* Hover / Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none">
          {/* Top badge */}
          <div className="flex justify-end">
            <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-[11px] font-bold shadow backdrop-blur-sm">
              وثيقة معتمدة وموثقة
            </span>
          </div>

          {/* Center prompt */}
          <div className="flex items-center justify-center">
            <span className="px-4 py-2 rounded-xl bg-[#F5C85A] text-slate-950 font-bold text-xs shadow-lg flex items-center gap-1.5 transform scale-95 group-hover:scale-100 transition-transform">
              <Eye className="w-4 h-4" />
              <span>معاينة وتكبير الشهادة</span>
            </span>
          </div>

          {/* Bottom quick actions */}
          <div className="flex items-center justify-between pointer-events-auto gap-2">
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-900 text-xs font-semibold shadow transition flex items-center gap-1"
              title="نسخ رابط التحقق المباشر"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition flex items-center gap-1"
              title="طباعة الوثيقة"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
