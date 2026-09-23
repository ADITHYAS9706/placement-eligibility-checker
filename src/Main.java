import java.util.ArrayList;
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

        Student student = new Student(
            name,
            cgpa,
            backlogs,
            branch,
            graduationYear
        );

        System.out.println("\n===== STUDENT DETAILS =====");

        System.out.println("Name: " + student.getName());
        System.out.println("CGPA: " + student.getCgpa());
        System.out.println("Backlogs: " + student.getBacklogs());
        System.out.println("Branch: " + student.getBranch());
        System.out.println("Graduation Year: " + student.getGraduationYear());

        sc.close();
        Company tcs = new Company(
    "TCS",
    7.0,
    0,
    "CSE"
);

Company infosys = new Company(
    "Infosys",
    6.5,
    1,
    "CSE"
);

Company wipro = new Company(
    "Wipro",
    6.0,
    2,
    "CSE"
);

EligibilityChecker checker = new EligibilityChecker();

boolean tcsEligible = checker.isEligible(student, tcs);
boolean infosysEligible = checker.isEligible(student, infosys);
boolean wiproEligible = checker.isEligible(student, wipro);

ArrayList<Company> companies = new ArrayList<>();
companies.add(tcs);
companies.add(infosys);
companies.add(wipro);
System.out.println("\n===== ELIGIBILITY RESULTS =====");

for (Company company : companies) {

    boolean eligible = checker.isEligible(student, company);

    if (eligible) {
        System.out.println(
            company.getCompanyName() + " :Eligible"
        );
    } else {
        System.out.println(
            company.getCompanyName() + " :Not Eligible"
        );
    }
}
    }
}