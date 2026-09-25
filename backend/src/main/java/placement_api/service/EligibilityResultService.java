package placement_api.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import placement_api.model.EligibilityResult;
import placement_api.repository.EligibilityResultRepository;

@Service
public class EligibilityResultService {

    private final EligibilityResultRepository repository;

    public EligibilityResultService(
            EligibilityResultRepository repository) {

        this.repository = repository;
    }

    // =========================
    // SAVE OR UPDATE RESULT
    // =========================

    public EligibilityResult saveResult(
            int studentId,
            int companyId,
            String result) {

        String reason;

        if (result.equals("Eligible")) {
            reason = "Student satisfies all eligibility requirements.";
        } else {
            reason = result;
        }

        // Check whether this student-company combination already exists
        Optional<EligibilityResult> existingResult =
                repository.findByStudentIdAndCompanyId(
                        studentId,
                        companyId
                );

        if (existingResult.isPresent()) {

            // Update existing record
            EligibilityResult eligibilityResult =
                    existingResult.get();

            eligibilityResult.setResult(result);
            eligibilityResult.setReason(reason);
            eligibilityResult.setCheckedAt(LocalDateTime.now());

            return repository.save(eligibilityResult);
        }

        // Create new record
        EligibilityResult eligibilityResult =
                new EligibilityResult(
                        studentId,
                        companyId,
                        result,
                        reason,
                        LocalDateTime.now()
                );

        return repository.save(eligibilityResult);
    }

    // =========================
    // GET ALL RESULTS
    // =========================

    public List<EligibilityResult> getAllResults() {

        return repository.findAll();
    }
}