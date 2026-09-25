package placement_api.service;

import org.springframework.stereotype.Service;

import placement_api.model.Company;
import placement_api.model.Student;

@Service
public class EligibilityService {

    public String checkEligibility(Student student, Company company) {

        // Check CGPA
        if (student.getCgpa() < company.getMinCgpa()) {
            return "Not Eligible - CGPA is below the required minimum.";
        }

        // Check backlogs
        if (student.getBacklogs() > company.getMaxBacklogs()) {
            return "Not Eligible - Backlogs exceed the allowed limit.";
        }

        // Check branch
        if (!student.getBranch().equalsIgnoreCase(
                company.getEligibleBranch())) {

            return "Not Eligible - Branch is not eligible.";
        }

        // Check graduation year
        if (student.getGraduationYear()
                != company.getGraduationYear()) {

            return "Not Eligible - Graduation year does not match.";
        }

        // All conditions passed
        return "Eligible";
    }
}