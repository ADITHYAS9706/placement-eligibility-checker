import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class ResultDAO {

    public static void getResultsByStudentId(int studentId) {

        String sql = """
                SELECT 
                    c.company_name,
                    er.result,
                    er.reason,
                    er.checked_at
                FROM eligibility_results er
                JOIN companies c
                    ON er.company_id = c.id
                WHERE er.student_id = ?
                ORDER BY er.checked_at DESC
                """;

        try (
            Connection connection = DatabaseConnection.getConnection();
            PreparedStatement statement = connection.prepareStatement(sql)
        ) {

            statement.setInt(1, studentId);

            ResultSet rs = statement.executeQuery();

            System.out.println("\n===== PREVIOUS ELIGIBILITY RESULTS =====");

            boolean found = false;

            while (rs.next()) {

                found = true;

                System.out.println(
                    "Company: " + rs.getString("company_name")
                );

                System.out.println(
                    "Result: " + rs.getString("result")
                );

                System.out.println(
                    "Reason: " + rs.getString("reason")
                );

                System.out.println(
                    "Checked At: " + rs.getTimestamp("checked_at")
                );

                System.out.println("--------------------------------");
            }

            if (!found) {
                System.out.println("No results found for this student.");
            }

        } catch (Exception e) {

            System.out.println("Failed to load results.");
            e.printStackTrace();
        }
    }
}