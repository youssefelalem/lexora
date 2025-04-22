# Lexora Project

هذا المشروع عبارة عن تطبيق ويب كامل يتكون من جزئين:
- Backend: مكتوب بلغة Java باستخدام Spring Boot
- Frontend: مكتوب باستخدام React.js

## هيكل المشروع

```
lexora/
├── frontend/                 # الجزء الأمامي (React)
│   ├── src/
│   │   ├── components/      # مكونات React
│   │   │   ├── common/     # المكونات المشتركة
│   │   │   ├── pages/      # صفحات التطبيق
│   │   │   └── features/   # مكونات الميزات
│   │   ├── App.js          # الملف الرئيسي للتطبيق
│   │   └── App.css         # الأنماط العامة
│   └── package.json        # تبعيات المشروع
│
└── src/                     # الجزء الخلفي (Spring Boot)
    ├── main/
    │   ├── java/          # الكود المصدري
    │   └── resources/     # ملفات الموارد
    └── pom.xml            # إدارة التبعيات
```

## متطلبات التشغيل

### Backend:
- Java JDK 11 أو أحدث
- Maven
- Spring Boot

### Frontend:
- Node.js (الإصدار 14 أو أحدث)
- npm

## كيفية تشغيل المشروع

### 1. تشغيل Backend
```bash
# الانتقال إلى المجلد الرئيسي
cd lexora

# تشغيل Backend
mvn spring-boot:run
```
سيتم تشغيل الخادم على المنفذ 8080

### 2. تشغيل Frontend
```bash
# الانتقال إلى مجلد Frontend
cd frontend

# تثبيت التبعيات
npm install

# تشغيل التطبيق
npm start
```
سيتم تشغيل التطبيق على المنفذ 3000

## ربط Frontend مع Backend

1. تأكد من أن Backend يعمل على المنفذ 8080
2. تأكد من أن Frontend يعمل على المنفذ 3000
3. في ملف `frontend/src/App.js`، يتم استخدام `BrowserRouter` للتعامل مع المسارات
4. يمكنك إضافة طلبات API في Frontend باستخدام axios:

```javascript
import axios from 'axios';

// مثال على طلب API
axios.get('http://localhost:8080/api/endpoint')
  .then(response => {
    // معالجة الاستجابة
  })
  .catch(error => {
    // معالجة الخطأ
  });
```

## نصائح مهمة

1. تأكد من تشغيل Backend قبل Frontend
2. إذا كنت تستخدم CORS، تأكد من تكوينه بشكل صحيح في Backend
3. يمكنك تغيير منفذ Backend في ملف `application.properties`
4. يمكنك تغيير منفذ Frontend في ملف `package.json`

## المساعدة والدعم

إذا واجهتك أي مشاكل:
1. تأكد من تثبيت جميع المتطلبات
2. تحقق من المنافذ المستخدمة
3. تأكد من أن جميع التبعيات مثبتة بشكل صحيح
4. تحقق من سجلات الخطأ في وحدة التحكم