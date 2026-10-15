import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Increase payload limit for personal photo and documents uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve static assets from public directory
app.use(express.static(path.join(process.cwd(), "public")));

const DB_PATH = path.join(process.cwd(), "data", "database.json");

// Ensure DB directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

interface DatabaseSchema {
  settings: {
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
  };
  statistics: {
    beneficiaries: number;
    certificates: number;
    specialties: number;
    yearsExperience: number;
  };
  theme?: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    borderColor: string;
    headerColor: string;
    cardColor: string;
  };
  specialties: Array<{
    id: string;
    name: string;
    category?: string;
    icon?: string;
    description?: string;
  }>;
  certificates: Array<{
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
  }>;
  applications: Array<{
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
  }>;
  messages?: Array<{
    id: string;
    name: string;
    phone: string;
    email: string;
    subject?: string;
    message: string;
    createdAt: string;
    read?: boolean;
  }>;
  admin: {
    username: string;
    password: string;
    tokenSecret: string;
  };
}

function readDb(): DatabaseSchema {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database file, using fallback:", err);
    throw err;
  }
}

function writeDb(data: DatabaseSchema): void {
  const tempPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tempPath, DB_PATH);
}

import { MASTER_VERIFICATION_CODE, SPECIAL_ALL_CERTIFICATES_CODE, SYSTEM_35_CERTIFICATES } from "./src/data/systemCertificates";
import { DEFAULT_THEME } from "./src/types";

const MASTER_ADMIN_VERIFICATION_CODE = MASTER_VERIFICATION_CODE;

// Function to generate a unique, non-colliding certificate number
function generateUniqueCertNumber(certificates: Array<{ certificateNumber: string }>): string {
  let unique = false;
  let code = "";
  let attempts = 0;
  while (!unique && attempts < 1000) {
    attempts++;
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
    code = `711${randomDigits}`;
    if (code !== MASTER_ADMIN_VERIFICATION_CODE && !certificates.some((c) => c.certificateNumber.toLowerCase() === code.toLowerCase())) {
      unique = true;
    }
  }
  return code;
}

// Simple bearer token auth middleware for admin
const adminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "غير مصرح - يرجى تسجيل الدخول كمدير" });
  }
  const token = authHeader.split(" ")[1];
  const db = readDb();
  if (token !== db.admin.tokenSecret) {
    return res.status(403).json({ error: "رمز المصادقة غير صالح أو منتهي الصلاحية" });
  }
  next();
};

// ======================== API ROUTES ========================

// 1. Public data for homepage and general components (specialties are kept strictly in admin dashboard)
app.get("/api/public/data", (req, res) => {
  try {
    const db = readDb();
    res.json({
      settings: db.settings,
      statistics: db.statistics,
      theme: db.theme || DEFAULT_THEME,
      galleryImages: (db as any).galleryImages || []
    });
  } catch (err: any) {
    res.status(500).json({ error: "فشل استرجاع بيانات الأكاديمية" });
  }
});

