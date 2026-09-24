import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class StudentDAO {

    // =========================
    // SAVE STUDENT
    // =========================

    public static int saveStudent(Student student) {

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

            statement.setString(1, student.getName());
            statement.setDouble(2, student.getCgpa());
            statement.setInt(3, student.getBacklogs());
            statement.setString(4, student.getBranch());
            statement.setInt(5, student.getGraduationYear());

            statement.executeUpdate();

            ResultSet keys =
                    statement.getGeneratedKeys();

            if (keys.next()) {

                int studentId =
                        keys.getInt(1);

                student.setId(studentId);

                System.out.println(
                        "Student saved successfully! ID: "
                                + studentId
                );

                return studentId;
            }

        } catch (Exception e) {

            System.out.println(
                    "Failed to save student."
            );

            e.printStackTrace();
        }

        return -1;
    }


    // =========================
    // GET STUDENT BY ID
    // =========================

    public static Student getStudentById(
            int studentId) {

        String sql =
                "SELECT id, name, cgpa, backlogs, " +
                "branch, graduation_year " +
                "FROM students WHERE id = ?";

        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setInt(1, studentId);

            ResultSet resultSet =
                    statement.executeQuery();

            if (resultSet.next()) {

                return new Student(
                        resultSet.getInt("id"),
                        resultSet.getString("name"),
                        resultSet.getDouble("cgpa"),
                        resultSet.getInt("backlogs"),
                        resultSet.getString("branch"),
                        resultSet.getInt("graduation_year")
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


    // =========================
    // GET ALL STUDENTS
    // =========================

    public static List<Student> getAllStudents() {

        List<Student> students =
                new ArrayList<>();

        String sql =
                "SELECT id, name, cgpa, backlogs, " +
                "branch, graduation_year " +
                "FROM students ORDER BY id";

        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql);

                ResultSet resultSet =
                        statement.executeQuery()
        ) {

            while (resultSet.next()) {

                Student student =
                        new Student(
                                resultSet.getInt("id"),
                                resultSet.getString("name"),
                                resultSet.getDouble("cgpa"),
                                resultSet.getInt("backlogs"),
                                resultSet.getString("branch"),
                                resultSet.getInt("graduation_year")
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


    // =========================
    // UPDATE STUDENT
    // =========================

    public static boolean updateStudent(
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

                return true;
            }

            System.out.println(
                    "Student ID not found."
            );

        } catch (Exception e) {

            System.out.println(
                    "Failed to update student."
            );

            e.printStackTrace();
        }

        return false;
    }


    // =========================
    // DELETE STUDENT
    // =========================

    public static boolean deleteStudent(
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

                return true;
            }

            System.out.println(
                    "Student ID not found."
            );

        } catch (Exception e) {

            System.out.println(
                    "Failed to delete student."
            );

            e.printStackTrace();
        }

        return false;
    }


    // =========================
    // SEARCH STUDENTS BY NAME
    // =========================

    public static List<Student> searchStudentsByName(
            String name) {

        List<Student> students =
                new ArrayList<>();

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

            while (rs.next()) {

                students.add(
                        new Student(
                                rs.getInt("id"),
                                rs.getString("name"),
                                rs.getDouble("cgpa"),
                                rs.getInt("backlogs"),
                                rs.getString("branch"),
                                rs.getInt("graduation_year")
                        )
                );
            }

        } catch (Exception e) {

            System.out.println(
                    "Failed to search students."
            );

            e.printStackTrace();
        }

        return students;
    }


    // =========================
    // SEARCH STUDENTS BY BRANCH
    // =========================

    public static List<Student> searchStudentsByBranch(
            String branch) {

        List<Student> students =
                new ArrayList<>();

        String sql =
                "SELECT id, name, cgpa, backlogs, " +
                "branch, graduation_year " +
                "FROM students " +
                "WHERE LOWER(branch) = LOWER(?) " +
                "ORDER BY name";

        try (
                Connection connection =
                        DatabaseConnection.getConnection();

                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {

            statement.setString(
                    1,
                    branch
            );

            ResultSet rs =
                    statement.executeQuery();

            while (rs.next()) {

                students.add(
                        new Student(
                                rs.getInt("id"),
                                rs.getString("name"),
                                rs.getDouble("cgpa"),
                                rs.getInt("backlogs"),
                                rs.getString("branch"),
                                rs.getInt("graduation_year")
                        )
                );
            }

        } catch (Exception e) {

            System.out.println(
                    "Failed to search students by branch."
            );

            e.printStackTrace();
        }

        return students;
    }


    // =========================
    // STUDENTS ABOVE CGPA
    // =========================

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

                students.add(
                        new Student(
                                rs.getInt("id"),
                                rs.getString("name"),
                                rs.getDouble("cgpa"),
                                rs.getInt("backlogs"),
                                rs.getString("branch"),
                                rs.getInt("graduation_year")
                        )
                );
            }

        } catch (Exception e) {

            System.out.println(
                    "Failed to filter students."
            );

            e.printStackTrace();
        }

        return students;
    }
}