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
            System.out.println("2. View Students");
            System.out.println("3. Update Student");
            System.out.println("4. Delete Student");
            System.out.println("5. Check Eligibility");
            System.out.println("6. View Eligibility Results");
            System.out.println("7. View Companies");
            System.out.println("8. Add Company");
            System.out.println("9. Update Company");
            System.out.println("10. Delete Company");
            System.out.println("11. Search Students");
            System.out.println("12. Find Eligible Companies");
            System.out.println("13. Exit");

            int choice =
                    readInt(
                            sc,
                            "Enter your choice: "
                    );

            switch (choice) {

                case 1:
                    addStudent(sc);
                    break;

                case 2:
                    viewStudents();
                    break;

                case 3:
                    updateStudent(sc);
                    break;

                case 4:
                    deleteStudent(sc);
                    break;

                case 5:
                    checkEligibility(sc);
                    break;

                case 6:
                    viewResults(sc);
                    break;

                case 7:
                    viewCompanies();
                    break;

                case 8:
                    addCompany(sc);
                    break;

                case 9:
                    updateCompany(sc);
                    break;

                case 10:
                    deleteCompany(sc);
                    break;

                case 11:
                    searchStudents(sc);
                    break;

                case 12:
                    findEligibleCompanies(sc);
                    break;

                case 13:

                    System.out.println(
                            "Thank you for using Placement Eligibility Checker!"
                    );

                    sc.close();
                    return;

                default:

                    System.out.println(
                            "Invalid choice. Please enter 1 to 13."
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

                int value =
                        sc.nextInt();

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

                double value =
                        sc.nextDouble();

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

    public static void addStudent(
            Scanner sc) {

        System.out.println(
                "\n===== ADD STUDENT ====="
        );

        String name;

        while (true) {

            System.out.print(
                    "Enter your name: "
            );

            name =
                    sc.nextLine().trim();

            if (!name.isEmpty()) {
                break;
            }

            System.out.println(
                    "Name cannot be empty."
            );
        }


        double cgpa;

        while (true) {

            cgpa =
                    readDouble(
                            sc,
                            "Enter your CGPA (0 - 10): "
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

            branch =
                    sc.nextLine().trim();

            if (!branch.isEmpty()) {
                break;
            }

            System.out.println(
                    "Branch cannot be empty."
            );
        }


        int graduationYear;

        while (true) {

            graduationYear =
                    readInt(
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


    // =========================
    // VIEW STUDENTS
    // =========================

    public static void viewStudents() {

        System.out.println(
                "\n===== REGISTERED STUDENTS ====="
        );


        List<Student> students =
                StudentDAO.getAllStudents();


        if (students == null ||
                students.isEmpty()) {

            System.out.println(
                    "No students found."
            );

            return;
        }


        for (Student student : students) {

            printStudent(student);
        }
    }


    // =========================
    // PRINT STUDENT
    // =========================

    public static void printStudent(
            Student student) {

        System.out.println(
                "\nStudent ID: "
                        + student.getId()
        );

        System.out.println(
                "Name: "
                        + student.getName()
        );

        System.out.println(
                "CGPA: "
                        + student.getCgpa()
        );

        System.out.println(
                "Backlogs: "
                        + student.getBacklogs()
        );

        System.out.println(
                "Branch: "
                        + student.getBranch()
        );

        System.out.println(
                "Graduation Year: "
                        + student.getGraduationYear()
        );

        System.out.println(
                "-----------------------------"
        );
    }


    // =========================
    // UPDATE STUDENT
    // =========================

    public static void updateStudent(
            Scanner sc) {

        System.out.println(
                "\n===== UPDATE STUDENT ====="
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


        String name;

        while (true) {

            System.out.print(
                    "Enter new name: "
            );

            name =
                    sc.nextLine().trim();

            if (!name.isEmpty()) {
                break;
            }

            System.out.println(
                    "Name cannot be empty."
            );
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


        String branch;

        while (true) {

            System.out.print(
                    "Enter new branch: "
            );

            branch =
                    sc.nextLine().trim();

            if (!branch.isEmpty()) {
                break;
            }

            System.out.println(
                    "Branch cannot be empty."
            );
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
                    "Invalid graduation year."
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


    // =========================
    // DELETE STUDENT
    // =========================

    public static void deleteStudent(
            Scanner sc) {

        System.out.println(
                "\n===== DELETE STUDENT ====="
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


        System.out.println(
                "Student: "
                        + student.getName()
        );


        System.out.print(
                "Are you sure? (yes/no): "
        );


        String confirmation =
                sc.nextLine().trim();


        if (!confirmation.equalsIgnoreCase(
                "yes")) {

            System.out.println(
                    "Delete operation cancelled."
            );

            return;
        }


        StudentDAO.deleteStudent(
                studentId
        );
    }


    // =========================
    // CHECK ELIGIBILITY
    // =========================

    public static void checkEligibility(
            Scanner sc) {

        System.out.println(
                "\n===== CHECK ELIGIBILITY ====="
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


        List<Company> companies =
                CompanyDAO.getAllCompanies();


        if (companies == null ||
                companies.isEmpty()) {

            System.out.println(
                    "No companies found."
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


        int studentId =
                readInt(
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


        System.out.print(
                "Enter company name: "
        );

        String companyName =
                sc.nextLine().trim();


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


        System.out.print(
                "Enter eligible branches: "
        );

        String eligibleBranch =
                sc.nextLine().trim();


        Company company =
                new Company(
                        0,
                        companyName,
                        minimumCgpa,
                        maximumBacklogs,
                        eligibleBranch
                );


        CompanyDAO.saveCompany(
                company
        );
    }


    // =========================
    // UPDATE COMPANY
    // =========================

    public static void updateCompany(
            Scanner sc) {

        System.out.println(
                "\n===== UPDATE COMPANY ====="
        );


        int companyId =
                readInt(
                        sc,
                        "Enter Company ID: "
                );


        List<Company> companies =
                CompanyDAO.getAllCompanies();


        Company existingCompany =
                null;


        if (companies != null) {

            for (Company company :
                    companies) {

                if (company.getId() ==
                        companyId) {

                    existingCompany =
                            company;

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


        System.out.print(
                "Enter new company name: "
        );

        String companyName =
                sc.nextLine().trim();


        double minimumCgpa;

        while (true) {

            minimumCgpa =
                    readDouble(
                            sc,
                            "Enter new minimum CGPA: "
                    );

            if (minimumCgpa >= 0 &&
                    minimumCgpa <= 10) {

                break;
            }

            System.out.println(
                    "Invalid CGPA."
            );
        }


        int maximumBacklogs;

        while (true) {

            maximumBacklogs =
                    readInt(
                            sc,
                            "Enter new maximum backlogs: "
                    );

            if (maximumBacklogs >= 0) {
                break;
            }

            System.out.println(
                    "Invalid number of backlogs."
            );
        }


        System.out.print(
                "Enter new eligible branches: "
        );

        String eligibleBranch =
                sc.nextLine().trim();


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


        int companyId =
                readInt(
                        sc,
                        "Enter Company ID: "
                );


        System.out.print(
                "Are you sure? (yes/no): "
        );


        String confirmation =
                sc.nextLine().trim();


        if (!confirmation.equalsIgnoreCase(
                "yes")) {

            System.out.println(
                    "Delete operation cancelled."
            );

            return;
        }


        CompanyDAO.deleteCompany(
                companyId
        );
    }


    // =========================
    // SEARCH STUDENTS
    // =========================

    public static void searchStudents(
            Scanner sc) {

        System.out.println(
                "\n===== SEARCH STUDENTS ====="
        );

        System.out.println(
                "1. Search by Name"
        );

        System.out.println(
                "2. Search by Branch"
        );

        System.out.println(
                "3. Students Above CGPA"
        );


        int choice =
                readInt(
                        sc,
                        "Enter choice: "
                );


        List<Student> students;


        switch (choice) {

            case 1:

                System.out.print(
                        "Enter name to search: "
                );

                String name =
                        sc.nextLine().trim();

                students =
                        StudentDAO.searchStudentsByName(
                                name
                        );

                displaySearchResults(
                        students
                );

                break;


            case 2:

                System.out.print(
                        "Enter branch: "
                );

                String branch =
                        sc.nextLine().trim();

                students =
                        StudentDAO.searchStudentsByBranch(
                                branch
                        );

                displaySearchResults(
                        students
                );

                break;


            case 3:

                double cgpa =
                        readDouble(
                                sc,
                                "Enter minimum CGPA: "
                        );

                students =
                        StudentDAO.getStudentsAboveCgpa(
                                cgpa
                        );

                displaySearchResults(
                        students
                );

                break;


            default:

                System.out.println(
                        "Invalid choice."
                );
        }
    }


    // =========================
    // DISPLAY SEARCH RESULTS
    // =========================

    public static void displaySearchResults(
            List<Student> students) {

        System.out.println(
                "\n===== SEARCH RESULTS ====="
        );


        if (students == null ||
                students.isEmpty()) {

            System.out.println(
                    "No matching students found."
            );

            return;
        }


        for (Student student : students) {

            printStudent(student);
        }
    }


    // =========================
    // FIND ELIGIBLE COMPANIES
    // =========================

    public static void findEligibleCompanies(
            Scanner sc) {

        System.out.println(
                "\n===== FIND ELIGIBLE COMPANIES ====="
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


        List<Company> companies =
                CompanyDAO.getAllCompanies();


        if (companies == null ||
                companies.isEmpty()) {

            System.out.println(
                    "No companies found."
            );

            return;
        }


        EligibilityChecker checker =
                new EligibilityChecker();


        boolean foundEligible =
                false;


        System.out.println(
                "\n===== COMPANIES FOR "
                        + student.getName()
                        + " ====="
        );


        for (Company company :
                companies) {

            String reason =
                    checker.getEligibilityReason(
                            student,
                            company
                    );


            if (reason.equalsIgnoreCase(
                    "Eligible")) {

                foundEligible = true;


                System.out.println(
                        ": "
                                + company.getCompanyName()
                                + " - Eligible"
                );
            }
        }


        if (!foundEligible) {

            System.out.println(
                    "No eligible companies found."
            );
        }
    }
}