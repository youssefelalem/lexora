# 🏛️ Lexora - نظام إدارة المكاتب القانونية

<div align="center">

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**نظام شامل لإدارة المكاتب القانونية والعمليات القانونية**

[المتطلبات](#متطلبات-التشغيل) • [التثبيت](#كيفية-تشغيل-المشروع) • [الميزات](#الميزات-الرئيسية) • [المساهمة](#المساهمة)

</div>

---

## 📋 نظرة عامة

**Lexora** هو نظام إدارة متكامل للمكاتب القانونية، مصمم لتسهيل إدارة القضايا والعملاء والوثائق والمواعيد. يتكون النظام من:

- **Backend**: مطور بـ Java و Spring Boot للحصول على أداء عالي وأمان قوي
- **Frontend**: مطور بـ React.js مع Tailwind CSS لواجهة مستخدم حديثة ومتجاوبة

## 🚀 الميزات الرئيسية

### 👥 إدارة العملاء
- إضافة وتعديل بيانات العملاء
- تصنيف العملاء حسب النوع (فرد، شركة، مؤسسة)
- عرض تاريخ شامل للعمليات

### ⚖️ إدارة القضايا
- تتبع حالة القضايا المختلفة
- إدارة أنواع القضايا (مدنية، جنائية، تجارية)
- جدولة الجلسات والمواعيد

### 📄 إدارة الوثائق
- رفع وتخزين الوثائق بأمان
- تصنيف الوثائق حسب النوع والقضية
- نظام بحث متقدم

### 💰 الإدارة المالية
- إدارة الفواتير والمدفوعات
- تتبع المصروفات
- تقارير مالية شاملة

### 👨‍💼 إدارة المستخدمين
- نظام أذونات متدرج
- إدارة أدوار المستخدمين
- أمان متقدم للبيانات

## 🏗️ هيكل المشروع

```
lexora/
├── 📁 frontend/                    # الواجهة الأمامية (React)
│   ├── 📁 src/
│   │   ├── 📁 components/          # مكونات React
│   │   │   ├── 📁 common/         # المكونات المشتركة
│   │   │   ├── 📁 pages/          # صفحات التطبيق
│   │   │   └── 📁 features/       # مكونات الميزات المتخصصة
│   │   ├── 📁 services/           # خدمات API
│   │   ├── 📄 App.js              # الملف الرئيسي
│   │   └── 📄 App.css             # الأنماط العامة
│   ├── 📄 package.json            # تبعيات المشروع
│   └── 📄 tailwind.config.js      # إعدادات Tailwind
│
├── 📁 src/                         # الخادم الخلفي (Spring Boot)
│   ├── 📁 main/java/              # الكود المصدري Java
│   ├── 📁 main/resources/         # ملفات الإعدادات
│   └── 📁 test/                   # اختبارات الوحدة
│
├── 📄 pom.xml                     # إدارة التبعيات Maven
├── 📄 class_diagram.puml          # مخطط الفئات
└── 📄 documentation.md            # الوثائق التفصيلية
```

## 🔧 متطلبات التشغيل

### للخادم الخلفي (Backend):
- ☕ **Java JDK 11** أو أحدث
- 📦 **Maven 3.6+**
- 🌱 **Spring Boot 2.7+**

### للواجهة الأمامية (Frontend):
- 🟢 **Node.js 14** أو أحدث
- 📦 **npm** أو **yarn**

## ⚡ كيفية تشغيل المشروع

### 1️⃣ تشغيل الخادم الخلفي

```bash
# الانتقال إلى المجلد الرئيسي
cd lexora

# تثبيت التبعيات وتشغيل الخادم
mvn clean install
mvn spring-boot:run
```

✅ **سيعمل الخادم على**: `http://localhost:8080`

### 2️⃣ تشغيل الواجهة الأمامية

```bash
# الانتقال إلى مجلد Frontend
cd frontend

# تثبيت التبعيات
npm install

# تشغيل التطبيق
npm start
```

✅ **ستعمل الواجهة على**: `http://localhost:3000`

## 🔗 ربط Frontend مع Backend

### إعداد API Client

```javascript
// في ملف services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// مثال على استخدام API
export const getClients = () => {
  return apiClient.get('/clients');
};

export const createCase = (caseData) => {
  return apiClient.post('/cases', caseData);
};
```

### إعداد CORS (في Backend)

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(true);
    }
}
```

## 🎨 التقنيات المستخدمة

### Backend
- **Spring Boot** - إطار العمل الرئيسي
- **Spring Security** - الأمان والمصادقة
- **Spring Data JPA** - طبقة الوصول للبيانات
- **MySQL/PostgreSQL** - قاعدة البيانات
- **Maven** - إدارة التبعيات

### Frontend
- **React.js** - مكتبة واجهة المستخدم
- **React Router** - إدارة التوجيه
- **Axios** - العميل HTTP
- **Tailwind CSS** - إطار عمل CSS
- **React Context** - إدارة الحالة

## 📱 لقطات الشاشة

### لوحة التحكم الرئيسية
![Dashboard](docs/images/dashboard.png)

### إدارة القضايا
![Cases Management](docs/images/cases.png)

### إدارة العملاء
![Clients Management](docs/images/clients.png)

## 🔧 الإعداد المتقدم

### تخصيص المنافذ

#### Backend (application.properties):
```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/lexora
spring.datasource.username=your_username
spring.datasource.password=your_password
```

#### Frontend (package.json):
```json
{
  "scripts": {
    "start": "set PORT=3000 && react-scripts start"
  }
}
```

## 🧪 تشغيل الاختبارات

### اختبارات Backend:
```bash
mvn test
```

### اختبارات Frontend:
```bash
cd frontend
npm test
```

## 🤝 المساهمة

نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:

1. **Fork** المشروع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/AmazingFeature`)
3. تأكيد التغييرات (`git commit -m 'إضافة ميزة رائعة'`)
4. دفع التغييرات (`git push origin feature/AmazingFeature`)
5. فتح **Pull Request**

## 📋 قائمة المهام

- [ ] إضافة نظام الإشعارات في الوقت الفعلي
- [ ] تطوير تطبيق الهاتف المحمول
- [ ] إضافة تقارير متقدمة
- [ ] دعم عدة لغات
- [ ] تحسين الأمان
- [ ] إضافة نظام النسخ الاحتياطي التلقائي

## 🐛 الإبلاغ عن المشاكل

إذا واجهتك أي مشاكل:

1. تأكد من تثبيت جميع المتطلبات بشكل صحيح
2. تحقق من أن المنافذ (3000 و 8080) غير مستخدمة
3. راجع سجلات الأخطاء في وحدة التحكم
4. أنشئ [Issue جديد](../../issues) مع وصف تفصيلي للمشكلة

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 👨‍💻 الفريق

- **المطور الرئيسي**: [اسمك]
- **البريد الإلكتروني**: [بريدك الإلكتروني]

---

<div align="center">

**⭐ إذا أعجبك المشروع، لا تنسَ إعطاؤه نجمة! ⭐**

Made with ❤️ for the legal community

</div>
