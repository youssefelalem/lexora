import React, { useState } from 'react';

// A reusable accordion component for FAQs
const AccordionItem = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-3 border border-gray-200 rounded-md">
      <button
        className="flex items-center justify-between w-full px-4 py-3 text-right bg-white hover:bg-gray-50 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-medium text-gray-900">{title}</span>
        <svg 
          className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 py-3 text-sm text-gray-600 border-t border-gray-200">{children}</div>
      )}
    </div>
  );
};

// Contact card component for various contact methods
const ContactCard = ({ icon, title, description, action, actionLabel }) => (
  <div className="p-5 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
    <div className="flex items-center mb-3">
      <div className="flex items-center justify-center w-10 h-10 mr-3 bg-blue-100 rounded-full">
        {icon}
      </div>
      <h3 className="font-medium text-gray-900">{title}</h3>
    </div>
    <p className="mb-4 text-sm text-gray-600">{description}</p>
    {action && (
      <a 
        href={action} 
        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100"
      >
        {actionLabel}
        <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </a>
    )}
  </div>
);

// Resource item component
const ResourceItem = ({ icon, title, description, link }) => (
  <div className="flex items-start p-4 transition-colors bg-white border border-gray-200 rounded-lg hover:border-blue-200">
    <div className="flex-shrink-0 p-2 mr-4 rounded-md bg-blue-50">
      {icon}
    </div>
    <div>
      <h3 className="mb-1 text-base font-medium text-gray-900">{title}</h3>
      <p className="mb-2 text-sm text-gray-600">{description}</p>
      {link && (
        <a 
          href={link} 
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
          target="_blank" 
          rel="noopener noreferrer"
        >
          استعرض المورد &rarr;
        </a>
      )}
    </div>
  </div>
);