// Contact form submission
app.post("/api/contact", (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ error: "يرجى كتابة الاسم ورقم الهاتف والرسالة" });
    }

    const db = readDb();
    if (!db.messages) db.messages = [];

    const newMessage = {
      id: `msg-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: (email || "").trim(),
      subject: (subject || "استفسار عام").trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      read: false
    };

    db.messages.unshift(newMessage);
    writeDb(db);

    res.status(201).json({
      success: true,
      message: "تم استلام رسالتك بنجاح وسيتواصل معك فريق الأكاديمية قريباً",
      id: newMessage.id
    });
  } catch (err: any) {
    res.status(500).json({ error: "فشل إرسال الرسالة، يرجى المحاولة لاحقاً" });
  }
});

// 2. Certificate verification endpoint
app.get("/api/certificates/verify/:certNumber", (req, res) => {
  try {
    const certNumber = (req.params.certNumber || "").trim();
    if (!certNumber) {
      return res.status(400).json({ error: "يرجى إدخال رمز التحقق", message: "يرجى إدخال رمز التحقق" });
    }

    const db = readDb();

    // Ensure certificates array is populated; if empty, seed with SYSTEM_35_CERTIFICATES
    let allCertificates = db.certificates;
    if (!allCertificates || allCertificates.length === 0) {
      allCertificates = SYSTEM_35_CERTIFICATES;
      db.certificates = SYSTEM_35_CERTIFICATES;
      db.statistics.certificates = SYSTEM_35_CERTIFICATES.length;
      writeDb(db);
    }

    // 1. Master Verification Code: 71110203328
    // Supports relationship: verification_code -> multiple certificates (35 certificates)
    if (certNumber === MASTER_VERIFICATION_CODE) {
      const linkedCertificates = allCertificates.filter(
        (c) => c.verificationCode === MASTER_VERIFICATION_CODE || 
               (c as any).verification_code === MASTER_VERIFICATION_CODE ||
               !c.verificationCode
      );

      return res.json({
        found: true,
        isMasterCode: true,
        isMasterAdmin: true,
        code: MASTER_VERIFICATION_CODE,
        total: linkedCertificates.length,
        certificates: linkedCertificates,
        message: "تم التحقق بنجاح من رمز التحقق الرئيسي (71110203328)"
      });
    }

    // 2. Check if multiple certificates are linked to this verificationCode
    const linkedByCode = allCertificates.filter(
      (c) => c.verificationCode === certNumber || (c as any).verification_code === certNumber
    );
    if (linkedByCode.length > 1) {
      return res.json({
        found: true,
        isMasterCode: true,
        isMasterAdmin: true,
        code: certNumber,
        total: linkedByCode.length,
        certificates: linkedByCode,
        message: "تم التحقق بنجاح من رمز التحقق"
      });
    }

    // 3. Search for individual certificate by certificateNumber
    const cert = allCertificates.find(
      (c) => c.certificateNumber.toLowerCase() === certNumber.toLowerCase() || c.id === certNumber
    );

    if (cert) {
      cert.verifiedCount = (cert.verifiedCount || 0) + 1;
      writeDb(db);

      return res.json({
        found: true,
        isMasterCode: false,
        certificate: cert
      });
    }

    // 4. Not found in database
    return res.status(404).json({
      found: false,
      message: "رمز الشهادة غير صحيح، يرجى التأكد من الرمز والمحاولة مرة أخرى."
    });
  } catch (err: any) {
    console.error("Verification error:", err);
    res.status(500).json({ 
      found: false,
      message: "رمز الشهادة غير صحيح، يرجى التأكد من الرمز والمحاولة مرة أخرى."
    });
  }
});

// 3. Application submission
app.post("/api/applications", (req, res) => {
  try {
    const { fullName, phone, email, governorate, specialty, certificateType, photoUrl, documentsUrl, notes } = req.body;

    if (!fullName || !phone || !governorate || !specialty || !certificateType) {
      return res.status(400).json({ error: "يرجى ملء جميع الحقول المطلوبة" });
    }

    const db = readDb();
    const newId = `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApp = {
      id: newId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: (email || "").trim(),
      governorate: governorate.trim(),
      specialty: specialty.trim(),
      certificateType: certificateType.trim(),
      photoUrl: photoUrl || "",
      documentsUrl: documentsUrl || "",
      notes: (notes || "").trim(),
      status: "قيد المراجعة" as const,
      createdAt: new Date().toISOString()
    };

    db.applications.unshift(newApp);
    writeDb(db);

    res.status(201).json({
      success: true,
      message: "تم استلام طلبك بنجاح",
      applicationId: newId,
      application: newApp
    });
  } catch (err: any) {
    console.error("Application error:", err);
    res.status(500).json({ error: "فشل حفظ الطلب، يرجى المحاولة مرة أخرى" });
  }
});

// 4. Admin Login
app.post("/api/admin/login", (req, res) => {
  try {
    const { username, password } = req.body;
    const db = readDb();

    if (username === db.admin.username && password === db.admin.password) {
      return res.json({
        success: true,
        token: db.admin.tokenSecret,
        username: db.admin.username
      });
    }

    return res.status(401).json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" });
  } catch (err: any) {
    res.status(500).json({ error: "فشل تسجيل الدخول" });
  }
});

// 5. Admin Dashboard full data
app.get("/api/admin/dashboard", adminAuth, (req, res) => {
  try {
    const db = readDb();
    res.json({
      settings: db.settings,
      statistics: db.statistics,
      specialties: db.specialties,
      certificates: db.certificates,
      applications: db.applications,
      theme: db.theme || DEFAULT_THEME,
      galleryImages: (db as any).galleryImages || []
    });
  } catch (err: any) {
    res.status(500).json({ error: "فشل جلب بيانات لوحة التحكم" });
  }
});

