package placement_api.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import placement_api.model.Student;
import placement_api.service.StudentService;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // =========================
    // GET ALL STUDENTS
    // =========================

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {

        List<Student> students =
                studentService.getAllStudents();

        return ResponseEntity.ok(students);
    }

    // =========================
    // GET STUDENT BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(
            @PathVariable int id) {

        Optional<Student> student =
                studentService.getStudentById(id);

        if (student.isPresent()) {
            return ResponseEntity.ok(student.get());
        }

        return ResponseEntity.notFound().build();
    }

    // =========================
    // ADD STUDENT
    // =========================

    @PostMapping
    public ResponseEntity<Student> addStudent(
            @RequestBody Student student) {

        Student savedStudent =
                studentService.saveStudent(student);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedStudent);
    }

    // =========================
    // UPDATE STUDENT
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable int id,
            @RequestBody Student student) {

        Student updatedStudent =
                studentService.updateStudent(
                        id,
                        student
                );

        if (updatedStudent != null) {
            return ResponseEntity.ok(updatedStudent);
        }

        return ResponseEntity.notFound().build();
    }

    // =========================
    // DELETE STUDENT
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(
            @PathVariable int id) {

        boolean deleted =
                studentService.deleteStudent(id);

        if (deleted) {

            return ResponseEntity.ok(
                    "Student deleted successfully!"
            );
        }

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Student not found.");
    }
}