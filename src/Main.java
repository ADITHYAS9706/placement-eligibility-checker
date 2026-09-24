import java.util.List;
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        while (true) {

            System.out.println("\n=================================");
            System.out.println("   PLACEMENT ELIGIBILITY CHECKER");
            System.out.println("=================================");
            System.out.println("1. Add Student");
            System.out.println("2. Check Eligibility");
            System.out.println("3. View Eligibility Results");
            System.out.println("4. View Companies");
            System.out.println("5. Add Company");
            System.out.println("6. Update Company");
            System.out.println("7. Delete Company");
            System.out.println("8. Exit");

            int choice = readInt(sc, "Enter your choice: ");

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
                    updateCompany(sc);
                    break;

                case 7:
                    deleteCompany(sc);
                    break;

                case 8:
                    System.out.println(
                        "Thank you for using Placement Eligibility Checker!"
                    );
                    sc.close();
                    return;

                default:
                    System.out.println(
                        "Invalid choice. Please enter 1 to 8."
                    );
            }
        }
    }


    // =========================
    // READ INTEGER
    // =========================

    public static int readInt(
            Scanner sc,
            String message) {

        while (true) {

            System.out.print(message);

            if (sc.hasNextInt()) {

                int value = sc.nextInt();
                sc.nextLine();

                return value;

            } else {

                System.out.println(
                    "Invalid input. Please enter a number."
                );

                sc.nextLine();
            }
        }
    }


    // =========================
    // READ DOUBLE
    // =========================

    public static double readDouble(
            Scanner sc,
            String message) {

        while (true) {

            System.out.print(message);

            if (sc.hasNextDouble()) {

                double value = sc.nextDouble();
                sc.nextLine();

                return value;

            } else {

                System.out.println(
                    "Invalid input. Please enter a number."
                );

                sc.nextLine();
            }
        }
    }


    // =========================
    // ADD STUDENT
    // =========================

    public static void addStudent(Scanner sc) {

        System.out.println("\n===== ADD STUDENT =====");

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

            System.out.print("Enter your branch: ");

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
                "Enter a valid graduation year."
            );
        }


        Student student = new Student(
            name,
            cgpa,
            backlogs,
            branch,
            graduationYear
        );


        int studentId =
            StudentDAO.saveStudent(student);


        if (studentId != -1) {

            System.out.println(
                "Student ID: " + studentId
            );
        }
    }


    // =========================
    // CHECK ELIGIBILITY
    // =========================

    public static void checkEligibility(
            Scanner sc) {

        System.out.println(
            "\n===== CHECK ELIGIBILITY ====="
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


        System.out.println(
            "\n===== STUDENT DETAILS ====="
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


        System.out.println(
            "\n===== ELIGIBILITY RESULTS ====="
        );


        for (Company company : companies) {

            String reason =
                checker.getEligibilityReason(
                    student,
                    company
                );


            String result;

            if (reason.equalsIgnoreCase("Eligible")) {

                result = "Eligible";

            } else {

                result = "Not Eligible";
            }


            System.out.println(
                company.getCompanyName()
                + " : "
                + reason
            );


            EligibilityResultDAO.saveResult(
                student.getId(),
                company.getId(),
                result,
                reason
            );
        }
    }


    // =========================
    // VIEW RESULTS
    // =========================

    public static void viewResults(
            Scanner sc) {

        System.out.println(
            "\n===== VIEW ELIGIBILITY RESULTS ====="
        );


        int studentId = readInt(
            sc,
            "Enter Student ID: "
        );


        ResultDAO.getResultsByStudentId(
            studentId
        );
    }


    // =========================
    // VIEW COMPANIES
    // =========================

    public static void viewCompanies() {

        System.out.println(
            "\n===== AVAILABLE COMPANIES ====="
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

            System.out.println(
                "\nCompany ID: "
                + company.getId()
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
                "-----------------------------"
            );
        }
    }


    // =========================
    // ADD COMPANY
    // =========================

    public static void addCompany(
            Scanner sc) {

        System.out.println(
            "\n===== ADD COMPANY ====="
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

            minimumCgpa = readDouble(
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

            maximumBacklogs = readInt(
                sc,
                "Enter maximum allowed backlogs: "
            );

            if (maximumBacklogs >= 0) {
                break;
            }

            System.out.println(
                "Maximum backlogs cannot be negative."
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


        Company company = new Company(
            0,
            companyName,
            minimumCgpa,
            maximumBacklogs,
            eligibleBranch
        );


        CompanyDAO.saveCompany(company);
    }


    // =========================
    // UPDATE COMPANY
    // =========================

    public static void updateCompany(
            Scanner sc) {

        System.out.println(
            "\n===== UPDATE COMPANY ====="
        );


        int companyId = readInt(
            sc,
            "Enter Company ID: "
        );


        List<Company> companies =
            CompanyDAO.getAllCompanies();


        Company existingCompany = null;


        if (companies != null) {

            for (Company company : companies) {

                if (company.getId() == companyId) {

                    existingCompany = company;
                    break;
                }
            }
        }


        if (existingCompany == null) {

            System.out.println(
                "Company ID not found."
            );

            return;
        }


        System.out.println(
            "\n===== CURRENT COMPANY DETAILS ====="
        );

        System.out.println(
            "Company ID: "
            + existingCompany.getId()
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


        String companyName;

        while (true) {

            System.out.print(
                "\nEnter new company name: "
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

            minimumCgpa = readDouble(
                sc,
                "Enter new minimum CGPA (0 - 10): "
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

            maximumBacklogs = readInt(
                sc,
                "Enter new maximum allowed backlogs: "
            );

            if (maximumBacklogs >= 0) {
                break;
            }

            System.out.println(
                "Maximum backlogs cannot be negative."
            );
        }


        String eligibleBranch;

        while (true) {

            System.out.print(
                "Enter new eligible branches: "
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


    // =========================
    // DELETE COMPANY
    // =========================

    public static void deleteCompany(
            Scanner sc) {

        System.out.println(
            "\n===== DELETE COMPANY ====="
        );


        int companyId = readInt(
            sc,
            "Enter Company ID: "
        );


        List<Company> companies =
            CompanyDAO.getAllCompanies();


        Company companyToDelete = null;


        if (companies != null) {

            for (Company company : companies) {

                if (company.getId() == companyId) {

                    companyToDelete = company;
                    break;
                }
            }
        }


        if (companyToDelete == null) {

            System.out.println(
                "Company ID not found."
            );

            return;
        }


        System.out.println(
            "\nCompany selected for deletion:"
        );

        System.out.println(
            "ID: "
            + companyToDelete.getId()
        );

        System.out.println(
            "Name: "
            + companyToDelete.getCompanyName()
        );


        System.out.print(
            "\nAre you sure you want to delete this company? (yes/no): "
        );

        String confirmation =
            sc.nextLine().trim();


        if (!confirmation.equalsIgnoreCase("yes")) {

            System.out.println(
                "Delete operation cancelled."
            );

            return;
        }


        CompanyDAO.deleteCompany(
            companyId
        );
    }
}