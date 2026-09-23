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
}