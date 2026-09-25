package placement_api.controller;

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

    // =========================
    // CHECK ELIGIBILITY
    // =========================

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

        // Return result to frontend
        return ResponseEntity.ok(result);
    }
}