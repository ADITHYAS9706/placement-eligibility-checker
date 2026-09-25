package placement_api.controller;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import placement_api.model.Company;
import placement_api.model.Student;
import placement_api.repository.CompanyRepository;
import placement_api.repository.StudentRepository;
import placement_api.service.EligibilityResultService;
import placement_api.service.EligibilityService;

@RestController
@RequestMapping("/api/eligibility")
@CrossOrigin(origins = "http://localhost:5173")
public class EligibilityController {

    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final EligibilityService eligibilityService;
    private final EligibilityResultService eligibilityResultService;

    public EligibilityController(
            StudentRepository studentRepository,
            CompanyRepository companyRepository,
            EligibilityService eligibilityService,
            EligibilityResultService eligibilityResultService) {

        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.eligibilityService = eligibilityService;
        this.eligibilityResultService = eligibilityResultService;
    }

    // =========================================================
    // CHECK ONE STUDENT FOR ONE COMPANY
    // =========================================================

    @GetMapping
    public ResponseEntity<String> checkEligibility(
            @RequestParam int studentId,
            @RequestParam int companyId) {

        // Find student
        Optional<Student> student =
                studentRepository.findById(studentId);

        if (student.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Student not found.");
        }

        // Find company
        Optional<Company> company =
                companyRepository.findById(companyId);

        if (company.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Company not found.");
        }

        // Check eligibility
        String result =
                eligibilityService.checkEligibility(
                        student.get(),
                        company.get()
                );

        // Save result
        eligibilityResultService.saveResult(
                studentId,
                companyId,
                result
        );

        // Return result
        return ResponseEntity.ok(result);
    }


    // =========================================================
    // CHECK ONE STUDENT FOR ALL COMPANIES
    // =========================================================

    @GetMapping("/student/all")
    public ResponseEntity<?> checkStudentForAllCompanies(
            @RequestParam int studentId) {

        // Find student
        Optional<Student> studentOptional =
                studentRepository.findById(studentId);

        if (studentOptional.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Student not found.");
        }

        Student student = studentOptional.get();

        // Get all companies
        List<Company> companies =
                companyRepository.findAll();

        if (companies.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("No companies found.");
        }

        // Store results
        List<Map<String, Object>> results =
                new ArrayList<>();

        int eligibleCount = 0;
        int notEligibleCount = 0;

        // Check student against every company
        for (Company company : companies) {

            String result =
                    eligibilityService.checkEligibility(
                            student,
                            company
                    );

            // Save result
            eligibilityResultService.saveResult(
                    student.getId(),
                    company.getId(),
                    result
            );

            // Determine status
            String lowerResult =
                    result.toLowerCase();

            boolean eligible =
                    lowerResult.contains("eligible")
                    && !lowerResult.contains("not eligible");

            if (eligible) {
                eligibleCount++;
            } else {
                notEligibleCount++;
            }

            // Create response object
            Map<String, Object> companyResult =
                    new LinkedHashMap<>();

            companyResult.put(
                    "companyId",
                    company.getId()
            );

            companyResult.put(
                    "companyName",
                    company.getCompanyName()
            );

            companyResult.put(
                    "result",
                    result
            );

            companyResult.put(
                    "eligible",
                    eligible
            );

            results.add(companyResult);
        }

        // Final response
        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "studentId",
                student.getId()
        );

        response.put(
                "studentName",
                student.getName()
        );

        response.put(
                "totalCompanies",
                companies.size()
        );

        response.put(
                "eligibleCompanies",
                eligibleCount
        );

        response.put(
                "notEligibleCompanies",
                notEligibleCount
        );

        response.put(
                "results",
                results
        );

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // CHECK ALL STUDENTS FOR ONE COMPANY
    // =========================================================

    @GetMapping("/all")
    public ResponseEntity<String> checkAllStudents(
            @RequestParam int companyId) {

        // Find company
        Optional<Company> company =
                companyRepository.findById(companyId);

        if (company.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Company not found.");
        }

        // Get all students
        List<Student> students =
                studentRepository.findAll();

        if (students.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("No students found.");
        }

        int eligibleCount = 0;
        int notEligibleCount = 0;

        // Check every student
        for (Student student : students) {

            String result =
                    eligibilityService.checkEligibility(
                            student,
                            company.get()
                    );

            // Save result
            eligibilityResultService.saveResult(
                    student.getId(),
                    companyId,
                    result
            );

            // Count result
            String lowerResult =
                    result.toLowerCase();

            if (
                lowerResult.contains("eligible")
                && !lowerResult.contains("not eligible")
            ) {
                eligibleCount++;
            } else {
                notEligibleCount++;
            }
        }

        // Return summary
        String response =
                "Eligibility check completed. "
                + "Total Students: " + students.size()
                + ", Eligible: " + eligibleCount
                + ", Not Eligible: " + notEligibleCount;

        return ResponseEntity.ok(response);
    }
}