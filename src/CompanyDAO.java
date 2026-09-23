import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class CompanyDAO {

    public static List<Company> getAllCompanies() {

        List<Company> companies = new ArrayList<>();

        String sql = "SELECT id, company_name, minimum_cgpa, " +
                     "maximum_backlogs, eligible_branch FROM companies";

        try (
            Connection connection = DatabaseConnection.getConnection();
            PreparedStatement statement = connection.prepareStatement(sql);
            ResultSet rs = statement.executeQuery()
        ) {

            while (rs.next()) {

                Company company = new Company(
                    rs.getInt("id"),
                    rs.getString("company_name"),
                    rs.getDouble("minimum_cgpa"),
                    rs.getInt("maximum_backlogs"),
                    rs.getString("eligible_branch")
                );

                companies.add(company);
            }

        } catch (Exception e) {

            System.out.println("Failed to load companies.");
            e.printStackTrace();
        }

        return companies;
    }
}