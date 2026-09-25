import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  CheckCircle,
  FileText,
  Search,
  Settings,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";

import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Students",
      icon: Users,
    },
    {
      name: "Companies",
      icon: Building2,
    },
    {
      name: "Eligibility Checker",
      icon: CheckCircle,
    },
    {
      name: "Results",
      icon: FileText,
    },
  ];

  const students = [
    {
      name: "Adithya S",
      cgpa: 9.2,
      branch: "CSE",
      backlogs: 0,
      year: 2028,
    },
    {
      name: "Vishal",
      cgpa: 9.1,
      branch: "ISE",
      backlogs: 0,
      year: 2026,
    },
    {
      name: "Arun",
      cgpa: 8.1,
      branch: "CSE",
      backlogs: 0,
      year: 2028,
    },
    {
      name: "Haris",
      cgpa: 9.0,
      branch: "CSE",
      backlogs: 2,
      year: 2028,
    },
  ];

  const companies = [
    {
      name: "TCS",
      minCgpa: 7.0,
      maxBacklogs: 0,
    },
    {
      name: "Infosys",
      minCgpa: 6.5,
      maxBacklogs: 1,
    },
    {
      name: "Wipro",
      minCgpa: 6.0,
      maxBacklogs: 2,
    },
  ];

  return (
    <div className="app">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>

        <div className="logo-section">

          <div className="logo-icon">
            <GraduationCap size={28} />
          </div>

          <div>
            <h2>Placement</h2>
            <span>Eligibility Checker</span>
          </div>

          <button
            className="close-sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>

        </div>

        <div className="menu-title">
          MAIN MENU
        </div>

        <nav className="navigation">

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`menu-item ${
                  activePage === item.name ? "active" : ""
                }`}
                onClick={() => {
                  setActivePage(item.name);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </button>
            );

          })}

        </nav>

        <div className="sidebar-bottom">

          <button className="menu-item">
            <Settings size={20} />
            <span>Settings</span>
          </button>

        </div>

      </aside>

      {/* Main Content */}
      <main className="main">

        {/* Header */}
        <header className="header">

          <button
            className="mobile-menu"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div>
            <h1>{activePage}</h1>
            <p>
              Manage student placement eligibility
            </p>
          </div>

          <div className="header-right">

            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search..."
              />
            </div>

            <div className="profile">
              <div className="profile-avatar">
                AS
              </div>

              <div className="profile-info">
                <strong>Admin</strong>
                <span>Placement Cell</span>
              </div>
            </div>

          </div>

        </header>

        {/* Dashboard */}
        {activePage === "Dashboard" && (

          <section className="content">

            {/* Welcome */}
            <div className="welcome-card">

              <div>
                <h2>
                  Welcome to Placement Eligibility Checker 👋
                </h2>

                <p>
                  Monitor students, companies and placement
                  eligibility from one place.
                </p>
              </div>

              <GraduationCap size={70} />

            </div>

            {/* Statistics */}
            <div className="stats-grid">

              <div className="stat-card">

                <div className="stat-icon students-icon">
                  <Users size={24} />
                </div>

                <div>
                  <span>Total Students</span>
                  <h3>12</h3>
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon companies-icon">
                  <Building2 size={24} />
                </div>

                <div>
                  <span>Companies</span>
                  <h3>3</h3>
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon eligible-icon">
                  <CheckCircle size={24} />
                </div>

                <div>
                  <span>Eligible</span>
                  <h3>8</h3>
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon results-icon">
                  <FileText size={24} />
                </div>

                <div>
                  <span>Results Checked</span>
                  <h3>9</h3>
                </div>

              </div>

            </div>

            {/* Two Columns */}
            <div className="dashboard-grid">

              {/* Recent Students */}
              <div className="panel">

                <div className="panel-header">

                  <div>
                    <h2>Recent Students</h2>
                    <p>Latest student records</p>
                  </div>

                  <button
                    onClick={() => setActivePage("Students")}
                    className="view-button"
                  >
                    View All
                  </button>

                </div>

                <div className="table-container">

                  <table>

                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>CGPA</th>
                        <th>Branch</th>
                        <th>Backlogs</th>
                      </tr>
                    </thead>

                    <tbody>

                      {students.map((student) => (

                        <tr key={student.name}>

                          <td>
                            <div className="student-name">
                              <div className="small-avatar">
                                {student.name
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </div>

                              {student.name}
                            </div>
                          </td>

                          <td>
                            <strong>{student.cgpa}</strong>
                          </td>

                          <td>
                            <span className="branch-badge">
                              {student.branch}
                            </span>
                          </td>

                          <td>
                            {student.backlogs === 0 ? (
                              <span className="success-text">
                                0
                              </span>
                            ) : (
                              <span className="danger-text">
                                {student.backlogs}
                              </span>
                            )}
                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

              {/* Companies */}
              <div className="panel">

                <div className="panel-header">

                  <div>
                    <h2>Companies</h2>
                    <p>Placement requirements</p>
                  </div>

                  <button
                    onClick={() => setActivePage("Companies")}
                    className="view-button"
                  >
                    View All
                  </button>

                </div>

                <div className="company-list">

                  {companies.map((company) => (

                    <div
                      className="company-item"
                      key={company.name}
                    >

                      <div className="company-logo">
                        {company.name.substring(0, 1)}
                      </div>

                      <div className="company-details">

                        <strong>{company.name}</strong>

                        <span>
                          Minimum CGPA: {company.minCgpa}
                        </span>

                      </div>

                      <div className="backlog-limit">

                        <small>Max Backlogs</small>

                        <strong>
                          {company.maxBacklogs}
                        </strong>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </div>

            {/* Quick Actions */}
            <div className="panel quick-actions">

              <div className="panel-header">

                <div>
                  <h2>Quick Actions</h2>
                  <p>Frequently used placement operations</p>
                </div>

              </div>

              <div className="actions-grid">

                <button
                  onClick={() => setActivePage("Students")}
                  className="action-card"
                >
                  <Users size={28} />
                  <strong>Manage Students</strong>
                  <span>Add, update and delete students</span>
                </button>

                <button
                  onClick={() => setActivePage("Companies")}
                  className="action-card"
                >
                  <Building2 size={28} />
                  <strong>Manage Companies</strong>
                  <span>Manage company requirements</span>
                </button>

                <button
                  onClick={() =>
                    setActivePage("Eligibility Checker")
                  }
                  className="action-card"
                >
                  <CheckCircle size={28} />
                  <strong>Check Eligibility</strong>
                  <span>Check student eligibility</span>
                </button>

                <button
                  onClick={() => setActivePage("Results")}
                  className="action-card"
                >
                  <FileText size={28} />
                  <strong>View Results</strong>
                  <span>View previous eligibility results</span>
                </button>

              </div>

            </div>

          </section>

        )}

        {/* Students Page */}
        {activePage === "Students" && (

          <section className="content">

            <div className="page-title">

              <div>
                <h2>Students</h2>
                <p>
                  Manage all registered students
                </p>
              </div>

              <button className="primary-button">
                + Add Student
              </button>

            </div>

            <div className="panel">

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
                    </tr>
                  </thead>

                  <tbody>

                    {students.map((student, index) => (

                      <tr key={student.name}>

                        <td>{index + 1}</td>

                        <td>
                          <div className="student-name">

                            <div className="small-avatar">
                              {student.name
                                .substring(0, 2)
                                .toUpperCase()}
                            </div>

                            {student.name}

                          </div>
                        </td>

                        <td>
                          <strong>{student.cgpa}</strong>
                        </td>

                        <td>{student.backlogs}</td>

                        <td>
                          <span className="branch-badge">
                            {student.branch}
                          </span>
                        </td>

                        <td>{student.year}</td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          </section>

        )}

        {/* Companies Page */}
        {activePage === "Companies" && (

          <section className="content">

            <div className="page-title">

              <div>
                <h2>Companies</h2>
                <p>
                  Manage company eligibility requirements
                </p>
              </div>

              <button className="primary-button">
                + Add Company
              </button>

            </div>

            <div className="company-cards">

              {companies.map((company) => (

                <div
                  className="large-company-card"
                  key={company.name}
                >

                  <div className="company-logo large">
                    {company.name.substring(0, 1)}
                  </div>

                  <h3>{company.name}</h3>

                  <div className="requirement">
                    <span>Minimum CGPA</span>
                    <strong>{company.minCgpa}</strong>
                  </div>

                  <div className="requirement">
                    <span>Maximum Backlogs</span>
                    <strong>{company.maxBacklogs}</strong>
                  </div>

                  <button className="secondary-button">
                    Manage
                  </button>

                </div>

              ))}

            </div>

          </section>

        )}

        {/* Eligibility Checker */}
        {activePage === "Eligibility Checker" && (

          <section className="content">

            <div className="page-title">

              <div>
                <h2>Eligibility Checker</h2>
                <p>
                  Check whether a student is eligible for a company
                </p>
              </div>

            </div>

            <div className="checker-card">

              <div className="form-group">

                <label>Select Student</label>

                <select>
                  <option>Select a student</option>

                  {students.map((student) => (
                    <option key={student.name}>
                      {student.name}
                    </option>
                  ))}

                </select>

              </div>

              <div className="form-group">

                <label>Select Company</label>

                <select>
                  <option>Select a company</option>

                  {companies.map((company) => (
                    <option key={company.name}>
                      {company.name}
                    </option>
                  ))}

                </select>

              </div>

              <button className="check-button">
                <CheckCircle size={20} />
                Check Eligibility
              </button>

            </div>

          </section>

        )}

        {/* Results Page */}
        {activePage === "Results" && (

          <section className="content">

            <div className="page-title">

              <div>
                <h2>Eligibility Results</h2>
                <p>
                  View student placement eligibility results
                </p>
              </div>

            </div>

            <div className="panel">

              <div className="table-container">

                <table>

                  <thead>

                    <tr>
                      <th>Student</th>
                      <th>Company</th>
                      <th>Result</th>
                      <th>Reason</th>
                    </tr>

                  </thead>

                  <tbody>

                    <tr>
                      <td>Adithya S</td>
                      <td>TCS</td>
                      <td>
                        <span className="eligible-badge">
                          Eligible
                        </span>
                      </td>
                      <td>All requirements satisfied</td>
                    </tr>

                    <tr>
                      <td>Haris</td>
                      <td>TCS</td>
                      <td>
                        <span className="not-eligible-badge">
                          Not Eligible
                        </span>
                      </td>
                      <td>Backlogs exceed allowed limit</td>
                    </tr>

                    <tr>
                      <td>Arun</td>
                      <td>Wipro</td>
                      <td>
                        <span className="eligible-badge">
                          Eligible
                        </span>
                      </td>
                      <td>All requirements satisfied</td>
                    </tr>

                  </tbody>

                </table>

              </div>

            </div>

          </section>

        )}

        {/* Footer */}
        <footer>
          Placement Eligibility Checker © 2026
        </footer>

      </main>

    </div>
  );
}

export default App;