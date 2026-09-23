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

        boolean branchEligible = false;

String[] eligibleBranches =
        company.getEligibleBranch().split(",");

for (String allowedBranch : eligibleBranches) {

    if (student.getBranch().trim()
            .equalsIgnoreCase(allowedBranch.trim())) {

        branchEligible = true;
        break;
    }
}
if (!branchEligible) {
    return "Branch not eligible";
}

        return "Eligible";
    }
}