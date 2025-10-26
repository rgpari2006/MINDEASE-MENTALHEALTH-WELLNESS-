import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

/**
 * Conceptual Java Class demonstrating how a backend service
 * would register a new user using JDBC and OOP principles.
 * * NOTE: This is a standalone class for demonstration. In a real
 * web application, this logic would be part of a server (like Spring Boot)
 * that exposes a REST API endpoint.
 */
public class UserRegistration {

    // Database configuration constants
    private static final String DB_URL = "jdbc:mysql://localhost:3306/mindease_db";
    private static final String DB_USER = "dbuser";
    private static final String DB_PASSWORD = "dbpassword";
    
    // SQL statement for inserting a new user
    private static final String INSERT_SQL = 
            "INSERT INTO users (email, password_hash) VALUES (?, ?)";

    /**
     * Attempts to establish a connection to the SQL database.
     * @return A database Connection object.
     * @throws SQLException if a database access error occurs.
     */
    private Connection getConnection() throws SQLException {
        // In a real application, you would load the JDBC driver here:
        // Class.forName("com.mysql.cj.jdbc.Driver");
        System.out.println("Attempting to connect to SQL database...");
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
    }

    /**
     * Registers a new user by saving their details to the SQL database.
     * This method encapsulates the core business logic of the service.
     * * @param email The user's email address.
     * @param password The user's raw password (should be hashed in production).
     * @return true if registration was successful, false otherwise.
     */
    public boolean registerNewUser(String email, String password) {
        // NOTE: In a production system, you MUST hash the password here (e.g., using BCrypt)
        // For this OOPS demonstration, we treat 'password' as the hashed value for simplicity.
        String passwordHash = password + "_hashed_mock"; 

        try (
            // 1. Establish connection (Resource management using try-with-resources)
            Connection conn = getConnection();
            
            // 2. Create PreparedStatement to prevent SQL Injection
            PreparedStatement pstmt = conn.prepareStatement(INSERT_SQL)
        ) {
            System.out.println("Connection successful. Preparing statement...");
            
            // 3. Set parameters for the SQL query
            pstmt.setString(1, email);
            pstmt.setString(2, passwordHash);
            
            // 4. Execute the update
            int affectedRows = pstmt.executeUpdate();
            
            if (affectedRows > 0) {
                System.out.println("SUCCESS: User '" + email + "' successfully inserted into SQL DB.");
                return true;
            } else {
                System.err.println("FAILURE: No rows affected. Registration failed for: " + email);
                return false;
            }

        } catch (SQLException e) {
            System.err.println("Database Error during registration: " + e.getMessage());
            e.printStackTrace();
            return false;
        } catch (Exception e) {
            System.err.println("General Error: " + e.getMessage());
            return false;
        }
    }

    /**
     * Main method to demonstrate the class functionality.
     */
    public static void main(String[] args) {
        UserRegistration service = new UserRegistration();
        System.out.println("--- Registering Test User 1 ---");
        // This call will fail in reality without a running DB, but demonstrates the OOP method call
        service.registerNewUser("test@example.com", "securePassword123"); 
        
        System.out.println("\n--- Registration Logic Demonstration Complete ---");
    }
}
