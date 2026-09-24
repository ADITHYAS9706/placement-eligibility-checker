import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class EligibilityResultDAO {

    // =========================
    // SAVE / UPDATE RESULT
    // =========================

    public static void saveResult(
            int studentId,
            int companyId,
            String result,
            String reason) {

        String checkSql =
                "SELECT id " +
                "FROM eligibility_results " +
                "WHERE student_id = ? " +
                "AND company_id = ?";

        String updateSql =
                "UPDATE eligibility_results SET " +
                "result = ?, " +
                "reason = ?, " +
                "checked_at = CURRENT_TIMESTAMP " +
                "WHERE student_id = ? " +
                "AND company_id = ?";

        String insertSql =
                "INSERT INTO eligibility_results " +
                "(student_id, company_id, result, reason) " +
                "VALUES (?, ?, ?, ?)";

        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement checkStatement =
                        connection.prepareStatement(checkSql)
        ) {

            checkStatement.setInt(
                    1,
                    studentId
            );

            checkStatement.setInt(
                    2,
                    companyId
            );

            ResultSet resultSet =
                    checkStatement.executeQuery();


            // =========================
            // RESULT ALREADY EXISTS
            // =========================

            if (resultSet.next()) {

                try (
                        PreparedStatement updateStatement =
                                connection.prepareStatement(
                                        updateSql
                                )
                ) {

                    updateStatement.setString(
                            1,
                            result
                    );

                    updateStatement.setString(
                            2,
                            reason
                    );

                    updateStatement.setInt(
                            3,
                            studentId
                    );

                    updateStatement.setInt(
                            4,
                            companyId
                    );

                    updateStatement.executeUpdate();

                    System.out.println(
                            "Eligibility result updated successfully!"
                    );
                }


            } else {

                // =========================
                // NEW RESULT
                // =========================

                try (
                        PreparedStatement insertStatement =
                                connection.prepareStatement(
                                        insertSql
                                )
                ) {

                    insertStatement.setInt(
                            1,
                            studentId
                    );

                    insertStatement.setInt(
                            2,
                            companyId
                    );

                    insertStatement.setString(
                            3,
                            result
                    );

                    insertStatement.setString(
                            4,
                            reason
                    );

                    insertStatement.executeUpdate();

                    System.out.println(
                            "Eligibility result saved successfully!"
                    );
                }
            }

        } catch (Exception e) {

            System.out.println(
                    "Failed to save eligibility result."
            );

            e.printStackTrace();
        }
    }
}