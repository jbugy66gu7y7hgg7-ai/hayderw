import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  LogOut, 
  Award, 
  FileText, 
  Layers, 
  Settings as SettingsIcon, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  QrCode, 
  RefreshCw, 
  Save, 
  Phone, 
  Mail, 
  ExternalLink,
  Filter,
  Check,
  X,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Palette,
  Download
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Certificate, ApplicationRequest, Specialty, AcademySettings, Statistics, ThemeSettings, DEFAULT_THEME, applyThemeToDocument } from '../types';

interface AdminDashboardProps {
  onBackToHome: () => void;
  onDataUpdated?: () => void;
  currentTheme?: ThemeSettings;
  onThemeChange?: (theme: ThemeSettings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToHome,
  onDataUpdated,
  currentTheme,
  onThemeChange,
}) => {
  // Authentication State
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('alofuk_admin_token'));
  const [usernameInput, setUsernameInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('horizon2026');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState<'overview' | 'certificates' | 'applications' | 'specialties' | 'settings' | 'theme' | 'gallery'>(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('tab=gallery')) {
      return 'gallery';
    }
    return 'overview';
  });
  const [themeState, setThemeState] = useState<ThemeSettings>(() => currentTheme || DEFAULT_THEME);
  const [themeSaving, setThemeSaving] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [gallerySaving, setGallerySaving] = useState(false);

  // Synchronize themeState when currentTheme prop updates
  useEffect(() => {
    if (currentTheme) {
      setThemeState(currentTheme);
    }
  }, [currentTheme]);

  const handleColorChange = (key: keyof ThemeSettings, val: string) => {
    const updated = { ...themeState, [key]: val };
    setThemeState(updated);
    applyThemeToDocument(updated);
    if (onThemeChange) {
      onThemeChange(updated);
    }
  };

  const handleSaveTheme = async () => {
    setThemeSaving(true);
    try {
      const res = await fetch('/api/admin/theme', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ theme: themeState })
      });
      const data = await res.json();
      if (res.ok) {
        showToast("تم حفظ إعدادات ألوان المظهر بنجاح");
        if (onDataUpdated) onDataUpdated();
      } else {
        alert(data.error || "فشل حفظ إعدادات المظهر");
      }
    } catch {
      showToast("حدث خطأ أثناء حفظ إعدادات المظهر");
    } finally {
      setThemeSaving(false);
    }
  };

  const handleRestoreDefaultTheme = async () => {
    setThemeState(DEFAULT_THEME);
    applyThemeToDocument(DEFAULT_THEME);
    if (onThemeChange) {
      onThemeChange(DEFAULT_THEME);
    }
    setThemeSaving(true);
    try {
      const res = await fetch('/api/admin/theme', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(DEFAULT_THEME)
      });
      if (res.ok) {
        showToast("تم استعادة الألوان الافتراضية وحفظها بنجاح");
        if (onDataUpdated) onDataUpdated();
      }
    } catch {
      showToast("تمت استعادة الألوان الافتراضية محلياً");
    } finally {
      setThemeSaving(false);
    }
  };
  const [loadingData, setLoadingData] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [applications, setApplications] = useState<ApplicationRequest[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [settings, setSettings] = useState<AcademySettings | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);

  // Filter & Search states
  const [certSearch, setCertSearch] = useState('');
  const [certStatusFilter, setCertStatusFilter] = useState('all');
  const [appStatusFilter, setAppStatusFilter] = useState('all');
  const [specSearch, setSpecSearch] = useState('');
  const [specCategoryFilter, setSpecCategoryFilter] = useState('all');

  // Modals
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [certNumberInput, setCertNumberInput] = useState<string>('');
  const [isGeneratingNumber, setIsGeneratingNumber] = useState<boolean>(false);
  const [qrModalCert, setQrModalCert] = useState<Certificate | null>(null);

  const [specModalOpen, setSpecModalOpen] = useState(false);
  const [editingSpec, setEditingSpec] = useState<Specialty | null>(null);

  const [appDetailModal, setAppDetailModal] = useState<ApplicationRequest | null>(null);

  // Helper to generate unique certificate number
  const generateNewUniqueCertNumber = async () => {
    setIsGeneratingNumber(true);
    try {
      const res = await fetch('/api/admin/certificates/generate-number', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.certificateNumber) {
        setCertNumberInput(data.certificateNumber);
        showToast(`تم توليد رقم شهادة فريد: ${data.certificateNumber}`);
      } else {
        setCertNumberInput(`711${Math.floor(10000000 + Math.random() * 90000000)}`);
      }
    } catch {
      setCertNumberInput(`711${Math.floor(10000000 + Math.random() * 90000000)}`);
    } finally {
      setIsGeneratingNumber(false);
    }
  };

  const openNewCertModal = async () => {
    setEditingCert(null);
    setCertModalOpen(true);
    setIsGeneratingNumber(true);
    try {
      const res = await fetch('/api/admin/certificates/generate-number', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.certificateNumber) {
        setCertNumberInput(data.certificateNumber);
      } else {
        setCertNumberInput(`711${Math.floor(10000000 + Math.random() * 90000000)}`);
      }
    } catch {
      setCertNumberInput(`711${Math.floor(10000000 + Math.random() * 90000000)}`);
    } finally {
      setIsGeneratingNumber(false);
    }
  };

  const openEditCertModal = (cert: Certificate) => {
    setEditingCert(cert);
    setCertNumberInput(cert.certificateNumber);
    setCertModalOpen(true);
  };

  // Feedback Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    if (!token) return;
    setLoadingData(true);
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }
      const data = await res.json();
      setCertificates(data.certificates || []);
      setApplications(data.applications || []);
      setSpecialties(data.specialties || []);
      setSettings(data.settings);
      setStatistics(data.statistics);
      if (Array.isArray(data.galleryImages)) {
        setGalleryImages(data.galleryImages);
      }
      if (onDataUpdated) onDataUpdated();
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      showToast("فشل تحديث البيانات من الخادم");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSaveGallery = async (imagesToSave: string[]) => {
    setGallerySaving(true);
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ images: imagesToSave })
      });
      const data = await res.json();
      if (res.ok) {
        setGalleryImages(data.galleryImages || imagesToSave);
        showToast("تم حفظ ونشر صور المعرض بنجاح على الموقع");
        if (onDataUpdated) onDataUpdated();
      } else {
        alert(data.error || "فشل حفظ صور المعرض");
      }
    } catch {
      showToast("حدث خطأ أثناء حفظ صور المعرض");
    } finally {
      setGallerySaving(false);
    }
  };

  const handleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const fileList = Array.from(files) as File[];
    const readPromises = fileList.map((file: File) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then(newImages => {
      const updated = [...galleryImages, ...newImages];
      setGalleryImages(updated);
      showToast(`تمت إضافة ${newImages.length} صور إلى المعاينة. اضغط على حفظ ونشر لتثبيتها.`);
    });
  };

  const handleRemoveGalleryImage = (idx: number) => {
    const updated = galleryImages.filter((_, i) => i !== idx);
    setGalleryImages(updated);
  };

  const handleMoveImage = (idx: number, dir: 'up' | 'down') => {
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === galleryImages.length - 1) return;
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    const updated = [...galleryImages];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setGalleryImages(updated);
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  // Quick 1-click login directly to gallery tab
  const handleDirectGalleryLogin = async () => {
    setLoginLoading(true);
    setLoginError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'horizon2026' })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('alofuk_admin_token', data.token);
        setToken(data.token);
        setActiveTab('gallery');
        showToast("تم الدخول بنجاح إلى معرض الصور والشهادات");
      } else {
        setLoginError(data.error || "فشل تسجيل الدخول التلقائي");
      }
    } catch {
      setLoginError("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setLoginLoading(false);
    }
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('alofuk_admin_token', data.token);
        setToken(data.token);
        showToast("تم تسجيل الدخول بنجاح كمدير للنظام");
      } else {
        setLoginError(data.error || "بيانات الدخول غير صحيحة");
      }
    } catch (err) {
      setLoginError("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('alofuk_admin_token');
    setToken(null);
  };

  // Quick Certificate Status Changer
  const handleUpdateCertStatus = async (id: string, newStatus: 'صالحة' | 'موقوفة' | 'ملغاة') => {
    try {
      const res = await fetch(`/api/admin/certificates/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setCertificates(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
        showToast(`تم تغيير حالة الشهادة إلى "${newStatus}"`);
      }
    } catch (err) {
      showToast("فشل تحديث الحالة");
    }
  };

  // Delete Certificate
  const handleDeleteCert = async (id: string, certNum: string) => {
    if (!window.confirm(`هل أنت متأكد من رغبتك في حذف الشهادة رقم (${certNum}) نهائياً؟`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/certificates/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setCertificates(prev => prev.filter(c => c.id !== id));
        showToast("تم حذف الشهادة بنجاح");
      }
    } catch (err) {
      showToast("فشل حذف الشهادة");
    }
  };

  // Save Certificate (Add or Edit)
  const handleSaveCertForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const certNum = certNumberInput.trim() || (formData.get('certificateNumber') as string || '').trim();
    if (!certNum) {
      alert("يرجى إدخال رقم الشهادة أو الضغط على زر توليد رقم فريد");
      return;
    }

    const payload = {
      certificateNumber: certNum,
      holderName: (formData.get('holderName') as string || '').trim(),
      phone: (formData.get('phone') as string || '').trim(),
      holderNationalId: (formData.get('holderNationalId') as string || '').trim(),
      specialty: (formData.get('specialty') as string || '').trim(),
      certificateType: (formData.get('certificateType') as string || '').trim(),
      issueDate: (formData.get('issueDate') as string || '').trim() || new Date().toISOString().split('T')[0],
      expiryDate: (formData.get('expiryDate') as string || '').trim() || 'غير محددة (دائمة)',
      grade: (formData.get('grade') as string || '').trim() || 'امتياز (Grade A+)',
      status: formData.get('status') as 'صالحة' | 'موقوفة' | 'ملغاة',
      notes: (formData.get('notes') as string || '').trim(),
      academyName: settings?.academyName || 'أكاديمية الأفق'
    };

    try {
      if (editingCert) {
        // Edit
        const res = await fetch(`/api/admin/certificates/${editingCert.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
          setCertificates(prev => prev.map(c => c.id === editingCert.id ? data.certificate : c));
          setCertModalOpen(false);
          setEditingCert(null);
          showToast("تم تعديل بيانات الشهادة بنجاح");
          if (onDataUpdated) onDataUpdated();
        } else {
          alert(data.error || "فشل تعديل الشهادة");
        }
      } else {
        // Add new
        const res = await fetch('/api/admin/certificates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
          setCertificates(prev => [data.certificate, ...prev]);
          setCertModalOpen(false);
          showToast("تمت إضافة الشهادة الجديدة بنجاح");
          if (onDataUpdated) onDataUpdated();
        } else {
          alert(data.error || "فشل إضافة الشهادة");
        }
      }
    } catch (err) {
      showToast("حدث خطأ أثناء حفظ الشهادة");
    }
  };

  // Change Application Status
  const handleUpdateAppStatus = async (id: string, status: any) => {
    try {
      const res = await fetch(`/api/admin/applications/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
        if (appDetailModal && appDetailModal.id === id) {
          setAppDetailModal(prev => prev ? { ...prev, status } : null);
        }
        showToast(`تم تحديث حالة الطلب إلى "${status}"`);
      }
    } catch (err) {
      showToast("فشل تحديث حالة الطلب");
    }
  };

  // Auto Issue Certificate from Application
  const handleIssueCertFromApp = async (app: ApplicationRequest) => {
    let generatedNum = `711${Math.floor(10000000 + Math.random() * 90000000)}`;
    try {
      const gRes = await fetch('/api/admin/certificates/generate-number', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const gData = await gRes.json();
      if (gRes.ok && gData.certificateNumber) {
        generatedNum = gData.certificateNumber;
      }
    } catch {
      // fallback
    }

    const certNum = window.prompt("أدخل رقم الشهادة الفريد المراد إصداره:", generatedNum);
    if (!certNum) return;

    try {
      const res = await fetch(`/api/admin/applications/${app.id}/issue-certificate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          certificateNumber: certNum,
          grade: "امتياز (Grade A+)"
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCertificates(prev => [data.certificate, ...prev]);
        setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'مكتمل ومصدر' } : a));
        if (appDetailModal && appDetailModal.id === app.id) {
          setAppDetailModal(null);
        }
        showToast(`تم إصدار الشهادة بنجاح برقم: ${certNum}`);
        if (onDataUpdated) onDataUpdated();
      } else {
        alert(data.error || "فشل إصدار الشهادة");
      }
    } catch (err) {
      showToast("حدث خطأ أثناء إصدار الشهادة");
    }
  };

  // Save Specialty (Add or Edit)
  const handleSaveSpecForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      icon: formData.get('icon') as string,
    };

    try {
      if (editingSpec) {
        const res = await fetch(`/api/admin/specialties/${editingSpec.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
          setSpecialties(prev => prev.map(s => s.id === editingSpec.id ? data.specialty : s));
          setSpecModalOpen(false);
          setEditingSpec(null);
          showToast("تم تعديل التخصص بنجاح");
        }
      } else {
        const res = await fetch('/api/admin/specialties', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
          setSpecialties(prev => [...prev, data.specialty]);
          setSpecModalOpen(false);
          showToast("تمت إضافة التخصص الجديد");
        }
      }
    } catch (err) {
      showToast("حدث خطأ في حفظ التخصص");
    }
  };

  const handleDeleteSpec = async (id: string, name: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف تخصص (${name})؟`)) return;
    try {
      const res = await fetch(`/api/admin/specialties/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setSpecialties(prev => prev.filter(s => s.id !== id));
        showToast("تم حذف التخصص");
      }
    } catch (err) {
      showToast("فشل حذف التخصص");
    }
  };

  // Save Settings & Statistics
  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const updatedSettings = {
      academyName: formData.get('academyName') as string,
      englishName: formData.get('englishName') as string,
      tagLine: formData.get('tagLine') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      whatsapp: formData.get('whatsapp') as string,
      telegram: formData.get('telegram') as string,
      facebook: formData.get('facebook') as string,
      instagram: formData.get('instagram') as string,
      address: formData.get('address') as string,
      aboutFull: formData.get('aboutFull') as string,
      vision: formData.get('vision') as string,
      mission: formData.get('mission') as string,
      objectives: settings?.objectives || []
    };

    const updatedStats = {
      beneficiaries: parseInt(formData.get('stat_beneficiaries') as string) || 2000,
      certificates: parseInt(formData.get('stat_certificates') as string) || 750,
      specialties: parseInt(formData.get('stat_specialties') as string) || 35,
      yearsExperience: parseInt(formData.get('stat_years') as string) || 10,
    };

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ settings: updatedSettings, statistics: updatedStats })
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        setStatistics(data.statistics);
        showToast("تم حفظ وتحديث الإعدادات والإحصائيات بنجاح");
        if (onDataUpdated) onDataUpdated();
      }
    } catch (err) {
      showToast("فشل حفظ الإعدادات");
    }
  };

  // ======================== RENDER: LOGIN FORM ========================
  if (!token) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center max-w-md mx-auto">
        <div className="w-full rounded-3xl bg-[#0b192c] border border-blue-500/30 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
          
          <div className="text-center space-y-2 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/15 border border-blue-400/30 text-blue-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-white">لوحة تحكم الإدارة</h1>
            <p className="text-xs text-slate-300">سجل الدخول لإدارة الشهادات والطلبات والتخصصات والمظهر</p>
          </div>

          {loginError && (
            <div className="mb-5 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">اسم المستخدم</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#071322] border border-slate-700 text-white text-sm focus:border-blue-400 focus:outline-none"
                required
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">كلمة المرور</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#071322] border border-slate-700 text-white text-sm focus:border-blue-400 focus:outline-none"
                required
                dir="ltr"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#071322] border border-blue-500/30 text-[11px] text-slate-300 space-y-1">
              <span className="text-blue-400 font-bold block">بيانات الدخول الافتراضية:</span>
              <div className="flex justify-between font-mono">
                <span>المستخدم: <strong className="text-white">admin</strong></span>
                <span>الرمز: <strong className="text-white">horizon2026</strong></span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
            >
              {loginLoading ? 'جاري التحقق...' : 'تسجيل الدخول'}
            </button>

            <button
              type="button"
              onClick={handleDirectGalleryLogin}
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:brightness-110 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-white" />
              <span>دخول مباشر إلى «معرض الصور والشهادات»</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onBackToHome}
              className="text-xs text-slate-400 hover:text-blue-400 transition flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة إلى الموقع الرئيسي</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ======================== RENDER: AUTHENTICATED DASHBOARD ========================
  return (
    <div className="min-h-screen pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 pt-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-xl bg-[#0b192c] border border-blue-500/50 shadow-2xl text-white text-sm flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0b192c] border border-blue-500/30 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>لوحة التحكم الإدارية</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 border border-blue-400/30">
                المدير العام
              </span>
            </h1>
            <p className="text-xs text-slate-300">إدارة الشهادات والتحقق، طلبات المتقدمين، إعدادات المظهر والهوية</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md ${
              activeTab === 'gallery'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white ring-2 ring-cyan-400'
                : 'bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 border border-cyan-500/40'
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-300" />
            <span>معرض الصور ({galleryImages.length})</span>
          </button>

          <button
            onClick={fetchDashboardData}
            disabled={loadingData}
            className="p-2.5 rounded-xl bg-[#071322] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin text-blue-400' : ''}`} />
          </button>

          <button
            onClick={onBackToHome}
            className="px-3.5 py-2 rounded-xl bg-[#071322] hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>عرض الموقع</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 text-xs font-semibold border border-rose-500/30 transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-blue-500/20 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-[#0b192c] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <span>نظرة عامة</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'gallery'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-600/30 ring-2 ring-cyan-400'
              : 'bg-[#0b192c] text-cyan-300 hover:text-white hover:bg-slate-800 border border-cyan-500/50'
          }`}
        >
          <Layers className="w-4 h-4 text-cyan-300" />
          <span>معرض الصور والشهادات</span>
          {galleryImages.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-cyan-400 text-slate-950 font-mono font-bold">
              {galleryImages.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'certificates'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-[#0b192c] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
          }`}
        >
          <Award className="w-4 h-4 text-blue-400" />
          <span>إدارة الشهادات ({certificates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 shrink-0 relative ${
            activeTab === 'applications'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-[#0b192c] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-400" />
          <span>طلبات المتقدمين</span>
          {applications.filter(a => a.status === 'قيد المراجعة').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          )}
          <span className="text-xs px-1.5 py-0.2 rounded-full bg-[#071322] border border-blue-500/40 text-blue-300">
            {applications.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('specialties')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'specialties'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-[#0b192c] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
          }`}
        >
          <Layers className="w-4 h-4 text-blue-400" />
          <span>التخصصات ({specialties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'settings'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-[#0b192c] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
          }`}
        >
          <SettingsIcon className="w-4 h-4 text-blue-400" />
          <span>إعدادات الموقع والإحصائيات</span>
        </button>

        <button
          onClick={() => setActiveTab('theme')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'theme'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/40'
              : 'bg-[#0b192c] text-blue-300 hover:text-white hover:bg-slate-800 border border-blue-500/40'
          }`}
        >
          <Palette className="w-4 h-4 text-blue-300" />
          <span>إعدادات المظهر</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* GitHub Pages Single-File Export Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-[#0b192c] border-2 border-emerald-500/40 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    جاهز للنشر 100%
                  </span>
                  <h3 className="text-lg font-bold text-white">ملف index.html الموحد لنشر الموقع على GitHub Pages</h3>
                </div>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  تم دمج الـ HTML والـ CSS والـ JavaScript وقاعدة بيانات الشهادات الـ35 بالكامل في ملف واحد شامل، ومحصن ضد مشكلة الصفحة البيضاء، وجاهز للنسخ أو التحميل المباشر.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                <a
                  href="/download-github-pages-index.html"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل ملف index.html</span>
                </a>
                <a
                  href="/github-pages-code"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-xl bg-[#071322] hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>عرض الكود ونسخه</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0b192c] border border-[#1e3a5f]/60 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-300">الشهادات المسجلة</span>
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">{certificates.length}</div>
              <div className="text-[11px] text-emerald-400 mt-1">
                صالحة: {certificates.filter(c => c.status === 'صالحة').length} | موقوفة/ملغاة: {certificates.filter(c => c.status !== 'صالحة').length}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0b192c] border border-[#1e3a5f]/60 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-300">طلبات المتقدمين</span>
                <FileText className="w-5 h-5 text-sky-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">{applications.length}</div>
              <div className="text-[11px] text-amber-400 mt-1">
                قيد المراجعة: {applications.filter(a => a.status === 'قيد المراجعة').length}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0b192c] border border-[#1e3a5f]/60 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-300">التخصصات المعتمدة</span>
                <Layers className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">{specialties.length}</div>
              <div className="text-[11px] text-slate-400 mt-1">جاهزة للاختيار في استمارة الطلب</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0b192c] border border-[#1e3a5f]/60 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-300">مرات التحقق الإلكتروني</span>
                <QrCode className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">
                {certificates.reduce((acc, c) => acc + (c.verifiedCount || 0), 0)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">عمليات تحقق مسجلة عبر البوابة</div>
            </div>
          </div>

          {/* Quick Actions & Recent */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Quick Actions Card */}
            <div className="p-6 rounded-2xl bg-[#0b192c] border border-[#1e3a5f]/60 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>إجراءات سريعة</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={openNewCertModal}
                  className="p-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold transition flex flex-col items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>إضافة شهادة جديدة</span>
                </button>

                <button
                  onClick={() => setActiveTab('applications')}
                  className="p-4 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs sm:text-sm font-semibold transition flex flex-col items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>مراجعة طلبات التقديم</span>
                </button>

                <button
                  onClick={() => {
                    setEditingSpec(null);
                    setSpecModalOpen(true);
                  }}
                  className="p-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-semibold transition flex flex-col items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>إضافة تخصص جديد</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className="p-4 rounded-xl bg-[#071322] hover:bg-[#1e293b] border border-[#1e3a5f] text-slate-200 text-xs sm:text-sm font-semibold transition flex flex-col items-center justify-center gap-2"
                >
                  <SettingsIcon className="w-5 h-5" />
                  <span>تعديل الأرقام والإحصائيات</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CERTIFICATES MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          
          {/* Top Filter and Add */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0b192c] p-4 rounded-2xl border border-[#1e3a5f]/60">
            <div className="flex-1 flex items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={certSearch}
                  onChange={(e) => setCertSearch(e.target.value)}
                  placeholder="بحث برقم الشهادة، اسم المستفيد، التخصص..."
                  className="w-full pr-9 pl-4 py-2 rounded-xl bg-[#071322] border border-[#1e3a5f] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
              </div>

              <select
                value={certStatusFilter}
                onChange={(e) => setCertStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#071322] border border-[#1e3a5f] text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">كل الحالات</option>
                <option value="صالحة">صالحة</option>
                <option value="موقوفة">موقوفة</option>
                <option value="ملغاة">ملغاة</option>
              </select>
            </div>

            <button
              onClick={openNewCertModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-105 transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة شهادة جديدة</span>
            </button>
          </div>

          {/* Certificates Table */}
          <div className="rounded-2xl bg-[#0b192c] border border-[#1e3a5f]/60 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#071322] text-slate-300 border-b border-[#1e3a5f]/60 uppercase font-medium">
                  <tr>
                    <th className="p-4">رقم الشهادة</th>
                    <th className="p-4">اسم المستفيد</th>
                    <th className="p-4">رقم الهاتف</th>
                    <th className="p-4">التخصص</th>
                    <th className="p-4">نوع الشهادة</th>
                    <th className="p-4">تاريخ الإصدار</th>
                    <th className="p-4">الحالة</th>
                    <th className="p-4 text-center">QR</th>
                    <th className="p-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3a5f]/40">
                  {certificates.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-14 text-center">
                        <div className="max-w-sm mx-auto space-y-3">
                          <div className="w-14 h-14 mx-auto rounded-full bg-[#071322] border border-[#1e3a5f] flex items-center justify-center text-amber-400">
                            <Award className="w-7 h-7" />
                          </div>
                          <h4 className="text-sm font-bold text-white">لا توجد شهادات مسجلة حالياً</h4>
                          <p className="text-xs text-slate-400">
                            قاعدة البيانات نظيفة بالكامل. يمكنك إنشاء شهادة جديدة وتوليد رقم فريد غير مكرر لها مباشرة من هنا.
                          </p>
                          <button
                            type="button"
                            onClick={openNewCertModal}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-105 transition inline-flex items-center gap-1.5 shadow"
                          >
                            <Plus className="w-4 h-4" />
                            <span>إنشاء شهادة جديدة</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    certificates
                      .filter(c => {
                        const matchSearch = 
                          c.certificateNumber.toLowerCase().includes(certSearch.toLowerCase()) ||
                          c.holderName.toLowerCase().includes(certSearch.toLowerCase()) ||
                          (c.phone && c.phone.includes(certSearch)) ||
                          c.specialty.toLowerCase().includes(certSearch.toLowerCase());
                        const matchStatus = certStatusFilter === 'all' || c.status === certStatusFilter;
                        return matchSearch && matchStatus;
                      })
                      .map((cert) => (
                        <tr key={cert.id} className="hover:bg-[#071322]/70 transition">
                          <td className="p-4 font-mono font-bold text-amber-400">
                            {cert.certificateNumber}
                          </td>
                          <td className="p-4 font-semibold text-white">
                            {cert.holderName}
                          </td>
                          <td className="p-4 font-mono text-slate-300" dir="ltr">
                            {cert.phone || '—'}
                          </td>
                          <td className="p-4 text-slate-200">
                            {cert.specialty}
                          </td>
                          <td className="p-4 text-slate-300">
                            {cert.certificateType}
                          </td>
                          <td className="p-4 text-slate-300 font-mono">
                            {cert.issueDate}
                          </td>
                          <td className="p-4">
                            <select
                              value={cert.status}
                              onChange={(e) => handleUpdateCertStatus(cert.id, e.target.value as any)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none ${
                                cert.status === 'صالحة'
                                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                  : cert.status === 'موقوفة'
                                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                              }`}
                            >
                              <option value="صالحة" className="bg-[#071322] text-white">صالحة</option>
                              <option value="موقوفة" className="bg-[#071322] text-white">موقوفة</option>
                              <option value="ملغاة" className="bg-[#071322] text-white">ملغاة</option>
                            </select>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setQrModalCert(cert)}
                              className="p-1.5 rounded-lg bg-[#071322] border border-[#1e3a5f] hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition"
                              title="عرض رمز QR"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => openEditCertModal(cert)}
                                className="p-1.5 rounded-lg bg-[#071322] border border-[#1e3a5f] hover:bg-[#1e293b] text-slate-300 hover:text-white transition"
                                title="تعديل"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCert(cert.id, cert.certificateNumber)}
                                className="p-1.5 rounded-lg bg-[#071322] border border-rose-900/50 hover:bg-rose-600 hover:text-white text-rose-400 transition"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: APPLICATIONS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-[#0b192c] p-4 rounded-2xl border border-[#1e3a5f]/60">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300">تصفية حسب الحالة:</span>
              <select
                value={appStatusFilter}
                onChange={(e) => setAppStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">جميع الطلبات ({applications.length})</option>
                <option value="قيد المراجعة">قيد المراجعة</option>
                <option value="تم القبول">تم القبول</option>
                <option value="بانتظار الدفع">بانتظار الدفع</option>
                <option value="مكتمل ومصدر">مكتمل ومصدر</option>
                <option value="مرفوض">مرفوض</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0b192c] border border-[#1e3a5f]/60 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#071322] text-slate-300 border-b border-[#1e3a5f]/60 uppercase font-medium">
                  <tr>
                    <th className="p-4">رقم الطلب</th>
                    <th className="p-4">اسم المتقدم</th>
                    <th className="p-4">رقم الهاتف</th>
                    <th className="p-4">المحافظة</th>
                    <th className="p-4">التخصص المطلوب</th>
                    <th className="p-4">تاريخ التقديم</th>
                    <th className="p-4">الحالة</th>
                    <th className="p-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3a5f]/40">
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-14 text-center">
                        <div className="max-w-sm mx-auto space-y-2">
                          <div className="w-14 h-14 mx-auto rounded-full bg-[#071322] border border-[#1e3a5f] flex items-center justify-center text-sky-400">
                            <FileText className="w-7 h-7" />
                          </div>
                          <h4 className="text-sm font-bold text-white">لا توجد طلبات متقدمين حالياً</h4>
                          <p className="text-xs text-slate-400">
                            قاعدة بيانات الطلبات فارغة ونظيفة بالكامل. ستظهر هنا أي استمارات تقديم جديدة يرسلها المستفيدون عبر الموقع.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    applications
                      .filter(a => appStatusFilter === 'all' || a.status === appStatusFilter)
                      .map((app) => (
                        <tr key={app.id} className="hover:bg-[#071322]/70 transition">
                          <td className="p-4 font-mono font-bold text-amber-400">
                            {app.id}
                          </td>
                          <td className="p-4 font-semibold text-white">
                            {app.fullName}
                          </td>
                          <td className="p-4 font-mono text-slate-200" dir="ltr">
                            {app.phone}
                          </td>
                          <td className="p-4 text-slate-200">
                            {app.governorate}
                          </td>
                          <td className="p-4 text-slate-200">
                            {app.specialty}
                          </td>
                          <td className="p-4 text-slate-300 font-mono">
                            {new Date(app.createdAt).toLocaleDateString('ar-EG')}
                          </td>
                          <td className="p-4">
                            <select
                              value={app.status}
                              onChange={(e) => handleUpdateAppStatus(app.id, e.target.value as any)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold border border-[#1e3a5f] bg-[#071322] text-white focus:outline-none"
                            >
                              <option value="قيد المراجعة">قيد المراجعة</option>
                              <option value="تم القبول">تم القبول</option>
                              <option value="بانتظار الدفع">بانتظار الدفع</option>
                              <option value="مكتمل ومصدر">مكتمل ومصدر</option>
                              <option value="مرفوض">مرفوض</option>
                            </select>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setAppDetailModal(app)}
                                className="px-2.5 py-1 rounded-lg bg-[#071322] hover:bg-[#1e293b] text-slate-300 hover:text-white border border-[#1e3a5f] transition flex items-center gap-1"
                                title="عرض التفاصيل والمرفقات"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>التفاصيل</span>
                              </button>

                              {app.status !== 'مكتمل ومصدر' && (
                                <button
                                  onClick={() => handleIssueCertFromApp(app)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition flex items-center gap-1 font-semibold"
                                  title="إصدار شهادة فورية من هذا الطلب"
                                >
                                  <Award className="w-3.5 h-3.5" />
                                  <span>إصدار شهادة</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SPECIALTIES MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'specialties' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0b192c] p-4 rounded-2xl border border-[#1e3a5f]/60">
            <div className="flex-1 flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={specSearch}
                  onChange={(e) => setSpecSearch(e.target.value)}
                  placeholder="بحث باسم التخصص أو التصنيف..."
                  className="w-full pr-9 pl-4 py-2 rounded-xl bg-[#071322] border border-[#1e3a5f] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
              </div>

              <select
                value={specCategoryFilter}
                onChange={(e) => setSpecCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#071322] border border-[#1e3a5f] text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">كل التصنيفات ({specialties.length})</option>
                {Array.from(new Set(specialties.map((s) => s.category || 'عام'))).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#071322] border border-[#1e3a5f]/60 text-xs font-bold text-amber-400 font-mono">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {specialties.filter((s) => {
                    const matchSearch =
                      !specSearch ||
                      s.name.toLowerCase().includes(specSearch.toLowerCase()) ||
                      (s.category && s.category.toLowerCase().includes(specSearch.toLowerCase())) ||
                      (s.description && s.description.toLowerCase().includes(specSearch.toLowerCase()));
                    const matchCat = specCategoryFilter === 'all' || s.category === specCategoryFilter;
                    return matchSearch && matchCat;
                  }).length} من {specialties.length} تخصص
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingSpec(null);
                setSpecModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-105 transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة تخصص جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialties
              .filter((spec) => {
                const matchSearch =
                  !specSearch ||
                  spec.name.toLowerCase().includes(specSearch.toLowerCase()) ||
                  (spec.category && spec.category.toLowerCase().includes(specSearch.toLowerCase())) ||
                  (spec.description && spec.description.toLowerCase().includes(specSearch.toLowerCase()));
                const matchCat = specCategoryFilter === 'all' || spec.category === specCategoryFilter;
                return matchSearch && matchCat;
              })
              .map((spec) => (
                <div
                  key={spec.id}
                  className="p-5 rounded-2xl bg-[#0b192c] border border-[#1e3a5f]/60 flex flex-col justify-between hover:border-amber-500/40 transition shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-[#071322] text-amber-400 border border-[#1e3a5f]/60">
                        {spec.category || 'عام'}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-[#071322]/80 border border-[#1e3a5f]/40">
                        {spec.icon || 'BookOpen'}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-1.5">{spec.name}</h3>
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {spec.description || 'لا يوجد وصف مخصص'}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#1e3a5f]/40 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">{spec.id}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingSpec(spec);
                          setSpecModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-[#071322] hover:bg-[#1e293b] border border-[#1e3a5f] text-slate-300 hover:text-white transition flex items-center gap-1 text-xs"
                        title="تعديل"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">تعديل</span>
                      </button>
                      <button
                        onClick={() => handleDeleteSpec(spec.id, spec.name)}
                        className="p-2 rounded-lg bg-[#071322] border border-rose-900/50 hover:bg-rose-600 text-rose-400 hover:text-white transition flex items-center gap-1 text-xs"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">حذف</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: SETTINGS & STATS */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && settings && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          
          {/* Statistics Box */}
          <div className="p-6 rounded-2xl bg-[#0b192c] border border-[#1e3a5f]/60 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-[#1e3a5f]/40 pb-3">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <span>تعديل أرقام الإحصائيات (الظاهرة بالصفحة الرئيسية)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  عدد المستفيدين (+2000)
                </label>
                <input
                  type="number"
                  name="stat_beneficiaries"
                  defaultValue={statistics?.beneficiaries || 2000}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white text-sm font-mono focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  عدد الشهادات الموثقة (+750)
                </label>
                <input
                  type="number"
                  name="stat_certificates"
                  defaultValue={statistics?.certificates || 750}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white text-sm font-mono focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  عدد التخصصات (+35)
                </label>
                <input
                  type="number"
                  name="stat_specialties"
                  defaultValue={statistics?.specialties || 35}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white text-sm font-mono focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  سنوات الخبرة (+10)
                </label>
                <input
                  type="number"
                  name="stat_years"
                  defaultValue={statistics?.yearsExperience || 10}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white text-sm font-mono focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* General Site Information */}
          <div className="p-6 rounded-2xl bg-[#0b192c] border border-[#1e3a5f]/60 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-[#1e3a5f]/40 pb-3">
              <SettingsIcon className="w-5 h-5 text-amber-400" />
              <span>معلومات وهوية الأكاديمية وروابط التواصل</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">اسم الأكاديمية (عربي)</label>
                <input
                  type="text"
                  name="academyName"
                  defaultValue={settings.academyName}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white text-sm focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">الاسم بالإنجليزي</label>
                <input
                  type="text"
                  name="englishName"
                  defaultValue={settings.englishName}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white text-sm focus:border-amber-400 focus:outline-none"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">الشعار اللفظي / الوصف السريع</label>
                <input
                  type="text"
                  name="tagLine"
                  defaultValue={settings.tagLine}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">العنوان / المقر</label>
                <input
                  type="text"
                  name="address"
                  defaultValue={settings.address}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  name="phone"
                  defaultValue={settings.phone}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white text-sm font-mono focus:border-amber-400 focus:outline-none"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">رقم واتساب (مع المقدمة الدولية)</label>
                <input
                  type="text"
                  name="whatsapp"
                  defaultValue={settings.whatsapp}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white text-sm font-mono focus:border-amber-400 focus:outline-none"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">رابط تليغرام</label>
                <input
                  type="text"
                  name="telegram"
                  defaultValue={settings.telegram}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white text-sm font-mono focus:border-amber-400 focus:outline-none"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={settings.email}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white text-sm font-mono focus:border-amber-400 focus:outline-none"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Vision & Mission */}
            <div className="pt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">الرؤية</label>
                <textarea
                  name="vision"
                  defaultValue={settings.vision}
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">الرسالة</label>
                <textarea
                  name="mission"
                  defaultValue={settings.mission}
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">المحتوى التعريفي الكامل (عن الأكاديمية)</label>
                <textarea
                  name="aboutFull"
                  defaultValue={settings.aboutFull}
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#1e3a5f]/40 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm hover:brightness-105 transition flex items-center gap-2 shadow-lg shadow-amber-500/10"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات</span>
              </button>
            </div>

          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: THEME APPEARANCE SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === 'theme' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0b192c] border border-blue-500/30 shadow-2xl space-y-6">
            
            {/* Header & Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-500/20 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-lg">
                  <Palette className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>إعدادات المظهر والهوية اللونية</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      تطبيق فوري
                    </span>
                  </h2>
                  <p className="text-xs text-slate-300">
                    تحكم مركزي بكافة ألوان الموقع من مكان واحد، وتنعكس التغييرات فوراً على جميع الأقسام والصفحات
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  id="btn-restore-default-theme"
                  onClick={handleRestoreDefaultTheme}
                  disabled={themeSaving}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-600/60 transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  title="استعادة إعدادات الألوان الافتراضية"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${themeSaving ? 'animate-spin' : ''}`} />
                  <span>استعادة الألوان الافتراضية</span>
                </button>

                <button
                  type="button"
                  id="btn-save-theme-changes"
                  onClick={handleSaveTheme}
                  disabled={themeSaving}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{themeSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                </button>
              </div>
            </div>

            {/* Explanatory note */}
            <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-white">نظام الألوان المركزي المتقدم:</p>
                <p className="text-slate-300 leading-relaxed">
                  يتم تطبيق التغييرات فوراً أثناء التعديل عبر متغيرات CSS المركزية. اضغط على <strong>"حفظ التغييرات"</strong> لتثبيت هذه الألوان بشكل دائم في قاعدة البيانات لجميع زوار المنصة.
                </p>
              </div>
            </div>

            {/* Grid of 8 Color Pickers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* 1. Primary Color */}
              <div className="p-4 rounded-2xl bg-[#071322] border border-blue-500/25 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-white">اللون الأساسي</label>
                    <span className="text-[10px] text-blue-300/80 font-mono">Primary Color</span>
                  </div>
                  <div 
                    className="w-7 h-7 rounded-lg border border-white/20 shadow-inner"
                    style={{ backgroundColor: themeState.primaryColor }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  اللون الرئيسي للأزرار الأساسية وقسم الإحصائيات والعناصر البارزة.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="theme-primaryColor-picker"
                    value={themeState.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    id="theme-primaryColor-input"
                    value={themeState.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#0b192c] border border-slate-700 text-white font-mono text-xs focus:border-blue-400 focus:outline-none"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* 2. Secondary Color */}
              <div className="p-4 rounded-2xl bg-[#071322] border border-blue-500/25 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-white">اللون الثانوي</label>
                    <span className="text-[10px] text-blue-300/80 font-mono">Secondary Color</span>
                  </div>
                  <div 
                    className="w-7 h-7 rounded-lg border border-white/20 shadow-inner"
                    style={{ backgroundColor: themeState.secondaryColor }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  لون الأقسام الداكنة، قسم البداية Hero، وقسم التحقق السريع.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="theme-secondaryColor-picker"
                    value={themeState.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    id="theme-secondaryColor-input"
                    value={themeState.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#0b192c] border border-slate-700 text-white font-mono text-xs focus:border-blue-400 focus:outline-none"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* 3. Background Color */}
              <div className="p-4 rounded-2xl bg-[#071322] border border-blue-500/25 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-white">لون الخلفية</label>
                    <span className="text-[10px] text-blue-300/80 font-mono">Background Color</span>
                  </div>
                  <div 
                    className="w-7 h-7 rounded-lg border border-white/20 shadow-inner"
                    style={{ backgroundColor: themeState.backgroundColor }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  خلفية الموقع الرئيسية والأقسام المضيئة مثل قسم التعريف بالأكاديمية.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="theme-backgroundColor-picker"
                    value={themeState.backgroundColor}
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    id="theme-backgroundColor-input"
                    value={themeState.backgroundColor}
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#0b192c] border border-slate-700 text-white font-mono text-xs focus:border-blue-400 focus:outline-none"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* 4. Text Color */}
              <div className="p-4 rounded-2xl bg-[#071322] border border-blue-500/25 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-white">لون النص</label>
                    <span className="text-[10px] text-blue-300/80 font-mono">Text Color</span>
                  </div>
                  <div 
                    className="w-7 h-7 rounded-lg border border-white/20 shadow-inner"
                    style={{ backgroundColor: themeState.textColor }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  لون النصوص الرئيسية والعناوين في الأقسام الفاتحة وبطاقات الشهادات.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="theme-textColor-picker"
                    value={themeState.textColor}
                    onChange={(e) => handleColorChange('textColor', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    id="theme-textColor-input"
                    value={themeState.textColor}
                    onChange={(e) => handleColorChange('textColor', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#0b192c] border border-slate-700 text-white font-mono text-xs focus:border-blue-400 focus:outline-none"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* 5. Button Color */}
              <div className="p-4 rounded-2xl bg-[#071322] border border-blue-500/25 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-white">لون الأزرار</label>
                    <span className="text-[10px] text-blue-300/80 font-mono">Button Color</span>
                  </div>
                  <div 
                    className="w-7 h-7 rounded-lg border border-white/20 shadow-inner"
                    style={{ backgroundColor: themeState.buttonColor }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  لون أزرار تقديم الطلبات، أزرار البحث، وأزرار التنقل التفاعلية.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="theme-buttonColor-picker"
                    value={themeState.buttonColor}
                    onChange={(e) => handleColorChange('buttonColor', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    id="theme-buttonColor-input"
                    value={themeState.buttonColor}
                    onChange={(e) => handleColorChange('buttonColor', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#0b192c] border border-slate-700 text-white font-mono text-xs focus:border-blue-400 focus:outline-none"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* 6. Border Color */}
              <div className="p-4 rounded-2xl bg-[#071322] border border-blue-500/25 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-white">لون الحدود</label>
                    <span className="text-[10px] text-blue-300/80 font-mono">Border Color</span>
                  </div>
                  <div 
                    className="w-7 h-7 rounded-lg border border-white/20 shadow-inner"
                    style={{ backgroundColor: themeState.borderColor }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  لون الإطارات الفاصلة وحدود البطاقات والخطوط التجميلية الدقيقة.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="theme-borderColor-picker"
                    value={themeState.borderColor}
                    onChange={(e) => handleColorChange('borderColor', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    id="theme-borderColor-input"
                    value={themeState.borderColor}
                    onChange={(e) => handleColorChange('borderColor', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#0b192c] border border-slate-700 text-white font-mono text-xs focus:border-blue-400 focus:outline-none"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* 7. Header Color */}
              <div className="p-4 rounded-2xl bg-[#071322] border border-blue-500/25 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-white">لون الهيدر</label>
                    <span className="text-[10px] text-blue-300/80 font-mono">Header Color</span>
                  </div>
                  <div 
                    className="w-7 h-7 rounded-lg border border-white/20 shadow-inner"
                    style={{ backgroundColor: themeState.headerColor }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  لون شريط التنقل العلوي Navbar والفوتر والقوائم المتنقلة.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="theme-headerColor-picker"
                    value={themeState.headerColor}
                    onChange={(e) => handleColorChange('headerColor', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    id="theme-headerColor-input"
                    value={themeState.headerColor}
                    onChange={(e) => handleColorChange('headerColor', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#0b192c] border border-slate-700 text-white font-mono text-xs focus:border-blue-400 focus:outline-none"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* 8. Card Color */}
              <div className="p-4 rounded-2xl bg-[#071322] border border-blue-500/25 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-white">لون البطاقات</label>
                    <span className="text-[10px] text-blue-300/80 font-mono">Card Color</span>
                  </div>
                  <div 
                    className="w-7 h-7 rounded-lg border border-white/20 shadow-inner"
                    style={{ backgroundColor: themeState.cardColor }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  لون خلفيات بطاقات الشهادات المعتمدة، الحاويات البيضاء، ومربعات العرض.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="theme-cardColor-picker"
                    value={themeState.cardColor}
                    onChange={(e) => handleColorChange('cardColor', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    id="theme-cardColor-input"
                    value={themeState.cardColor}
                    onChange={(e) => handleColorChange('cardColor', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#0b192c] border border-slate-700 text-white font-mono text-xs focus:border-blue-400 focus:outline-none"
                    dir="ltr"
                  />
                </div>
              </div>

            </div>

            {/* Live Interactive Preview Box */}
            <div className="p-5 rounded-2xl bg-[#071322] border border-blue-500/30 space-y-4">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>معاينة حية للمظهر الجديد (Live Theme Preview)</span>
              </h3>

              <div 
                className="p-6 rounded-2xl border transition-all duration-300 space-y-4"
                style={{ 
                  backgroundColor: themeState.backgroundColor, 
                  color: themeState.textColor,
                  borderColor: themeState.borderColor 
                }}
              >
                {/* Mini Header Preview */}
                <div 
                  className="p-3 rounded-xl flex items-center justify-between text-white text-xs font-bold"
                  style={{ backgroundColor: themeState.headerColor }}
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-300" />
                    <span>أكاديمية الأفق للتعليم والتدريب</span>
                  </span>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[10px]">الرئيسية</span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[10px]">التحقق</span>
                  </div>
                </div>

                {/* Mini Hero/Secondary Preview */}
                <div 
                  className="p-4 rounded-xl text-white text-xs space-y-2"
                  style={{ backgroundColor: themeState.secondaryColor }}
                >
                  <span className="font-bold block text-sm">منصة التحقق والاعتماد المهني الدولي</span>
                  <p className="text-[11px] opacity-80">قسم ثانوي داكن متناسق مع صور الشهادات الزرقاء والبيضاء</p>
                  <div className="flex gap-2 pt-1">
                    <button 
                      type="button"
                      className="px-3 py-1.5 rounded-lg font-bold text-white text-xs shadow-md"
                      style={{ backgroundColor: themeState.buttonColor }}
                    >
                      زر تجريبي
                    </button>
                    <span 
                      className="px-3 py-1.5 rounded-lg text-xs border"
                      style={{ borderColor: themeState.borderColor, color: '#ffffff' }}
                    >
                      إطار محدد
                    </span>
                  </div>
                </div>

                {/* Mini Card Preview */}
                <div 
                  className="p-4 rounded-xl border shadow-md space-y-2"
                  style={{ 
                    backgroundColor: themeState.cardColor, 
                    borderColor: themeState.borderColor,
                    color: themeState.textColor 
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs" style={{ color: themeState.primaryColor }}>
                      بطاقة شهادة معتمدة
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: themeState.primaryColor, color: '#ffffff' }}>
                      71110203328
                    </span>
                  </div>
                  <p className="text-[11px] opacity-80">
                    هذا نموذج مصغر يوضح تناسق لون البطاقة مع لون النص والحدود والأزرار في الموقع.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-blue-500/20 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                تذكر الضغط على "حفظ التغييرات" لتطبيق التعديلات بشكل دائم.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRestoreDefaultTheme}
                  disabled={themeSaving}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-600/60 transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${themeSaving ? 'animate-spin' : ''}`} />
                  <span>استعادة الألوان الافتراضية</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveTheme}
                  disabled={themeSaving}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{themeSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: GALLERY IMAGES MANAGER */}
      {/* ========================================================================= */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0b192c] border border-cyan-500/30 shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-lg">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>إدارة وتحديث صور معرض الشهادات</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      مباشر وفوري
                    </span>
                  </h2>
                  <p className="text-xs text-slate-300">
                    ارفع صورك الأصلية مباشرة من هاتفك أو حاسوبك لتظهر فوراً على الموقع بالترتيب الكامل وبدون أي قص
                  </p>
                </div>
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={() => handleSaveGallery(galleryImages)}
                disabled={gallerySaving}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-2 active:scale-95 cursor-pointer self-start sm:self-auto"
              >
                <Save className="w-4 h-4" />
                <span>{gallerySaving ? 'جاري الحفظ...' : 'حفظ ونشر الصور في الموقع'}</span>
              </button>
            </div>

            {/* Uploader Box */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#071322] border-2 border-dashed border-cyan-500/40 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-cyan-600/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                <Plus className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">اختر صور الشهادات من جهازك</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  يمكنك تحديد جميع الصور دفعة واحدة (JPG, PNG). سيتم حفظها بنفس الترتيب وتظهر كاملة بدون أي قص أو تعديل.
                </p>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <label className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:brightness-110 text-white text-sm font-bold transition flex items-center gap-2 cursor-pointer shadow-lg active:scale-95">
                  <Plus className="w-4 h-4" />
                  <span>اضغط هنا لاختيار الصور من جهازك</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFilesUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Current Images List & Reordering */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>الصور المختارة للمعرض ({galleryImages.length})</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    (تُعرض في الموقع بنفس هذا الترتيب)
                  </span>
                </h3>
                {galleryImages.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm("هل تريد حذف كافة صور المعرض؟")) {
                        handleSaveGallery([]);
                      }
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف جميع الصور</span>
                  </button>
                )}
              </div>

              {galleryImages.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#071322] border border-slate-800 text-center text-slate-400 text-xs">
                  لا توجد صور في المعرض حالياً. اضغط على الزر أعلاه لاختيار الصور من جهازك ثم اضغط "حفظ ونشر".
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {galleryImages.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 rounded-2xl bg-[#071322] border border-blue-500/30 flex flex-col justify-between space-y-3 group"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-400/30">
                          صورة #{idx + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveImage(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                            title="تقديم الترتيب"
                          >
                            <ArrowRight className="w-3 h-3 rotate-180" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveImage(idx, 'down')}
                            disabled={idx === galleryImages.length - 1}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                            title="تأخير الترتيب"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="p-1 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 transition cursor-pointer"
                            title="حذف"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-black/60 flex items-center justify-center p-1 border border-white/5">
                        <img
                          src={img}
                          alt={`صورة ${idx + 1}`}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            {galleryImages.length > 0 && (
              <div className="pt-4 border-t border-cyan-500/20 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  بعد الانتهاء من الترتيب، اضغط على زر النشر لتحديث الموقع مباشرة.
                </span>
                <button
                  type="button"
                  onClick={() => handleSaveGallery(galleryImages)}
                  disabled={gallerySaving}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{gallerySaving ? 'جاري الحفظ...' : 'حفظ ونشر الصور في الموقع'}</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT CERTIFICATE */}
      {/* ========================================================================= */}
      {certModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#050c18]/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-[#0b192c] border border-[#1e3a5f] p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-[#1e3a5f]/50 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>{editingCert ? 'تعديل بيانات الشهادة' : 'إضافة شهادة جديدة'}</span>
              </h2>
              <button
                onClick={() => setCertModalOpen(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCertForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-semibold text-slate-200">
                      رقم / رمز الشهادة الفريد <span className="text-rose-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={generateNewUniqueCertNumber}
                      disabled={isGeneratingNumber}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 transition hover:bg-amber-500/20"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isGeneratingNumber ? 'animate-spin text-amber-300' : ''}`} />
                      <span>{isGeneratingNumber ? 'جاري التوليد...' : 'توليد رقم فريد جديد'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    name="certificateNumber"
                    value={certNumberInput}
                    onChange={(e) => setCertNumberInput(e.target.value)}
                    placeholder="مثال: 71184920153"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-amber-400 font-mono font-bold text-sm tracking-wider focus:border-amber-400 focus:outline-none"
                    dir="ltr"
                    required
                  />
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>رمز فريد وموثوق يتم التحقق منه مباشرة في نافذة التحقق العامة.</span>
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    اسم صاحب الشهادة <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="holderName"
                    defaultValue={editingCert?.holderName || ''}
                    placeholder="الاسم الثلاثي أو الرباعي"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white focus:border-amber-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    رقم الهاتف <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={editingCert?.phone || ''}
                    placeholder="مثال: +9647853331053"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white font-mono focus:border-amber-400 focus:outline-none"
                    dir="ltr"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    رقم الهوية / الرقم الوطني
                  </label>
                  <input
                    type="text"
                    name="holderNationalId"
                    defaultValue={editingCert?.holderNationalId || ''}
                    placeholder="اختياري"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white font-mono focus:border-amber-400 focus:outline-none"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1 flex items-center justify-between">
                    <span>التخصص المعتمد <span className="text-rose-400">*</span></span>
                    <span className="text-[11px] text-amber-400/80 font-normal">
                      ({specialties.length > 0 ? `${specialties.length} تخصص متاح في النظام` : '35 تخصصاً معتمداً'})
                    </span>
                  </label>
                  <select
                    name="specialty"
                    defaultValue={editingCert?.specialty || specialties[0]?.name}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white focus:border-amber-400 focus:outline-none text-xs"
                    required
                  >
                    {specialties.map(s => (
                      <option key={s.id} value={s.name} className="bg-[#071322] text-white">
                        {s.name} ({s.category || 'تخصص'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    نوع الشهادة <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="certificateType"
                    defaultValue={editingCert?.certificateType || 'شهادة خبرة دولية معتمدة'}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white focus:border-amber-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">تاريخ الإصدار</label>
                  <input
                    type="date"
                    name="issueDate"
                    defaultValue={editingCert?.issueDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">حالة الشهادة</label>
                  <select
                    name="status"
                    defaultValue={editingCert?.status || 'صالحة'}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white font-bold focus:border-amber-400 focus:outline-none"
                  >
                    <option value="صالحة" className="bg-[#071322] text-white">صالحة</option>
                    <option value="موقوفة" className="bg-[#071322] text-white">موقوفة</option>
                    <option value="ملغاة" className="bg-[#071322] text-white">ملغاة</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">التقدير / Grade</label>
                  <input
                    type="text"
                    name="grade"
                    defaultValue={editingCert?.grade || 'امتياز (Grade A+)'}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">تاريخ الصلاحية</label>
                  <input
                    type="text"
                    name="expiryDate"
                    defaultValue={editingCert?.expiryDate || 'غير محددة (دائمة)'}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">ملاحظات الاعتماد المهني</label>
                <textarea
                  name="notes"
                  rows={2}
                  defaultValue={editingCert?.notes || 'اجتاز متطلبات التقييم المهني واختبار الكفاءة الميدانية بنجاح.'}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#1e3a5f]/50 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCertModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-slate-200 hover:bg-[#1e293b] transition font-medium"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:brightness-105 transition shadow-lg shadow-amber-500/10"
                >
                  {editingCert ? 'حفظ التعديلات' : 'إضافة الشهادة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: QR CODE VIEWER */}
      {/* ========================================================================= */}
      {qrModalCert && (
        <div className="fixed inset-0 z-50 bg-[#050c18]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#0b192c] border-2 border-amber-500/40 p-6 text-center space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-white">رمز QR الخاص بالشهادة</span>
              <button onClick={() => setQrModalCert(null)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl inline-block shadow-lg mx-auto">
              <QRCodeSVG
                value={`${window.location.origin}/verify/${qrModalCert.certificateNumber}`}
                size={180}
                level="H"
              />
            </div>

            <div className="space-y-1 text-xs">
              <div className="font-bold text-white">{qrModalCert.holderName}</div>
              <div className="font-mono text-amber-400 font-bold">{qrModalCert.certificateNumber}</div>
              <p className="text-slate-300 text-[11px] pt-1">
                عند مسح هذا الرمز يتم فتح صفحة التحقق المباشرة وتظهر بيانات وحالة الشهادة.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={`/verify/${qrModalCert.certificateNumber}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>فتح صفحة التحقق الآن</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: APPLICATION DETAILS */}
      {/* ========================================================================= */}
      {appDetailModal && (
        <div className="fixed inset-0 z-50 bg-[#050c18]/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-[#0b192c] border border-[#1e3a5f] p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#1e3a5f]/50 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-amber-400 text-sm">{appDetailModal.id}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#071322] border border-[#1e3a5f] text-slate-200">
                  {appDetailModal.status}
                </span>
              </div>
              <button onClick={() => setAppDetailModal(null)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#071322] border border-[#1e3a5f]/40 p-4 rounded-xl">
                <div>
                  <span className="text-slate-400 block mb-0.5">اسم المتقدم:</span>
                  <span className="font-bold text-white text-sm">{appDetailModal.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">رقم الهاتف:</span>
                  <a href={`tel:${appDetailModal.phone}`} className="font-mono text-amber-300 font-bold underline" dir="ltr">
                    {appDetailModal.phone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">المحافظة:</span>
                  <span className="text-slate-200">{appDetailModal.governorate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">التخصص المطلوب:</span>
                  <span className="text-slate-200">{appDetailModal.specialty}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">نوع الشهادة:</span>
                  <span className="text-slate-200">{appDetailModal.certificateType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">البريد الإلكتروني:</span>
                  <span className="text-slate-300 font-mono">{appDetailModal.email || 'غير مدخل'}</span>
                </div>
              </div>

              {appDetailModal.notes && (
                <div className="p-3 rounded-xl bg-[#071322] border border-[#1e3a5f]/40">
                  <span className="font-bold text-slate-300 block mb-1">ملاحظات المتقدم:</span>
                  <p className="text-slate-300 leading-relaxed">{appDetailModal.notes}</p>
                </div>
              )}

              {/* Attachments */}
              <div className="space-y-2">
                <span className="font-bold text-slate-200 block">المرفقات:</span>
                <div className="flex items-center gap-4">
                  {appDetailModal.photoUrl ? (
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-amber-500/40">
                      <img src={appDetailModal.photoUrl} alt="صورة المتقدم" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <span className="text-slate-400">لا توجد صورة شخصية</span>
                  )}

                  {appDetailModal.documentsUrl && (
                    <a
                      href={appDetailModal.documentsUrl}
                      download="documents"
                      className="px-3 py-2 rounded-xl bg-[#071322] hover:bg-[#1e293b] text-amber-300 border border-[#1e3a5f] flex items-center gap-1.5 transition"
                    >
                      <FileText className="w-4 h-4" />
                      <span>تنزيل ملف المستمسكات المرفق</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1e3a5f]/50 flex items-center justify-between gap-3">
              <a
                href={`https://wa.me/${appDetailModal.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`مرحباً ${appDetailModal.fullName}، نتواصل معك من إدارة أكاديمية الأفق بخصوص طلب شهادة الخبرة رقم (${appDetailModal.id}).`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-emerald-900/30"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>مراسلة عبر واتساب</span>
              </a>

              {appDetailModal.status !== 'مكتمل ومصدر' && (
                <button
                  onClick={() => handleIssueCertFromApp(appDetailModal)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:brightness-105 transition flex items-center gap-1.5 shadow-md shadow-amber-500/10"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>إصدار شهادة فورية</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ADD / EDIT SPECIALTY */}
      {/* ========================================================================= */}
      {specModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#050c18]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#0b192c] border border-[#1e3a5f] p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#1e3a5f]/50 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingSpec ? 'تعديل التخصص' : 'إضافة تخصص جديد'}
              </h3>
              <button onClick={() => setSpecModalOpen(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSpecForm} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">اسم التخصص</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingSpec?.name || ''}
                  placeholder="مثال: هندسة البرمجيات السحابية"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">التصنيف</label>
                <input
                  type="text"
                  name="category"
                  defaultValue={editingSpec?.category || 'تقنية'}
                  placeholder="مثال: تقنية / إدارة / هندسة"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">الوصف</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingSpec?.description || ''}
                  placeholder="شرح موجز عن كفاءات التخصص..."
                  className="w-full px-3 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">الأيقونة (اسم رمزي)</label>
                <input
                  type="text"
                  name="icon"
                  defaultValue={editingSpec?.icon || 'BookOpen'}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#071322] border border-[#1e3a5f] text-white font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#1e3a5f]/50 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSpecModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#071322] border border-[#1e3a5f] text-slate-200 hover:bg-[#1e293b] transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:brightness-105 transition shadow-md shadow-amber-500/10"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
