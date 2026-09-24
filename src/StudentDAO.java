import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class StudentDAO {

    // =====================================================
    // SAVE STUDENT
    // =====================================================

    public static void saveStudent(Student student) {

        String sql =
                "INSERT INTO students " +
                "(name, cgpa, backlogs, branch, graduation_year) " +
                "VALUES (?, ?, ?, ?, ?)";

        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(
                                sql,
                                java.sql.Statement.RETURN_GENERATED_KEYS
                        )
        ) {

            statement.setString(
                    1,
                    student.getName()
            );

            statement.setDouble(
                    2,
                    student.getCgpa()
            );

            statement.setInt(
                    3,
                    student.getBacklogs()
            );

            statement.setString(
                    4,
                    student.getBranch()
            );

            statement.setInt(
                    5,
                    student.getGraduationYear()
            );

            statement.executeUpdate();

            ResultSet keys =
                    statement.getGeneratedKeys();

            if (keys.next()) {

                System.out.println(
                        "Student saved successfully! ID: "
                                + keys.getInt(1)
                );

            } else {

                System.out.println(
                        "Student saved successfully!"
                );
            }

        } catch (Exception e) {

            System.out.println(
                    "Failed to save student."
            );

            e.printStackTrace();
        }
    }


    // =====================================================
    // GET STUDENT BY ID
    // =====================================================

    public static Student getStudentById(
            int studentId) {

        String sql =
                "SELECT id, name, cgpa, backlogs, " +
                "branch, graduation_year " +
                "FROM students " +
                "WHERE id = ?";

        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setInt(
                    1,
                    studentId
            );

            ResultSet rs =
                    statement.executeQuery();

            if (rs.next()) {

                return new Student(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getDouble("cgpa"),
                        rs.getInt("backlogs"),
                        rs.getString("branch"),
                        rs.getInt("graduation_year")
                );
            }

        } catch (Exception e) {

            System.out.println(
                    "Failed to load student."
            );

            e.printStackTrace();
        }

        return null;
    }


    // =====================================================
    // GET ALL STUDENTS
    // =====================================================

    public static List<Student> getAllStudents() {

        List<Student> students =
                new ArrayList<>();

        String sql =
                "SELECT id, name, cgpa, backlogs, " +
                "branch, graduation_year " +
                "FROM students " +
                "ORDER BY id";

        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql);

                ResultSet rs =
                        statement.executeQuery()
        ) {

            while (rs.next()) {

                Student student =
                        new Student(
                                rs.getInt("id"),
                                rs.getString("name"),
                                rs.getDouble("cgpa"),
                                rs.getInt("backlogs"),
                                rs.getString("branch"),
                                rs.getInt("graduation_year")
                        );

                students.add(student);
            }

        } catch (Exception e) {

            System.out.println(
                    "Failed to load students."
            );

            e.printStackTrace();
        }

        return students;
    }


    // =====================================================
    // UPDATE STUDENT
    // =====================================================

    public static void updateStudent(
            Student student) {

        String sql =
                "UPDATE students SET " +
                "name = ?, " +
                "cgpa = ?, " +
                "backlogs = ?, " +
                "branch = ?, " +
                "graduation_year = ? " +
                "WHERE id = ?";

        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setString(
                    1,
                    student.getName()
            );

            statement.setDouble(
                    2,
                    student.getCgpa()
            );

            statement.setInt(
                    3,
                    student.getBacklogs()
            );

            statement.setString(
                    4,
                    student.getBranch()
            );

            statement.setInt(
                    5,
                    student.getGraduationYear()
            );

            statement.setInt(
                    6,
                    student.getId()
            );

            int rows =
                    statement.executeUpdate();

            if (rows > 0) {

                System.out.println(
                        "Student updated successfully!"
                );

            } else {

                System.out.println(
                        "Student ID not found."
                );
            }

        } catch (Exception e) {

            System.out.println(
                    "Failed to update student."
            );

            e.printStackTrace();
        }
    }


    // =====================================================
    // DELETE STUDENT
    // =====================================================

    public static void deleteStudent(
            int studentId) {

        String sql =
                "DELETE FROM students WHERE id = ?";

        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setInt(
                    1,
                    studentId
            );

            int rows =
                    statement.executeUpdate();

            if (rows > 0) {

                System.out.println(
                        "Student deleted successfully!"
                );

            } else {

                System.out.println(
                        "Student ID not found."
                );
            }

        } catch (Exception e) {

            System.out.println(
                    "Failed to delete student."
            );

            e.printStackTrace();
        }
    }


    // =====================================================
    // SEARCH STUDENTS BY NAME
    // =====================================================

    public static void searchStudentsByName(
            String name) {

        String sql =
                "SELECT id, name, cgpa, backlogs, " +
                "branch, graduation_year " +
                "FROM students " +
                "WHERE name LIKE ? " +
                "ORDER BY name";

        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setString(
                    1,
                    "%" + name + "%"
            );

            ResultSet rs =
                    statement.executeQuery();

            boolean found = false;

            System.out.println(
                    "\n===== SEARCH RESULTS ====="
            );

            while (rs.next()) {

                found = true;

                System.out.println(
                        "Student ID : "
                                + rs.getInt("id")
                );

                System.out.println(
                        "Name       : "
                                + rs.getString("name")
                );

                System.out.println(
                        "CGPA       : "
                                + rs.getDouble("cgpa")
                );

                System.out.println(
                        "Backlogs   : "
                                + rs.getInt("backlogs")
                );

                System.out.println(
                        "Branch     : "
                                + rs.getString("branch")
                );

                System.out.println(
                        "Graduation : "
                                + rs.getInt(
                                        "graduation_year"
                                )
                );

                System.out.println(
                        "-----------------------------"
                );
            }

            if (!found) {

                System.out.println(
                        "No students found."
                );
            }

        } catch (Exception e) {

            System.out.println(
                    "Failed to search students."
            );

            e.printStackTrace();
        }
    }


    // =====================================================
    // SEARCH STUDENTS BY BRANCH
    // =====================================================

    public static List<Student> searchStudentsByBranch(
            String branch) {

        List<Student> students =
                new ArrayList<>();

        String sql =
                "SELECT id, name, cgpa, backlogs, " +
                "branch, graduation_year " +
                "FROM students " +
                "WHERE branch LIKE ? " +
                "ORDER BY name";

        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setString(
                    1,
                    "%" + branch + "%"
            );

            ResultSet rs =
                    statement.executeQuery();

            while (rs.next()) {

                Student student =
                        new Student(
                                rs.getInt("id"),
                                rs.getString("name"),
                                rs.getDouble("cgpa"),
                                rs.getInt("backlogs"),
                                rs.getString("branch"),
                                rs.getInt("graduation_year")
                        );

                students.add(student);
            }

        } catch (Exception e) {

            System.out.println(
                    "Failed to search students by branch."
            );

            e.printStackTrace();
        }

        return students;
    }


    // =====================================================
    // GET STUDENTS ABOVE CGPA
    // =====================================================

    public static List<Student> getStudentsAboveCgpa(
            double cgpa) {

        List<Student> students =
                new ArrayList<>();

        String sql =
                "SELECT id, name, cgpa, backlogs, " +
                "branch, graduation_year " +
                "FROM students " +
                "WHERE cgpa >= ? " +
                "ORDER BY cgpa DESC";

        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setDouble(
                    1,
                    cgpa
            );

            ResultSet rs =
                    statement.executeQuery();

            while (rs.next()) {

                Student student =
                        new Student(
                                rs.getInt("id"),
                                rs.getString("name"),
                                rs.getDouble("cgpa"),
                                rs.getInt("backlogs"),
                                rs.getString("branch"),
                                rs.getInt("graduation_year")
                        );

                students.add(student);
            }

        } catch (Exception e) {

            System.out.println(
                    "Failed to search students by CGPA."
            );

            e.printStackTrace();
        }

        return students;
    }
}