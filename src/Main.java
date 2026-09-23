import java.util.List;
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        

        Scanner sc = new Scanner(System.in);

        System.out.println("===== PLACEMENT ELIGIBILITY CHECKER =====");

        System.out.print("Enter your name: ");
        String name = sc.nextLine();

        System.out.print("Enter your CGPA: ");
        double cgpa = sc.nextDouble();

        System.out.print("Enter number of backlogs: ");
        int backlogs = sc.nextInt();

        sc.nextLine();

        System.out.print("Enter your branch: ");
        String branch = sc.nextLine();

        System.out.print("Enter graduation year: ");
        int graduationYear = sc.nextInt();

        // Create Student object
        Student student = new Student(
                name,
                cgpa,
                backlogs,
                branch,
                graduationYear
        );

        // Save student to MySQL
       int studentId = StudentDAO.saveStudent(student);
       System.out.println("Student ID: " + studentId);

        System.out.println("\n===== STUDENT DETAILS =====");

        System.out.println("Name: " + student.getName());
        System.out.println("CGPA: " + student.getCgpa());
        System.out.println("Backlogs: " + student.getBacklogs());
        System.out.println("Branch: " + student.getBranch());
        System.out.println("Graduation Year: " + student.getGraduationYear());

        // Get companies from MySQL
        List<Company> companies = CompanyDAO.getAllCompanies();

        // Eligibility checker
        EligibilityChecker checker = new EligibilityChecker();

        System.out.println("\n===== ELIGIBILITY RESULTS =====");

        for (Company company : companies) {

    String reason =
        checker.getEligibilityReason(student, company);

    String result;

    if (reason.equals("Eligible")) {
        result = "Eligible";
    } else {
        result = "Not Eligible";
    }

    System.out.println(
        company.getCompanyName() + " : " + reason
    );

    EligibilityResultDAO.saveResult(
        student.getId(),
        company.getId(),
        result,
        reason
    );
}

        
        System.out.println("\n===== VIEW SAVED RESULTS =====");

System.out.print("Enter Student ID: ");

int searchId = sc.nextInt();

ResultDAO.getResultsByStudentId(searchId);
sc.close();
    }
}