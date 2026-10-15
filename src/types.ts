export interface AcademySettings {
  academyName: string;
  englishName: string;
  tagLine: string;
  phone: string;
  email: string;
  whatsapp: string;
  telegram: string;
  facebook: string;
  instagram: string;
  address: string;
  aboutShort: string;
  aboutFull: string;
  vision: string;
  mission: string;
  objectives: string[];
  galleryImages?: string[];
}

export interface Statistics {
  beneficiaries: number;
  certificates: number;
  specialties: number;
  yearsExperience: number;
}

export interface Specialty {
  id: string;
  name: string;
  category?: string;
  icon?: string;
  description?: string;
}

export interface SpecialtyItem extends Specialty {
  image?: string;
  certificateNumber?: string;
  duration?: string;
  issuer?: string;
  qrCode?: string;
  certificateUrl?: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  verificationCode?: string;
  verification_code?: string;
  holderName: string;
  phone?: string;
  holderNationalId?: string;
  specialty: string;
  certificateType: string;
  issueDate: string;
  expiryDate?: string;
  grade?: string;
  status: "صالحة" | "موقوفة" | "ملغاة";
  academyName: string;
  certificateImage?: string;
  qrCode?: string;
  verificationUrl?: string;
  verifiedCount?: number;
  notes?: string;
  createdAt?: string;
}

export interface ApplicationRequest {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  governorate: string;
  specialty: string;
  certificateType: string;
  photoUrl?: string;
  documentsUrl?: string;
  notes?: string;
  status: "قيد المراجعة" | "تم القبول" | "بانتظار الدفع" | "مكتمل ومصدر" | "مرفوض";
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
  read?: boolean;
}

export interface PublicDataResponse {
  settings: AcademySettings;
  statistics: Statistics;
  specialties: Specialty[];
  totalCertificates: number;
  featuredCertificates?: Certificate[];
  theme?: ThemeSettings;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  borderColor: string;
  headerColor: string;
  cardColor: string;
}

export const DEFAULT_THEME: ThemeSettings = {
  primaryColor: "#1d4ed8",
  secondaryColor: "#0b192c",
  backgroundColor: "#ffffff",
  textColor: "#0f172a",
  buttonColor: "#1d4ed8",
  borderColor: "#93c5fd",
  headerColor: "#091424",
  cardColor: "#ffffff",
};

export const applyThemeToDocument = (theme: ThemeSettings) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--primary-color', theme.primaryColor || DEFAULT_THEME.primaryColor);
  root.style.setProperty('--secondary-color', theme.secondaryColor || DEFAULT_THEME.secondaryColor);
  root.style.setProperty('--bg-color', theme.backgroundColor || DEFAULT_THEME.backgroundColor);
  root.style.setProperty('--text-color', theme.textColor || DEFAULT_THEME.textColor);
  root.style.setProperty('--button-color', theme.buttonColor || DEFAULT_THEME.buttonColor);
  root.style.setProperty('--border-color', theme.borderColor || DEFAULT_THEME.borderColor);
  root.style.setProperty('--header-color', theme.headerColor || DEFAULT_THEME.headerColor);
  root.style.setProperty('--card-color', theme.cardColor || DEFAULT_THEME.cardColor);
};
