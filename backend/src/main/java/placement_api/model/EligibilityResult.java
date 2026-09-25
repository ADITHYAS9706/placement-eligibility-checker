package placement_api.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class EligibilityResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int studentId;

    private int companyId;

    private String result;

    private String reason;

    private LocalDateTime checkedAt;

    // =========================
    // DEFAULT CONSTRUCTOR
    // =========================

    public EligibilityResult() {
    }

    // =========================
    // CONSTRUCTOR
    // =========================

    public EligibilityResult(
            int studentId,
            int companyId,
            String result,
            String reason,
            LocalDateTime checkedAt) {

        this.studentId = studentId;
        this.companyId = companyId;
        this.result = result;
        this.reason = reason;
        this.checkedAt = checkedAt;
    }

    // =========================
    // GETTERS AND SETTERS
    // =========================

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getStudentId() {
        return studentId;
    }

    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }

    public int getCompanyId() {
        return companyId;
    }

    public void setCompanyId(int companyId) {
        this.companyId = companyId;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getCheckedAt() {
        return checkedAt;
    }

    public void setCheckedAt(LocalDateTime checkedAt) {
        this.checkedAt = checkedAt;
    }
}