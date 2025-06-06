# 🏛️ Lexora - نظام إدارة المكاتب القانونية

<div align="center">

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7.0-green.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Java](https://img.shields.io/badge/Java-11+-orange.svg)](https://www.oracle.com/java/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**نظام شامل لإدارة المكاتب القانونية مع واجهة حديثة وسهلة الاستخدام**

</div>

## 📋 نظرة عامة

Lexora هو تطبيق ويب متكامل مصمم لإدارة المكاتب القانونية بكفاءة عالية. يوفر النظام حلولاً شاملة لإدارة القضايا والعملاء والوثائق والمدفوعات.

### ✨ الميزات الرئيسية

- 📁 **إدارة القضايا**: تتبع شامل لجميع القضايا وحالاتها
- 👥 **إدارة العملاء**: قاعدة بيانات متكاملة للعملاء
- 📄 **إدارة الوثائق**: تخزين وتنظيم آمن للمستندات
- 💰 **إدارة المدفوعات**: نظام فواتير ومدفوعات متطور
- 📊 **لوحة التحكم**: تقارير وإحصائيات تفاعلية
- 🔐 **نظام المصادقة**: حماية متقدمة للبيانات

## 🏗️ البنية التقنية

### Backend (الخادم الخلفي)
- **إطار العمل**: Spring Boot 2.7.0
- **اللغة**: Java 11+
- **إدارة التبعيات**: Maven
- **قاعدة البيانات**: [تحديد نوع قاعدة البيانات]
- **الأمان**: Spring Security

### Frontend (الواجهة الأمامية)
- **إطار العمل**: React.js 18.2.0
- **التصميم**: Tailwind CSS
- **إدارة الحالة**: React Context API
- **التوجيه**: React Router
- **طلبات API**: Axios

## 📁 هيكل المشروع

```
lexora/
├── 📂 frontend/                    # الواجهة الأمامية (React)
│   ├── 📂 public/                 # الملفات الثابتة
│   ├── 📂 src/
│   │   ├── 📂 components/         # المكونات
│   │   │   ├── 📂 common/        # المكونات المشتركة
│   │   │   ├── 📂 features/      # مكونات الميزات
│   │   │   └── 📂 pages/         # صفحات التطبيق
│   │   ├── 📂 services/          # خدمات API
│   │   ├── 📄 App.js             # الملف الرئيسي
│   │   └── 📄 index.js           # نقطة الدخول
│   └── 📄 package.json           # تبعيات المشروع
│
├── 📂 src/                        # الخادم الخلفي (Spring Boot)
│   ├── 📂 main/
│   │   ├── 📂 java/              # الكود المصدري
│   │   │   └── 📂 com/version0/
│   │   └── 📂 resources/         # ملفات الإعدادات
│   └── 📂 test/                  # اختبارات الوحدة
│
├── 📄 pom.xml                    # إدارة تبعيات Maven
├── 📄 mvnw                       # Maven Wrapper (Linux/Mac)
├── 📄 mvnw.cmd                   # Maven Wrapper (Windows)
└── 📄 README.md                  # وثائق المشروع
```

## ⚙️ متطلبات النظام

### الخادم الخلفي (Backend)
| المتطلب | الإصدار المطلوب | الوصف |
|---------|-----------------|-------|
| ☕ Java JDK | 11+ | بيئة تطوير Java |
| 🔧 Maven | 3.6+ | أداة إدارة المشاريع |
| 🗄️ قاعدة البيانات | MySQL/PostgreSQL | قاعدة بيانات المشروع |

### الواجهة الأمامية (Frontend)
| المتطلب | الإصدار المطلوب | الوصف |
|---------|-----------------|-------|
| 🟢 Node.js | 16+ | بيئة تشغيل JavaScript |
| 📦 npm | 8+ | مدير الحزم |

### أدوات التطوير (اختيارية)
- 💻 **IDE**: IntelliJ IDEA / VS Code
- 🌐 **المتصفح**: Chrome / Firefox / Edge
- 📊 **أدوات قاعدة البيانات**: phpMyAdmin / pgAdmin

## 🚀 دليل التثبيت والتشغيل

### 📋 التحضير الأولي

1. **استنساخ المشروع**
   ```bash
   git clone [رابط المشروع]
   cd lexora
   ```

2. **التحقق من المتطلبات**
   ```bash
   # التحقق من Java
   java -version
   
   # التحقق من Maven
   mvn -version
   
   # التحقق من Node.js
   node -v
   npm -v
   ```

### 🖥️ تشغيل الخادم الخلفي (Backend)

1. **الانتقال إلى المجلد الرئيسي**
   ```bash
   cd lexora
   ```

2. **تثبيت التبعيات وبناء المشروع**
   ```bash
   mvn clean install
   ```

3. **تشغيل الخادم**
   ```bash
   mvn spring-boot:run
   ```
   
   أو باستخدام Maven Wrapper:
   ```bash
   # على Windows
   mvnw.cmd spring-boot:run
   
   # على Linux/Mac
   ./mvnw spring-boot:run
   ```

✅ **الخادم سيعمل على**: `http://localhost:8080`

### 💻 تشغيل الواجهة الأمامية (Frontend)

1. **الانتقال إلى مجلد Frontend**
   ```bash
   cd frontend
   ```

2. **تثبيت التبعيات**
   ```bash
   npm install
   ```

3. **تشغيل التطبيق**
   ```bash
   npm start
   ```

✅ **التطبيق سيعمل على**: `http://localhost:3000`

### 🔄 التشغيل الكامل (خطوات سريعة)

```bash
# تشغيل Backend (نافذة طرفية أولى)
cd lexora
mvn spring-boot:run

# تشغيل Frontend (نافذة طرفية ثانية)
cd frontend
npm install && npm start
```

## 🔗 ربط Frontend مع Backend

### إعدادات الاتصال

| المكون | الرابط | الوصف |
|--------|--------|-------|
| Backend API | `http://localhost:8080` | خادم Spring Boot |
| Frontend App | `http://localhost:3000` | تطبيق React |

### خطوات الإعداد

1. **تشغيل Backend أولاً** على المنفذ 8080
2. **تشغيل Frontend ثانياً** على المنفذ 3000
3. **التحقق من إعدادات CORS** في Backend
4. **اختبار الاتصال** من خلال المتصفح

### مثال على طلب API

```javascript
// في ملف services/api.js
import axios from 'axios';

// إعداد قاعدة البيانات
const API_BASE_URL = 'http://localhost:8080/api';

// إنشاء instance لـ axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// مثال على استدعاء API
export const getClients = async () => {
  try {
    const response = await apiClient.get('/clients');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب بيانات العملاء:', error);
    throw error;
  }
};

// مثال على إرسال بيانات
export const createClient = async (clientData) => {
  try {
    const response = await apiClient.post('/clients', clientData);
    return response.data;
  } catch (error) {
    console.error('خطأ في إنشاء عميل جديد:', error);
    throw error;
  }
};
```

### إعدادات CORS في Backend

```java
// في ملف config/CorsConfig.java
@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## ⚡ أوامر مفيدة

### Backend Commands
```bash
# تنظيف وبناء المشروع
mvn clean compile

# تشغيل الاختبارات
mvn test

# إنشاء ملف JAR
mvn package

# تشغيل المشروع مع إعدادات التطوير
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend Commands
```bash
# تثبيت التبعيات
npm install

# تشغيل في وضع التطوير
npm start

# بناء المشروع للإنتاج
npm run build

# اختبار التطبيق
npm test

# تحليل حجم البرنامج
npm run analyze
```

### إعدادات قاعدة البيانات
```properties
# في ملف application.properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/lexora_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

## 🛠️ نصائح التطوير

### للمطورين
- 📝 **استخدم التعليقات**: اكتب تعليقات واضحة باللغة العربية
- 🧪 **اختبر الكود**: تأكد من اختبار جميع الميزات قبل النشر
- 🔄 **استخدم Git**: احفظ تغييراتك بانتظام
- 📦 **إدارة التبعيات**: حافظ على التبعيات محدثة

### حل المشاكل الشائعة
1. **مشكلة CORS**: تأكد من إعدادات CORS في Backend
2. **منفذ مستخدم**: غيّر المنفذ في إعدادات التطبيق
3. **تبعيات مفقودة**: نفذ `mvn clean install` و `npm install`
4. **قاعدة البيانات**: تحقق من إعدادات الاتصال

## 📊 الواجهات المتوفرة

### صفحات النظام
- 🏠 **لوحة التحكم**: عرض شامل للإحصائيات
- ⚖️ **إدارة القضايا**: إضافة وتتبع القضايا
- 👥 **إدارة العملاء**: قاعدة بيانات العملاء
- 📄 **إدارة الوثائق**: تخزين وتنظيم المستندات
- 💰 **المدفوعات والفواتير**: نظام مالي متكامل
- 👤 **إدارة المستخدمين**: صلاحيات وأدوار
- ⚙️ **الإعدادات**: تخصيص النظام

### المكونات المشتركة
- 🔔 **الإشعارات**: تنبيهات فورية
- 📋 **جداول البيانات**: عرض منظم للمعلومات
- 🔍 **البحث والتصفية**: أدوات بحث متقدمة
- 📤 **رفع الملفات**: إدارة المرفقات

## 🆘 المساعدة والدعم

### خطوات حل المشاكل

#### ❌ مشاكل Backend
```bash
# التحقق من المنفذ المستخدم
netstat -ano | findstr :8080

# إعادة تشغيل الخادم
mvn spring-boot:stop
mvn spring-boot:run

# تنظيف وإعادة البناء
mvn clean install -U
```

#### ❌ مشاكل Frontend
```bash
# حذف node_modules وإعادة التثبيت
rm -rf node_modules package-lock.json
npm install

# تنظيف cache
npm cache clean --force

# تشغيل مع وضع المراقبة
npm start --verbose
```

#### ❌ مشاكل قاعدة البيانات
- تحقق من اتصال قاعدة البيانات
- تأكد من صحة معلومات المصادقة
- تحقق من إعدادات `application.properties`

### 📞 طلب المساعدة

إذا واجهتك مشاكل:

1. **تحقق من السجلات**: ابحث عن رسائل الخطأ في وحدة التحكم
2. **راجع الوثائق**: تأكد من اتباع جميع الخطوات
3. **تحقق من المتطلبات**: تأكد من تثبيت جميع المتطلبات
4. **أعد تشغيل النظام**: أحياناً يحل إعادة التشغيل المشكلة

### 📝 تقرير المشاكل

عند تقديم تقرير مشكلة، قدم:
- ✅ وصف المشكلة بالتفصيل
- ✅ الخطوات لإعادة إنتاج المشكلة
- ✅ رسائل الخطأ الكاملة
- ✅ معلومات النظام (OS، Java version، etc.)

## 🤝 المساهمة في المشروع

نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:

1. **Fork المشروع**
2. **إنشاء فرع جديد** (`git checkout -b feature/new-feature`)
3. **كتابة الكود** مع اتباع معايير المشروع
4. **اختبار التغييرات** بدقة
5. **Commit التغييرات** (`git commit -m 'إضافة ميزة جديدة'`)
6. **Push للفرع** (`git push origin feature/new-feature`)
7. **فتح Pull Request**

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## 📮 معلومات الاتصال

- **المطور**: [El elalem Youssef,Naji Fatima zahra]
- **البريد الإلكتروني**: [youssef.elalem-etu@univh2c.ma,fnaji0974@email.com]

---

<div align="center">
  <p>تم تطوير هذا المشروع بـ ❤️ باستخدام Spring Boot و React</p>
  <p><strong>© 2025 Lexora Project. جميع الحقوق محفوظة.</strong></p>
</div>