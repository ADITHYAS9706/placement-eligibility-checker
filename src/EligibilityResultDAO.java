import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class EligibilityResultDAO {

    // =====================================================
    // SAVE OR UPDATE ELIGIBILITY RESULT
    // =====================================================

    public static void saveResult(
            int studentId,
            int companyId,
            String result,
            String reason) {

        // First check whether a result already exists
        String checkSql =
                "SELECT id " +
                "FROM eligibility_results " +
                "WHERE student_id = ? " +
                "AND company_id = ? " +
                "LIMIT 1";

        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement checkStatement =
                        connection.prepareStatement(
                                checkSql
                        )
        ) {

            checkStatement.setInt(
                    1,
                    studentId
            );

            checkStatement.setInt(
                    2,
                    companyId
            );


            ResultSet rs =
                    checkStatement.executeQuery();


            // =================================================
            // RESULT ALREADY EXISTS -> UPDATE
            // =================================================

            if (rs.next()) {

                int resultId =
                        rs.getInt("id");


                updateResult(
                        resultId,
                        result,
                        reason
                );

            }

            // =================================================
            // RESULT DOES NOT EXIST -> INSERT
            // =================================================

            else {

                insertResult(
                        studentId,
                        companyId,
                        result,
                        reason
                );
            }


        } catch (Exception e) {

            System.out.println(
                    "Failed to save eligibility result."
            );

            e.printStackTrace();
        }
    }


    // =====================================================
    // INSERT NEW RESULT
    // =====================================================

    private static void insertResult(
            int studentId,
            int companyId,
            String result,
            String reason) {

        String sql =
                "INSERT INTO eligibility_results " +
                "(student_id, company_id, result, reason) " +
                "VALUES (?, ?, ?, ?)";


        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setInt(
                    1,
                    studentId
            );

            statement.setInt(
                    2,
                    companyId
            );

            statement.setString(
                    3,
                    result
            );

            statement.setString(
                    4,
                    reason
            );


            statement.executeUpdate();


            System.out.println(
                    "Eligibility result saved successfully!"
            );


        } catch (Exception e) {

            System.out.println(
                    "Failed to insert eligibility result."
            );

            e.printStackTrace();
        }
    }


    // =====================================================
    // UPDATE EXISTING RESULT
    // =====================================================

    private static void updateResult(
            int resultId,
            String result,
            String reason) {

        String sql =
                "UPDATE eligibility_results " +
                "SET result = ?, reason = ?, " +
                "checked_at = CURRENT_TIMESTAMP " +
                "WHERE id = ?";


        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setString(
                    1,
                    result
            );

            statement.setString(
                    2,
                    reason
            );

            statement.setInt(
                    3,
                    resultId
            );


            statement.executeUpdate();


            System.out.println(
                    "Eligibility result updated successfully!"
            );


        } catch (Exception e) {

            System.out.println(
                    "Failed to update eligibility result."
            );

            e.printStackTrace();
        }
    }
}