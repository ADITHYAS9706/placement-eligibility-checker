package placement_api.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import placement_api.model.Company;
import placement_api.model.EligibilityResult;
import placement_api.model.Student;
import placement_api.repository.CompanyRepository;
import placement_api.repository.EligibilityResultRepository;
import placement_api.repository.StudentRepository;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {

    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final EligibilityResultRepository eligibilityResultRepository;

    public ReportController(
            StudentRepository studentRepository,
            CompanyRepository companyRepository,
            EligibilityResultRepository eligibilityResultRepository) {

        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.eligibilityResultRepository = eligibilityResultRepository;
    }

    // ==========================================
    // STUDENT PLACEMENT REPORT
    // ==========================================

    @GetMapping("/students")
    public List<Map<String, Object>> getStudentPlacementReport() {

        List<Student> students =
                studentRepository.findAll();

        List<Company> companies =
                companyRepository.findAll();

        List<EligibilityResult> results =
                eligibilityResultRepository.findAll();

        List<Map<String, Object>> report =
                new ArrayList<>();

        // ==========================================
        // CREATE REPORT FOR EACH STUDENT
        // ==========================================

        for (Student student : students) {

            Map<String, Object> studentReport =
                    new HashMap<>();

            int studentId = student.getId();

            studentReport.put(
                    "studentId",
                    studentId
            );

            studentReport.put(
                    "name",
                    student.getName()
            );

            studentReport.put(
                    "cgpa",
                    student.getCgpa()
            );

            studentReport.put(
                    "backlogs",
                    student.getBacklogs()
            );

            studentReport.put(
                    "branch",
                    student.getBranch()
            );

            studentReport.put(
                    "graduationYear",
                    student.getGraduationYear()
            );

            // ==========================================
            // COMPANY RESULTS
            // ==========================================

            List<Map<String, Object>> companyResults =
                    new ArrayList<>();

            int checkedCount = 0;
            int eligibleCount = 0;
            int notEligibleCount = 0;

            for (EligibilityResult result : results) {

                if (result.getStudentId() != studentId) {
                    continue;
                }

                checkedCount++;

                Map<String, Object> companyReport =
                        new HashMap<>();

                companyReport.put(
                        "companyId",
                        result.getCompanyId()
                );

                String companyName =
                        "Unknown Company";

                for (Company company : companies) {

                    if (company.getId() ==
                            result.getCompanyId()) {

                        companyName =
                                company.getCompanyName();

                        break;
                    }
                }

                companyReport.put(
                        "companyName",
                        companyName
                );

                companyReport.put(
                        "result",
                        result.getResult()
                );

                companyReport.put(
                        "reason",
                        result.getReason()
                );

                companyReport.put(
                        "checkedAt",
                        result.getCheckedAt()
                );

                String resultText =
                        String.valueOf(
                                result.getResult()
                        ).toLowerCase();

                boolean eligible =
                        resultText.contains("eligible")
                        && !resultText.contains(
                                "not eligible"
                        );

                if (eligible) {
                    eligibleCount++;
                } else {
                    notEligibleCount++;
                }

                companyResults.add(
                        companyReport
                );
            }

            // ==========================================
            // ADD COUNTS
            // ==========================================

            studentReport.put(
                    "checkedCompanies",
                    checkedCount
            );

            studentReport.put(
                    "eligibleCompanies",
                    eligibleCount
            );

            studentReport.put(
                    "notEligibleCompanies",
                    notEligibleCount
            );

            studentReport.put(
                    "companyResults",
                    companyResults
            );

            // ==========================================
            // OVERALL STATUS
            // ==========================================

            String overallStatus;

            if (checkedCount == 0) {

                overallStatus = "Not Checked";

            } else if (eligibleCount > 0) {

                overallStatus = "Eligible";

            } else {

                overallStatus = "Not Eligible";
            }

            studentReport.put(
                    "overallStatus",
                    overallStatus
            );

            report.add(studentReport);
        }

        return report;
    }
}