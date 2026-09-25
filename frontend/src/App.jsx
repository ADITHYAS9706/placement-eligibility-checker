import { useEffect, useState } from "react";
import "./App.css";

function App() {

  // =====================================================
  // STUDENT STATE
  // =====================================================

  const [students, setStudents] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    cgpa: "",
    backlogs: "",
    branch: "",
    graduationYear: ""
  });

  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);


  // =====================================================
  // COMPANY STATE
  // =====================================================

  const [companies, setCompanies] = useState([]);

  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    minCgpa: "",
    maxBacklogs: "",
    eligibleBranch: "",
    graduationYear: ""
  });

  const [companyMessage, setCompanyMessage] = useState("");
  const [editingCompanyId, setEditingCompanyId] = useState(null);


  // =====================================================
  // GET ALL STUDENTS
  // =====================================================

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

      console.error("Student loading error:", error);

      setMessage("Could not connect to backend");
    }
  };


  // =====================================================
  // GET ALL COMPANIES
  // =====================================================

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

      console.error("Company loading error:", error);

      setCompanyMessage(
        "Could not connect to company backend"
      );
    }
  };


  // =====================================================
  // LOAD DATA WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {

    loadStudents();
    loadCompanies();

  }, []);


  // =====================================================
  // STUDENT INPUT
  // =====================================================

  const handleChange = (event) => {

    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });

  };


  // =====================================================
  // ADD / UPDATE STUDENT
  // =====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setMessage("");

    try {

      const studentData = {

        name: formData.name,

        cgpa: Number(formData.cgpa),

        backlogs: Number(formData.backlogs),

        branch: formData.branch,

        graduationYear:
          Number(formData.graduationYear)
      };


      // UPDATE STUDENT

      if (editingId !== null) {

        const response = await fetch(
          `http://localhost:8080/api/students/${editingId}`,
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


        setStudents((previousStudents) =>

          previousStudents.map((student) =>

            student.id === editingId
              ? updatedStudent
              : student

          )

        );


        setMessage(
          "Student updated successfully!"
        );


        setEditingId(null);

      }


      // ADD STUDENT

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


        setStudents((previousStudents) => [

          ...previousStudents,

          newStudent

        ]);


        setMessage(
          "Student added successfully!"
        );

      }


      // CLEAR FORM

      setFormData({

        name: "",
        cgpa: "",
        backlogs: "",
        branch: "",
        graduationYear: ""

      });


    } catch (error) {

      console.error(
        "Student error:",
        error
      );


      if (editingId !== null) {

        setMessage(
          "Failed to update student"
        );

      } else {

        setMessage(
          "Failed to add student"
        );

      }

    }

  };


  // =====================================================
  // EDIT STUDENT
  // =====================================================

  const handleEdit = (student) => {

    setEditingId(student.id);

    setFormData({

      name: student.name,

      cgpa: student.cgpa,

      backlogs: student.backlogs,

      branch: student.branch,

      graduationYear:
        student.graduationYear

    });

    setMessage("");

  };


  // =====================================================
  // CANCEL STUDENT EDIT
  // =====================================================

  const handleCancelEdit = () => {

    setEditingId(null);

    setFormData({

      name: "",
      cgpa: "",
      backlogs: "",
      branch: "",
      graduationYear: ""

    });

    setMessage("");

  };


  // =====================================================
  // DELETE STUDENT
  // =====================================================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
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
        throw new Error("Failed to delete student");
      }


      setStudents((previousStudents) =>

        previousStudents.filter(
          (student) => student.id !== id
        )

      );


      setMessage(
        "Student deleted successfully!"
      );


    } catch (error) {

      console.error(
        "Delete student error:",
        error
      );


      setMessage(
        "Failed to delete student"
      );

    }

  };


  // =====================================================
  // COMPANY INPUT
  // =====================================================

  const handleCompanyChange = (event) => {

    setCompanyForm({

      ...companyForm,

      [event.target.name]:
        event.target.value

    });

  };


  // =====================================================
  // ADD / UPDATE COMPANY
  // =====================================================

  const handleCompanySubmit = async (event) => {

    event.preventDefault();

    setCompanyMessage("");

    try {

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


      // =================================================
      // UPDATE COMPANY
      // =================================================

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

          const errorText =
            await response.text();

          console.error(
            "Company update error:",
            errorText
          );

          throw new Error(
            "Failed to update company"
          );

        }


        const updatedCompany =
          await response.json();


        setCompanies(
          (previousCompanies) =>

            previousCompanies.map(
              (company) =>

                company.id === editingCompanyId
                  ? updatedCompany
                  : company
            )

        );


        setCompanyMessage(
          "Company updated successfully!"
        );


        setEditingCompanyId(null);

      }


      // =================================================
      // ADD COMPANY
      // =================================================

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

          const errorText =
            await response.text();

          console.error(
            "Company backend error:",
            errorText
          );

          throw new Error(
            "Failed to add company"
          );

        }


        const newCompany =
          await response.json();


        setCompanies(
          (previousCompanies) => [

            ...previousCompanies,

            newCompany

          ]
        );


        setCompanyMessage(
          "Company added successfully!"
        );

      }


      // CLEAR COMPANY FORM

      setCompanyForm({

        companyName: "",
        minCgpa: "",
        maxBacklogs: "",
        eligibleBranch: "",
        graduationYear: ""

      });


    } catch (error) {

      console.error(
        "Company error:",
        error
      );


      setCompanyMessage(
        editingCompanyId !== null
          ? "Failed to update company"
          : "Failed to add company"
      );

    }

  };


  // =====================================================
  // EDIT COMPANY
  // =====================================================

  const handleCompanyEdit = (company) => {

    setEditingCompanyId(company.id);

    setCompanyForm({

      companyName:
        company.companyName,

      minCgpa:
        company.minCgpa,

      maxBacklogs:
        company.maxBacklogs,

      eligibleBranch:
        company.eligibleBranch,

      graduationYear:
        company.graduationYear

    });

    setCompanyMessage("");

  };


  // =====================================================
  // CANCEL COMPANY EDIT
  // =====================================================

  const handleCompanyCancelEdit = () => {

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


  // =====================================================
  // DELETE COMPANY
  // =====================================================

  const handleCompanyDelete = async (id) => {

    const confirmDelete =
      window.confirm(
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

        const errorText =
          await response.text();

        console.error(
          "Company delete error:",
          errorText
        );

        throw new Error(
          "Failed to delete company"
        );

      }


      setCompanies(
        (previousCompanies) =>

          previousCompanies.filter(
            (company) => company.id !== id
          )

      );


      setCompanyMessage(
        "Company deleted successfully!"
      );


    } catch (error) {

      console.error(
        "Delete company error:",
        error
      );


      setCompanyMessage(
        "Failed to delete company"
      );

    }

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="app">


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="header">

        <h1>
          Placement Eligibility Checker
        </h1>

        <p>
          Student Placement Management System
        </p>

      </header>


      {/* =================================================
          STUDENT ADD / EDIT
      ================================================= */}

      <section className="card">

        <h2>

          {editingId !== null
            ? "Edit Student"
            : "Add Student"}

        </h2>


        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={formData.name}
            onChange={handleChange}
            required
          />


          <input
            type="number"
            name="cgpa"
            placeholder="CGPA"
            step="0.01"
            min="0"
            max="10"
            value={formData.cgpa}
            onChange={handleChange}
            required
          />


          <input
            type="number"
            name="backlogs"
            placeholder="Backlogs"
            min="0"
            value={formData.backlogs}
            onChange={handleChange}
            required
          />


          <input
            type="text"
            name="branch"
            placeholder="Branch"
            value={formData.branch}
            onChange={handleChange}
            required
          />


          <input
            type="number"
            name="graduationYear"
            placeholder="Graduation Year"
            value={formData.graduationYear}
            onChange={handleChange}
            required
          />


          <button type="submit">

            {editingId !== null
              ? "Update Student"
              : "Add Student"}

          </button>


          {editingId !== null && (

            <button
              type="button"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>

          )}

        </form>


        {message && (

          <p className="message">
            {message}
          </p>

        )}

      </section>


      {/* =================================================
          STUDENT LIST
      ================================================= */}

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
                          handleEdit(student)
                        }
                      >
                        Edit
                      </button>


                      <button
                        onClick={() =>
                          handleDelete(student.id)
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


      {/* =================================================
          COMPANY ADD / EDIT
      ================================================= */}

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
              onClick={
                handleCompanyCancelEdit
              }
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


      {/* =================================================
          COMPANY LIST
      ================================================= */}

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
                          handleCompanyEdit(
                            company
                          )
                        }
                      >
                        Edit
                      </button>


                      <button
                        onClick={() =>
                          handleCompanyDelete(
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

    </div>

  );

}

export default App;