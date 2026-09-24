public class EligibilityChecker {

    // =========================
    // CHECK ELIGIBILITY
    // =========================

    public boolean isEligible(
            Student student,
            Company company) {

        // Check CGPA
        if (student.getCgpa() <
            company.getMinimumCgpa()) {

            return false;
        }


        // Check backlogs
        if (student.getBacklogs() >
            company.getMaximumBacklogs()) {

            return false;
        }


        // Check branch
        if (!isBranchEligible(
                student.getBranch(),
                company.getEligibleBranch())) {

            return false;
        }


        return true;
    }


    // =========================
    // GET ELIGIBILITY REASON
    // =========================

    public String getEligibilityReason(
            Student student,
            Company company) {


        // CGPA check

        if (student.getCgpa() <
            company.getMinimumCgpa()) {

            return "CGPA below required "
                    + company.getMinimumCgpa();
        }


        // Backlog check

        if (student.getBacklogs() >
            company.getMaximumBacklogs()) {

            return "Backlogs exceed allowed limit of "
                    + company.getMaximumBacklogs();
        }


        // Branch check

        if (!isBranchEligible(
                student.getBranch(),
                company.getEligibleBranch())) {

            return "Branch not eligible";
        }


        return "Eligible";
    }


    // =========================
    // BRANCH ELIGIBILITY
    // =========================

    private boolean isBranchEligible(
            String studentBranch,
            String companyBranches) {


        if (studentBranch == null ||
            companyBranches == null) {

            return false;
        }


        String normalizedStudentBranch =
                studentBranch
                    .trim()
                    .toLowerCase();


        String[] branches =
                companyBranches.split(",");


        for (String branch : branches) {

            String normalizedCompanyBranch =
                    branch
                        .trim()
                        .toLowerCase();


            if (normalizedStudentBranch.equals(
                    normalizedCompanyBranch)) {

                return true;
            }
        }


        return false;
    }
}