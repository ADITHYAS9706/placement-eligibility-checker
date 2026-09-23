import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class StudentDAO {

    // Save student
    public static int saveStudent(Student student) {

        String sql = "INSERT INTO students " +
                     "(name, cgpa, backlogs, branch, graduation_year) " +
                     "VALUES (?, ?, ?, ?, ?)";

        try (
            Connection connection = DatabaseConnection.getConnection();
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

            ResultSet keys = statement.getGeneratedKeys();

            if (keys.next()) {

                int studentId = keys.getInt(1);

                student.setId(studentId);

                System.out.println(
                    "Student saved successfully! ID: " + studentId
                );

                return studentId;
            }

        } catch (Exception e) {

            System.out.println("Failed to save student.");
            e.printStackTrace();
        }

        return -1;
    }


    // Get student by ID
    public static Student getStudentById(int studentId) {

        String sql = "SELECT * FROM students WHERE id = ?";

        try (
            Connection connection = DatabaseConnection.getConnection();
            PreparedStatement statement =
                    connection.prepareStatement(sql)
        ) {

            statement.setInt(1, studentId);

            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {

                Student student = new Student(
                    resultSet.getString("name"),
                    resultSet.getDouble("cgpa"),
                    resultSet.getInt("backlogs"),
                    resultSet.getString("branch"),
                    resultSet.getInt("graduation_year")
                );

                student.setId(resultSet.getInt("id"));

                return student;
            }

        } catch (Exception e) {

            System.out.println("Failed to load student.");
            e.printStackTrace();
        }

        return null;
    }
}