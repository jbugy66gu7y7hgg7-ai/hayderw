/**
 * بوت واتساب للدعم الفني - أكاديمية الأفق (ماليزيا)
 * Alofuk Academy WhatsApp Customer Support Bot
 * 
 * الميزات:
 * 1. معالجة رسائل الترحيب وعرض القائمة التفاعلية.
 * 2. الرد الذكي على اختيارات المستخدم (1، 2، 3، إلخ) وتوجيه العميل.
 * 3. دعم التحقق المباشر من أرقام الشهادات عبر قاعدة بيانات أو واجهة الأكاديمية.
 * 4. مهيأ بالكامل للربط مع WhatsApp Business Cloud API (Meta Graph API)
 *    بالإضافة إلى إمكانية التشغيل والاختبار المحلي الفوري.
 */

import express from 'express';

const app = express();
app.use(express.json());

// ==========================================
// 1. الإعدادات والبيئة (Environment Settings)
// ==========================================
const PORT = process.env.BOT_PORT || 4000;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || 'YOUR_META_ACCESS_TOKEN';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || 'YOUR_PHONE_NUMBER_ID';
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'alofuk_bot_verify_token_2025';
const ACADEMY_API_URL = process.env.ACADEMY_API_URL || 'http://localhost:3000';

// سجل حالات المحادثات لتتبع الخطوة الحالية للعميل (Session Store)
const userSessions = new Map();

// ==========================================
// 2. قوالب الرسائل والنصوص (Message Templates)
// ==========================================
const MESSAGES = {
  welcome: (userName = 'عزيزنا العميل') => 
`مرحباً بك ${userName} في أكاديمية الأفق - ماليزيا 🇲🇾🌟
الوكالة المعتمدة لتوثيق ومنح شهادات الخبرة الدولية.

يسعدنا خدمتك! الرجاء اختيار رقم الخدمة المطلوبة:

1️⃣ الاستفسار عن شهادات الخبرة وكيفية الحصول عليها
2️⃣ التحقق الفوري من صحة شهادة صادرة
3️⃣ التخصصات المتاحة ورابط التقديم الإلكتروني
4️⃣ التحدث مع مستشار الدعم الفني وخدمة العملاء

💡 أرسل رقم الخيار (1 أو 2 أو 3 أو 4) للمتابعة.`,

  option1_info:
`📋 *شهادات الخبرة الدولية - أكاديمية الأفق*:

• شهادة مهنية وقانونية تثبت كفاءتك وخبرتك العملية في مجالك.
• تحتوي على رقم تسلسلي دولي معتمد ورمز استجابة سريعة (QR Code).
• تصدر خلال 24 - 48 ساعة بعد تدقيق الأوليات واجتياز التقييم.

للتقديم الفوري تفضل بزيارة موقعنا:
🌐 https://alofuk.com/apply

أرسل "0" أو "قائمة" للعودة إلى القائمة الرئيسية.`,

  option2_prompt:
`🔍 *خدمة التحقق من الشهادات المعتمدة*:

يرجى إرسال رقم الشهادة أو رقم التسجيل الآن 
(مثال: ALF-2024-8841 أو ALOFUK-2024-101)

وسيقوم النظام بفحصها فوراً في السجل الرسمي لأكاديمية الأفق.`,

  option3_specialties:
`🎓 *التخصصات المعتمدة لدى الأكاديمية*:

نقدم شهادات خبرة في أكثر من 35 تخصصاً رئيسياً تشمل:
• الإدارة وريادة الأعمال والمحاسبة
• تكنولوجيا المعلومات والبرمجة والشبكات
• السلامة المهنية والصحة والبيئة (HSE)
• الإعلام، التصميم، والتسويق الرقمي
• الهندسة والتقنيات الفنية

📌 يمكنك استعراض كافة التخصصات والتقديم مباشرة:
🌐 https://alofuk.com/#specialties-section

أرسل "0" أو "قائمة" للعودة إلى القائمة الرئيسية.`,

  option4_human_support:
`👨‍💼 *التحدث مع مستشار الدعم الفني*:

تم تحويل طلبك لفريق خدمة العملاء، وسيقوم أحد ممثلينا بالتواصل معك في أقرب وقت.

📞 هاتف ومكتب الإدارة: +9647853331053
💬 واتساب مباشر: https://wa.me/9647853331053
⏰ أوقات العمل: السبت إلى الخميس (9:00 ص - 8:00 م بتوقيت مكة/بغداد)

أرسل "0" أو "قائمة" للعودة إلى القائمة الرئيسية.`,

  fallback:
`عذراً، لم نتمكن من فهم طلبك ⚠️

يرجى إرسال رقم الخيار المطلوب:
1: استفسار عن الشهادات
2: التحقق من شهادة
3: التخصصات والتقديم
4: التحدث مع خدمة العملاء

أو أرسل كلمة "قائمة" لعرض الخيارات من جديد.`
};

