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

System.out.println("\n===== COMPANY DETAILS =====");

System.out.println("Company: " + tcs.getCompanyName());
System.out.println("Minimum CGPA: " + tcs.getMinimumCgpa());
System.out.println("Maximum Backlogs: " + tcs.getMaximumBacklogs());
System.out.println("Eligible Branch: " + tcs.getEligibleBranch());
    }
}