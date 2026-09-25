package placement_api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String companyName;

    private double minCgpa;

    private int maxBacklogs;

    private String eligibleBranch;

    private int graduationYear;

    public Company() {
    }

    public Company(
            String companyName,
            double minCgpa,
            int maxBacklogs,
            String eligibleBranch,
            int graduationYear) {

        this.companyName = companyName;
        this.minCgpa = minCgpa;
        this.maxBacklogs = maxBacklogs;
        this.eligibleBranch = eligibleBranch;
        this.graduationYear = graduationYear;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public double getMinCgpa() {
        return minCgpa;
    }

    public void setMinCgpa(double minCgpa) {
        this.minCgpa = minCgpa;
    }

    public int getMaxBacklogs() {
        return maxBacklogs;
    }

    public void setMaxBacklogs(int maxBacklogs) {
        this.maxBacklogs = maxBacklogs;
    }

    public String getEligibleBranch() {
        return eligibleBranch;
    }

    public void setEligibleBranch(String eligibleBranch) {
        this.eligibleBranch = eligibleBranch;
    }

    public int getGraduationYear() {
        return graduationYear;
    }

    public void setGraduationYear(int graduationYear) {
        this.graduationYear = graduationYear;
    }
}