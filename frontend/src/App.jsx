import { useEffect, useState } from "react";
import "./App.css";

const API_BASE = "http://localhost:8080/api";

function App() {
  // =========================================================
  // STUDENTS
  // =========================================================

  const [students, setStudents] = useState([]);

  const [studentForm, setStudentForm] = useState({
    name: "",
    cgpa: "",
    backlogs: "",
    branch: "",
    graduationYear: ""
  });

  const [editingStudentId, setEditingStudentId] = useState(null);
  const [studentMessage, setStudentMessage] = useState("");

  // =========================================================
  // COMPANIES
  // =========================================================

  const [companies, setCompanies] = useState([]);

  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    minCgpa: "",
    maxBacklogs: "",
    eligibleBranch: "",
    graduationYear: ""
  });

  const [editingCompanyId, setEditingCompanyId] = useState(null);
  const [companyMessage, setCompanyMessage] = useState("");

  // =========================================================
  // ELIGIBILITY
  // =========================================================

  const [studentId, setStudentId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [eligibilityResult, setEligibilityResult] = useState("");
  const [eligibilityMessage, setEligibilityMessage] = useState("");

  // =========================================================
  // LOAD STUDENTS
  // =========================================================

  const loadStudents = async () => {
    try {
      const response = await fetch(`${API_BASE}/students`);

      if (!response.ok) {
        throw new Error("Failed to load students");
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Student loading error:", error);
      setStudentMessage("Could not connect to student backend.");
    }
  };

  // =========================================================
  // LOAD COMPANIES
  // =========================================================

  const loadCompanies = async () => {
    try {
      const response = await fetch(`${API_BASE}/companies`);

      if (!response.ok) {
        throw new Error("Failed to load companies");
      }

      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error("Company loading error:", error);
      setCompanyMessage("Could not connect to company backend.");
    }
  };

  // =========================================================
  // LOAD DATA WHEN PAGE OPENS
  // =========================================================

  useEffect(() => {
    loadStudents();
    loadCompanies();
  }, []);

  // =========================================================
  // STUDENT INPUT
  // =========================================================

  const handleStudentChange = (event) => {
    setStudentForm({
      ...studentForm,
      [event.target.name]: event.target.value
    });
  };

  // =========================================================
  // ADD / UPDATE STUDENT
  // =========================================================

  const handleStudentSubmit = async (event) => {
    event.preventDefault();

    setStudentMessage("");

    try {
      const studentData = {
        name: studentForm.name,
        cgpa: Number(studentForm.cgpa),
        backlogs: Number(studentForm.backlogs),
        branch: studentForm.branch,
        graduationYear: Number(studentForm.graduationYear)
      };

      let response;

      // UPDATE
      if (editingStudentId !== null) {
        response = await fetch(
          `${API_BASE}/students/${editingStudentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
          }
        );
      }

      // ADD
      else {
        response = await fetch(`${API_BASE}/students`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(studentData)
        });
      }

      if (!response.ok) {
        throw new Error("Student request failed");
      }

      const savedStudent = await response.json();

      if (editingStudentId !== null) {
        setStudents(
          students.map((student) =>
            student.id === editingStudentId
              ? savedStudent
              : student
          )
        );

        setStudentMessage("Student updated successfully!");
      } else {
        setStudents([...students, savedStudent]);

        setStudentMessage("Student added successfully!");
      }

      setStudentForm({
        name: "",
        cgpa: "",
        backlogs: "",
        branch: "",
        graduationYear: ""
      });

      setEditingStudentId(null);

    } catch (error) {
      console.error("Student submit error:", error);

      if (editingStudentId !== null) {
        setStudentMessage("Failed to update student.");
      } else {
        setStudentMessage("Failed to add student.");
      }
    }
  };

  // =========================================================
  // EDIT STUDENT
  // =========================================================

  const handleEditStudent = (student) => {
    setEditingStudentId(student.id);

    setStudentForm({
      name: student.name,
      cgpa: student.cgpa,
      backlogs: student.backlogs,
      branch: student.branch,
      graduationYear: student.graduationYear
    });

    setStudentMessage("");
  };

  // =========================================================
  // CANCEL STUDENT EDIT
  // =========================================================

  const handleCancelStudentEdit = () => {
    setEditingStudentId(null);

    setStudentForm({
      name: "",
      cgpa: "",
      backlogs: "",
      branch: "",
      graduationYear: ""
    });

    setStudentMessage("");
  };

  // =========================================================
  // DELETE STUDENT
  // =========================================================

  const handleDeleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/students/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      setStudents(
        students.filter((student) => student.id !== id)
      );

      setStudentMessage("Student deleted successfully!");

    } catch (error) {
      console.error("Delete student error:", error);
      setStudentMessage("Failed to delete student.");
    }
  };

  // =========================================================
  // COMPANY INPUT
  // =========================================================

  const handleCompanyChange = (event) => {
    setCompanyForm({
      ...companyForm,
      [event.target.name]: event.target.value
    });
  };

  // =========================================================
  // ADD / UPDATE COMPANY
  // =========================================================

  const handleCompanySubmit = async (event) => {
    event.preventDefault();

    setCompanyMessage("");

    try {
      const companyData = {
        companyName: companyForm.companyName,
        minCgpa: Number(companyForm.minCgpa),
        maxBacklogs: Number(companyForm.maxBacklogs),
        eligibleBranch: companyForm.eligibleBranch,
        graduationYear: Number(companyForm.graduationYear)
      };

      let response;

      // UPDATE
      if (editingCompanyId !== null) {
        response = await fetch(
          `${API_BASE}/companies/${editingCompanyId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(companyData)
          }
        );
      }

      // ADD
      else {
        response = await fetch(`${API_BASE}/companies`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(companyData)
        });
      }

      if (!response.ok) {
        throw new Error("Company request failed");
      }

      const savedCompany = await response.json();

      if (editingCompanyId !== null) {
        setCompanies(
          companies.map((company) =>
            company.id === editingCompanyId
              ? savedCompany
              : company
          )
        );

        setCompanyMessage("Company updated successfully!");
      } else {
        setCompanies([...companies, savedCompany]);

        setCompanyMessage("Company added successfully!");
      }

      setCompanyForm({
        companyName: "",
        minCgpa: "",
        maxBacklogs: "",
        eligibleBranch: "",
        graduationYear: ""
      });

      setEditingCompanyId(null);

    } catch (error) {
      console.error("Company submit error:", error);

      if (editingCompanyId !== null) {
        setCompanyMessage("Failed to update company.");
      } else {
        setCompanyMessage("Failed to add company.");
      }
    }
  };

  // =========================================================
  // EDIT COMPANY
  // =========================================================

  const handleEditCompany = (company) => {
    setEditingCompanyId(company.id);

    setCompanyForm({
      companyName: company.companyName,
      minCgpa: company.minCgpa,
      maxBacklogs: company.maxBacklogs,
      eligibleBranch: company.eligibleBranch,
      graduationYear: company.graduationYear
    });

    setCompanyMessage("");
  };

  // =========================================================
  // CANCEL COMPANY EDIT
  // =========================================================

  const handleCancelCompanyEdit = () => {
    setEditingCompanyId(null);

    setCompanyForm({
      companyName: "",
      minCgpa: "",
      maxBacklogs: "",
      eligibleBranch: "",
      graduationYear: ""
    });

    setCompanyMessage("");
  };

  // =========================================================
  // DELETE COMPANY
  // =========================================================

  const handleDeleteCompany = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this company?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/companies/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete company");
      }

      setCompanies(
        companies.filter((company) => company.id !== id)
      );

      setCompanyMessage("Company deleted successfully!");

    } catch (error) {
      console.error("Delete company error:", error);
      setCompanyMessage("Failed to delete company.");
    }
  };

  // =========================================================
  // CHECK ELIGIBILITY
  // =========================================================

  const handleCheckEligibility = async (event) => {
    event.preventDefault();

    setEligibilityResult("");
    setEligibilityMessage("");

    if (!studentId || !companyId) {
      setEligibilityMessage(
        "Please enter both Student ID and Company ID."
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/eligibility?studentId=${studentId}&companyId=${companyId}`
      );

      const resultText = await response.text();

      if (!response.ok) {
        setEligibilityMessage(resultText);
        return;
      }

      setEligibilityResult(resultText);

    } catch (error) {
      console.error("Eligibility error:", error);

      setEligibilityMessage(
        "Could not connect to eligibility backend."
      );
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="app">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="header">
        <h1>Placement Eligibility Checker</h1>
        <p>Student Placement Management System</p>
      </header>


      {/* =====================================================
          STUDENT SECTION
      ===================================================== */}

      <section className="card">

        <h2>
          {editingStudentId !== null
            ? "Edit Student"
            : "Add Student"}
        </h2>

        <form onSubmit={handleStudentSubmit}>

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
            value={studentForm.graduationYear}
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
              onClick={handleCancelStudentEdit}
            >
              Cancel
            </button>
          )}

        </form>

        {studentMessage && (
          <p className="message">
            {studentMessage}
          </p>
        )}

      </section>


      {/* =====================================================
          STUDENT TABLE
      ===================================================== */}

      <section className="card">

        <h2>Students</h2>

        {students.length === 0 ? (

          <p>No students found.</p>

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

                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.cgpa}</td>
                    <td>{student.backlogs}</td>
                    <td>{student.branch}</td>
                    <td>{student.graduationYear}</td>

                    <td>

                      <button
                        type="button"
                        onClick={() =>
                          handleEditStudent(student)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteStudent(student.id)
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


      {/* =====================================================
          COMPANY SECTION
      ===================================================== */}

      <section className="card">

        <h2>
          {editingCompanyId !== null
            ? "Edit Company"
            : "Add Company"}
        </h2>

        <form onSubmit={handleCompanySubmit}>

          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={companyForm.companyName}
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
            value={companyForm.maxBacklogs}
            onChange={handleCompanyChange}
            required
          />

          <input
            type="text"
            name="eligibleBranch"
            placeholder="Eligible Branch"
            value={companyForm.eligibleBranch}
            onChange={handleCompanyChange}
            required
          />

          <input
            type="number"
            name="graduationYear"
            placeholder="Graduation Year"
            value={companyForm.graduationYear}
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
              onClick={handleCancelCompanyEdit}
            >
              Cancel
            </button>
          )}

        </form>

        {companyMessage && (
          <p className="message">
            {companyMessage}
          </p>
        )}

      </section>


      {/* =====================================================
          COMPANY TABLE
      ===================================================== */}

      <section className="card">

        <h2>Companies</h2>

        {companies.length === 0 ? (

          <p>No companies found.</p>

        ) : (

          <div className="table-container">

            <table>

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Company Name</th>
                  <th>Minimum CGPA</th>
                  <th>Maximum Backlogs</th>
                  <th>Eligible Branch</th>
                  <th>Graduation Year</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {companies.map((company) => (

                  <tr key={company.id}>

                    <td>{company.id}</td>

                    <td>{company.companyName}</td>

                    <td>{company.minCgpa}</td>

                    <td>{company.maxBacklogs}</td>

                    <td>{company.eligibleBranch}</td>

                    <td>{company.graduationYear}</td>

                    <td>

                      <button
                        type="button"
                        onClick={() =>
                          handleEditCompany(company)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteCompany(company.id)
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


      {/* =====================================================
          ELIGIBILITY SECTION
      ===================================================== */}

      <section className="card">

        <h2>Check Placement Eligibility</h2>

        <form onSubmit={handleCheckEligibility}>

          <input
            type="number"
            placeholder="Student ID"
            value={studentId}
            onChange={(event) =>
              setStudentId(event.target.value)
            }
            min="1"
            required
          />

          <input
            type="number"
            placeholder="Company ID"
            value={companyId}
            onChange={(event) =>
              setCompanyId(event.target.value)
            }
            min="1"
            required
          />

          <button type="submit">
            Check Eligibility
          </button>

        </form>

        {eligibilityResult && (
          <div className="message">
            <h3>Eligibility Result</h3>
            <p>{eligibilityResult}</p>
          </div>
        )}

        {eligibilityMessage && (
          <p className="message">
            {eligibilityMessage}
          </p>
        )}

      </section>

    </div>
  );
}

export default App;