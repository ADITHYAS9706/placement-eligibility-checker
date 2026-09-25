package placement_api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import placement_api.model.Student;
import placement_api.repository.StudentRepository;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get student by ID
    public Optional<Student> getStudentById(int id) {
        return studentRepository.findById(id);
    }

    // Add student
    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    // Update student
    public Student updateStudent(int id, Student updatedStudent) {

        Optional<Student> existingStudent =
                studentRepository.findById(id);

        if (existingStudent.isPresent()) {

            Student student = existingStudent.get();

            student.setName(updatedStudent.getName());
            student.setCgpa(updatedStudent.getCgpa());
            student.setBacklogs(updatedStudent.getBacklogs());
            student.setBranch(updatedStudent.getBranch());
            student.setGraduationYear(
                    updatedStudent.getGraduationYear()
            );

            return studentRepository.save(student);
        }

        return null;
    }

    // Delete student
    public boolean deleteStudent(int id) {

        if (studentRepository.existsById(id)) {

            studentRepository.deleteById(id);

            return true;
        }

        return false;
    }
}