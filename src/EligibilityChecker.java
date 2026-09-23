public class EligibilityChecker {

    public boolean isEligible(Student student, Company company) {

        boolean cgpaEligible =
                student.getCgpa() >= company.getMinimumCgpa();

        boolean backlogEligible =
                student.getBacklogs() <= company.getMaximumBacklogs();

        boolean branchEligible =
                student.getBranch().equalsIgnoreCase(
                        company.getEligibleBranch()
                );

        return cgpaEligible && backlogEligible && branchEligible;
    }

    public String getEligibilityReason(Student student, Company company) {

        if (student.getCgpa() < company.getMinimumCgpa()) {
            return "CGPA below required " + company.getMinimumCgpa();
        }

        if (student.getBacklogs() > company.getMaximumBacklogs()) {
            return "Backlogs exceed allowed limit of "
                    + company.getMaximumBacklogs();
        }

        if (!student.getBranch().equalsIgnoreCase(
                company.getEligibleBranch())) {
            return "Branch not eligible";
        }

        return "Eligible";
    }
}