// Update gallery images (admin)
app.post("/api/admin/gallery", adminAuth, (req, res) => {
  try {
    const { images } = req.body;
    if (!Array.isArray(images)) {
      return res.status(400).json({ error: "يجب إرسال مصفوفة من الصور" });
    }
    const db = readDb();
    const assetsDir = path.join(process.cwd(), "public", "assets", "img");
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }

    const savedPaths: string[] = [];
    images.forEach((imgStr: any, idx: number) => {
      if (typeof imgStr === "string" && imgStr.startsWith("data:image/")) {
        const matches = imgStr.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (matches) {
          const rawExt = matches[1].toLowerCase();
          const ext = rawExt.includes("png") ? "png" : "jpg";
          const buffer = Buffer.from(matches[2], "base64");
          const fileName = `gallery_custom_${idx + 1}_${Date.now()}.${ext}`;
          const filePath = path.join(assetsDir, fileName);
          fs.writeFileSync(filePath, buffer);
          savedPaths.push(`/assets/img/${fileName}`);
          return;
        }
      }
      if (typeof imgStr === "string" && imgStr.trim()) {
        savedPaths.push(imgStr.trim());
      }
    });

    (db as any).galleryImages = savedPaths;
    writeDb(db);

    res.json({
      success: true,
      message: "تم حفظ صور المعرض بنجاح",
      galleryImages: savedPaths
    });
  } catch (err: any) {
    console.error("Gallery save error:", err);
    res.status(500).json({ error: "فشل حفظ صور المعرض" });
  }
});

// Update Theme Settings
app.put("/api/admin/theme", adminAuth, (req, res) => {
  try {
    const db = readDb();
    const newTheme = req.body;
    db.theme = {
      ...DEFAULT_THEME,
      ...newTheme
    };
    writeDb(db);
    res.json({
      success: true,
      message: "تم حفظ إعدادات الألوان بنجاح",
      theme: db.theme
    });
  } catch (err: any) {
    res.status(500).json({ error: "فشل حفظ إعدادات الألوان" });
  }
});

// Reset Theme Settings to Default
app.post("/api/admin/theme/reset", adminAuth, (req, res) => {
  try {
    const db = readDb();
    db.theme = { ...DEFAULT_THEME };
    writeDb(db);
    res.json({
      success: true,
      message: "تمت استعادة الألوان الافتراضية بنجاح",
      theme: db.theme
    });
  } catch (err: any) {
    res.status(500).json({ error: "فشل استعادة الألوان الافتراضية" });
  }
});

// 6. Admin Certificates CRUD

// Generate unique certificate number endpoint
app.get("/api/admin/certificates/generate-number", adminAuth, (req, res) => {
  try {
    const db = readDb();
    const certNum = generateUniqueCertNumber(db.certificates);
    res.json({ success: true, certificateNumber: certNum });
  } catch (err: any) {
    res.status(500).json({ error: "فشل توليد رقم الشهادة" });
  }
});

app.post("/api/admin/certificates", adminAuth, (req, res) => {
  try {
    const {
      certificateNumber,
      holderName,
      phone,
      holderNationalId,
      specialty,
      certificateType,
      issueDate,
      expiryDate,
      grade,
      status,
      academyName,
      notes
    } = req.body;

    if (!holderName || !holderName.trim()) {
      return res.status(400).json({ error: "يرجى كتابة اسم صاحب الشهادة" });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ error: "يرجى كتابة رقم هاتف صاحب الشهادة" });
    }
    if (!specialty || !specialty.trim()) {
      return res.status(400).json({ error: "يرجى اختيار التخصص المعتمد" });
    }

    const db = readDb();
    let certNum = (certificateNumber || "").trim();

    if (certNum) {
      if (certNum === MASTER_ADMIN_VERIFICATION_CODE) {
        return res.status(400).json({ error: "الرمز 71110203328 محجوز كرمز تحقق رئيسي ولا يمكن تخصيصه كشهادة فردية" });
      }
      const existing = db.certificates.find(
        (c) => c.certificateNumber.toLowerCase() === certNum.toLowerCase()
      );
      if (existing) {
        return res.status(400).json({ error: "رقم الشهادة هذا مستخدم بالفعل مسبقاً، يرجى اختيار أو توليد رقم فريد" });
      }
    } else {
      certNum = generateUniqueCertNumber(db.certificates);
    }

    const newCert = {
      id: `cert-${Date.now()}`,
      certificateNumber: certNum,
      holderName: holderName.trim(),
      phone: phone.trim(),
      holderNationalId: holderNationalId?.trim() || "",
      specialty: specialty.trim(),
      certificateType: (certificateType || "شهادة خبرة دولية معتمدة").trim(),
      issueDate: issueDate || new Date().toISOString().split("T")[0],
      expiryDate: expiryDate || "غير محددة (دائمة)",
      grade: grade?.trim() || "امتياز (Grade A+)",
      status: (status || "صالحة") as "صالحة" | "موقوفة" | "ملغاة",
      academyName: academyName?.trim() || db.settings.academyName,
      certificateImage: req.body.certificateImage || "",
      qrCode: `/verify/${certNum}`,
      verificationUrl: `/verify/${certNum}`,
      verifiedCount: 0,
      notes: notes?.trim() || "",
      createdAt: new Date().toISOString()
    };

    db.certificates.unshift(newCert);
    db.statistics.certificates = db.certificates.length;
    writeDb(db);

    res.status(201).json({ success: true, certificate: newCert });
  } catch (err: any) {
    res.status(500).json({ error: "فشل إضافة الشهادة" });
  }
});

