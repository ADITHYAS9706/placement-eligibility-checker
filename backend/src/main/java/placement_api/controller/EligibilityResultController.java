package placement_api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import placement_api.model.EligibilityResult;
import placement_api.service.EligibilityResultService;

@RestController
@RequestMapping("/api/eligibility-results")
@CrossOrigin(origins = "http://localhost:5173")
public class EligibilityResultController {

    private final EligibilityResultService eligibilityResultService;

    public EligibilityResultController(
            EligibilityResultService eligibilityResultService) {

        this.eligibilityResultService = eligibilityResultService;
    }

    // =========================
    // GET ALL ELIGIBILITY RESULTS
    // =========================

    @GetMapping
    public ResponseEntity<List<EligibilityResult>> getAllResults() {

        List<EligibilityResult> results =
                eligibilityResultService.getAllResults();

        return ResponseEntity.ok(results);
    }
}