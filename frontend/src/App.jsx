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
    graduationYear: "",
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
    graduationYear: "",
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

      if (data.length > 0 && !studentId) {
        setStudentId(String(data[0].id));
      }

    } catch (error) {
      console.error(error);

      setMessage(
        "Could not connect to student backend."
      );
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

      if (data.length > 0 && !companyId) {
        setCompanyId(String(data[0].id));
      }

    } catch (error) {
      console.error(error);

      setMessage(
        "Could not connect to company backend."
      );
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
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    loadStudents();
    loadCompanies();
    loadEligibilityResults();
  }, []);

  // =========================
  // FIND STUDENT
  // =========================

  const getStudentName = (id) => {

    const student = students.find(
      (student) =>
        Number(student.id) === Number(id)
    );

    return student
      ? student.name
      : "Unknown Student";
  };

  // =========================
  // FIND COMPANY
  // =========================

  const getCompanyName = (id) => {

    const company = companies.find(
      (company) =>
        Number(company.id) === Number(id)
    );

    return company
      ? company.companyName
      : "Unknown Company";
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDateTime = (dateValue) => {

    if (!dateValue) {
      return "N/A";
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // =========================
  // DASHBOARD COUNTS
  // =========================

  const totalStudents = students.length;

  const totalCompanies = companies.length;

  // Students who have at least one eligible result
  const eligibleStudentIds = new Set();

  // Students who have been checked at least once
  const checkedStudentIds = new Set();

  eligibilityResults.forEach((item) => {

    const result = String(
      item.result || ""
    ).toLowerCase();

    const id = Number(item.studentId);

    if (!id) {
      return;
    }

    checkedStudentIds.add(id);

    if (
      result.includes("eligible") &&
      !result.includes("not eligible")
    ) {
      eligibleStudentIds.add(id);
    }
  });

  // =========================
  // ELIGIBLE STUDENTS
  // =========================

  const totalEligible =
    eligibleStudentIds.size;

  // =========================
  // NOT ELIGIBLE STUDENTS
  // =========================

  const notEligibleStudentIds =
    new Set();

  checkedStudentIds.forEach((id) => {

    if (!eligibleStudentIds.has(id)) {
      notEligibleStudentIds.add(id);
    }

  });

  const totalNotEligible =
    notEligibleStudentIds.size;

  // =========================
  // PENDING / NOT CHECKED
  // =========================

  const totalPending =
    Math.max(
      0,
      totalStudents -
      totalEligible -
      totalNotEligible
    );

  // =========================
  // STUDENT INPUT
  // =========================

  const handleStudentChange = (event) => {

    setStudentForm({
      ...studentForm,
      [event.target.name]:
        event.target.value,
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
      graduationYear: Number(
        studentForm.graduationYear
      ),
    };

    try {

      if (editingStudentId !== null) {

        const response = await fetch(
          `http://localhost:8080/api/students/${editingStudentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(studentData),
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to update student"
          );
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

      } else {

        const response = await fetch(
          "http://localhost:8080/api/students",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(studentData),
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to add student"
          );
        }

        const newStudent =
          await response.json();

        setStudents([
          ...students,
          newStudent,
        ]);

        setStudentId(
          String(newStudent.id)
        );

        setMessage(
          "Student added successfully!"
        );
      }

      setStudentForm({
        name: "",
        cgpa: "",
        backlogs: "",
        branch: "",
        graduationYear: "",
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
        student.graduationYear,
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
      graduationYear: "",
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
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete student"
        );
      }

      const updatedStudents =
        students.filter(
          (student) =>
            student.id !== id
        );

      setStudents(updatedStudents);

      if (
        Number(studentId) === Number(id)
      ) {

        if (updatedStudents.length > 0) {

          setStudentId(
            String(
              updatedStudents[0].id
            )
          );

        } else {

          setStudentId("");

        }
      }

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
      [event.target.name]:
        event.target.value,
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
        Number(companyForm.graduationYear),
    };

    try {

      if (editingCompanyId !== null) {

        const response = await fetch(
          `http://localhost:8080/api/companies/${editingCompanyId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(companyData),
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

      } else {

        const response = await fetch(
          "http://localhost:8080/api/companies",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(companyData),
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
          newCompany,
        ]);

        setCompanyId(
          String(newCompany.id)
        );

        setMessage(
          "Company added successfully!"
        );
      }

      setCompanyForm({
        companyName: "",
        minCgpa: "",
        maxBacklogs: "",
        eligibleBranch: "",
        graduationYear: "",
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
      maxBacklogs:
        company.maxBacklogs,
      eligibleBranch:
        company.eligibleBranch,
      graduationYear:
        company.graduationYear,
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
      graduationYear: "",
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
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete company"
        );
      }

      const updatedCompanies =
        companies.filter(
          (company) =>
            company.id !== id
        );

      setCompanies(updatedCompanies);

      if (
        Number(companyId) === Number(id)
      ) {

        if (updatedCompanies.length > 0) {

          setCompanyId(
            String(
              updatedCompanies[0].id
            )
          );

        } else {

          setCompanyId("");

        }
      }

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
        "Please select a student and company."
      );

      return;
    }

    setEligibilityResult("");
    setMessage("");

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

      await loadEligibilityResults();

    } catch (error) {

      console.error(error);

      setEligibilityResult(
        "Could not connect to eligibility backend."
      );
    }
  };

  // =========================
  // RESULT STYLE
  // =========================

  const getResultStyle = (result) => {

    const text = String(
      result || ""
    ).toLowerCase();

    if (
      text.includes("eligible") &&
      !text.includes("not eligible")
    ) {

      return {
        color: "#15803d",
        fontWeight: "bold",
      };
    }

    return {
      color: "#dc2626",
      fontWeight: "bold",
    };
  };

  // =========================
  // DASHBOARD CARD
  // =========================

  const DashboardCard = ({
    title,
    value,
    description,
    valueColor,
  }) => {

    return (

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "22px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
          flex: "1 1 200px",
          minWidth: "200px",
        }}
      >

        <p
          style={{
            margin: "0 0 8px 0",
            color: "#374151",
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          {title}
        </p>

        <h2
          style={{
            margin: "0 0 6px 0",
            fontSize: "36px",
            fontWeight: "800",
            color: valueColor,
          }}
        >
          {value}
        </h2>

        <p
          style={{
            margin: 0,
            color: "#6b7280",
            fontSize: "13px",
          }}
        >
          {description}
        </p>

      </div>
    );
  };

  // =========================
  // PAGE
  // =========================

  return (

    <div className="app">

      {/* HEADER */}

      <header className="header">

        <h1>
          Placement Eligibility Checker
        </h1>

        <p>
          Student Placement Management System
        </p>

      </header>

      {/* MESSAGE */}

      {message && (
        <p className="message">
          {message}
        </p>
      )}

      {/* DASHBOARD */}

      <section
        style={{
          marginBottom: "30px",
        }}
      >

        <h2
          style={{
            marginBottom: "15px",
          }}
        >
          Dashboard
        </h2>

        <div
          style={{
            display: "flex",
            gap: "18px",
            flexWrap: "wrap",
          }}
        >

          <DashboardCard
            title="Total Students"
            value={totalStudents}
            description="Students registered"
            valueColor="#2563eb"
          />

          <DashboardCard
            title="Total Companies"
            value={totalCompanies}
            description="Companies registered"
            valueColor="#7c3aed"
          />

          <DashboardCard
            title="Eligible Students"
            value={totalEligible}
            description="Unique students eligible"
            valueColor="#16a34a"
          />

          <DashboardCard
            title="Not Eligible Students"
            value={totalNotEligible}
            description="Unique students not eligible"
            valueColor="#dc2626"
          />

          <DashboardCard
            title="Pending / Not Checked"
            value={totalPending}
            description="Students not checked yet"
            valueColor="#ea580c"
          />

        </div>

      </section>

      {/* STUDENT SECTION */}

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
              onClick={cancelStudentEdit}
            >
              Cancel
            </button>

          )}

        </form>

      </section>

      {/* STUDENT LIST */}

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
                          handleEditStudent(
                            student
                          )
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

      {/* COMPANY SECTION */}

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
              onClick={cancelCompanyEdit}
            >
              Cancel
            </button>

          )}

        </form>

      </section>

      {/* COMPANY LIST */}

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
                          handleEditCompany(
                            company
                          )
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

      {/* ELIGIBILITY CHECK */}

      <section className="card">

        <h2>
          Check Placement Eligibility
        </h2>

        <p>
          Select a student and company to
          check whether the student is
          eligible.
        </p>

        <select
          value={studentId}
          onChange={(event) =>
            setStudentId(
              event.target.value
            )
          }
          disabled={
            students.length === 0
          }
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            fontSize: "16px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        >

          <option value="">
            Select Student
          </option>

          {students.map((student) => (

            <option
              key={student.id}
              value={student.id}
            >
              {student.name} — ID{" "}
              {student.id}
            </option>

          ))}

        </select>

        <select
          value={companyId}
          onChange={(event) =>
            setCompanyId(
              event.target.value
            )
          }
          disabled={
            companies.length === 0
          }
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            fontSize: "16px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        >

          <option value="">
            Select Company
          </option>

          {companies.map((company) => (

            <option
              key={company.id}
              value={company.id}
            >
              {company.companyName} — ID{" "}
              {company.id}
            </option>

          ))}

        </select>

        <button
          onClick={handleCheckEligibility}
          disabled={
            !studentId ||
            !companyId ||
            students.length === 0 ||
            companies.length === 0
          }
        >
          Check Eligibility
        </button>

        {eligibilityResult && (

          <div className="message">

            <h3>
              Eligibility Result
            </h3>

            <p
              style={getResultStyle(
                eligibilityResult
              )}
            >
              {eligibilityResult}
            </p>

          </div>

        )}

      </section>

      {/* ELIGIBILITY RESULTS */}

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
                  <th>Student</th>
                  <th>Company</th>
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

                        <strong>
                          {getStudentName(
                            item.studentId
                          )}
                        </strong>

                        <br />

                        <small>
                          ID:{" "}
                          {item.studentId}
                        </small>

                      </td>

                      <td>

                        <strong>
                          {getCompanyName(
                            item.companyId
                          )}
                        </strong>

                        <br />

                        <small>
                          ID:{" "}
                          {item.companyId}
                        </small>

                      </td>

                      <td>

                        <span
                          style={{
                            ...getResultStyle(
                              item.result
                            ),
                            padding:
                              "6px 10px",
                            borderRadius:
                              "6px",
                          }}
                        >
                          {item.result}
                        </span>

                      </td>

                      <td>
                        {item.reason
                          ? item.reason
                          : "No reason available"}
                      </td>

                      <td>
                        {formatDateTime(
                          item.checkedAt
                        )}
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