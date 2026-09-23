public class Student {

    private String name;
    private double cgpa;
    private int backlogs;
    private String branch;
    private int graduationYear;
    private int id;
    public int getId() {
    return id;
}

public void setId(int id) {
    this.id = id;
}

    public Student(String name, double cgpa, int backlogs, String branch, int graduationYear) {
        this.name = name;
        this.cgpa = cgpa;
        this.backlogs = backlogs;
        this.branch = branch;
        this.graduationYear = graduationYear;
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
}