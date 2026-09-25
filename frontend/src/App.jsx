import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // =========================
  // STUDENTS
  // =========================

  const [students, setStudents] = useState([]);

  const [studentForm, setStudentForm] = useState({
    name: "",
    cgpa: "",
    backlogs: "",
    branch: "",
    graduationYear: ""
  });

  const [editingStudentId, setEditingStudentId] = useState(null);

  // =========================
  // COMPANIES
  // =========================

  const [companies, setCompanies] = useState([]);

  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    minCgpa: "",
    maxBacklogs: "",
    eligibleBranch: "",
    graduationYear: ""
  });

  const [editingCompanyId, setEditingCompanyId] = useState(null);

  // =========================
  // ELIGIBILITY
  // =========================

  const [studentId, setStudentId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [eligibilityResult, setEligibilityResult] = useState("");

  // =========================
  // ELIGIBILITY RESULTS
  // =========================

  const [eligibilityResults, setEligibilityResults] = useState([]);

  // =========================
  // MESSAGE
  // =========================

  const [message, setMessage] = useState("");

  // =========================
  // LOAD STUDENTS
  // =========================

  const loadStudents = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/students"
      );

      if (!response.ok) {
        throw new Error("Failed to load students");
      }

      const data = await response.json();

      setStudents(data);

    } catch (error) {
      console.error(error);
      setMessage("Could not connect to student backend.");
    }
  };

  // =========================
  // LOAD COMPANIES
  // =========================

  const loadCompanies = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/companies"
      );

      if (!response.ok) {
        throw new Error("Failed to load companies");
      }

      const data = await response.json();

      setCompanies(data);

    } catch (error) {
      console.error(error);
      setMessage("Could not connect to company backend.");
    }
  };

  // =========================
  // LOAD ELIGIBILITY RESULTS
  // =========================

  const loadEligibilityResults = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/eligibility-results"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load eligibility results"
        );
      }

      const data = await response.json();

      setEligibilityResults(data);

    } catch (error) {
      console.error(error);
      setMessage(
        "Could not connect to eligibility results backend."
      );
    }
  };

  // =========================
  // LOAD DATA WHEN PAGE OPENS
  // =========================

  useEffect(() => {
    loadStudents();
    loadCompanies();
    loadEligibilityResults();
  }, []);

  // =========================
  // STUDENT INPUT
  // =========================

  const handleStudentChange = (event) => {
    setStudentForm({
      ...studentForm,
      [event.target.name]: event.target.value
    });
  };

  // =========================
  // ADD / UPDATE STUDENT
  // =========================

  const handleStudentSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    const studentData = {
      name: studentForm.name,
      cgpa: Number(studentForm.cgpa),
      backlogs: Number(studentForm.backlogs),
      branch: studentForm.branch,
      graduationYear: Number(studentForm.graduationYear)
    };

    try {

      // UPDATE
      if (editingStudentId !== null) {

        const response = await fetch(
          `http://localhost:8080/api/students/${editingStudentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update student");
        }

        const updatedStudent =
          await response.json();

        setStudents(
          students.map((student) =>
            student.id === editingStudentId
              ? updatedStudent
              : student
          )
        );

        setMessage(
          "Student updated successfully!"
        );

        setEditingStudentId(null);

      }

      // ADD
      else {

        const response = await fetch(
          "http://localhost:8080/api/students",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add student");
        }

        const newStudent =
          await response.json();

        setStudents([
          ...students,
          newStudent
        ]);

        setMessage(
          "Student added successfully!"
        );
      }

      setStudentForm({
        name: "",
        cgpa: "",
        backlogs: "",
        branch: "",
        graduationYear: ""
      });

    } catch (error) {

      console.error(error);

      setMessage(
        editingStudentId !== null
          ? "Failed to update student."
          : "Failed to add student."
      );
    }
  };

  // =========================
  // EDIT STUDENT
  // =========================

  const handleEditStudent = (student) => {

    setEditingStudentId(student.id);

    setStudentForm({
      name: student.name,
      cgpa: student.cgpa,
      backlogs: student.backlogs,
      branch: student.branch,
      graduationYear:
        student.graduationYear
    });

    setMessage("");
  };

  // =========================
  // CANCEL STUDENT EDIT
  // =========================

  const cancelStudentEdit = () => {

    setEditingStudentId(null);

    setStudentForm({
      name: "",
      cgpa: "",
      backlogs: "",
      branch: "",
      graduationYear: ""
    });

    setMessage("");
  };

  // =========================
  // DELETE STUDENT
  // =========================

  const handleDeleteStudent = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      const response = await fetch(
        `http://localhost:8080/api/students/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete student"
        );
      }

      setStudents(
        students.filter(
          (student) => student.id !== id
        )
      );

      setMessage(
        "Student deleted successfully!"
      );

    } catch (error) {

      console.error(error);

      setMessage(
        "Failed to delete student."
      );
    }
  };

  // =========================
  // COMPANY INPUT
  // =========================

  const handleCompanyChange = (event) => {

    setCompanyForm({
      ...companyForm,
      [event.target.name]: event.target.value
    });
  };

  // =========================
  // ADD / UPDATE COMPANY
  // =========================

  const handleCompanySubmit = async (event) => {

    event.preventDefault();

    setMessage("");

    const companyData = {
      companyName:
        companyForm.companyName,

      minCgpa:
        Number(companyForm.minCgpa),

      maxBacklogs:
        Number(companyForm.maxBacklogs),

      eligibleBranch:
        companyForm.eligibleBranch,

      graduationYear:
        Number(companyForm.graduationYear)
    };

    try {

      // UPDATE
      if (editingCompanyId !== null) {

        const response = await fetch(
          `http://localhost:8080/api/companies/${editingCompanyId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(companyData)
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to update company"
          );
        }

        const updatedCompany =
          await response.json();

        setCompanies(
          companies.map((company) =>
            company.id === editingCompanyId
              ? updatedCompany
              : company
          )
        );

        setMessage(
          "Company updated successfully!"
        );

        setEditingCompanyId(null);

      }

      // ADD
      else {

        const response = await fetch(
          "http://localhost:8080/api/companies",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(companyData)
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to add company"
          );
        }

        const newCompany =
          await response.json();

        setCompanies([
          ...companies,
          newCompany
        ]);

        setMessage(
          "Company added successfully!"
        );
      }

      setCompanyForm({
        companyName: "",
        minCgpa: "",
        maxBacklogs: "",
        eligibleBranch: "",
        graduationYear: ""
      });

    } catch (error) {

      console.error(error);

      setMessage(
        editingCompanyId !== null
          ? "Failed to update company."
          : "Failed to add company."
      );
    }
  };

  // =========================
  // EDIT COMPANY
  // =========================

  const handleEditCompany = (company) => {

    setEditingCompanyId(company.id);

    setCompanyForm({
      companyName: company.companyName,
      minCgpa: company.minCgpa,
      maxBacklogs: company.maxBacklogs,
      eligibleBranch:
        company.eligibleBranch,
      graduationYear:
        company.graduationYear
    });

    setMessage("");
  };

  // =========================
  // CANCEL COMPANY EDIT
  // =========================

  const cancelCompanyEdit = () => {

    setEditingCompanyId(null);

    setCompanyForm({
      companyName: "",
      minCgpa: "",
      maxBacklogs: "",
      eligibleBranch: "",
      graduationYear: ""
    });

    setMessage("");
  };

  // =========================
  // DELETE COMPANY
  // =========================

  const handleDeleteCompany = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this company?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      const response = await fetch(
        `http://localhost:8080/api/companies/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete company"
        );
      }

      setCompanies(
        companies.filter(
          (company) => company.id !== id
        )
      );

      setMessage(
        "Company deleted successfully!"
      );

    } catch (error) {

      console.error(error);

      setMessage(
        "Failed to delete company."
      );
    }
  };

  // =========================
  // CHECK ELIGIBILITY
  // =========================

  const handleCheckEligibility = async () => {

    if (!studentId || !companyId) {

      setEligibilityResult(
        "Please enter Student ID and Company ID."
      );

      return;
    }

    setEligibilityResult("");

    try {

      const response = await fetch(
        `http://localhost:8080/api/eligibility?studentId=${studentId}&companyId=${companyId}`
      );

      const result =
        await response.text();

      if (!response.ok) {

        setEligibilityResult(result);

        return;
      }

      setEligibilityResult(result);

      // Reload saved results
      await loadEligibilityResults();

    } catch (error) {

      console.error(error);

      setEligibilityResult(
        "Could not connect to eligibility backend."
      );
    }
  };

  return (
    <div className="app">

      {/* =========================
          HEADER
      ========================= */}

      <header className="header">

        <h1>
          Placement Eligibility Checker
        </h1>

        <p>
          Student Placement Management System
        </p>

      </header>

      {/* =========================
          MESSAGE
      ========================= */}

      {message && (
        <p className="message">
          {message}
        </p>
      )}

      {/* =========================
          STUDENT SECTION
      ========================= */}

      <section className="card">

        <h2>
          {editingStudentId !== null
            ? "Edit Student"
            : "Add Student"}
        </h2>

        <form
          onSubmit={handleStudentSubmit}
        >

          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={studentForm.name}
            onChange={handleStudentChange}
            required
          />

          <input
            type="number"
            name="cgpa"
            placeholder="CGPA"
            step="0.01"
            min="0"
            max="10"
            value={studentForm.cgpa}
            onChange={handleStudentChange}
            required
          />

          <input
            type="number"
            name="backlogs"
            placeholder="Backlogs"
            min="0"
            value={studentForm.backlogs}
            onChange={handleStudentChange}
            required
          />

          <input
            type="text"
            name="branch"
            placeholder="Branch"
            value={studentForm.branch}
            onChange={handleStudentChange}
            required
          />

          <input
            type="number"
            name="graduationYear"
            placeholder="Graduation Year"
            value={
              studentForm.graduationYear
            }
            onChange={handleStudentChange}
            required
          />

          <button type="submit">

            {editingStudentId !== null
              ? "Update Student"
              : "Add Student"}

          </button>

          {editingStudentId !== null && (

            <button
              type="button"
              onClick={cancelStudentEdit}
            >
              Cancel
            </button>

          )}

        </form>

      </section>

      {/* =========================
          STUDENT LIST
      ========================= */}

      <section className="card">

        <h2>
          Students
        </h2>

        {students.length === 0 ? (

          <p>
            No students found.
          </p>

        ) : (

          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>ID</th>
                  <th>Name</th>
                  <th>CGPA</th>
                  <th>Backlogs</th>
                  <th>Branch</th>
                  <th>Graduation Year</th>
                  <th>Actions</th>

                </tr>

              </thead>

              <tbody>

                {students.map((student) => (

                  <tr key={student.id}>

                    <td>
                      {student.id}
                    </td>

                    <td>
                      {student.name}
                    </td>

                    <td>
                      {student.cgpa}
                    </td>

                    <td>
                      {student.backlogs}
                    </td>

                    <td>
                      {student.branch}
                    </td>

                    <td>
                      {student.graduationYear}
                    </td>

                    <td>

                      <button
                        onClick={() =>
                          handleEditStudent(student)
                        }
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteStudent(
                            student.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

      {/* =========================
          COMPANY SECTION
      ========================= */}

      <section className="card">

        <h2>
          {editingCompanyId !== null
            ? "Edit Company"
            : "Add Company"}
        </h2>

        <form
          onSubmit={handleCompanySubmit}
        >

          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={
              companyForm.companyName
            }
            onChange={handleCompanyChange}
            required
          />

          <input
            type="number"
            name="minCgpa"
            placeholder="Minimum CGPA"
            step="0.01"
            min="0"
            max="10"
            value={companyForm.minCgpa}
            onChange={handleCompanyChange}
            required
          />

          <input
            type="number"
            name="maxBacklogs"
            placeholder="Maximum Backlogs"
            min="0"
            value={
              companyForm.maxBacklogs
            }
            onChange={handleCompanyChange}
            required
          />

          <input
            type="text"
            name="eligibleBranch"
            placeholder="Eligible Branch"
            value={
              companyForm.eligibleBranch
            }
            onChange={handleCompanyChange}
            required
          />

          <input
            type="number"
            name="graduationYear"
            placeholder="Graduation Year"
            value={
              companyForm.graduationYear
            }
            onChange={handleCompanyChange}
            required
          />

          <button type="submit">

            {editingCompanyId !== null
              ? "Update Company"
              : "Add Company"}

          </button>

          {editingCompanyId !== null && (

            <button
              type="button"
              onClick={cancelCompanyEdit}
            >
              Cancel
            </button>

          )}

        </form>

      </section>

      {/* =========================
          COMPANY LIST
      ========================= */}

      <section className="card">

        <h2>
          Companies
        </h2>

        {companies.length === 0 ? (

          <p>
            No companies found.
          </p>

        ) : (

          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>ID</th>
                  <th>Company</th>
                  <th>Min CGPA</th>
                  <th>Max Backlogs</th>
                  <th>Eligible Branch</th>
                  <th>Graduation Year</th>
                  <th>Actions</th>

                </tr>

              </thead>

              <tbody>

                {companies.map((company) => (

                  <tr key={company.id}>

                    <td>
                      {company.id}
                    </td>

                    <td>
                      {company.companyName}
                    </td>

                    <td>
                      {company.minCgpa}
                    </td>

                    <td>
                      {company.maxBacklogs}
                    </td>

                    <td>
                      {company.eligibleBranch}
                    </td>

                    <td>
                      {company.graduationYear}
                    </td>

                    <td>

                      <button
                        onClick={() =>
                          handleEditCompany(company)
                        }
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteCompany(
                            company.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

      {/* =========================
          ELIGIBILITY CHECK
      ========================= */}

      <section className="card">

        <h2>
          Check Eligibility
        </h2>

        <input
          type="number"
          placeholder="Student ID"
          value={studentId}
          onChange={(event) =>
            setStudentId(event.target.value)
          }
        />

        <input
          type="number"
          placeholder="Company ID"
          value={companyId}
          onChange={(event) =>
            setCompanyId(event.target.value)
          }
        />

        <button
          onClick={handleCheckEligibility}
        >
          Check Eligibility
        </button>

        {eligibilityResult && (

          <div className="message">

            <h3>
              Eligibility Result
            </h3>

            <p>
              {eligibilityResult}
            </p>

          </div>

        )}

      </section>

      {/* =========================
          ELIGIBILITY RESULTS
      ========================= */}

      <section className="card">

        <h2>
          Eligibility Results
        </h2>

        {eligibilityResults.length === 0 ? (

          <p>
            No eligibility results found.
          </p>

        ) : (

          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>ID</th>
                  <th>Student ID</th>
                  <th>Company ID</th>
                  <th>Result</th>
                  <th>Reason</th>
                  <th>Checked At</th>

                </tr>

              </thead>

              <tbody>

                {eligibilityResults.map(
                  (item) => (

                    <tr key={item.id}>

                      <td>
                        {item.id}
                      </td>

                      <td>
                        {item.studentId}
                      </td>

                      <td>
                        {item.companyId}
                      </td>

                      <td>
                        {item.result}
                      </td>

                      <td>
                        {item.reason}
                      </td>

                      <td>
                        {item.checkedAt
                          ? new Date(
                              item.checkedAt
                            ).toLocaleString()
                          : "N/A"}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}

export default App;