import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class CompanyDAO {

    // =========================
    // GET ALL COMPANIES
    // =========================

    public static List<Company> getAllCompanies() {

        List<Company> companies = new ArrayList<>();

        String sql =
            "SELECT id, company_name, min_cgpa, " +
            "max_backlogs, eligible_branch " +
            "FROM companies";

        try (
            Connection connection =
                DatabaseConnection.getConnection();

            PreparedStatement statement =
                connection.prepareStatement(sql);

            ResultSet resultSet =
                statement.executeQuery()
        ) {

            while (resultSet.next()) {

                Company company = new Company(
                    resultSet.getInt("id"),
                    resultSet.getString("company_name"),
                    resultSet.getDouble("min_cgpa"),
                    resultSet.getInt("max_backlogs"),
                    resultSet.getString("eligible_branch")
                );

                companies.add(company);
            }

        } catch (Exception e) {

            System.out.println(
                "Failed to load companies."
            );

            e.printStackTrace();
        }

        return companies;
    }


    // =========================
    // SAVE COMPANY
    // =========================

    public static void saveCompany(Company company) {

        String sql =
            "INSERT INTO companies " +
            "(company_name, min_cgpa, max_backlogs, eligible_branch) " +
            "VALUES (?, ?, ?, ?)";

        try (
            Connection connection =
                DatabaseConnection.getConnection();

            PreparedStatement statement =
                connection.prepareStatement(
                    sql,
                    java.sql.Statement.RETURN_GENERATED_KEYS
                )
        ) {

            statement.setString(
                1,
                company.getCompanyName()
            );

            statement.setDouble(
                2,
                company.getMinimumCgpa()
            );

            statement.setInt(
                3,
                company.getMaximumBacklogs()
            );

            statement.setString(
                4,
                company.getEligibleBranch()
            );

            statement.executeUpdate();

            ResultSet keys =
                statement.getGeneratedKeys();

            if (keys.next()) {

                System.out.println(
                    "Company saved successfully! ID: "
                    + keys.getInt(1)
                );

            } else {

                System.out.println(
                    "Company saved successfully!"
                );
            }

        } catch (Exception e) {

            System.out.println(
                "Failed to save company."
            );

            e.printStackTrace();
        }
    }
}