app.put("/api/admin/certificates/:id", adminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const db = readDb();

    const idx = db.certificates.findIndex((c) => c.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "الشهادة غير موجودة" });
    }

    // Check certificateNumber uniqueness if changed
    if (updates.certificateNumber) {
      const trimmedNum = updates.certificateNumber.trim();
      if (trimmedNum === MASTER_ADMIN_VERIFICATION_CODE) {
        return res.status(400).json({ error: "الرمز 71110203328 محجوز كرمز تحقق رئيسي ولا يمكن استخدامه لشهادة فردية" });
      }
      const dup = db.certificates.find(
        (c) => c.id !== id && c.certificateNumber.toLowerCase() === trimmedNum.toLowerCase()
      );
      if (dup) {
        return res.status(400).json({ error: "رقم الشهادة مستخدم بالفعل لشهادة أخرى" });
      }
    }

    db.certificates[idx] = {
      ...db.certificates[idx],
      ...updates,
      phone: updates.phone !== undefined ? (updates.phone || "").trim() : db.certificates[idx].phone,
      holderName: updates.holderName ? updates.holderName.trim() : db.certificates[idx].holderName,
      specialty: updates.specialty ? updates.specialty.trim() : db.certificates[idx].specialty,
      certificateNumber: updates.certificateNumber ? updates.certificateNumber.trim() : db.certificates[idx].certificateNumber
    };

    writeDb(db);
    res.json({ success: true, certificate: db.certificates[idx] });
  } catch (err: any) {
    res.status(500).json({ error: "فشل تعديل بيانات الشهادة" });
  }
});

app.delete("/api/admin/certificates/:id", adminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const idx = db.certificates.findIndex((c) => c.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "الشهادة غير موجودة" });
    }

    db.certificates.splice(idx, 1);
    writeDb(db);
    res.json({ success: true, message: "تم حذف الشهادة بنجاح" });
  } catch (err: any) {
    res.status(500).json({ error: "فشل حذف الشهادة" });
  }
});

app.patch("/api/admin/certificates/:id/status", adminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["صالحة", "موقوفة", "ملغاة"].includes(status)) {
      return res.status(400).json({ error: "الحالة غير صالحة" });
    }

    const db = readDb();
    const cert = db.certificates.find((c) => c.id === id);
    if (!cert) {
      return res.status(404).json({ error: "الشهادة غير موجودة" });
    }

    cert.status = status;
    writeDb(db);
    res.json({ success: true, certificate: cert });
  } catch (err: any) {
    res.status(500).json({ error: "فشل تحديث حالة الشهادة" });
  }
});

// 7. Admin Specialties CRUD
app.post("/api/admin/specialties", adminAuth, (req, res) => {
  try {
    const { name, description, category, icon } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "اسم التخصص مطلوب" });
    }

    const db = readDb();
    const newSpec = {
      id: `spec-${Date.now()}`,
      name: name.trim(),
      description: (description || "").trim(),
      category: (category || "عام").trim(),
      icon: icon || "BookOpen"
    };

    db.specialties.push(newSpec);
    db.statistics.specialties = Math.max(db.statistics.specialties, db.specialties.length);
    writeDb(db);

    res.status(201).json({ success: true, specialty: newSpec });
  } catch (err: any) {
    res.status(500).json({ error: "فشل إضافة التخصص" });
  }
});

