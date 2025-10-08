# إدارة الاستثمار السعبري | Al-Saabri Investment Management

## وصف المشروع
نظام إدارة الاستثمار السعبري هو تطبيق ويب شامل لإدارة الاستثمارات والمستثمرين. يوفر النظام واجهة سهلة الاستخدام لتتبع الاستثمارات، حساب الأرباح، وإدارة المعاملات المالية.

## المميزات الرئيسية

### 🏦 إدارة المستثمرين
- إضافة وتعديل بيانات المستثمرين
- تتبع تاريخ المستثمرين
- إنشاء بطاقات هوية للمستثمرين مع QR Code

### 💰 إدارة الاستثمارات
- تسجيل الاستثمارات الجديدة
- تتبع الاستثمارات النشطة والمغلقة
- حساب الأرباح الشهرية تلقائياً

### 📊 التحليلات والتقارير
- رسوم بيانية تفاعلية
- تقارير مالية شاملة
- تحليل الأداء والاتجاهات

### 🔔 نظام الإشعارات
- إشعارات الأرباح المستحقة
- تنبيهات العمليات
- إشعارات النظام

### ☁️ المزامنة السحابية
- نسخ احتياطي تلقائي مع Firebase
- مزامنة البيانات في الوقت الفعلي
- حماية البيانات

## التقنيات المستخدمة

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Firebase Realtime Database
- **UI Framework**: Custom CSS Grid & Flexbox
- **Charts**: Chart.js
- **Icons**: Font Awesome
- **QR Code**: QRCode.js

## متطلبات التشغيل

- متصفح ويب حديث (Chrome, Firefox, Safari, Edge)
- اتصال بالإنترنت للمزامنة السحابية
- Node.js (للتطوير)

## 🚀 طرق التثبيت والاستخدام

### 📱 التثبيت على الهاتف (PWA)
**الطريقة الأسهل والأسرع:**

1. افتح متصفح الهاتف (Chrome, Safari, Firefox)
2. اذهب إلى: **https://alsabariosama-create.github.io/Al-Saabri-Investment-/**
3. انتظر تحميل التطبيق كاملاً
4. ستظهر رسالة "تثبيت التطبيق" - اضغط عليها
5. التطبيق سيتم إضافته لشاشة الهاتف الرئيسية

**مميزات PWA:**
- ✅ يعمل بدون إنترنت
- ✅ إشعارات فورية  
- ✅ تحديثات تلقائية
- ✅ سرعة في التحميل

### 💻 التثبيت على الكمبيوتر (Desktop App)

#### تحميل مباشر (الأسهل):
اذهب إلى [صفحة الإصدارات](https://github.com/alsabariosama-create/Al-Saabri-Investment-/releases/latest) واختر:

- **Windows**: `إدارة-الاستثمار-السعبري-x64.exe`
- **macOS**: `إدارة-الاستثمار-السعبري-x64.dmg`  
- **Linux**: `إدارة-الاستثمار-السعبري-x64.AppImage`

#### البناء من المصدر:
```bash
# استنساخ المستودع
git clone https://github.com/alsabariosama-create/Al-Saabri-Investment-.git

# الانتقال إلى مجلد المشروع
cd Al-Saabri-Investment-

# تثبيت التبعيات
npm install

# تشغيل التطبيق (تطوير)
npm run dev

# بناء التطبيق
npm run build           # جميع المنصات
npm run build-win       # Windows فقط
npm run build-mac       # macOS فقط
npm run build-linux     # Linux فقط
npm start
```

## البنية الهيكلية

```
├── index.html              # الصفحة الرئيسية
├── style.css              # ملف الأنماط الرئيسي
├── app.js                 # منطق التطبيق الرئيسي
├── assets/                # الأصول (الصور والأيقونات)
├── firebase-*.js          # ملفات Firebase
├── analytics-*.js         # ملفات التحليلات
├── notification-*.js      # نظام الإشعارات
└── محفضة المستثمر/        # مجلد المحفظة
```

## الإعدادات

لإعداد Firebase:
1. قم بإنشاء مشروع Firebase جديد
2. أضف إعدادات Firebase في `index.html`
3. فعّل Realtime Database و Storage

## 📚 الروابط المفيدة

- **🔗 رابط التطبيق المباشر**: https://alsabariosama-create.github.io/Al-Saabri-Investment-/
- **📖 دليل التثبيت المفصل**: [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)
- **📝 دليل المستخدم**: [دليل_المستخدم.md](دليل_المستخدم.md)
- **⌨️ اختصارات لوحة المفاتيح**: [KEYBOARD_SHORTCUTS_GUIDE.md](KEYBOARD_SHORTCUTS_GUIDE.md)
- **🐛 الإبلاغ عن مشكلة**: [GitHub Issues](https://github.com/alsabariosama-create/Al-Saabri-Investment-/issues)

## المساهمة

نرحب بالمساهمات! يرجى:
1. عمل Fork للمستودع
2. إنشاء فرع للميزة الجديدة
3. إجراء التغييرات
4. إرسال Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT.

## التواصل

- **المطور**: أسامة السعبري
- **GitHub**: https://github.com/alsabariosama-create
- **المشروع**: https://github.com/alsabariosama-create/Al-Saabri-Investment-

## إصدارات التحديث

### v1.0.0
- الإصدار الأولي
- إدارة المستثمرين والاستثمارات
- نظام التقارير الأساسي
- المزامنة مع Firebase

---

<div dir="rtl">
<h2>🇮🇶 للمطورين العراقيين</h2>
<p>هذا المشروع مطور خصيصاً لتلبية احتياجات السوق العراقي في مجال إدارة الاستثمارات، مع دعم كامل للغة العربية والدينار العراقي.</p>
</div>
