package com.version0.lexora.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * خصائص التطبيق العامة
 * Configuration properties for application-wide settings
 */
@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    /**
     * إعدادات الواجهة الأمامية
     * Frontend configuration settings
     */
    private FrontendProperties frontend = new FrontendProperties();

    /**
     * إعدادات البريد الإلكتروني
     * Email configuration settings
     */
    private EmailProperties email = new EmailProperties();

    // Getters and Setters
    public FrontendProperties getFrontend() {
        return frontend;
    }

    public void setFrontend(FrontendProperties frontend) {
        this.frontend = frontend;
    }

    public EmailProperties getEmail() {
        return email;
    }

    public void setEmail(EmailProperties email) {
        this.email = email;
    }

    /**
     * خصائص الواجهة الأمامية
     * Frontend properties class
     */
    public static class FrontendProperties {
        /**
         * عنوان URL الأساسي للواجهة الأمامية
         * Base URL for the frontend application
         */
        private String url = "http://localhost:3000";

        /**
         * مسار صفحة إعادة تعيين كلمة المرور
         * Password reset page path
         */
        private String resetPasswordPath = "/reset-password";

        /**
         * مسار صفحة تأكيد البريد الإلكتروني
         * Email verification page path
         */
        private String verifyEmailPath = "/verify-email";

        // Getters and Setters
        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getResetPasswordPath() {
            return resetPasswordPath;
        }

        public void setResetPasswordPath(String resetPasswordPath) {
            this.resetPasswordPath = resetPasswordPath;
        }

        public String getVerifyEmailPath() {
            return verifyEmailPath;
        }

        public void setVerifyEmailPath(String verifyEmailPath) {
            this.verifyEmailPath = verifyEmailPath;
        }

        /**
         * الحصول على رابط إعادة تعيين كلمة المرور الكامل
         * Get the complete password reset URL
         */
        public String getResetPasswordUrl(String token) {
            return url + resetPasswordPath + "/" + token;
        }

        /**
         * الحصول على رابط تأكيد البريد الإلكتروني الكامل
         * Get the complete email verification URL
         */
        public String getVerifyEmailUrl(String token) {
            return url + verifyEmailPath + "/" + token;
        }
    }

    /**
     * خصائص البريد الإلكتروني
     * Email properties class
     */
    public static class EmailProperties {
        /**
         * اسم المرسل الافتراضي
         * Default sender name
         */
        private String fromName = "Lexora Legal System";

        /**
         * عنوان البريد الإلكتروني للمرسل
         * Sender email address
         */
        private String fromEmail = "noreply@lexora.com";

        /**
         * عنوان البريد الإلكتروني للدعم
         * Support email address
         */
        private String supportEmail = "support@lexora.com";

        // Getters and Setters
        public String getFromName() {
            return fromName;
        }

        public void setFromName(String fromName) {
            this.fromName = fromName;
        }

        public String getFromEmail() {
            return fromEmail;
        }

        public void setFromEmail(String fromEmail) {
            this.fromEmail = fromEmail;
        }

        public String getSupportEmail() {
            return supportEmail;
        }

        public void setSupportEmail(String supportEmail) {
            this.supportEmail = supportEmail;
        }
    }
}
