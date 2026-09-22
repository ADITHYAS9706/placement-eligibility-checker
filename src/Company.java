public class Company {

    private String companyName;
    private double minimumCgpa;
    private int maximumBacklogs;
    private String eligibleBranch;

    public Company(String companyName, double minimumCgpa,
                   int maximumBacklogs, String eligibleBranch) {

        this.companyName = companyName;
        this.minimumCgpa = minimumCgpa;
        this.maximumBacklogs = maximumBacklogs;
        this.eligibleBranch = eligibleBranch;
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