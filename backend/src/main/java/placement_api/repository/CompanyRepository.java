package placement_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import placement_api.model.Company;

public interface CompanyRepository extends JpaRepository<Company, Integer> {
}