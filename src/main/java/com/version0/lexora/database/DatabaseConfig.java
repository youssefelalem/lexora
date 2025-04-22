package com.version0.lexora.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConfig {
    private static final String DB_URL = "jdbc:mysql://127.0.0.1:3306/lexora";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "11032004";  // Updated password

    public static Connection getConnection() throws SQLException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            return DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
        } catch (ClassNotFoundException e) {
            throw new SQLException("MySQL JDBC Driver not found.", e);
        }
    }

    public static void initializeDatabase() {
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String createDbSQL = "CREATE DATABASE IF NOT EXISTS lexora";
            String useDbSQL = "USE lexora";
            String createTableSQL = "CREATE TABLE IF NOT EXISTS users ("
                + "id INT AUTO_INCREMENT PRIMARY KEY,"
                + "name VARCHAR(255) NOT NULL,"
                + "email VARCHAR(255) NOT NULL UNIQUE,"
                + "password VARCHAR(255) NOT NULL"
                + ")";

            conn.createStatement().execute(createDbSQL);
            conn.createStatement().execute(useDbSQL);
            conn.createStatement().execute(createTableSQL);
            
            System.out.println("Database and tables initialized successfully");
        } catch (SQLException e) {
            System.err.println("Error initializing database: " + e.getMessage());
            e.printStackTrace();
        }
    }
} 