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
            System.out.println("6. Exit");

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
                    System.out.println(
                        "Thank you for using Placement Eligibility Checker!"
                    );
                    sc.close();
                    return;

                default:
                    System.out.println(
                        "Invalid choice. Please enter 1 to 6."
                    );
            }
        }
    }


    // =========================
    // SAFE INTEGER INPUT
    // =========================

    public static int readInt(Scanner sc, String message) {

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
    // SAFE DOUBLE INPUT
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

            System.out.println("Name cannot be empty.");
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
                "Invalid CGPA. Please enter a value between 0 and 10."
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
                "Please enter a valid graduation year between 2020 and 2035."
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

    public static void checkEligibility(Scanner sc) {

        System.out.println(
            "\n===== CHECK ELIGIBILITY ====="
        );

        int studentId;

        while (true) {

            studentId = readInt(
                sc,
                "Enter Student ID: "
            );

            if (studentId > 0) {
                break;
            }

            System.out.println(
                "Student ID must be greater than 0."
            );
        }


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

    public static void viewResults(Scanner sc) {

        System.out.println(
            "\n===== VIEW ELIGIBILITY RESULTS ====="
        );


        int studentId;

        while (true) {

            studentId = readInt(
                sc,
                "Enter Student ID: "
            );

            if (studentId > 0) {
                break;
            }

            System.out.println(
                "Student ID must be greater than 0."
            );
        }


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
                "\nCompany: "
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

    public static void addCompany(Scanner sc) {

    System.out.println("\n===== ADD COMPANY =====");

    String companyName;

    while (true) {

        System.out.print("Enter company name: ");
        companyName = sc.nextLine().trim();

        if (!companyName.isEmpty()) {
            break;
        }

        System.out.println("Company name cannot be empty.");
    }


    double minimumCgpa;

    while (true) {

        minimumCgpa =
                readDouble(sc, "Enter minimum CGPA (0 - 10): ");

        if (minimumCgpa >= 0 && minimumCgpa <= 10) {
            break;
        }

        System.out.println(
            "Minimum CGPA must be between 0 and 10."
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
            "Maximum backlogs cannot be negative."
        );
    }


    String eligibleBranch;

    while (true) {

        System.out.print("Enter eligible branches: ");
        eligibleBranch = sc.nextLine().trim();

        if (!eligibleBranch.isEmpty()) {
            break;
        }

        System.out.println(
            "Eligible branches cannot be empty."
        );
    }


    // ID = 0 because MySQL AUTO_INCREMENT
    Company company = new Company(
        0,
        companyName,
        minimumCgpa,
        maximumBacklogs,
        eligibleBranch
    );


    CompanyDAO.saveCompany(company);
}
}