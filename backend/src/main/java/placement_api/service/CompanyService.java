package placement_api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import placement_api.model.Company;
import placement_api.repository.CompanyRepository;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Optional<Company> getCompanyById(int id) {
        return companyRepository.findById(id);
    }

    public Company saveCompany(Company company) {
        return companyRepository.save(company);
    }

    public Company updateCompany(int id, Company company) {

        Optional<Company> existingCompany =
                companyRepository.findById(id);

        if (existingCompany.isEmpty()) {
            return null;
        }

        Company existing = existingCompany.get();

        existing.setCompanyName(company.getCompanyName());
        existing.setMinCgpa(company.getMinCgpa());
        existing.setMaxBacklogs(company.getMaxBacklogs());
        existing.setEligibleBranch(company.getEligibleBranch());
        existing.setGraduationYear(company.getGraduationYear());

        return companyRepository.save(existing);
    }

    public boolean deleteCompany(int id) {

        if (!companyRepository.existsById(id)) {
            return false;
        }

        companyRepository.deleteById(id);
        return true;
    }
}