app.put("/api/admin/specialties/:id", adminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, icon } = req.body;
    const db = readDb();

    const idx = db.specialties.findIndex((s) => s.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "التخصص غير موجود" });
    }

    db.specialties[idx] = {
      ...db.specialties[idx],
      name: name ? name.trim() : db.specialties[idx].name,
      description: description !== undefined ? description.trim() : db.specialties[idx].description,
      category: category !== undefined ? category.trim() : db.specialties[idx].category,
      icon: icon || db.specialties[idx].icon
    };

    writeDb(db);
    res.json({ success: true, specialty: db.specialties[idx] });
  } catch (err: any) {
    res.status(500).json({ error: "فشل تعديل التخصص" });
  }
});

app.delete("/api/admin/specialties/:id", adminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const idx = db.specialties.findIndex((s) => s.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "التخصص غير موجود" });
    }

    db.specialties.splice(idx, 1);
    writeDb(db);
    res.json({ success: true, message: "تم حذف التخصص بنجاح" });
  } catch (err: any) {
    res.status(500).json({ error: "فشل حذف التخصص" });
  }
});

// 8. Admin Applications management
app.patch("/api/admin/applications/:id/status", adminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const valid = ["قيد المراجعة", "تم القبول", "بانتظار الدفع", "مكتمل ومصدر", "مرفوض"];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: "حالة الطلب غير صالحة" });
    }

    const db = readDb();
    const appItem = db.applications.find((a) => a.id === id);
    if (!appItem) {
      return res.status(404).json({ error: "الطلب غير موجود" });
    }

    appItem.status = status;
    writeDb(db);
    res.json({ success: true, application: appItem });
  } catch (err: any) {
    res.status(500).json({ error: "فشل تحديث حالة الطلب" });
  }
});

// Convert application directly into issued certificate
app.post("/api/admin/applications/:id/issue-certificate", adminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const appItem = db.applications.find((a) => a.id === id);
    if (!appItem) {
      return res.status(404).json({ error: "الطلب غير موجود" });
    }

    // Generate certificate number or use provided
    const certNum = req.body.certificateNumber || generateUniqueCertNumber(db.certificates);

    const newCert = {
      id: `cert-${Date.now()}`,
      certificateNumber: certNum,
      holderName: appItem.fullName,
      phone: appItem.phone,
      holderNationalId: req.body.holderNationalId || "",
      specialty: appItem.specialty,
      certificateType: appItem.certificateType,
      issueDate: new Date().toISOString().split("T")[0],
      expiryDate: "غير محددة (دائمة)",
      grade: req.body.grade || "امتياز",
      status: "صالحة" as const,
      academyName: db.settings.academyName,
      verifiedCount: 0,
      notes: `صادرة بناء على طلب معتمد رقم ${appItem.id}`,
      createdAt: new Date().toISOString()
    };

    db.certificates.unshift(newCert);
    appItem.status = "مكتمل ومصدر";
    writeDb(db);

    res.status(201).json({ success: true, certificate: newCert, application: appItem });
  } catch (err: any) {
    res.status(500).json({ error: "فشل إصدار الشهادة من الطلب" });
  }
});

// 9. Update Settings & Statistics
app.put("/api/admin/settings", adminAuth, (req, res) => {
  try {
    const { settings, statistics } = req.body;
    const db = readDb();

    if (settings) {
      db.settings = { ...db.settings, ...settings };
    }
    if (statistics) {
      db.statistics = { ...db.statistics, ...statistics };
    }

    writeDb(db);
    res.json({ success: true, settings: db.settings, statistics: db.statistics });
  } catch (err: any) {
    res.status(500).json({ error: "فشل حفظ إعدادات الموقع" });
  }
});

// 9b. Update Theme Settings
app.put("/api/admin/theme", adminAuth, (req, res) => {
  try {
    const { theme } = req.body;
    const db = readDb();
    if (theme) {
      db.theme = { ...DEFAULT_THEME, ...theme };
      writeDb(db);
    }
    res.json({ success: true, theme: db.theme });
  } catch (err: any) {
    res.status(500).json({ error: "فشل حفظ إعدادات المظهر" });
  }
});

app.post("/api/admin/theme/reset", adminAuth, (req, res) => {
  try {
    const db = readDb();
    db.theme = { ...DEFAULT_THEME };
    writeDb(db);
    res.json({ success: true, theme: db.theme });
  } catch (err: any) {
    res.status(500).json({ error: "فشل استعادة الألوان الافتراضية" });
  }
});

