package com.version0.lexora.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * خدمة البريد الإلكتروني - تتعامل مع إرسال البريد الإلكتروني للمستخدمين
 * Email Service - Handles sending emails to users
 */
@Service
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username:noreply@lexora.com}")
    private String fromEmail;
    
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;
    
    /**
     * منشئ الخدمة - يتم حقن مُرسل البريد الإلكتروني
     * @param mailSender مُرسل البريد الإلكتروني المستخدم لإرسال رسائل البريد الإلكتروني
     */
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
      /**
     * إرسال رسالة بريد إلكتروني بسيطة
     * @param to عنوان البريد الإلكتروني للمستلم
     * @param subject موضوع البريد الإلكتروني
     * @param text نص البريد الإلكتروني
     */    public void sendSimpleMessage(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            
            System.out.println("Attempting to send email to: " + to);
            mailSender.send(message);
            System.out.println("Email sent successfully to: " + to);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + to + ": " + e.getMessage());
            e.printStackTrace(); // Print the full stack trace for better debugging
            
            // In development mode, we'll just log the email content instead of failing
            System.out.println("---------------------- EMAIL CONTENT FOR DEVELOPMENT ----------------------");
            System.out.println("TO: " + to);
            System.out.println("SUBJECT: " + subject);
            System.out.println("CONTENT:\n" + text);
            System.out.println("-------------------------------------------------------------------------");
            
            // DO NOT re-throw the exception in development mode
            // This allows the application to continue functioning even if email sending fails
            // For production, you would want to uncomment the following line:
            // throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }
    
    /**
     * إرسال بريد إلكتروني لإعادة تعيين كلمة المرور
     * @param to عنوان البريد الإلكتروني للمستلم
     * @param token رمز إعادة التعيين
     * @param nom اسم المستخدم
     */
    public void sendPasswordResetEmail(String to, String token, String nom) {
        String resetUrl = frontendUrl + "/reset-password/" + token;
        String subject = "إعادة تعيين كلمة المرور - نظام exoraL";
        String text = "مرحبًا " + nom + ",\n\n" +
                "لقد طلبت إعادة تعيين كلمة المرور الخاصة بك في نظام exoraL. \n\n" +
                "انقر على الرابط التالي لإعادة تعيين كلمة المرور: \n\n" + 
                resetUrl + "\n\n" +
                "هذا الرابط صالح لمدة 24 ساعة فقط. بعد ذلك، ستحتاج إلى طلب رابط جديد. \n\n" +
                "إذا لم تقم بطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني.\n\n" +
                "مع تحيات،\n" +
                "فريق الدعم الفني - نظام exoraL";
        
        sendSimpleMessage(to, subject, text);
    }
    
    /**
     * إرسال بريد إلكتروني ترحيبي لمستخدم جديد
     * @param to عنوان البريد الإلكتروني للمستلم
     * @param nom اسم المستخدم
     * @param password كلمة المرور الأولية (في حالة إنشاء حساب من قبل المشرف)
     */
    public void sendWelcomeEmail(String to, String nom, String password) {
        String loginUrl = frontendUrl + "/login";
        String subject = "مرحبًا بك في نظام exoraL لإدارة مكتب المحاماة";
        String text = "مرحبًا " + nom + ",\n\n" +
                "نرحب بك في نظام exoraL لإدارة مكتب المحاماة. \n\n" +
                "تم إنشاء حساب لك بالبيانات التالية: \n" +
                "البريد الإلكتروني: " + to + "\n" +
                "كلمة المرور الأولية: " + password + "\n\n" +
                "يرجى تسجيل الدخول باستخدام الرابط التالي وتغيير كلمة المرور الخاصة بك: \n" +
                loginUrl + "\n\n" +
                "مع تحيات،\n" +
                "فريق الدعم الفني - نظام exoraL";
        
        sendSimpleMessage(to, subject, text);
    }
    
    /**
     * إرسال بريد إلكتروني لتأكيد البريد الإلكتروني
     * @param to عنوان البريد الإلكتروني للمستلم
     * @param token رمز التحقق
     * @param nom اسم المستخدم
     */
    public void sendEmailVerificationEmail(String to, String token, String nom) {
        String verificationUrl = frontendUrl + "/verify-email?token=" + token;
        String subject = "تأكيد البريد الإلكتروني - نظام exoraL";
        String text = "مرحبًا " + nom + ",\n\n" +
                "شكرًا للتسجيل في نظام exoraL لإدارة مكتب المحاماة. \n\n" +
                "يرجى تأكيد عنوان بريدك الإلكتروني بالنقر على الرابط التالي: \n\n" + 
                verificationUrl + "\n\n" +
                "هذا الرابط صالح لمدة 24 ساعة فقط. بعد ذلك، ستحتاج إلى طلب رابط جديد. \n\n" +
                "إذا لم تقم بإنشاء حساب في نظامنا، يرجى تجاهل هذا البريد الإلكتروني.\n\n" +
                "مع تحيات،\n" +
                "فريق الدعم الفني - نظام exoraL";
        
        sendSimpleMessage(to, subject, text);
    }
}
