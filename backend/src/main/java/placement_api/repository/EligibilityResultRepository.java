package placement_api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import placement_api.model.EligibilityResult;

public interface EligibilityResultRepository
        extends JpaRepository<EligibilityResult, Integer> {

    List<EligibilityResult> findByStudentId(int studentId);

    List<EligibilityResult> findByCompanyId(int companyId);

    List<EligibilityResult> findByStudentIdOrderByCheckedAtDesc(int studentId);
}