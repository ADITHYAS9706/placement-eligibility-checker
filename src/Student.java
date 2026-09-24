public class Student {

    private int id;
    private String name;
    private double cgpa;
    private int backlogs;
    private String branch;
    private int graduationYear;


    // =========================
    // CONSTRUCTOR FOR NEW STUDENT
    // =========================

    public Student(
            String name,
            double cgpa,
            int backlogs,
            String branch,
            int graduationYear) {

        this.name = name;
        this.cgpa = cgpa;
        this.backlogs = backlogs;
        this.branch = branch;
        this.graduationYear = graduationYear;
    }


    // =========================
    // CONSTRUCTOR FOR DATABASE STUDENT
    // =========================

    public Student(
            int id,
            String name,
            double cgpa,
            int backlogs,
            String branch,
            int graduationYear) {

        this.id = id;
        this.name = name;
        this.cgpa = cgpa;
        this.backlogs = backlogs;
        this.branch = branch;
        this.graduationYear = graduationYear;
    }


    // =========================
    // GETTERS
    // =========================

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public double getCgpa() {
        return cgpa;
    }

    public int getBacklogs() {
        return backlogs;
    }

    public String getBranch() {
        return branch;
    }

    public int getGraduationYear() {
        return graduationYear;
    }


    // =========================
    // SETTERS
    // =========================

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCgpa(double cgpa) {
        this.cgpa = cgpa;
    }

    public void setBacklogs(int backlogs) {
        this.backlogs = backlogs;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public void setGraduationYear(int graduationYear) {
        this.graduationYear = graduationYear;
    }
}