// 10. Admin Verification Statistics
app.get("/api/admin/verification-stats", adminAuth, (req, res) => {
  try {
    const db = readDb();
    const total = db.certificates.length;
    const valid = db.certificates.filter((c) => c.status === "صالحة").length;
    const revoked = db.certificates.filter((c) => c.status === "ملغاة").length;
    const suspended = db.certificates.filter((c) => c.status === "موقوفة").length;
    const totalVerifications = db.certificates.reduce((acc, c) => acc + (c.verifiedCount || 0), 0);

    res.json({
      totalCertificates: total,
      validCertificates: valid,
      revokedCertificates: revoked,
      suspendedCertificates: suspended,
      totalVerifications
    });
  } catch (err: any) {
    res.status(500).json({ error: "فشل استرجاع إحصائيات التحقق" });
  }
});

// 11. Admin Contact Messages
app.get("/api/admin/messages", adminAuth, (req, res) => {
  try {
    const db = readDb();
    res.json({ messages: db.messages || [] });
  } catch (err: any) {
    res.status(500).json({ error: "فشل جلب الرسائل" });
  }
});

app.delete("/api/admin/messages/:id", adminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    if (db.messages) {
      db.messages = db.messages.filter((m) => m.id !== id);
      writeDb(db);
    }
    res.json({ success: true, message: "تم حذف الرسالة" });
  } catch (err: any) {
    res.status(500).json({ error: "فشل حذف الرسالة" });
  }
});

// 12. Showcase Images API for original user uploads
app.post("/api/admin/showcase-images", (req, res) => {
  try {
    const { images } = req.body;
    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: "الرجاء توفير قائمة بالصور" });
    }
    const publicImgDir = path.join(process.cwd(), "public", "assets", "img");
    if (!fs.existsSync(publicImgDir)) {
      fs.mkdirSync(publicImgDir, { recursive: true });
    }
    const savedUrls: string[] = [];
    images.forEach((imgBase64, index) => {
      if (typeof imgBase64 === "string" && imgBase64.includes(";base64,")) {
        const parts = imgBase64.split(";base64,");
        const ext = parts[0].includes("png") ? "png" : "jpg";
        const buffer = Buffer.from(parts[1], "base64");
        const filename = `user_vip_${index + 1}.${ext}`;
        const filePath = path.join(publicImgDir, filename);
        fs.writeFileSync(filePath, buffer);
        savedUrls.push(`/assets/img/${filename}?v=${Date.now()}`);
      } else if (typeof imgBase64 === "string") {
        savedUrls.push(imgBase64);
      }
    });

    const db = readDb();
    (db as any).showcaseImages = savedUrls;
    writeDb(db);

    res.json({ success: true, urls: savedUrls });
  } catch (err: any) {
    res.status(500).json({ error: "فشل حفظ الصور: " + err.message });
  }
});

app.get("/api/public/showcase-images", (req, res) => {
  try {
    const db = readDb();
    res.json({ urls: (db as any).showcaseImages || [] });
  } catch (err: any) {
    res.status(500).json({ error: "فشل استرجاع الصور" });
  }
});

// 13. Video Upload API
app.post("/api/upload-video", (req, res) => {
  try {
    const { videoBase64 } = req.body;
    if (!videoBase64 || typeof videoBase64 !== "string") {
      return res.status(400).json({ error: "لم يتم توفير ملف فيديو صالح" });
    }
    const publicVideoDir = path.join(process.cwd(), "public", "assets", "video");
    if (!fs.existsSync(publicVideoDir)) {
      fs.mkdirSync(publicVideoDir, { recursive: true });
    }
    const parts = videoBase64.includes(";base64,") ? videoBase64.split(";base64,")[1] : videoBase64;
    const buffer = Buffer.from(parts, "base64");
    const filePath = path.join(publicVideoDir, "alofuk_official.mp4");
    fs.writeFileSync(filePath, buffer);

    const distVideoDir = path.join(process.cwd(), "dist", "assets", "video");
    if (fs.existsSync(distVideoDir)) {
      fs.writeFileSync(path.join(distVideoDir, "alofuk_official.mp4"), buffer);
    }

    const videoUrl = `/assets/video/alofuk_official.mp4?v=${Date.now()}`;
    res.json({ success: true, url: videoUrl });
  } catch (err: any) {
    res.status(500).json({ error: "فشل حفظ الفيديو: " + err.message });
  }
});

// Start Server with Vite or static production dist
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
