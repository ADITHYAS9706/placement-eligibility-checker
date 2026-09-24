import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.List;
import java.util.Scanner;

public class Main {

    // =====================================================
    // MAIN
    // =====================================================

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        while (true) {

            System.out.println();
            System.out.println("=================================");
            System.out.println("   PLACEMENT ELIGIBILITY CHECKER");
            System.out.println("=================================");

            System.out.println("1. Add Student");
            System.out.println("2. Check Eligibility");
            System.out.println("3. View Eligibility Results");
            System.out.println("4. View Companies");
            System.out.println("5. Add Company");
            System.out.println("6. Search Student");
            System.out.println("7. Update Student");
            System.out.println("8. Delete Student");
            System.out.println("9. Update Company");
            System.out.println("10. Delete Company");
            System.out.println("11. Dashboard");
            System.out.println("12. Company Placement Report");
            System.out.println("13. Student Placement Report");
            System.out.println("14. Exit");

            int choice = readInt(
                    sc,
                    "Enter your choice: "
            );

            switch (choice) {

                case 1:
                    addStudent(sc);
                    break;

                case 2:
                    checkEligibility(sc);
                    break;

                case 3:
                    viewResults(sc);
                    break;

                case 4:
                    viewCompanies();
                    break;

                case 5:
                    addCompany(sc);
                    break;

                case 6:
                    searchStudent(sc);
                    break;

                case 7:
                    updateStudent(sc);
                    break;

                case 8:
                    deleteStudent(sc);
                    break;

                case 9:
                    updateCompany(sc);
                    break;

                case 10:
                    deleteCompany(sc);
                    break;

                case 11:
                    showDashboard();
                    break;

                case 12:
                    companyPlacementReport(sc);
                    break;

                case 13:
                    studentPlacementReport(sc);
                    break;

                case 14:

                    System.out.println();
                    System.out.println(
                            "Thank you for using Placement Eligibility Checker!"
                    );

                    sc.close();
                    return;

                default:

                    System.out.println(
                            "Invalid choice. Please enter 1 to 14."
                    );
            }
        }
    }


    // =====================================================
    // ADD STUDENT
    // =====================================================

    public static void addStudent(Scanner sc) {

        System.out.println();
        System.out.println("===== ADD STUDENT =====");

        String name;

        while (true) {

            System.out.print("Enter your name: ");

            name = sc.nextLine().trim();

            if (!name.isEmpty()) {
                break;
            }

            System.out.println(
                    "Name cannot be empty."
            );
        }


        double cgpa;

        while (true) {

            cgpa = readDouble(
                    sc,
                    "Enter your CGPA (0 - 10): "
            );

            if (cgpa >= 0 && cgpa <= 10) {
                break;
            }

            System.out.println(
                    "Invalid CGPA. Enter a value between 0 and 10."
            );
        }


        int backlogs;

        while (true) {

            backlogs = readInt(
                    sc,
                    "Enter number of backlogs: "
            );

            if (backlogs >= 0) {
                break;
            }

            System.out.println(
                    "Backlogs cannot be negative."
            );
        }


        String branch;

        while (true) {

            System.out.print(
                    "Enter your branch: "
            );

            branch = sc.nextLine().trim();

            if (!branch.isEmpty()) {
                break;
            }

            System.out.println(
                    "Branch cannot be empty."
            );
        }


        int graduationYear;

        while (true) {

            graduationYear = readInt(
                    sc,
                    "Enter graduation year: "
            );

            if (graduationYear >= 2020 &&
                    graduationYear <= 2035) {

                break;
            }

            System.out.println(
                    "Please enter a valid graduation year between 2020 and 2035."
            );
        }


        Student student =
                new Student(
                        name,
                        cgpa,
                        backlogs,
                        branch,
                        graduationYear
                );

        StudentDAO.saveStudent(student);
    }


    // =====================================================
    // CHECK ELIGIBILITY
    // =====================================================

    public static void checkEligibility(Scanner sc) {

        System.out.println();
        System.out.println(
                "===== CHECK ELIGIBILITY ====="
        );

        int studentId = readInt(
                sc,
                "Enter Student ID: "
        );


        Student student =
                StudentDAO.getStudentById(studentId);


        if (student == null) {

            System.out.println(
                    "Student not found."
            );

            return;
        }


        System.out.println();
        System.out.println(
                "===== STUDENT DETAILS ====="
        );

        System.out.println(
                "Name: " + student.getName()
        );

        System.out.println(
                "CGPA: " + student.getCgpa()
        );

        System.out.println(
                "Backlogs: " + student.getBacklogs()
        );

        System.out.println(
                "Branch: " + student.getBranch()
        );

        System.out.println(
                "Graduation Year: "
                        + student.getGraduationYear()
        );


        List<Company> companies =
                CompanyDAO.getAllCompanies();


        if (companies == null ||
                companies.isEmpty()) {

            System.out.println(
                    "No companies found in database."
            );

            return;
        }


        EligibilityChecker checker =
                new EligibilityChecker();


        System.out.println();
        System.out.println(
                "===== ELIGIBILITY RESULTS ====="
        );


        for (Company company : companies) {

            String reason =
                    checker.getEligibilityReason(
                            student,
                            company
                    );


            String result;

            if (reason.equalsIgnoreCase(
                    "Eligible")) {

                result = "Eligible";

            } else {

                result = "Not Eligible";
            }


            System.out.println(
                    company.getCompanyName()
                            + " : "
                            + reason
            );


            saveOrUpdateEligibilityResult(
                    student.getId(),
                    company.getId(),
                    result,
                    reason
            );
        }
    }


    // =====================================================
    // SAVE OR UPDATE ELIGIBILITY RESULT
    // =====================================================

    public static void saveOrUpdateEligibilityResult(
            int studentId,
            int companyId,
            String result,
            String reason) {

        String sql =
                "INSERT INTO eligibility_results " +
                "(student_id, company_id, result, reason) " +
                "VALUES (?, ?, ?, ?) " +
                "ON DUPLICATE KEY UPDATE " +
                "result = VALUES(result), " +
                "reason = VALUES(reason), " +
                "checked_at = CURRENT_TIMESTAMP";


        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setInt(1, studentId);
            statement.setInt(2, companyId);
            statement.setString(3, result);
            statement.setString(4, reason);

            statement.executeUpdate();

        } catch (Exception e) {

            System.out.println(
                    "Failed to save eligibility result."
            );

            e.printStackTrace();
        }
    }


    // =====================================================
    // VIEW RESULTS
    // =====================================================

    public static void viewResults(Scanner sc) {

        System.out.println();
        System.out.println(
                "===== VIEW ELIGIBILITY RESULTS ====="
        );

        int studentId =
                readInt(
                        sc,
                        "Enter Student ID: "
                );

        ResultDAO.getResultsByStudentId(
                studentId
        );
    }


    // =====================================================
    // VIEW COMPANIES
    // =====================================================

    public static void viewCompanies() {

        System.out.println();
        System.out.println(
                "===== AVAILABLE COMPANIES ====="
        );


        List<Company> companies =
                CompanyDAO.getAllCompanies();


        if (companies == null ||
                companies.isEmpty()) {

            System.out.println(
                    "No companies found."
            );

            return;
        }


        for (Company company : companies) {

            System.out.println();

            System.out.println(
                    "ID: " + company.getId()
            );

            System.out.println(
                    "Company: "
                            + company.getCompanyName()
            );

            System.out.println(
                    "Minimum CGPA: "
                            + company.getMinimumCgpa()
            );

            System.out.println(
                    "Maximum Backlogs: "
                            + company.getMaximumBacklogs()
            );

            System.out.println(
                    "Eligible Branches: "
                            + company.getEligibleBranch()
            );

            System.out.println(
                    "--------------------------------"
            );
        }
    }


    // =====================================================
    // ADD COMPANY
    // =====================================================

    public static void addCompany(Scanner sc) {

        System.out.println();
        System.out.println(
                "===== ADD COMPANY ====="
        );


        String companyName;

        while (true) {

            System.out.print(
                    "Enter company name: "
            );

            companyName =
                    sc.nextLine().trim();


            if (!companyName.isEmpty()) {
                break;
            }

            System.out.println(
                    "Company name cannot be empty."
            );
        }


        double minimumCgpa;

        while (true) {

            minimumCgpa =
                    readDouble(
                            sc,
                            "Enter minimum CGPA (0 - 10): "
                    );


            if (minimumCgpa >= 0 &&
                    minimumCgpa <= 10) {

                break;
            }

            System.out.println(
                    "CGPA must be between 0 and 10."
            );
        }


        int maximumBacklogs;

        while (true) {

            maximumBacklogs =
                    readInt(
                            sc,
                            "Enter maximum allowed backlogs: "
                    );


            if (maximumBacklogs >= 0) {
                break;
            }

            System.out.println(
                    "Backlogs cannot be negative."
            );
        }


        String eligibleBranch;

        while (true) {

            System.out.print(
                    "Enter eligible branches: "
            );

            eligibleBranch =
                    sc.nextLine().trim();


            if (!eligibleBranch.isEmpty()) {
                break;
            }

            System.out.println(
                    "Eligible branches cannot be empty."
            );
        }


        Company company =
                new Company(
                        0,
                        companyName,
                        minimumCgpa,
                        maximumBacklogs,
                        eligibleBranch
                );


        CompanyDAO.saveCompany(company);
    }


    // =====================================================
    // SEARCH STUDENT
    // =====================================================

    public static void searchStudent(
            Scanner sc) {

        System.out.println();
        System.out.println(
                "===== SEARCH STUDENT ====="
        );


        System.out.print(
                "Enter student name: "
        );


        String name =
                sc.nextLine().trim();


        if (name.isEmpty()) {

            System.out.println(
                    "Search name cannot be empty."
            );

            return;
        }


        StudentDAO.searchStudentsByName(
                name
        );
    }


    // =====================================================
    // UPDATE STUDENT
    // =====================================================

    public static void updateStudent(
            Scanner sc) {

        System.out.println();
        System.out.println(
                "===== UPDATE STUDENT ====="
        );


        int studentId =
                readInt(
                        sc,
                        "Enter Student ID: "
                );


        Student student =
                StudentDAO.getStudentById(
                        studentId
                );


        if (student == null) {

            System.out.println(
                    "Student not found."
            );

            return;
        }


        System.out.println();
        System.out.println(
                "===== CURRENT DETAILS ====="
        );

        System.out.println(
                "Name: " + student.getName()
        );

        System.out.println(
                "CGPA: " + student.getCgpa()
        );

        System.out.println(
                "Backlogs: " + student.getBacklogs()
        );

        System.out.println(
                "Branch: " + student.getBranch()
        );

        System.out.println(
                "Graduation Year: "
                        + student.getGraduationYear()
        );


        System.out.println();

        System.out.print(
                "Enter new name: "
        );


        String name =
                sc.nextLine().trim();


        if (name.isEmpty()) {

            System.out.println(
                    "Name cannot be empty."
            );

            return;
        }


        double cgpa;

        while (true) {

            cgpa =
                    readDouble(
                            sc,
                            "Enter new CGPA (0 - 10): "
                    );


            if (cgpa >= 0 &&
                    cgpa <= 10) {

                break;
            }

            System.out.println(
                    "CGPA must be between 0 and 10."
            );
        }


        int backlogs;

        while (true) {

            backlogs =
                    readInt(
                            sc,
                            "Enter new number of backlogs: "
                    );


            if (backlogs >= 0) {
                break;
            }

            System.out.println(
                    "Backlogs cannot be negative."
            );
        }


        System.out.print(
                "Enter new branch: "
        );


        String branch =
                sc.nextLine().trim();


        if (branch.isEmpty()) {

            System.out.println(
                    "Branch cannot be empty."
            );

            return;
        }


        int graduationYear;

        while (true) {

            graduationYear =
                    readInt(
                            sc,
                            "Enter new graduation year: "
                    );


            if (graduationYear >= 2020 &&
                    graduationYear <= 2035) {

                break;
            }

            System.out.println(
                    "Please enter a valid graduation year."
            );
        }


        Student updatedStudent =
                new Student(
                        studentId,
                        name,
                        cgpa,
                        backlogs,
                        branch,
                        graduationYear
                );


        StudentDAO.updateStudent(
                updatedStudent
        );
    }


    // =====================================================
    // DELETE STUDENT
    // =====================================================

    public static void deleteStudent(
            Scanner sc) {

        System.out.println();
        System.out.println(
                "===== DELETE STUDENT ====="
        );


        int studentId =
                readInt(
                        sc,
                        "Enter Student ID: "
                );


        Student student =
                StudentDAO.getStudentById(
                        studentId
                );


        if (student == null) {

            System.out.println(
                    "Student not found."
            );

            return;
        }


        System.out.println();

        System.out.println(
                "Student ID: "
                        + student.getId()
        );

        System.out.println(
                "Student Name: "
                        + student.getName()
        );


        System.out.print(
                "Are you sure you want to delete this student? (yes/no): "
        );


        String confirmation =
                sc.nextLine().trim();


        if (confirmation.equalsIgnoreCase(
                "yes")) {

            StudentDAO.deleteStudent(
                    studentId
            );

        } else {

            System.out.println(
                    "Delete operation cancelled."
            );
        }
    }


    // =====================================================
    // UPDATE COMPANY
    // =====================================================

    public static void updateCompany(
            Scanner sc) {

        System.out.println();
        System.out.println(
                "===== UPDATE COMPANY ====="
        );


        int companyId =
                readInt(
                        sc,
                        "Enter Company ID: "
                );


        List<Company> companies =
                CompanyDAO.getAllCompanies();


        Company existingCompany = null;


        for (Company company : companies) {

            if (company.getId() ==
                    companyId) {

                existingCompany = company;
                break;
            }
        }


        if (existingCompany == null) {

            System.out.println(
                    "Company not found."
            );

            return;
        }


        System.out.println();
        System.out.println(
                "===== CURRENT COMPANY DETAILS ====="
        );

        System.out.println(
                "Company Name: "
                        + existingCompany.getCompanyName()
        );

        System.out.println(
                "Minimum CGPA: "
                        + existingCompany.getMinimumCgpa()
        );

        System.out.println(
                "Maximum Backlogs: "
                        + existingCompany.getMaximumBacklogs()
        );

        System.out.println(
                "Eligible Branches: "
                        + existingCompany.getEligibleBranch()
        );


        System.out.println();
        System.out.println(
                "===== ENTER NEW DETAILS ====="
        );


        String companyName;

        while (true) {

            System.out.print(
                    "Enter company name: "
            );

            companyName =
                    sc.nextLine().trim();


            if (!companyName.isEmpty()) {
                break;
            }

            System.out.println(
                    "Company name cannot be empty."
            );
        }


        double minimumCgpa;

        while (true) {

            minimumCgpa =
                    readDouble(
                            sc,
                            "Enter minimum CGPA (0 - 10): "
                    );


            if (minimumCgpa >= 0 &&
                    minimumCgpa <= 10) {

                break;
            }

            System.out.println(
                    "CGPA must be between 0 and 10."
            );
        }


        int maximumBacklogs;

        while (true) {

            maximumBacklogs =
                    readInt(
                            sc,
                            "Enter maximum allowed backlogs: "
                    );


            if (maximumBacklogs >= 0) {
                break;
            }

            System.out.println(
                    "Backlogs cannot be negative."
            );
        }


        String eligibleBranch;

        while (true) {

            System.out.print(
                    "Enter eligible branches: "
            );

            eligibleBranch =
                    sc.nextLine().trim();


            if (!eligibleBranch.isEmpty()) {
                break;
            }

            System.out.println(
                    "Eligible branches cannot be empty."
            );
        }


        Company updatedCompany =
                new Company(
                        companyId,
                        companyName,
                        minimumCgpa,
                        maximumBacklogs,
                        eligibleBranch
                );


        CompanyDAO.updateCompany(
                updatedCompany
        );
    }


    // =====================================================
    // DELETE COMPANY
    // =====================================================

    public static void deleteCompany(
            Scanner sc) {

        System.out.println();
        System.out.println(
                "===== DELETE COMPANY ====="
        );


        int companyId =
                readInt(
                        sc,
                        "Enter Company ID: "
                );


        List<Company> companies =
                CompanyDAO.getAllCompanies();


        Company companyToDelete = null;


        for (Company company : companies) {

            if (company.getId() ==
                    companyId) {

                companyToDelete = company;
                break;
            }
        }


        if (companyToDelete == null) {

            System.out.println(
                    "Company not found."
            );

            return;
        }


        System.out.println();

        System.out.println(
                "Company ID: "
                        + companyToDelete.getId()
        );

        System.out.println(
                "Company Name: "
                        + companyToDelete.getCompanyName()
        );


        System.out.print(
                "Are you sure you want to delete this company? (yes/no): "
        );


        String confirmation =
                sc.nextLine().trim();


        if (confirmation.equalsIgnoreCase(
                "yes")) {

            CompanyDAO.deleteCompany(
                    companyId
            );

        } else {

            System.out.println(
                    "Delete operation cancelled."
            );
        }
    }


    // =====================================================
    // DASHBOARD
    // =====================================================

    public static void showDashboard() {

        System.out.println();

        System.out.println(
                "================================="
        );

        System.out.println(
                "       PLACEMENT DASHBOARD"
        );

        System.out.println(
                "================================="
        );


        int totalStudents = 0;
        int totalCompanies = 0;
        int totalChecks = 0;
        int eligibleChecks = 0;
        int notEligibleChecks = 0;
        int studentsWithEligibility = 0;
        int studentsEligibleForAll = 0;


        String studentSql =
                "SELECT COUNT(*) FROM students";


        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(
                                studentSql
                        );

                ResultSet rs =
                        statement.executeQuery()
        ) {

            if (rs.next()) {

                totalStudents =
                        rs.getInt(1);
            }

        } catch (Exception e) {

            System.out.println(
                    "Unable to calculate student count."
            );
        }


        String companySql =
                "SELECT COUNT(*) FROM companies";


        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(
                                companySql
                        );

                ResultSet rs =
                        statement.executeQuery()
        ) {

            if (rs.next()) {

                totalCompanies =
                        rs.getInt(1);
            }

        } catch (Exception e) {

            System.out.println(
                    "Unable to calculate company count."
            );
        }


        String totalCheckSql =
                "SELECT COUNT(*) FROM eligibility_results";


        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(
                                totalCheckSql
                        );

                ResultSet rs =
                        statement.executeQuery()
        ) {

            if (rs.next()) {

                totalChecks =
                        rs.getInt(1);
            }

        } catch (Exception e) {

            System.out.println(
                    "Unable to calculate total checks."
            );
        }


        String eligibleSql =
                "SELECT COUNT(*) " +
                "FROM eligibility_results " +
                "WHERE result = 'Eligible'";


        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(
                                eligibleSql
                        );

                ResultSet rs =
                        statement.executeQuery()
        ) {

            if (rs.next()) {

                eligibleChecks =
                        rs.getInt(1);
            }

        } catch (Exception e) {

            System.out.println(
                    "Unable to calculate eligible checks."
            );
        }


        String notEligibleSql =
                "SELECT COUNT(*) " +
                "FROM eligibility_results " +
                "WHERE result = 'Not Eligible'";


        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(
                                notEligibleSql
                        );

                ResultSet rs =
                        statement.executeQuery()
        ) {

            if (rs.next()) {

                notEligibleChecks =
                        rs.getInt(1);
            }

        } catch (Exception e) {

            System.out.println(
                    "Unable to calculate not eligible checks."
            );
        }


        String studentsEligibleSql =
                "SELECT COUNT(DISTINCT student_id) " +
                "FROM eligibility_results " +
                "WHERE result = 'Eligible'";


        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(
                                studentsEligibleSql
                        );

                ResultSet rs =
                        statement.executeQuery()
        ) {

            if (rs.next()) {

                studentsWithEligibility =
                        rs.getInt(1);
            }

        } catch (Exception e) {

            System.out.println(
                    "Unable to calculate eligible students."
            );
        }


        if (totalCompanies > 0) {

            String allCompaniesSql =
                    "SELECT COUNT(*) FROM (" +
                    "SELECT student_id " +
                    "FROM eligibility_results " +
                    "WHERE result = 'Eligible' " +
                    "GROUP BY student_id " +
                    "HAVING COUNT(DISTINCT company_id) = ?" +
                    ") AS eligible_students";


            try (
                    Connection connection =
                            DatabaseConnection.getConnection();

                    PreparedStatement statement =
                            connection.prepareStatement(
                                    allCompaniesSql
                            )
            ) {

                statement.setInt(
                        1,
                        totalCompanies
                );


                ResultSet rs =
                        statement.executeQuery();


                if (rs.next()) {

                    studentsEligibleForAll =
                            rs.getInt(1);
                }

            } catch (Exception e) {

                System.out.println(
                        "Unable to calculate students eligible for all companies."
                );
            }
        }


        double eligibilityRate = 0;


        if (totalChecks > 0) {

            eligibilityRate =
                    (eligibleChecks * 100.0)
                            / totalChecks;
        }


        System.out.println();

        System.out.println(
                "Total Students              : "
                        + totalStudents
        );

        System.out.println(
                "Total Companies             : "
                        + totalCompanies
        );

        System.out.println(
                "Total Eligibility Checks    : "
                        + totalChecks
        );

        System.out.println(
                "Eligible Checks             : "
                        + eligibleChecks
        );

        System.out.println(
                "Not Eligible Checks         : "
                        + notEligibleChecks
        );

        System.out.println(
                "Students Eligible for At Least One Company : "
                        + studentsWithEligibility
        );

        System.out.println(
                "Students Eligible for All Companies       : "
                        + studentsEligibleForAll
        );

        System.out.printf(
                "Eligibility Rate            : %.2f%%%n",
                eligibilityRate
        );


        System.out.println(
                "\n================================="
        );
    }


    // =====================================================
    // COMPANY PLACEMENT REPORT
    // =====================================================

    public static void companyPlacementReport(
            Scanner sc) {

        System.out.println();
        System.out.println(
                "===== COMPANY PLACEMENT REPORT ====="
        );


        List<Company> companies =
                CompanyDAO.getAllCompanies();


        if (companies == null ||
                companies.isEmpty()) {

            System.out.println(
                    "No companies found."
            );

            return;
        }


        System.out.println();
        System.out.println(
                "Available Companies:"
        );


        for (Company company : companies) {

            System.out.println(
                    company.getId()
                            + ". "
                            + company.getCompanyName()
            );
        }


        int companyId =
                readInt(
                        sc,
                        "\nEnter Company ID: "
                );


        Company selectedCompany = null;


        for (Company company : companies) {

            if (company.getId() ==
                    companyId) {

                selectedCompany = company;
                break;
            }
        }


        if (selectedCompany == null) {

            System.out.println(
                    "Company not found."
            );

            return;
        }


        String sql =
                "SELECT " +
                "s.id, " +
                "s.name, " +
                "s.cgpa, " +
                "s.backlogs, " +
                "s.branch, " +
                "s.graduation_year, " +
                "er.result, " +
                "er.reason " +
                "FROM eligibility_results er " +
                "JOIN students s " +
                "ON er.student_id = s.id " +
                "WHERE er.company_id = ? " +
                "ORDER BY er.result DESC, s.name";


        int total = 0;
        int eligible = 0;
        int notEligible = 0;


        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setInt(
                    1,
                    companyId
            );


            ResultSet rs =
                    statement.executeQuery();


            while (rs.next()) {

                total++;

                String result =
                        rs.getString("result");


                if ("Eligible".equalsIgnoreCase(
                        result)) {

                    eligible++;

                } else {

                    notEligible++;
                }
            }


            System.out.println();

            System.out.println(
                    "================================="
            );

            System.out.println(
                    "COMPANY: "
                            + selectedCompany.getCompanyName()
            );

            System.out.println(
                    "================================="
            );


            if (total == 0) {

                System.out.println(
                        "No eligibility results found for this company."
                );

                return;
            }


            double rate =
                    (eligible * 100.0) / total;


            System.out.println();

            System.out.println(
                    "Total Students Checked : "
                            + total
            );

            System.out.println(
                    "Eligible                : "
                            + eligible
            );

            System.out.println(
                    "Not Eligible            : "
                            + notEligible
            );

            System.out.printf(
                    "Eligibility Rate        : %.2f%%%n",
                    rate
            );


            System.out.println();
            System.out.println(
                    "===== STUDENT DETAILS ====="
            );


            try (
                    PreparedStatement detailStatement =
                            connection.prepareStatement(sql)
            ) {

                detailStatement.setInt(
                        1,
                        companyId
                );


                ResultSet detailRs =
                        detailStatement.executeQuery();


                while (detailRs.next()) {

                    System.out.println();

                    System.out.println(
                            "Student ID: "
                                    + detailRs.getInt("id")
                    );

                    System.out.println(
                            "Name: "
                                    + detailRs.getString("name")
                    );

                    System.out.println(
                            "CGPA: "
                                    + detailRs.getDouble("cgpa")
                    );

                    System.out.println(
                            "Backlogs: "
                                    + detailRs.getInt("backlogs")
                    );

                    System.out.println(
                            "Branch: "
                                    + detailRs.getString("branch")
                    );

                    System.out.println(
                            "Graduation Year: "
                                    + detailRs.getInt(
                                            "graduation_year"
                                    )
                    );

                    System.out.println(
                            "Result: "
                                    + detailRs.getString("result")
                    );

                    System.out.println(
                            "Reason: "
                                    + detailRs.getString("reason")
                    );

                    System.out.println(
                            "--------------------------------"
                    );
                }
            }

        } catch (Exception e) {

            System.out.println(
                    "Failed to generate company placement report."
            );

            e.printStackTrace();
        }
    }


    // =====================================================
    // STUDENT PLACEMENT REPORT
    // =====================================================

    public static void studentPlacementReport(
            Scanner sc) {

        System.out.println();
        System.out.println(
                "===== STUDENT PLACEMENT REPORT ====="
        );


        int studentId =
                readInt(
                        sc,
                        "Enter Student ID: "
                );


        StudentReportDAO.generateStudentReport(
                studentId
        );
    }


    // =====================================================
    // READ INTEGER
    // =====================================================

    public static int readInt(
            Scanner sc,
            String message) {

        while (true) {

            System.out.print(message);

            String input =
                    sc.nextLine().trim();


            try {

                return Integer.parseInt(
                        input
                );

            } catch (NumberFormatException e) {

                System.out.println(
                        "Please enter a valid integer."
                );
            }
        }
    }


    // =====================================================
    // READ DOUBLE
    // =====================================================

    public static double readDouble(
            Scanner sc,
            String message) {

        while (true) {

            System.out.print(message);

            String input =
                    sc.nextLine().trim();


            try {

                return Double.parseDouble(
                        input
                );

            } catch (NumberFormatException e) {

                System.out.println(
                        "Please enter a valid number."
                );
            }
        }
    }
}