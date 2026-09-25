package placement_api.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import placement_api.model.Company;
import placement_api.service.CompanyService;

@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = "http://localhost:5173")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    // =========================
    // GET ALL COMPANIES
    // =========================

    @GetMapping
    public ResponseEntity<List<Company>> getAllCompanies() {

        List<Company> companies =
                companyService.getAllCompanies();

        return ResponseEntity.ok(companies);
    }

    // =========================
    // GET COMPANY BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompanyById(
            @PathVariable int id) {

        Optional<Company> company =
                companyService.getCompanyById(id);

        if (company.isPresent()) {
            return ResponseEntity.ok(company.get());
        }

        return ResponseEntity.notFound().build();
    }

    // =========================
    // ADD COMPANY
    // =========================

    @PostMapping
    public ResponseEntity<Company> addCompany(
            @RequestBody Company company) {

        Company savedCompany =
                companyService.saveCompany(company);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedCompany);
    }

    // =========================
    // UPDATE COMPANY
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<Company> updateCompany(
            @PathVariable int id,
            @RequestBody Company company) {

        Company updatedCompany =
                companyService.updateCompany(id, company);

        if (updatedCompany != null) {
            return ResponseEntity.ok(updatedCompany);
        }

        return ResponseEntity.notFound().build();
    }

    // =========================
    // DELETE COMPANY
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCompany(
            @PathVariable int id) {

        boolean deleted =
                companyService.deleteCompany(id);

        if (deleted) {
            return ResponseEntity.ok(
                    "Company deleted successfully!"
            );
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Company not found.");
    }
}