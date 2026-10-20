import rawDb from '../../data/database.json';

// In-memory / localStorage database for static deployments (GitHub Pages)
const STORAGE_KEY = 'alofuk_static_db';

function getLocalDb() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Could not read from localStorage', e);
  }
  return rawDb;
}

function saveLocalDb(data: any) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save to localStorage', e);
  }
}

export function initStaticApiFallback() {
  if (typeof window === 'undefined') return;

  try {
    const originalFetch = window.fetch ? window.fetch.bind(window) : null;
    if (!originalFetch) return;

    const customFetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
      const urlString = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

      // Only intercept /api/ routes
      if (urlString && urlString.includes('/api/')) {
        try {
          const res = await originalFetch(input, init);
          // If server exists and handles the route (status 200, 201, etc.), return it
          if (res.status !== 404) {
            return res;
          }
        } catch (err) {
          // Network error (e.g. running on GitHub Pages where backend server is absent)
        }

        // Handle with static embedded DB for GitHub Pages!
        const db = getLocalDb();
        const method = (init?.method || 'GET').toUpperCase();

        // 1. Public data
        if (urlString.includes('/api/public/data')) {
          return new Response(JSON.stringify({
            settings: db.settings,
            statistics: db.statistics,
            theme: db.theme,
            specialties: db.specialties,
            galleryImages: db.galleryImages || []
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // 2. Certificate verification
        if (urlString.includes('/api/certificates/verify/')) {
          const parts = urlString.split('/api/certificates/verify/');
          const query = decodeURIComponent(parts[1] || '').trim();

          // Master Code Check (71110203328)
          if (query === '71110203328' || query.toLowerCase() === 'master') {
            return new Response(JSON.stringify({
              found: true,
              isMasterCode: true,
              isMasterAdmin: true,
              total: (db.certificates || []).length,
              certificates: db.certificates || []
            }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          // Single Certificate Check
          const cert = (db.certificates || []).find((c: any) => 
            String(c.certificateNumber).trim().toLowerCase() === query.toLowerCase() ||
            String(c.studentName).trim().toLowerCase() === query.toLowerCase() ||
            String(c.englishName).trim().toLowerCase() === query.toLowerCase()
          );

          if (cert) {
            return new Response(JSON.stringify({
              found: true,
              certificate: cert
            }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          return new Response(JSON.stringify({
            found: false,
            error: 'الرقم المدخل غير مسجل في قاعدة البيانات الرسمية'
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // 3. Application submit
        if (urlString.includes('/api/applications') && method === 'POST') {
          try {
            const body = JSON.parse(String(init?.body || '{}'));
            const newApp = {
              id: 'app_' + Date.now(),
              ...body,
              status: 'قيد المراجعة',
              createdAt: new Date().toISOString()
            };
            db.applications = [newApp, ...(db.applications || [])];
            saveLocalDb(db);
            return new Response(JSON.stringify({ success: true, application: newApp }), {
              status: 201,
              headers: { 'Content-Type': 'application/json' }
            });
          } catch {
            return new Response(JSON.stringify({ error: 'بيانات غير صالحة' }), { status: 400 });
          }
        }

        // 4. Contact message submit
        if (urlString.includes('/api/contact') && method === 'POST') {
          return new Response(JSON.stringify({ success: true, message: 'تم إرسال رسالتك بنجاح' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // 5. Admin login
        if (urlString.includes('/api/admin/login') && method === 'POST') {
          try {
            const body = JSON.parse(String(init?.body || '{}'));
            if (body.username === 'admin' && body.password === 'horizon2026') {
              return new Response(JSON.stringify({
                success: true,
                token: 'static_admin_token_' + Date.now(),
                user: { username: 'admin', role: 'admin' }
              }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              });
            }
            return new Response(JSON.stringify({ error: 'بيانات الدخول غير صحيحة' }), { status: 401 });
          } catch {
            return new Response(JSON.stringify({ error: 'خطأ' }), { status: 400 });
          }
        }

        // 6. Admin dashboard data
        if (urlString.includes('/api/admin/dashboard')) {
          return new Response(JSON.stringify({
            certificates: db.certificates || [],
            applications: db.applications || [],
            specialties: db.specialties || [],
            settings: db.settings,
            statistics: db.statistics,
            theme: db.theme,
            galleryImages: db.galleryImages || []
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      return originalFetch(input, init);
    };

    try {
      (window as any).fetch = customFetch;
    } catch {
      try {
        Object.defineProperty(window, 'fetch', {
          value: customFetch,
          writable: true,
          configurable: true,
        });
      } catch {
        // In environments where window.fetch has only a getter, skip override gracefully
      }
    }
  } catch (e) {
    // Graceful fallback
  }
}