// ==========================================
// 3. محرك معالجة منطق الرسائل (Bot Core Logic)
// ==========================================

/**
 * فحص رقم الشهادة محلياً أو عبر واجهة الأكاديمية
 */
async function verifyCertificateNumber(certNum) {
  const cleanNum = certNum.trim().toUpperCase();
  try {
    const response = await fetch(`${ACADEMY_API_URL}/api/certificates/${encodeURIComponent(cleanNum)}`);
    if (response.ok) {
      const data = await response.json();
      if (data.exists && data.certificate) {
        const cert = data.certificate;
        return `✅ *تم التحقق بنجاح من صحة الشهادة* 🎓\n\n` +
               `👤 *اسم صاحب الشهادة*: ${cert.holderName}\n` +
               `🔢 *رقم التسجيل*: ${cert.certificateNumber}\n` +
               `🎯 *التخصص*: ${cert.specialty}\n` +
               `📅 *تاريخ الإصدار*: ${cert.issueDate}\n` +
               `🏢 *الجهة المصدرة*: أكاديمية الأفق - ماليزيا\n` +
               `🔗 *رابط الوثيقة الرسمي*: ${ACADEMY_API_URL}/verify/${cert.certificateNumber}\n\n` +
               `أرسل "0" أو "قائمة" للعودة إلى القائمة الرئيسية.`;
      }
    }
  } catch (err) {
    console.warn('[Verify API Warning] Could not reach academy API, falling back:', err.message);
  }

  return `❌ *لم يتم العثور على شهادة بهذا الرقم* (${cleanNum})\n\nيرجى التأكد من كتابة الرقم التسلسلي المطبوع على الشهادة بدقة، أو التواصل مع خدمة العملاء عبر الخيار (4).\n\nأرسل "0" للعودة للقائمة الرئيسية.`;
}

/**
 * معالجة نص الرسالة وتوليد الرد المناسب
 */
async function processIncomingMessage(senderNumber, messageText, senderName = 'عزيزنا العميل') {
  const normalizedText = (messageText || '').trim();
  const session = userSessions.get(senderNumber) || { state: 'IDLE' };

  // 1. إذا طلب العميل القائمة أو أرسل تحية
  const greetings = ['مرحبا', 'مرحباً', 'سلام', 'السلام عليكم', 'الو', 'هلا', 'hi', 'hello', 'start', 'قائمة', '0', 'menu'];
  if (greetings.includes(normalizedText.toLowerCase()) || session.state === 'IDLE') {
    userSessions.set(senderNumber, { state: 'MAIN_MENU' });
    return MESSAGES.welcome(senderName);
  }

  // 2. إذا كان العميل في مرحلة إدخال رقم الشهادة
  if (session.state === 'AWAITING_CERT_NUMBER') {
    userSessions.set(senderNumber, { state: 'MAIN_MENU' });
    return await verifyCertificateNumber(normalizedText);
  }

  // 3. التعامل مع خيارات القائمة الرئيسية
  switch (normalizedText) {
    case '1':
      userSessions.set(senderNumber, { state: 'MAIN_MENU' });
      return MESSAGES.option1_info;

    case '2':
      userSessions.set(senderNumber, { state: 'AWAITING_CERT_NUMBER' });
      return MESSAGES.option2_prompt;

    case '3':
      userSessions.set(senderNumber, { state: 'MAIN_MENU' });
      return MESSAGES.option3_specialties;

    case '4':
      userSessions.set(senderNumber, { state: 'SUPPORT_CONNECTED' });
      return MESSAGES.option4_human_support;

    default:
      // التحقق مما إذا كان النص المدخل يشبه صيغة رقم شهادة مباشرة
      if (/^(ALF|ALOFUK|\d{4,})/i.test(normalizedText)) {
        return await verifyCertificateNumber(normalizedText);
      }
      return MESSAGES.fallback;
  }
}

