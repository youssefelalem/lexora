package com.version0.lexora.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * هذه الفئة تدير إعدادات الاتصال بقاعدة البيانات.
 * Cette classe gère la configuration et la connexion à la base de données.
 */
public class DatabaseConfig {
    // معلمات الاتصال بقاعدة البيانات (الرابط، المستخدم، كلمة المرور).
    // Paramètres de connexion à la base de données (URL, utilisateur, mot de passe).
    private static final String DB_URL = "jdbc:mysql://127.0.0.1:3306/lexora";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "11032004";  // Updated password

    /**
     * الحصول على اتصال بقاعدة البيانات.
     * Obtient une connexion à la base de données.
     * @return Connection object
     * @throws SQLException if a database access error occurs
     */
    public static Connection getConnection() throws SQLException {
        try {
            // تحميل مشغل JDBC لـ MySQL
            // Charger le pilote JDBC MySQL
            Class.forName("com.mysql.cj.jdbc.Driver");
            // إنشاء الاتصال
            // Établir la connexion
            return DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
        } catch (ClassNotFoundException e) {
            // إذا لم يتم العثور على المشغل
            // Si le pilote n'est pas trouvé
            throw new SQLException("MySQL JDBC Driver not found.", e);
        }
    }

    /**
     * تهيئة قاعدة البيانات عن طريق إنشاء قاعدة البيانات وجدول 'utilisateurs' إذا لم يكونا موجودين.
     * Initialise la base de données en créant la base de données et la table 'utilisateurs' si elles n'existent pas.
     */
    public static void initializeDatabase() {
        // Use try-with-resources for the connection
        // Utiliser try-with-resources pour la connexion
        // Construct the connection URL without the database name initially to create the DB
        // Construire l'URL de connexion sans le nom de la base de données initialement pour créer la BD
        String baseUrl = "jdbc:mysql://127.0.0.1:3306/";
        try (Connection conn = DriverManager.getConnection(baseUrl, DB_USER, DB_PASSWORD)) {
            // استعلام SQL لإنشاء قاعدة البيانات إذا لم تكن موجودة
            // Requête SQL pour créer la base de données si elle n'existe pas
            String createDbSQL = "CREATE DATABASE IF NOT EXISTS lexora";
            conn.createStatement().execute(createDbSQL);
            System.out.println("Database 'lexora' checked/created successfully.");
        } catch (SQLException e) {
            System.err.println("Error connecting to MySQL server or creating database: " + e.getMessage());
            e.printStackTrace();
            return; // Exit if database creation fails
        }

        // Now connect to the specific database to create the table
        // Maintenant, connectez-vous à la base de données spécifique pour créer la table
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            // استعلام SQL لإنشاء جدول المستخدمين إذا لم يكن موجودًا، مطابقًا لنموذج Utilisateur
            // Requête SQL pour créer la table des utilisateurs si elle n'existe pas, correspondant au modèle Utilisateur
            String createTableSQL = "CREATE TABLE IF NOT EXISTS utilisateurs (" // Changed table name to 'utilisateurs'
                + "idUtilisateur BIGINT AUTO_INCREMENT PRIMARY KEY," // Changed PK name and type
                + "type_utilisateur VARCHAR(31) NOT NULL," // Added discriminator column
                + "nom VARCHAR(255) NOT NULL," // Changed 'name' to 'nom'
                + "email VARCHAR(255) NOT NULL UNIQUE,"
                + "motDePasseHash VARCHAR(255) NOT NULL," // Changed 'password' to 'motDePasseHash'
                + "estActive BOOLEAN NOT NULL DEFAULT TRUE" // Added 'estActive' column, removed numeroBarreau
                + ")";

            // تنفيذ استعلام SQL لإنشاء الجدول
            // Exécuter la requête SQL pour créer la table
            conn.createStatement().execute(createTableSQL);

            // طباعة رسالة نجاح
            // Imprimer un message de succès
            System.out.println("Table 'utilisateurs' initialized successfully in database 'lexora'.");
        } catch (SQLException e) {
            // طباعة رسالة خطأ في حالة حدوث مشكلة
            // Imprimer un message d'erreur en cas de problème
            System.err.println("Error initializing table 'utilisateurs': " + e.getMessage());
            e.printStackTrace();
        }
    }
}