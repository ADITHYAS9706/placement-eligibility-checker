package placement_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import placement_api.model.Student;

public interface StudentRepository extends JpaRepository<Student, Integer> {
}