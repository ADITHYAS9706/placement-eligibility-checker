package placement_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import placement_api.model.EligibilityResult;

public interface EligibilityResultRepository
        extends JpaRepository<EligibilityResult, Integer> {
}