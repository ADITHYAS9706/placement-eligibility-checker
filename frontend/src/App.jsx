import { useEffect, useState } from "react";
import "./App.css";
import Login from "./Login";
import { apiFetch } from "./api";

const API = "http://localhost:8080/api";

const navItems = [
  {
    id: "dashboard",
    icon: "▦",
    label: "Dashboard",
  },
  {
    id: "students",
    icon: "👨‍🎓",
    label: "Students",
  },
  {
    id: "companies",
    icon: "🏢",
    label: "Companies",
  },
  {
    id: "eligibility",
    icon: "✓",
    label: "Eligibility",
  },
  {
    id: "results",
    icon: "📋",
    label: "Results",
  },
  {
    id: "reports",
    icon: "📊",
    label: "Reports",
  },
];

function App() {
  // =========================
  // AUTHENTICATION
  // =========================

  const [isLoggedIn, setIsLoggedIn] =
    useState(
      () =>
        localStorage.getItem(
          "loggedIn"
        ) === "true"
    );

  const [currentUser, setCurrentUser] =
    useState(() => ({
      username:
        localStorage.getItem(
          "username"
        ) || "",

      role:
        localStorage.getItem(
          "userRole"
        ) || "USER",
    }));

  // =========================
  // NAVIGATION
  // =========================

  const [activeSection, setActiveSection] =
    useState("dashboard");

  // =========================
  // STUDENTS
  // =========================

  const [students, setStudents] =
    useState([]);

  const [studentForm, setStudentForm] =
    useState({
      name: "",
      cgpa: "",
      backlogs: "",
      branch: "",
      graduationYear: "",
    });

  const [editingStudentId, setEditingStudentId] =
    useState(null);

  // =========================
  // COMPANIES
  // =========================

  const [companies, setCompanies] =
    useState([]);

  const [companyForm, setCompanyForm] =
    useState({
      companyName: "",
      minCgpa: "",
      maxBacklogs: "",
      eligibleBranch: "",
      graduationYear: "",
    });

  const [editingCompanyId, setEditingCompanyId] =
    useState(null);

  // =========================
  // ELIGIBILITY
  // =========================

  const [studentId, setStudentId] =
    useState("");

  const [companyId, setCompanyId] =
    useState("");

  const [eligibilityResult, setEligibilityResult] =
    useState("");

  // =========================
  // RESULTS
  // =========================

  const [eligibilityResults, setEligibilityResults] =
    useState([]);

  // =========================
  // REPORTS
  // =========================

  const [placementReports, setPlacementReports] =
    useState([]);

  const [reportSearch, setReportSearch] =
    useState("");

  const [selectedReport, setSelectedReport] =
    useState(null);

  // =========================
  // MESSAGE
  // =========================

  const [message, setMessage] =
    useState("");

  // =========================
  // ROLE
  // =========================

  const isAdmin =
    currentUser.role === "ADMIN";

  const visibleNavItems = isAdmin
    ? navItems
    : navItems.filter(
        (item) =>
          item.id === "dashboard" ||
          item.id === "results" ||
          item.id === "reports"
      );

  // =========================
  // LOAD STUDENTS
  // =========================

  const loadStudents = async () => {
    try {
      const response = await apiFetch(
        `${API}/students`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load students"
        );
      }

      const data =
        await response.json();

      setStudents(data);

      if (
        data.length > 0 &&
        !studentId
      ) {
        setStudentId(
          String(data[0].id)
        );
      }
    } catch (error) {
      console.error(error);

      if (
        error.message !==
        "Unauthorized"
      ) {
        setMessage(
          "Could not load students."
        );
      }
    }
  };

  // =========================
  // LOAD COMPANIES
  // =========================

  const loadCompanies = async () => {
    try {
      const response = await apiFetch(
        `${API}/companies`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load companies"
        );
      }

      const data =
        await response.json();

      setCompanies(data);

      if (
        data.length > 0 &&
        !companyId
      ) {
        setCompanyId(
          String(data[0].id)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // LOAD RESULTS

  // =========================

  const loadEligibilityResults =
    async () => {
      try {
        const response = await apiFetch(
          `${API}/eligibility-results`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load eligibility results"
          );
        }

        const data =
          await response.json();

        setEligibilityResults(data);
      } catch (error) {
        console.error(error);
      }
    };

  // =========================
  // LOAD REPORTS
  // =========================

  const loadPlacementReports =
    async () => {
      try {
        const response = await apiFetch(
          `${API}/reports/students`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load placement reports"
          );
        }

        const data =
          await response.json();

        setPlacementReports(data);
      } catch (error) {
        console.error(error);
      }
    };

  // =========================
  // INITIAL LOAD
  // =========================

 useEffect(() => {
  if (!isLoggedIn) {
    return;
  }

  // Only ADMIN can load students and companies
  if (isAdmin) {
    loadStudents();
    loadCompanies();
  }

  // Load results and reports
  loadEligibilityResults();
  loadPlacementReports();
}, [isLoggedIn, isAdmin]);

  // =========================
  // FIND STUDENT
  // =========================

  const getStudentName = (id) => {
    const student = students.find(
      (student) =>
        Number(student.id) ===
        Number(id)
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
        Number(company.id) ===
        Number(id)
    );

    return company
      ? company.companyName
      : "Unknown Company";
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDateTime = (
    dateValue
  ) => {
    if (!dateValue) {
      return "N/A";
    }

    const date = new Date(
      dateValue
    );

    if (isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }
    );
  };

  // =========================
  // DASHBOARD COUNTS
  // =========================

  const totalStudents =
    students.length;

  const totalCompanies =
    companies.length;

  const eligibleStudentIds =
    new Set();

  const checkedStudentIds =
    new Set();

  eligibilityResults.forEach(
    (item) => {
      const result = String(
        item.result || ""
      ).toLowerCase();

      const id = Number(
        item.studentId
      );

      if (!id) {
        return;
      }

      checkedStudentIds.add(id);

      if (
        result.includes(
          "eligible"
        ) &&
        !result.includes(
          "not eligible"
        )
      ) {
        eligibleStudentIds.add(
          id
        );
      }
    }
  );

  const totalEligible =
    eligibleStudentIds.size;

  const notEligibleStudentIds =
    new Set();

  checkedStudentIds.forEach(
    (id) => {
      if (
        !eligibleStudentIds.has(
          id
        )
      ) {
        notEligibleStudentIds.add(
          id
        );
      }
    }
  );

  const totalNotEligible =
    notEligibleStudentIds.size;

  const totalPending =
    Math.max(
      0,
      totalStudents -
        totalEligible -
        totalNotEligible
    );

  // =========================
  // STUDENT FORM
  // =========================

  const handleStudentChange = (
    event
  ) => {
    setStudentForm({
      ...studentForm,
      [event.target.name]:
        event.target.value,
    });
  };

  // =========================
  // STUDENT SUBMIT
  // =========================

  const handleStudentSubmit =
    async (event) => {
      event.preventDefault();

      setMessage("");

      const studentData = {
        name: studentForm.name,
        cgpa: Number(
          studentForm.cgpa
        ),
        backlogs: Number(
          studentForm.backlogs
        ),
        branch: studentForm.branch,
        graduationYear: Number(
          studentForm.graduationYear
        ),
      };

      try {
        if (
          editingStudentId !==
          null
        ) {
          const response =
            await apiFetch(
              `${API}/students/${editingStudentId}`,
              {
                method: "PUT",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify(
                  studentData
                ),
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
            students.map(
              (student) =>
                student.id ===
                editingStudentId
                  ? updatedStudent
                  : student
            )
          );

          setMessage(
            "Student updated successfully!"
          );

          setEditingStudentId(null);
        } else {
          const response =
            await apiFetch(
              `${API}/students`,
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify(
                  studentData
                ),
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
            String(
              newStudent.id
            )
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

        await loadPlacementReports();
      } catch (error) {
        console.error(error);

        setMessage(
          editingStudentId !==
            null
            ? "Failed to update student."
            : "Failed to add student."
        );
      }
    };

  // =========================
  // EDIT STUDENT
  // =========================

  const handleEditStudent = (
    student
  ) => {
    setEditingStudentId(
      student.id
    );

    setStudentForm({
      name: student.name,
      cgpa: student.cgpa,
      backlogs: student.backlogs,
      branch: student.branch,
      graduationYear:
        student.graduationYear,
    });

    setActiveSection(
      "students"
    );

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

  const handleDeleteStudent =
    async (id) => {
      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this student?"
        );

      if (!confirmDelete) {
        return;
      }

      try {
        const response =
          await apiFetch(
            `${API}/students/${id}`,
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

        setStudents(
          updatedStudents
        );

        if (
          Number(studentId) ===
          Number(id)
        ) {
          setStudentId(
            updatedStudents.length >
              0
              ? String(
                  updatedStudents[0]
                    .id
                )
              : ""
          );
        }

        setMessage(
          "Student deleted successfully!"
        );

        await loadPlacementReports();
        await loadEligibilityResults();
      } catch (error) {
        console.error(error);

        setMessage(
          "Failed to delete student."
        );
      }
    };

  // =========================
  // COMPANY FORM
  // =========================

  const handleCompanyChange = (
    event
  ) => {
    setCompanyForm({
      ...companyForm,
      [event.target.name]:
        event.target.value,
    });
  };

  // =========================
  // COMPANY SUBMIT
  // =========================

  const handleCompanySubmit =
    async (event) => {
      event.preventDefault();

      setMessage("");

      const companyData = {
        companyName:
          companyForm.companyName,

        minCgpa: Number(
          companyForm.minCgpa
        ),

        maxBacklogs: Number(
          companyForm.maxBacklogs
        ),

        eligibleBranch:
          companyForm.eligibleBranch,

        graduationYear: Number(
          companyForm.graduationYear
        ),
      };

      try {
        if (
          editingCompanyId !==
          null
        ) {
          const response =
            await apiFetch(
              `${API}/companies/${editingCompanyId}`,
              {
                method: "PUT",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify(
                  companyData
                ),
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
            companies.map(
              (company) =>
                company.id ===
                editingCompanyId
                  ? updatedCompany
                  : company
            )
          );

          setMessage(
            "Company updated successfully!"
          );

          setEditingCompanyId(
            null
          );
        } else {
          const response =
            await apiFetch(
              `${API}/companies`,
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify(
                  companyData
                ),
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
            String(
              newCompany.id
            )
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

        await loadPlacementReports();
      } catch (error) {
        console.error(error);

        setMessage(
          editingCompanyId !==
            null
            ? "Failed to update company."
            : "Failed to add company."
        );
      }
    };

  // =========================
  // EDIT COMPANY
  // =========================

  const handleEditCompany = (
    company
  ) => {
    setEditingCompanyId(
      company.id
    );

    setCompanyForm({
      companyName:
        company.companyName,

      minCgpa: company.minCgpa,

      maxBacklogs:
        company.maxBacklogs,

      eligibleBranch:
        company.eligibleBranch,

      graduationYear:
        company.graduationYear,
    });

    setActiveSection(
      "companies"
    );

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

  const handleDeleteCompany =
    async (id) => {
      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this company?"
        );

      if (!confirmDelete) {
        return;
      }

      try {
        const response =
          await apiFetch(
            `${API}/companies/${id}`,
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

        setCompanies(
          updatedCompanies
        );

        if (
          Number(companyId) ===
          Number(id)
        ) {
          setCompanyId(
            updatedCompanies.length >
              0
              ? String(
                  updatedCompanies[0]
                    .id
                )
              : ""
          );
        }

        setMessage(
          "Company deleted successfully!"
        );

        await loadPlacementReports();
        await loadEligibilityResults();
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

  const handleCheckEligibility =
    async () => {
      if (!studentId || !companyId) {
        setEligibilityResult(
          "Please select a student and company."
        );

        return;
      }

      setEligibilityResult("");
      setMessage("");

      try {
        const response =
          await apiFetch(
            `${API}/eligibility?studentId=${studentId}&companyId=${companyId}`
          );

        const result =
          await response.text();

        setEligibilityResult(
          result
        );

        if (!response.ok) {
          return;
        }

        await loadEligibilityResults();
        await loadPlacementReports();
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

  const getResultStyle = (
    result
  ) => {
    const text = String(
      result || ""
    ).toLowerCase();

    if (
      text.includes(
        "eligible"
      ) &&
      !text.includes(
        "not eligible"
      )
    ) {
      return {
        color: "#15803d",
        fontWeight: "700",
      };
    }

    return {
      color: "#dc2626",
      fontWeight: "700",
    };
  };

  // =========================
  // FILTER REPORTS
  // =========================

  const filteredPlacementReports =
    placementReports.filter(
      (student) => {
        const search =
          reportSearch
            .toLowerCase()
            .trim();

        if (!search) {
          return true;
        }

        return (
          String(
            student.name || ""
          )
            .toLowerCase()
            .includes(search) ||
          String(
            student.branch || ""
          )
            .toLowerCase()
            .includes(search) ||
          String(
            student.studentId || ""
          ).includes(search)
        );
      }
    );

  // =========================
  // LOGIN
  // =========================

  const handleLogin = (
    userData
  ) => {
    setIsLoggedIn(true);

    setCurrentUser({
      username:
        userData.username,

      role:
        userData.role,
    });

    setActiveSection(
      "dashboard"
    );

    setMessage("");
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem(
      "loggedIn"
    );

    localStorage.removeItem(
      "username"
    );

    localStorage.removeItem(
      "userRole"
    );

    localStorage.removeItem(
      "authToken"
    );

    setIsLoggedIn(false);

    setCurrentUser({
      username: "",
      role: "USER",
    });

    setActiveSection(
      "dashboard"
    );

    setSelectedReport(null);
    setEligibilityResult("");
    setMessage("");
  };

  // =========================
  // NAVIGATION
  // =========================

  const handleNavigation = (
    section
  ) => {
    setActiveSection(
      section
    );

    setSelectedReport(null);
    setMessage("");

    if (section === "results") {
      loadEligibilityResults();
    }

    if (section === "reports") {
      loadPlacementReports();
    }
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
      <div className="dashboard-card">

        <p className="dashboard-title">
          {title}
        </p>

        <h2
          className="dashboard-value"
          style={{
            color: valueColor,
          }}
        >
          {value}
        </h2>

        <p className="dashboard-description">
          {description}
        </p>

      </div>
    );
  };

  // =========================
  // LOGIN SCREEN
  // =========================

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={handleLogin}
      />
    );
  }

  // =========================
  // APPLICATION
  // =========================

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">

        <div>

          <h1>
            Placement Eligibility Checker
          </h1>

          <p>
            Student Placement Management
            System
          </p>

        </div>

      </header>

      <div className="app-layout">

        {/* SIDEBAR */}

        <aside className="sidebar">

          <div className="sidebar-brand">

            <div className="brand-logo">
              PEC
            </div>

            <div>

              <h2>
                Placement
              </h2>

              <p>
                Management System
              </p>

            </div>

          </div>

          <div className="sidebar-divider"></div>

          <nav className="sidebar-nav">

            {visibleNavItems.map(
              (item) => (
                <button
                  key={item.id}
                  className={`nav-button ${
                    activeSection ===
                    item.id
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleNavigation(
                      item.id
                    )
                  }
                >

                  <span className="nav-icon">
                    {item.icon}
                  </span>

                  <span>
                    {item.label}
                  </span>

                </button>
              )
            )}

          </nav>

          <div className="sidebar-footer">

            <div className="user-info">

              <div className="user-avatar">

                {currentUser.username
                  ? currentUser.username
                      .charAt(0)
                      .toUpperCase()
                  : "U"}

              </div>

              <div className="user-details">

                <strong>
                  {currentUser.username ||
                    "User"}
                </strong>

                <span>
                  {currentUser.role ||
                    "USER"}
                </span>

              </div>

            </div>

            <button
              className="logout-button"
              onClick={
                handleLogout
              }
            >
              Logout
            </button>

          </div>

        </aside>

        {/* MAIN */}

        <main className="main-content">

          {message && (
            <div className="message">
              {message}
            </div>
          )}

          {/* =========================
              DASHBOARD
          ========================= */}

          {activeSection ===
            "dashboard" && (
            <section className="page-section">

              <div className="page-heading">

                <div>

                  <h2>
                    Dashboard
                  </h2>

                  <p>
                    Overview of your placement
                    management system.
                  </p>

                </div>

              </div>

              <div className="dashboard-grid">

                <DashboardCard
                  title="Total Students"
                  value={
                    totalStudents
                  }
                  description="Students registered"
                  valueColor="#2563eb"
                />

                <DashboardCard
                  title="Total Companies"
                  value={
                    totalCompanies
                  }
                  description="Companies registered"
                  valueColor="#7c3aed"
                />

                <DashboardCard
                  title="Eligible Students"
                  value={
                    totalEligible
                  }
                  description="Unique students eligible"
                  valueColor="#16a34a"
                />

                <DashboardCard
                  title="Not Eligible Students"
                  value={
                    totalNotEligible
                  }
                  description="Unique students not eligible"
                  valueColor="#dc2626"
                />

                <DashboardCard
                  title="Pending / Not Checked"
                  value={
                    totalPending
                  }
                  description="Students not checked yet"
                  valueColor="#ea580c"
                />

              </div>

              <div className="quick-actions card">

                <h3>
                  Quick Actions
                </h3>

                <p>
                  Use the navigation menu to
                  manage your placement system.
                </p>

                <div className="quick-action-buttons">

                  {isAdmin && (
                    <>
                      <button
                        onClick={() =>
                          handleNavigation(
                            "students"
                          )
                        }
                      >
                        Manage Students
                      </button>

                      <button
                        onClick={() =>
                          handleNavigation(
                            "companies"
                          )
                        }
                      >
                        Manage Companies
                      </button>

                      <button
                        onClick={() =>
                          handleNavigation(
                            "eligibility"
                          )
                        }
                      >
                        Check Eligibility
                      </button>
                    </>
                  )}

                  <button
                    onClick={() =>
                      handleNavigation(
                        "reports"
                      )
                    }
                  >
                    View Reports
                  </button>

                </div>

              </div>

            </section>
          )}

          {/* =========================
              STUDENTS
          ========================= */}

          {activeSection ===
            "students" &&
            isAdmin && (
            <section className="page-section">

              <div className="page-heading">

                <div>

                  <h2>
                    Students
                  </h2>

                  <p>
                    Add, edit, and manage
                    student records.
                  </p>

                </div>

              </div>

              <section className="card">

                <h3>
                  {editingStudentId !==
                  null
                    ? "Edit Student"
                    : "Add Student"}
                </h3>

                <form
                  onSubmit={
                    handleStudentSubmit
                  }
                >

                  <input
                    type="text"
                    name="name"
                    placeholder="Student Name"
                    value={
                      studentForm.name
                    }
                    onChange={
                      handleStudentChange
                    }
                    required
                  />

                  <input
                    type="number"
                    name="cgpa"
                    placeholder="CGPA"
                    step="0.01"
                    min="0"
                    max="10"
                    value={
                      studentForm.cgpa
                    }
                    onChange={
                      handleStudentChange
                    }
                    required
                  />

                  <input
                    type="number"
                    name="backlogs"
                    placeholder="Backlogs"
                    min="0"
                    value={
                      studentForm.backlogs
                    }
                    onChange={
                      handleStudentChange
                    }
                    required
                  />

                  <input
                    type="text"
                    name="branch"
                    placeholder="Branch"
                    value={
                      studentForm.branch
                    }
                    onChange={
                      handleStudentChange
                    }
                    required
                  />

                  <input
                    type="number"
                    name="graduationYear"
                    placeholder="Graduation Year"
                    value={
                      studentForm.graduationYear
                    }
                    onChange={
                      handleStudentChange
                    }
                    required
                  />

                  <div className="form-actions">

                    <button type="submit">

                      {editingStudentId !==
                      null
                        ? "Update Student"
                        : "Add Student"}

                    </button>

                    {editingStudentId !==
                      null && (
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={
                          cancelStudentEdit
                        }
                      >
                        Cancel
                      </button>
                    )}

                  </div>

                </form>

              </section>

              <section className="card">

                <div className="section-title-row">

                  <div>

                    <h3>
                      Student List
                    </h3>

                    <p>
                      {students.length}{" "}
                      student(s) registered.
                    </p>

                  </div>

                </div>

                {students.length ===
                0 ? (
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
                          <th>
                            Graduation Year
                          </th>
                          <th>Actions</th>
                        </tr>

                      </thead>

                      <tbody>

                        {students.map(
                          (student) => (
                            <tr
                              key={
                                student.id
                              }
                            >

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
                                {
                                  student.backlogs
                                }
                              </td>

                              <td>
                                {
                                  student.branch
                                }
                              </td>

                              <td>
                                {
                                  student.graduationYear
                                }
                              </td>

                              <td>

                                <div className="table-actions">

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
                                    className="delete-button"
                                    onClick={() =>
                                      handleDeleteStudent(
                                        student.id
                                      )
                                    }
                                  >
                                    Delete
                                  </button>

                                </div>

                              </td>

                            </tr>
                          )
                        )}

                      </tbody>

                    </table>

                  </div>
                )}

              </section>

            </section>
          )}

          {/* =========================
              COMPANIES
          ========================= */}

          {activeSection ===
            "companies" &&
            isAdmin && (
            <section className="page-section">

              <div className="page-heading">

                <div>

                  <h2>
                    Companies
                  </h2>

                  <p>
                    Manage companies and
                    placement criteria.
                  </p>

                </div>

              </div>

              <section className="card">

                <h3>
                  {editingCompanyId !==
                  null
                    ? "Edit Company"
                    : "Add Company"}
                </h3>

                <form
                  onSubmit={
                    handleCompanySubmit
                  }
                >

                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name"
                    value={
                      companyForm.companyName
                    }
                    onChange={
                      handleCompanyChange
                    }
                    required
                  />

                  <input
                    type="number"
                    name="minCgpa"
                    placeholder="Minimum CGPA"
                    step="0.01"
                    min="0"
                    max="10"
                    value={
                      companyForm.minCgpa
                    }
                    onChange={
                      handleCompanyChange
                    }
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
                    onChange={
                      handleCompanyChange
                    }
                    required
                  />

                  <input
                    type="text"
                    name="eligibleBranch"
                    placeholder="Eligible Branch"
                    value={
                      companyForm.eligibleBranch
                    }
                    onChange={
                      handleCompanyChange
                    }
                    required
                  />

                  <input
                    type="number"
                    name="graduationYear"
                    placeholder="Graduation Year"
                    value={
                      companyForm.graduationYear
                    }
                    onChange={
                      handleCompanyChange
                    }
                    required
                  />

                  <div className="form-actions">

                    <button type="submit">

                      {editingCompanyId !==
                      null
                        ? "Update Company"
                        : "Add Company"}

                    </button>

                    {editingCompanyId !==
                      null && (
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={
                          cancelCompanyEdit
                        }
                      >
                        Cancel
                      </button>
                    )}

                  </div>

                </form>

              </section>

              <section className="card">

                <div className="section-title-row">

                  <div>

                    <h3>
                      Company List
                    </h3>

                    <p>
                      {companies.length}{" "}
                      company(ies) registered.
                    </p>

                  </div>

                </div>

                {companies.length ===
                0 ? (
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
                          <th>
                            Max Backlogs
                          </th>
                          <th>
                            Eligible Branch
                          </th>
                          <th>
                            Graduation Year
                          </th>
                          <th>Actions</th>
                        </tr>

                      </thead>

                      <tbody>

                        {companies.map(
                          (company) => (
                            <tr
                              key={
                                company.id
                              }
                            >

                              <td>
                                {company.id}
                              </td>

                              <td>
                                {
                                  company.companyName
                                }
                              </td>

                              <td>
                                {
                                  company.minCgpa
                                }
                              </td>

                              <td>
                                {
                                  company.maxBacklogs
                                }
                              </td>

                              <td>
                                {
                                  company.eligibleBranch
                                }
                              </td>

                              <td>
                                {
                                  company.graduationYear
                                }
                              </td>

                              <td>

                                <div className="table-actions">

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
                                    className="delete-button"
                                    onClick={() =>
                                      handleDeleteCompany(
                                        company.id
                                      )
                                    }
                                  >
                                    Delete
                                  </button>

                                </div>

                              </td>

                            </tr>
                          )
                        )}

                      </tbody>

                    </table>

                  </div>
                )}

              </section>

            </section>
          )}

          {/* =========================
              ELIGIBILITY
          ========================= */}

          {activeSection ===
            "eligibility" &&
            isAdmin && (
            <section className="page-section">

              <div className="page-heading">

                <div>

                  <h2>
                    Eligibility Check
                  </h2>

                  <p>
                    Check placement eligibility
                    for a student and company.
                  </p>

                </div>

              </div>

              <section className="card eligibility-card">

                <h3>
                  Check Placement
                  Eligibility
                </h3>

                <p>
                  Select a student and
                  company to perform the
                  eligibility check.
                </p>

                <div className="eligibility-form">

                  <label>
                    Student
                  </label>

                  <select
                    value={studentId}
                    onChange={(event) =>
                      setStudentId(
                        event.target.value
                      )
                    }
                  >

                    <option value="">
                      Select Student
                    </option>

                    {students.map(
                      (student) => (
                        <option
                          key={
                            student.id
                          }
                          value={
                            student.id
                          }
                        >
                          {student.name} —
                          ID{" "}
                          {student.id}
                        </option>
                      )
                    )}

                  </select>

                  <label>
                    Company
                  </label>

                  <select
                    value={companyId}
                    onChange={(event) =>
                      setCompanyId(
                        event.target.value
                      )
                    }
                  >

                    <option value="">
                      Select Company
                    </option>

                    {companies.map(
                      (company) => (
                        <option
                          key={
                            company.id
                          }
                          value={
                            company.id
                          }
                        >
                          {
                            company.companyName
                          }{" "}
                          — ID{" "}
                          {company.id}
                        </option>
                      )
                    )}

                  </select>

                  <button
                    onClick={
                      handleCheckEligibility
                    }
                    disabled={
                      !studentId ||
                      !companyId
                    }
                  >
                    Check Eligibility
                  </button>

                </div>

                {eligibilityResult && (
                  <div className="result-box">

                    <h4>
                      Eligibility Result
                    </h4>

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

            </section>
          )}

          {/* =========================
              RESULTS
          ========================= */}

          {activeSection ===
            "results" && (
            <section className="page-section">

              <div className="page-heading">

                <div>

                  <h2>
                    Eligibility Results
                  </h2>

                  <p>
                    View saved eligibility
                    results.
                  </p>

                </div>

                <button
                  onClick={
                    loadEligibilityResults
                  }
                >
                  Refresh Results
                </button>

              </div>

              <section className="card">

                {eligibilityResults.length ===
                0 ? (
                  <p>
                    No eligibility
                    results found.
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
                          <th>
                            Checked At
                          </th>
                        </tr>

                      </thead>

                      <tbody>

                        {eligibilityResults.map(
                          (item) => (
                            <tr
                              key={
                                item.id
                              }
                            >

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
                                  {
                                    item.studentId
                                  }
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
                                  {
                                    item.companyId
                                  }
                                </small>

                              </td>

                              <td>

                                <span
                                  className="result-badge"
                                  style={getResultStyle(
                                    item.result
                                  )}
                                >
                                  {
                                    item.result
                                  }
                                </span>

                              </td>

                              <td>
                                {
                                  item.reason ||
                                  "No reason available"
                                }
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

            </section>
          )}

          {/* =========================
              REPORTS
          ========================= */}

          {activeSection ===
            "reports" && (
            <section className="page-section">

              <div className="page-heading">

                <div>

                  <h2>
                    Placement Reports
                  </h2>

                  <p>
                    View student placement
                    summaries.
                  </p>

                </div>

                <button
                  onClick={
                    loadPlacementReports
                  }
                >
                  Refresh Reports
                </button>

              </div>

              <section className="card">

                <div className="report-header">

                  <div>

                    <h3>
                      Student Placement
                      Reports
                    </h3>

                    <p>
                      Search students and
                      view placement status.
                    </p>

                  </div>

                  <input
                    className="report-search"
                    type="text"
                    placeholder="Search student..."
                    value={
                      reportSearch
                    }
                    onChange={(event) =>
                      setReportSearch(
                        event.target.value
                      )
                    }
                  />

                </div>

                {placementReports.length ===
                0 ? (
                  <p>
                    No placement reports
                    available.
                  </p>
                ) : filteredPlacementReports.length ===
                  0 ? (
                  <p>
                    No students match
                    your search.
                  </p>
                ) : (
                  <div className="table-container">

                    <table>

                      <thead>

                        <tr>
                          <th>Student</th>
                          <th>CGPA</th>
                          <th>Branch</th>
                          <th>Backlogs</th>
                          <th>Checked</th>
                          <th>Eligible</th>
                          <th>
                            Not Eligible
                          </th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>

                      </thead>

                      <tbody>

                        {filteredPlacementReports.map(
                          (student) => (
                            <tr
                              key={
                                student.studentId
                              }
                            >

                              <td>

                                <strong>
                                  {
                                    student.name
                                  }
                                </strong>

                                <br />

                                <small>
                                  ID:{" "}
                                  {
                                    student.studentId
                                  }
                                </small>

                              </td>

                              <td>
                                {
                                  student.cgpa
                                }
                              </td>

                              <td>
                                {
                                  student.branch
                                }
                              </td>

                              <td>
                                {
                                  student.backlogs
                                }
                              </td>

                              <td>
                                {
                                  student.checkedCompanies
                                }
                              </td>

                              <td>

                                <span className="eligible-text">
                                  {
                                    student.eligibleCompanies
                                  }
                                </span>

                              </td>

                              <td>

                                <span className="not-eligible-text">
                                  {
                                    student.notEligibleCompanies
                                  }
                                </span>

                              </td>

                              <td>

                                <span
                                  className={`status ${
                                    student.overallStatus ===
                                    "Eligible"
                                      ? "eligible-status"
                                      : student.overallStatus ===
                                        "Not Checked"
                                      ? "pending-status"
                                      : "not-eligible-status"
                                  }`}
                                >
                                  {
                                    student.overallStatus
                                  }
                                </span>

                              </td>

                              <td>

                                <button
                                  onClick={() =>
                                    setSelectedReport(
                                      student
                                    )
                                  }
                                >
                                  View Details
                                </button>

                              </td>

                            </tr>
                          )
                        )}

                      </tbody>

                    </table>

                  </div>
                )}

              </section>

              {selectedReport && (
                <section className="card">

                  <div className="details-header">

                    <div>

                      <h3>
                        Placement Details
                      </h3>

                      <p>
                        Detailed company
                        eligibility results.
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        setSelectedReport(
                          null
                        )
                      }
                    >
                      Close
                    </button>

                  </div>

                  <div className="student-details-grid">

                    <div className="detail-item">

                      <strong>
                        Student
                      </strong>

                      <p>
                        {
                          selectedReport.name
                        }
                      </p>

                    </div>

                    <div className="detail-item">

                      <strong>
                        CGPA
                      </strong>

                      <p>
                        {
                          selectedReport.cgpa
                        }
                      </p>

                    </div>

                    <div className="detail-item">

                      <strong>
                        Branch
                      </strong>

                      <p>
                        {
                          selectedReport.branch
                        }
                      </p>

                    </div>

                    <div className="detail-item">

                      <strong>
                        Backlogs
                      </strong>

                      <p>
                        {
                          selectedReport.backlogs
                        }
                      </p>

                    </div>

                    <div className="detail-item">

                      <strong>
                        Graduation Year
                      </strong>

                      <p>
                        {
                          selectedReport.graduationYear
                        }
                      </p>

                    </div>

                    <div className="detail-item">

                      <strong>
                        Overall Status
                      </strong>

                      <p
                        className={
                          selectedReport.overallStatus ===
                          "Eligible"
                            ? "eligible-text"
                            : selectedReport.overallStatus ===
                              "Not Checked"
                            ? "pending-text"
                            : "not-eligible-text"
                        }
                      >
                        {
                          selectedReport.overallStatus
                        }
                      </p>

                    </div>

                  </div>

                  <h4 className="company-results-title">
                    Company Results
                  </h4>

                  {!selectedReport.companyResults ||
                  selectedReport.companyResults.length ===
                    0 ? (
                    <p>
                      This student has not
                      been checked against
                      any company yet.
                    </p>
                  ) : (
                    <div className="table-container">

                      <table>

                        <thead>

                          <tr>
                            <th>Company</th>
                            <th>Result</th>
                            <th>Reason</th>
                            <th>
                              Checked At
                            </th>
                          </tr>

                        </thead>

                        <tbody>

                          {selectedReport.companyResults.map(
                            (
                              company,
                              index
                            ) => (
                              <tr
                                key={`${company.companyId}-${index}`}
                              >

                                <td>
                                  <strong>
                                    {
                                      company.companyName
                                    }
                                  </strong>
                                </td>

                                <td>

                                  <span
                                    style={getResultStyle(
                                      company.result
                                    )}
                                  >
                                    {
                                      company.result
                                    }
                                  </span>

                                </td>

                                <td>
                                  {
                                    company.reason ||
                                    "No reason available"
                                  }
                                </td>

                                <td>
                                  {formatDateTime(
                                    company.checkedAt
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
              )}

            </section>
          )}

        </main>

      </div>

    </div>
  );
}

export default App;