const Support = () => {
  const [activeTab, setActiveTab] = useState('faq');

  // Icons
  const emailIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  );

  const phoneIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
  );

  const chatIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
    </svg>
  );

  const docIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
    </svg>
  );

  const videoIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
    </svg>
  );

  const trainingIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
    </svg>
  );

  return (
    <div className="max-w-5xl p-4 mx-auto bg-white rounded-lg shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">المساعدة والدعم</h1>
      
      {/* Tabs */}
      <div className="flex flex-wrap mb-6 border-b border-gray-200">
        <button 
          className={`mr-4 py-2 px-1 text-sm font-medium border-b-2 ${activeTab === 'faq' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('faq')}
        >
          الأسئلة الشائعة
        </button>
        <button 
          className={`mr-4 py-2 px-1 text-sm font-medium border-b-2 ${activeTab === 'contact' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('contact')}
        >
          تواصل معنا
        </button>
        <button 
          className={`mr-4 py-2 px-1 text-sm font-medium border-b-2 ${activeTab === 'resources' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('resources')}
        >
          موارد تعليمية
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="mt-6">
        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div>
            <p className="mb-6 text-gray-600">هنا يمكنك العثور على إجابات للأسئلة الشائعة حول استخدام النظام</p>
            
            <div className="mt-8">
              <AccordionItem title="كيف يمكنني إنشاء حساب جديد؟">
                <p>
                  لإنشاء حساب جديد، يرجى التواصل مع مسؤول النظام الخاص بك. سيقوم المسؤول بإنشاء حسابك وتزويدك بمعلومات تسجيل الدخول.
                  بعد ذلك، يمكنك استخدام بريدك الإلكتروني وكلمة المرور المؤقتة للدخول، وسيُطلب منك تغيير كلمة المرور عند أول تسجيل دخول.
                </p>
              </AccordionItem>
              
              <AccordionItem title="نسيت كلمة المرور الخاصة بي، كيف يمكنني إعادة تعيينها؟">
                <p>
                  إذا نسيت كلمة المرور الخاصة بك، يرجى اتباع الخطوات التالية:
                </p>
                <ol className="mt-2 mr-6 space-y-1 list-decimal">
                  <li>انقر على رابط "نسيت كلمة المرور" في صفحة تسجيل الدخول</li>
                  <li>أدخل بريدك الإلكتروني المسجل</li>
                  <li>ستتلقى رسالة بريد إلكتروني تحتوي على رابط لإعادة تعيين كلمة المرور</li>
                  <li>انقر على الرابط واتبع التعليمات لإنشاء كلمة مرور جديدة</li>
                </ol>
                <p className="mt-2">
                  إذا لم تتلق رسالة البريد الإلكتروني، يرجى التحقق من مجلد البريد العشوائي (Spam) أو التواصل مع الدعم الفني.
                </p>
              </AccordionItem>
              
              <AccordionItem title="كيف يمكنني إضافة قضية جديدة؟">
                <p>
                  لإضافة قضية جديدة، اتبع الخطوات التالية:
                </p>
                <ol className="mt-2 mr-6 space-y-1 list-decimal">
                  <li>انتقل إلى قسم "القضايا" من القائمة الجانبية</li>
                  <li>انقر على زر "إضافة قضية جديدة"</li>
                  <li>أكمل النموذج بإدخال جميع المعلومات المطلوبة (اسم القضية، العميل، التفاصيل، إلخ)</li>
                  <li>قم بتحميل أي مستندات ضرورية</li>
                  <li>انقر على "حفظ" لإنشاء القضية</li>
                </ol>
                <p className="mt-2">
                  بعد إنشاء القضية، يمكنك العودة إليها في أي وقت من قسم "جميع القضايا".
                </p>
              </AccordionItem>
              
              <AccordionItem title="كيف يمكنني تسجيل جلسة جديدة؟">
                <p>
                  لتسجيل جلسة جديدة مرتبطة بقضية:
                </p>
                <ol className="mt-2 mr-6 space-y-1 list-decimal">
                  <li>افتح القضية المطلوبة</li>
                  <li>انتقل إلى تبويب "الجلسات"</li>
                  <li>انقر على "إضافة جلسة جديدة"</li>
                  <li>أدخل تاريخ ووقت ومكان الجلسة</li>
                  <li>أضف أي ملاحظات أو تفاصيل إضافية</li>
                  <li>انقر على "حفظ" لتسجيل الجلسة</li>
                </ol>
                <p className="mt-2">
                  يمكنك أيضاً عرض جميع الجلسات المستقبلية في لوحة التحكم الرئيسية.
                </p>
              </AccordionItem>
              
              <AccordionItem title="كيف يمكنني إنشاء وإدارة الفواتير؟">
                <p>
                  لإنشاء فاتورة جديدة:
                </p>
                <ol className="mt-2 mr-6 space-y-1 list-decimal">
                  <li>انتقل إلى قسم "الفواتير" من القائمة</li>
                  <li>انقر على "إنشاء فاتورة جديدة"</li>
                  <li>حدد العميل والقضية المرتبطة (اختياري)</li>
                  <li>أضف بنود الفاتورة والمبالغ</li>
                  <li>حدد تاريخ الاستحقاق وطريقة الدفع</li>
                  <li>انقر على "إصدار الفاتورة"</li>
                </ol>
                <p className="mt-2">
                  يمكنك تتبع حالة الفواتير (مدفوعة، معلقة، متأخرة) من خلال لوحة إدارة الفواتير.
                </p>
              </AccordionItem>
            </div>
          </div>
        )}
        
        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div>
            <p className="mb-6 text-gray-600">لديك مشكلة أو استفسار؟ يمكنك التواصل معنا من خلال إحدى الطرق التالية:</p>
            
            <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
              <ContactCard 
                icon={emailIcon}
                title="البريد الإلكتروني"
                description="راسلنا على البريد الإلكتروني وسنقوم بالرد خلال يوم عمل واحد"
                action="mailto:support@lexora.com"
                actionLabel="إرسال بريد إلكتروني"
              />
              
              <ContactCard 
                icon={phoneIcon}
                title="الهاتف"
                description="اتصل بنا على الرقم التالي خلال ساعات العمل من 9:00 ص - 5:00 م"
                action="tel:+212522222222"
                actionLabel="+212522222222"
              />
              
              <ContactCard 
                icon={chatIcon}
                title="الدردشة المباشرة"
                description="تواصل مع فريق الدعم الفني مباشرة عبر الدردشة الفورية"
                action="#chat"
                actionLabel="بدء دردشة"
              />
            </div>
            
            <div className="mt-8">
              <h3 className="mb-4 text-lg font-medium text-gray-800">استمارة التواصل</h3>
              <form className="p-6 rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">الاسم</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="أدخل بريدك الإلكتروني"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700">الموضوع</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="موضوع الاستفسار"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700">الرسالة</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="اكتب رسالتك هنا..."
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    إرسال
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div>
            <p className="mb-6 text-gray-600">استكشف الموارد التعليمية المتاحة لمساعدتك على استخدام النظام بشكل أفضل:</p>
            
            <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
              <ResourceItem 
                icon={docIcon}
                title="دليل المستخدم"
                description="دليل شامل يشرح جميع ميزات النظام وكيفية استخدامها بالتفصيل"
                link="#user-guide"
              />
              
              <ResourceItem 
                icon={videoIcon}
                title="فيديوهات تعليمية"
                description="مجموعة من الفيديوهات القصيرة التي توضح كيفية استخدام ميزات النظام المختلفة"
                link="#video-tutorials"
              />
              
              <ResourceItem 
                icon={trainingIcon}
                title="جلسات تدريبية"
                description="سجل في جلسة تدريبية افتراضية مباشرة مع أحد خبراء النظام"
                link="#training-sessions"
              />
              
              <ResourceItem 
                icon={docIcon}
                title="الأسئلة الشائعة الموسعة"
                description="قائمة موسعة بالأسئلة الشائعة والمشكلات المعروفة وحلولها"
                link="#extended-faq"
              />
            </div>
            
            <div className="p-6 mt-10 rounded-lg bg-blue-50">
              <h3 className="mb-2 text-lg font-medium text-gray-800">هل تحتاج إلى تدريب مخصص؟</h3>
              <p className="mb-4 text-gray-600">
                يوفر فريقنا جلسات تدريبية مخصصة لمساعدتك أنت وفريقك على الاستفادة القصوى من النظام.
              </p>
              <button className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                طلب جلسة تدريبية
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;