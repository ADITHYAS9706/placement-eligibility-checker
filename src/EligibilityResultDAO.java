import java.sql.Connection;
import java.sql.PreparedStatement;

public class EligibilityResultDAO {

    public static void saveResult(
            int studentId,
            int companyId,
            String result,
            String reason) {

        String sql = "INSERT INTO eligibility_results " +
                     "(student_id, company_id, result, reason) " +
                     "VALUES (?, ?, ?, ?)";

        try (
            Connection connection = DatabaseConnection.getConnection();
            PreparedStatement statement =
                    connection.prepareStatement(sql)
        ) {

            statement.setInt(1, studentId);
            statement.setInt(2, companyId);
            statement.setString(3, result);
            statement.setString(4, reason);

            statement.executeUpdate();

            System.out.println(
                "Eligibility result saved successfully!"
            );

        } catch (Exception e) {

            System.out.println(
                "Failed to save eligibility result."
            );

            e.printStackTrace();
        }
    }
}