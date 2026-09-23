public class Company {

    private int id;
    private String companyName;
    private double minimumCgpa;
    private int maximumBacklogs;
    private String eligibleBranch;

    public Company(int id,
                   String companyName,
                   double minimumCgpa,
                   int maximumBacklogs,
                   String eligibleBranch) {

        this.id = id;
        this.companyName = companyName;
        this.minimumCgpa = minimumCgpa;
        this.maximumBacklogs = maximumBacklogs;
        this.eligibleBranch = eligibleBranch;
    }

    public int getId() {
        return id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public double getMinimumCgpa() {
        return minimumCgpa;
    }

    public int getMaximumBacklogs() {
        return maximumBacklogs;
    }

    public String getEligibleBranch() {
        return eligibleBranch;
    }
}