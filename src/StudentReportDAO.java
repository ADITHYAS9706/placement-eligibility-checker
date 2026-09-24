import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class StudentReportDAO {

    public static void generateStudentReport(int studentId) {

        String studentSql =
                "SELECT id, name, cgpa, backlogs, branch, graduation_year " +
                "FROM students " +
                "WHERE id = ?";

        String resultSql =
                "SELECT c.company_name, er.result, er.reason " +
                "FROM eligibility_results er " +
                "JOIN companies c ON er.company_id = c.id " +
                "WHERE er.student_id = ? " +
                "ORDER BY c.company_name";

        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement studentStatement =
                        connection.prepareStatement(studentSql)
        ) {

            studentStatement.setInt(1, studentId);

            ResultSet studentRs =
                    studentStatement.executeQuery();

            if (!studentRs.next()) {

                System.out.println();
                System.out.println(
                        "Student not found."
                );

                return;
            }

            System.out.println();
            System.out.println(
                    "========================================"
            );

            System.out.println(
                    "        STUDENT PLACEMENT REPORT"
            );

            System.out.println(
                    "========================================"
            );

            System.out.println();

            System.out.println(
                    "Student ID       : "
                            + studentRs.getInt("id")
            );

            System.out.println(
                    "Name             : "
                            + studentRs.getString("name")
            );

            System.out.println(
                    "CGPA             : "
                            + studentRs.getDouble("cgpa")
            );

            System.out.println(
                    "Backlogs         : "
                            + studentRs.getInt("backlogs")
            );

            System.out.println(
                    "Branch           : "
                            + studentRs.getString("branch")
            );

            System.out.println(
                    "Graduation Year  : "
                            + studentRs.getInt("graduation_year")
            );


            System.out.println();
            System.out.println(
                    "----------------------------------------"
            );

            System.out.println(
                    "        COMPANY ELIGIBILITY"
            );

            System.out.println(
                    "----------------------------------------"
            );


            int companiesChecked = 0;
            int eligible = 0;
            int notEligible = 0;


            try (
                    PreparedStatement resultStatement =
                            connection.prepareStatement(
                                    resultSql
                            )
            ) {

                resultStatement.setInt(
                        1,
                        studentId
                );

                ResultSet resultRs =
                        resultStatement.executeQuery();


                boolean found = false;


                while (resultRs.next()) {

                    found = true;

                    companiesChecked++;


                    String companyName =
                            resultRs.getString(
                                    "company_name"
                            );

                    String result =
                            resultRs.getString(
                                    "result"
                            );

                    String reason =
                            resultRs.getString(
                                    "reason"
                            );


                    if ("Eligible".equalsIgnoreCase(
                            result)) {

                        eligible++;

                    } else {

                        notEligible++;
                    }


                    System.out.println();

                    System.out.println(
                            companyName
                                    + " : "
                                    + result
                    );

                    System.out.println(
                            "Reason : "
                                    + reason
                    );
                }


                if (!found) {

                    System.out.println();

                    System.out.println(
                            "No eligibility results found."
                    );
                }
            }


            double eligibilityRate = 0;


            if (companiesChecked > 0) {

                eligibilityRate =
                        (eligible * 100.0)
                                / companiesChecked;
            }


            System.out.println();

            System.out.println(
                    "----------------------------------------"
            );

            System.out.println(
                    "              SUMMARY"
            );

            System.out.println(
                    "----------------------------------------"
            );

            System.out.println(
                    "Companies Checked : "
                            + companiesChecked
            );

            System.out.println(
                    "Eligible          : "
                            + eligible
            );

            System.out.println(
                    "Not Eligible      : "
                            + notEligible
            );

            System.out.printf(
                    "Eligibility Rate  : %.2f%%%n",
                    eligibilityRate
            );


            System.out.println();

            System.out.println(
                    "========================================"
            );

            System.out.println(
                    "        END OF STUDENT REPORT"
            );

            System.out.println(
                    "========================================"
            );


        } catch (Exception e) {

            System.out.println();

            System.out.println(
                    "Failed to generate student report."
            );

            e.printStackTrace();
        }
    }
}