// ==========================================
// 4. إرسال الرسالة إلى WhatsApp Cloud API (Meta)
// ==========================================
async function sendWhatsAppMessage(to, messageText) {
  // إذا لم يتم توفير رمز Meta، نطبع الرسالة في الطرفية للاختبار والمحاكاة
  if (!WHATSAPP_TOKEN || WHATSAPP_TOKEN === 'YOUR_META_ACCESS_TOKEN') {
    console.log(`\n💬 [محاكاة الإرسال إلى ${to}]:\n${messageText}\n------------------------`);
    return { success: true, simulated: true };
  }

  const url = `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'text',
        text: { body: messageText }
      }),
    });

    const responseData = await res.json();
    if (!res.ok) {
      console.error('[WhatsApp API Error]:', responseData);
      return { success: false, error: responseData };
    }
    return { success: true, data: responseData };
  } catch (error) {
    console.error('[WhatsApp API Request Failed]:', error.message);
    return { success: false, error: error.message };
  }
}

// ==========================================
// 5. مسارات Webhook الخاصة بـ WhatsApp Business API
// ==========================================

// أ) مسار التحقق من Webhook من قبل فيسبوك / Meta
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ تم توثيق Webhook بنجاح مع سيرفرات Meta.');
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// ب) مسار استقبال الرسائل القادمة ومعالجتها
app.post('/webhook', async (req, res) => {
  try {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          const value = change.value;
          if (value && value.messages && value.messages.length > 0) {
            const incomingMsg = value.messages[0];
            const sender = incomingMsg.from;
            const senderName = value.contacts?.[0]?.profile?.name || 'عزيزنا العميل';
            
            // نأخذ النص سواء من رسالة نصية عادية أو زر تفاعلي
            let text = '';
            if (incomingMsg.type === 'text') {
              text = incomingMsg.text.body;
            } else if (incomingMsg.type === 'button') {
              text = incomingMsg.button.text;
            } else if (incomingMsg.type === 'interactive') {
              text = incomingMsg.interactive?.button_reply?.id || incomingMsg.interactive?.list_reply?.id || '';
            }

            console.log(`📩 رسالة واردة من [${sender} - ${senderName}]: "${text}"`);

            // معالجة الرسالة وتوليد الرد
            const replyText = await processIncomingMessage(sender, text, senderName);

            // إرسال الرد عبر واتساب
            await sendWhatsAppMessage(sender, replyText);
          }
        }
      }
      return res.status(200).send('EVENT_RECEIVED');
    }

    res.sendStatus(404);
  } catch (err) {
    console.error('Error handling webhook event:', err);
    res.status(500).send('Internal Server Error');
  }
});

// ==========================================
// 6. واجهة اختبار محلية وسريعة (Simulator Route)
// ==========================================
app.post('/test-chat', async (req, res) => {
  const { phone = '9647853331053', message = 'مرحبا', name = 'أحمد' } = req.body;
  const reply = await processIncomingMessage(phone, message, name);
  res.json({
    sender: phone,
    receivedMessage: message,
    botReply: reply
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'active', bot: 'Alofuk Academy WhatsApp Support Bot' });
});

// بدء تشغيل الخادم
app.listen(PORT, () => {
  console.log(`
🤖 ========================================================
   بوت واتساب لأكاديمية الأفق يعمل الآن بنجاح على المنفذ: ${PORT}
   Webhook URL: http://your-domain.com/webhook
   Verify Token: ${VERIFY_TOKEN}
   واجهة الاختبار السريع: POST http://localhost:${PORT}/test-chat
========================================================
  `);
});

export { processIncomingMessage, verifyCertificateNumber, sendWhatsAppMessage };
