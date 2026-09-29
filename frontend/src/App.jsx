import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import Login from "./Login";
import "./App.css";

const configuredApiUrl = import.meta.env.VITE_API_URL;
const API_URL = configuredApiUrl
  ? `${configuredApiUrl.startsWith("http") ? "" : "https://"}${configuredApiUrl}`
  : "http://localhost:8080";
const EMPTY_STUDENT = { name: "", cgpa: "", backlogs: "0", branch: "", graduationYear: "" };
const EMPTY_COMPANY = { companyName: "", minCgpa: "", maxBacklogs: "0", eligibleBranch: "", graduationYear: "" };
const NAV_ITEMS = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard },
  { id: "students", label: "Students", icon: GraduationCap },
  { id: "companies", label: "Companies", icon: Building2 },
  { id: "eligibility", label: "Eligibility", icon: ClipboardCheck },
  { id: "results", label: "Results", icon: BriefcaseBusiness },
];

async function request(path, options = {}) {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const text = await response.text();
  if (response.status === 401) {
    ["loggedIn", "username", "userRole", "authToken"].forEach((key) => localStorage.removeItem(key));
    window.location.reload();
    throw new Error("Your session expired. Please sign in again.");
  }
  if (!response.ok) throw new Error(text || `Request failed (${response.status}).`);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function App() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn") === "true");
  const [user, setUser] = useState({ username: localStorage.getItem("username") || "", role: localStorage.getItem("userRole") || "" });
  const [activePage, setActivePage] = useState("dashboard");
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(localStorage.getItem("loggedIn") === "true");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_STUDENT);
  const [search, setSearch] = useState("");
  const [studentId, setStudentId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [checkResult, setCheckResult] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [studentData, companyData, resultData, summaryData] = await Promise.all([
        request("/api/students"),
        request("/api/companies"),
        request("/api/eligibility-results"),
        request("/api/reports/summary"),
      ]);
      setStudents(Array.isArray(studentData) ? studentData : []);
      setCompanies(Array.isArray(companyData) ? companyData : []);
      setResults(Array.isArray(resultData) ? resultData : []);
      setSummary(summaryData || {});
    } catch (loadError) {
      setError(loadError.message || "Could not load placement data. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loggedIn) return undefined;
    let active = true;
    Promise.all([
      request("/api/students"),
      request("/api/companies"),
      request("/api/eligibility-results"),
      request("/api/reports/summary"),
    ])
      .then(([studentData, companyData, resultData, summaryData]) => {
        if (!active) return;
        setStudents(Array.isArray(studentData) ? studentData : []);
        setCompanies(Array.isArray(companyData) ? companyData : []);
        setResults(Array.isArray(resultData) ? resultData : []);
        setSummary(summaryData || {});
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || "Could not load placement data. Check that the backend is running.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [loggedIn]);

  const handleLogin = (loginData) => {
    setUser(loginData);
    setLoggedIn(true);
    setActivePage("dashboard");
  };

  const handleLogout = () => {
    ["loggedIn", "username", "userRole", "authToken"].forEach((key) => localStorage.removeItem(key));
    setLoggedIn(false);
    setUser({ username: "", role: "" });
  };

  const openForm = (record = null, type = activePage) => {
    setEditingId(record?.id ?? null);
    setForm(type === "students" ? (record ? { ...record } : EMPTY_STUDENT) : (record ? { ...record } : EMPTY_COMPANY));
    setFormOpen(true);
    setError("");
    setNotice("");
  };

  const saveRecord = async (event) => {
    event.preventDefault();
    const isStudent = activePage === "students";
    const endpoint = isStudent ? "/api/students" : "/api/companies";
    const payload = isStudent
      ? { ...form, cgpa: Number(form.cgpa), backlogs: Number(form.backlogs), graduationYear: Number(form.graduationYear) }
      : { ...form, minCgpa: Number(form.minCgpa), maxBacklogs: Number(form.maxBacklogs), graduationYear: Number(form.graduationYear) };
    setLoading(true);
    setError("");
    try {
      await request(`${endpoint}${editingId ? `/${editingId}` : ""}`, {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      setFormOpen(false);
      setNotice(`${isStudent ? "Student" : "Company"} ${editingId ? "updated" : "added"} successfully.`);
      await loadData();
    } catch (saveError) {
      setError(saveError.message || "Could not save this record.");
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (type, id) => {
    const label = type === "students" ? "student" : "company";
    if (!window.confirm(`Delete this ${label}? This cannot be undone.`)) return;
    setLoading(true);
    setError("");
    try {
      await request(`/api/${type}/${id}`, { method: "DELETE" });
      setNotice(`${label[0].toUpperCase()}${label.slice(1)} deleted.`);
      await loadData();
    } catch (deleteError) {
      setError(deleteError.message || `Could not delete this ${label}.`);
    } finally {
      setLoading(false);
    }
  };

  const runEligibilityCheck = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    setCheckResult("");
    try {
      const result = await request(`/api/eligibility?studentId=${encodeURIComponent(studentId)}&companyId=${encodeURIComponent(companyId)}`);
      setCheckResult(String(result));
      setNotice("Eligibility check completed and saved to results.");
      await loadData();
    } catch (checkError) {
      setError(checkError.message || "Could not complete the eligibility check.");
    } finally {
      setLoading(false);
    }
  };

  if (!loggedIn) return <Login onLogin={handleLogin} />;

  const pageTitle = NAV_ITEMS.find((item) => item.id === activePage)?.label || "Overview";
  const filteredStudents = students.filter((item) => `${item.name} ${item.branch} ${item.graduationYear}`.toLowerCase().includes(search.toLowerCase()));
  const filteredCompanies = companies.filter((item) => `${item.companyName} ${item.eligibleBranch}`.toLowerCase().includes(search.toLowerCase()));
  const getStudentName = (id) => students.find((student) => student.id === id)?.name || `Student #${id}`;
  const getCompanyName = (id) => companies.find((company) => company.id === id)?.companyName || `Company #${id}`;
  const isEligible = (result) => String(result).toLowerCase().includes("eligible") && !String(result).toLowerCase().includes("not eligible");

  return (
    <div className="workspace">
      <aside className="sidebar">
        <a className="brand" href="#overview" onClick={() => setActivePage("dashboard")} aria-label="Placement Desk home">
          <span className="brand-mark"><ShieldCheck size={21} strokeWidth={2.2} /></span>
          <span><strong>Placement Desk</strong><small>ELIGIBILITY PORTAL</small></span>
        </a>
        <div className="nav-caption">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`nav-item ${activePage === id ? "is-active" : ""}`} onClick={() => { setActivePage(id); setFormOpen(false); setSearch(""); setError(""); setNotice(""); }}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>{activePage === id && <ChevronRight className="nav-chevron" size={15} />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note"><span className="online-dot" />System connected</div>
          <div className="profile-row">
            <span className="avatar">{(user.username || "U").slice(0, 1).toUpperCase()}</span>
            <span className="profile-copy"><strong>{user.username || "User"}</strong><small>{user.role || "Placement team"}</small></span>
            <button className="icon-button logout" title="Sign out" aria-label="Sign out" onClick={handleLogout}><LogOut size={17} /></button>
          </div>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-divider">/</span><strong>{pageTitle}</strong></div>
          <div className="topbar-actions"><span className="today-label">Placement cycle <strong>{new Date().getFullYear()}</strong></span><button className="icon-button refresh" title="Refresh data" aria-label="Refresh data" onClick={loadData} disabled={loading}><RefreshCw size={17} className={loading ? "spin" : ""} /></button></div>
        </header>

        <main className="content">
          {(error || notice) && <div className={`alert ${error ? "alert-error" : "alert-success"}`} role="status"><span>{error || notice}</span><button className="alert-close" aria-label="Dismiss message" onClick={() => { setError(""); setNotice(""); }}><X size={16} /></button></div>}
          {activePage === "dashboard" && <>
            <section className="welcome-row"><div><div className="eyebrow">PLACEMENT OPERATIONS</div><h1>Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {user.username || "there"}.</h1><p>Your placement pipeline, at a glance.</p></div><button className="button button-primary" onClick={() => setActivePage("eligibility")}><ClipboardCheck size={17} />Run eligibility check</button></section>
            <section className="metric-grid" aria-label="Placement statistics">
              <Metric label="Registered students" value={summary.totalStudents ?? students.length} icon={Users} tone="mint" note="Student records" />
              <Metric label="Active companies" value={summary.totalCompanies ?? companies.length} icon={Building2} tone="blue" note="Eligibility criteria set" />
              <Metric label="Eligible students" value={summary.eligibleStudents ?? 0} icon={ArrowUpRight} tone="green" note="At least one match" />
              <Metric label="Awaiting review" value={summary.pendingStudents ?? 0} icon={ArrowDownRight} tone="amber" note="Not checked yet" />
            </section>
            <section className="dashboard-lower">
              <div className="panel recent-panel"><div className="panel-heading"><div><h2>Recent eligibility checks</h2><p>Latest decisions across your student cohort</p></div><button className="text-button" onClick={() => setActivePage("results")}>View all <ChevronRight size={15} /></button></div>
                {results.length ? <div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>COMPANY</th><th>DECISION</th><th>CHECKED</th></tr></thead><tbody>{results.slice(-6).reverse().map((item) => <tr key={item.id}><td className="person-cell"><span className="table-avatar">{getStudentName(item.studentId).slice(0, 1)}</span><strong>{getStudentName(item.studentId)}</strong></td><td>{getCompanyName(item.companyId)}</td><td><Status eligible={isEligible(item.result)}>{isEligible(item.result) ? "Eligible" : "Not eligible"}</Status></td><td>{formatDate(item.checkedAt)}</td></tr>)}</tbody></table></div> : <EmptyState title="No checks yet" text="Run an eligibility check to start building your placement activity." action="Check eligibility" onClick={() => setActivePage("eligibility")} />}
              </div>
              <div className="panel actions-panel"><div className="panel-heading"><div><h2>Quick actions</h2><p>Keep your placement data up to date</p></div></div><button className="action-link" onClick={() => { setActivePage("students"); openForm(null, "students"); }}><span className="action-icon action-mint"><Plus size={17} /></span><span><strong>Add a student</strong><small>Create a student profile</small></span><ChevronRight size={16} /></button><button className="action-link" onClick={() => { setActivePage("companies"); openForm(null, "companies"); }}><span className="action-icon action-lilac"><Building2 size={17} /></span><span><strong>Add a company</strong><small>Set eligibility criteria</small></span><ChevronRight size={16} /></button><button className="action-link" onClick={() => setActivePage("eligibility")}><span className="action-icon action-peach"><ClipboardCheck size={17} /></span><span><strong>Check eligibility</strong><small>Match a student to a role</small></span><ChevronRight size={16} /></button></div>
            </section>
          </>}

          {(activePage === "students" || activePage === "companies") && <>
            <section className="page-heading"><div><div className="eyebrow">DIRECTORY</div><h1>{activePage === "students" ? "Student records" : "Company directory"}</h1><p>{activePage === "students" ? "Maintain student profiles used for eligibility checks." : "Manage employers and the criteria used to assess candidates."}</p></div>{!formOpen && <button className="button button-primary" onClick={() => openForm()}><Plus size={17} />Add {activePage === "students" ? "student" : "company"}</button>}</section>
            {formOpen ? <section className="panel form-panel"><div className="panel-heading"><div><h2>{editingId ? "Update" : "New"} {activePage === "students" ? "student profile" : "company criteria"}</h2><p>Fields marked required must be completed.</p></div><button className="icon-button" aria-label="Close form" onClick={() => setFormOpen(false)}><X size={18} /></button></div>
              <form className="record-form" onSubmit={saveRecord}>
                {activePage === "students" ? <>
                  <Field label="Full name"><input required name="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Aanya Sharma" /></Field>
                  <Field label="CGPA"><input required type="number" min="0" max="10" step="0.01" value={form.cgpa} onChange={(event) => setForm({ ...form, cgpa: event.target.value })} placeholder="0.00 – 10.00" /></Field>
                  <Field label="Branch"><input required value={form.branch} onChange={(event) => setForm({ ...form, branch: event.target.value })} placeholder="e.g. Computer Science" /></Field>
                  <Field label="Active backlogs"><input required type="number" min="0" value={form.backlogs} onChange={(event) => setForm({ ...form, backlogs: event.target.value })} /></Field>
                  <Field label="Graduation year"><input required type="number" min="2000" max="2100" value={form.graduationYear} onChange={(event) => setForm({ ...form, graduationYear: event.target.value })} placeholder={String(new Date().getFullYear())} /></Field>
                </> : <>
                  <Field label="Company name"><input required value={form.companyName} onChange={(event) => setForm({ ...form, companyName: event.target.value })} placeholder="e.g. Northstar Technologies" /></Field>
                  <Field label="Minimum CGPA"><input required type="number" min="0" max="10" step="0.01" value={form.minCgpa} onChange={(event) => setForm({ ...form, minCgpa: event.target.value })} placeholder="0.00 – 10.00" /></Field>
                  <Field label="Eligible branch"><input required value={form.eligibleBranch} onChange={(event) => setForm({ ...form, eligibleBranch: event.target.value })} placeholder="e.g. Computer Science" /></Field>
                  <Field label="Maximum backlogs"><input required type="number" min="0" value={form.maxBacklogs} onChange={(event) => setForm({ ...form, maxBacklogs: event.target.value })} /></Field>
                  <Field label="Graduation year"><input required type="number" min="2000" max="2100" value={form.graduationYear} onChange={(event) => setForm({ ...form, graduationYear: event.target.value })} placeholder={String(new Date().getFullYear())} /></Field>
                </>}
                <div className="form-footer"><span>Eligibility matches the criteria exactly as entered.</span><div><button type="button" className="button button-quiet" onClick={() => setFormOpen(false)}>Cancel</button><button className="button button-primary" disabled={loading}>{loading ? "Saving…" : editingId ? "Save changes" : "Create record"}</button></div></div>
              </form>
            </section> : <section className="panel directory-panel"><div className="directory-toolbar"><div className="record-count"><strong>{activePage === "students" ? students.length : companies.length}</strong> records</div><label className="search-box"><Search size={16} /><input aria-label="Search records" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${activePage}…`} /></label></div>
              {activePage === "students" ? <div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>CGPA</th><th>BRANCH</th><th>BACKLOGS</th><th>GRADUATION</th><th /></tr></thead><tbody>{filteredStudents.map((item) => <tr key={item.id}><td className="person-cell"><span className="table-avatar">{item.name?.slice(0, 1)}</span><strong>{item.name}</strong></td><td><strong>{Number(item.cgpa).toFixed(2)}</strong></td><td>{item.branch}</td><td>{item.backlogs}</td><td>{item.graduationYear}</td><td><RowActions onEdit={() => openForm(item)} onDelete={() => deleteRecord("students", item.id)} /></td></tr>)}</tbody></table>{!filteredStudents.length && <EmptyState title={students.length ? "No matching students" : "No students added"} text={students.length ? "Try another search term." : "Add your first student profile to begin."} action={!students.length ? "Add student" : null} onClick={() => openForm()} />}</div> : <div className="table-wrap"><table><thead><tr><th>COMPANY</th><th>MIN. CGPA</th><th>MAX. BACKLOGS</th><th>ELIGIBLE BRANCH</th><th>GRADUATION</th><th /></tr></thead><tbody>{filteredCompanies.map((item) => <tr key={item.id}><td className="company-cell"><span className="company-mark"><Building2 size={16} /></span><strong>{item.companyName}</strong></td><td>{Number(item.minCgpa).toFixed(2)}</td><td>{item.maxBacklogs}</td><td>{item.eligibleBranch}</td><td>{item.graduationYear}</td><td><RowActions onEdit={() => openForm(item)} onDelete={() => deleteRecord("companies", item.id)} /></td></tr>)}</tbody></table>{!filteredCompanies.length && <EmptyState title={companies.length ? "No matching companies" : "No companies added"} text={companies.length ? "Try another search term." : "Add a company and its eligibility criteria."} action={!companies.length ? "Add company" : null} onClick={() => openForm()} />}</div>}
            </section>}
          </>}

          {activePage === "eligibility" && <>
            <section className="page-heading"><div><div className="eyebrow">CANDIDATE MATCHING</div><h1>Eligibility checker</h1><p>Compare a student profile against a company's placement criteria.</p></div></section>
            <section className="eligibility-layout"><div className="panel checker-panel"><div className="panel-heading"><div><h2>Run a new check</h2><p>Each check is saved automatically to your results.</p></div><span className="checker-badge"><ShieldCheck size={17} /></span></div>
              <form className="checker-form" onSubmit={runEligibilityCheck}><Field label="Select student"><select required value={studentId} onChange={(event) => setStudentId(event.target.value)}><option value="">Choose a student</option>{students.map((item) => <option value={item.id} key={item.id}>{item.name} · {item.branch}</option>)}</select></Field><Field label="Select company"><select required value={companyId} onChange={(event) => setCompanyId(event.target.value)}><option value="">Choose a company</option>{companies.map((item) => <option value={item.id} key={item.id}>{item.companyName}</option>)}</select></Field><button className="button button-primary check-button" disabled={loading || !students.length || !companies.length}><ClipboardCheck size={17} />{loading ? "Checking…" : "Check eligibility"}</button></form>
              {checkResult && <div className={`check-result ${isEligible(checkResult) ? "result-pass" : "result-fail"}`}><div className="result-symbol">{isEligible(checkResult) ? <Check size={20} /> : <X size={20} />}</div><div><strong>{isEligible(checkResult) ? "Eligible for this opportunity" : "Not eligible for this opportunity"}</strong><p>{checkResult}</p></div></div>}
              {(!students.length || !companies.length) && <p className="form-hint">Add at least one student and one company before running a check.</p>}
            </div><aside className="panel criteria-panel"><div className="eyebrow">ASSESSMENT RULES</div><h2>What gets checked?</h2><p>A candidate must meet every requirement below to qualify.</p><ul className="criteria-list"><li><span className="criteria-number">01</span><span><strong>Academic standing</strong><small>CGPA meets or exceeds the company minimum</small></span></li><li><span className="criteria-number">02</span><span><strong>Backlog limit</strong><small>Active backlogs do not exceed the allowed maximum</small></span></li><li><span className="criteria-number">03</span><span><strong>Branch & graduation</strong><small>Branch and year match the hiring criteria</small></span></li></ul></aside></section>
          </>}

          {activePage === "results" && <>
            <section className="page-heading"><div><div className="eyebrow">DECISION LOG</div><h1>Eligibility results</h1><p>Every completed student-to-company assessment in one place.</p></div><div className="result-summary"><strong>{results.length}</strong><span>checks recorded</span></div></section>
            <section className="panel directory-panel"><div className="directory-toolbar"><div className="record-count">Assessment history</div><label className="search-box"><Search size={16} /><input aria-label="Search results" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student or company…" /></label></div>
              {results.length ? <div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>COMPANY</th><th>DECISION</th><th>DETAIL</th><th>CHECKED</th></tr></thead><tbody>{[...results].reverse().filter((item) => `${getStudentName(item.studentId)} ${getCompanyName(item.companyId)} ${item.result} ${item.reason || ""}`.toLowerCase().includes(search.toLowerCase())).map((item) => <tr key={item.id}><td className="person-cell"><span className="table-avatar">{getStudentName(item.studentId).slice(0, 1)}</span><strong>{getStudentName(item.studentId)}</strong></td><td>{getCompanyName(item.companyId)}</td><td><Status eligible={isEligible(item.result)}>{isEligible(item.result) ? "Eligible" : "Not eligible"}</Status></td><td className="reason-cell">{item.reason || item.result}</td><td>{formatDate(item.checkedAt)}</td></tr>)}</tbody></table></div> : <EmptyState title="No results to show" text="Eligibility checks you run will appear here." action="Run a check" onClick={() => setActivePage("eligibility")} />}
            </section>
          </>}
          <footer className="page-footer"><span>Placement Desk <span className="footer-dot">·</span> Student placement operations</span><span>{loading ? "Syncing data…" : "Data synced with placement services"}</span></footer>
        </main>
      </div>
    </div>
  );
}

function Metric({ label, value, icon: Icon, tone, note }) {
  return <article className="metric-card"><div className={`metric-icon ${tone}`}><Icon size={19} strokeWidth={1.9} /></div><div className="metric-label">{label}</div><div className="metric-bottom"><strong>{value}</strong><span>{note}</span></div></article>;
}

function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

function Status({ eligible, children }) {
  return <span className={`status ${eligible ? "status-eligible" : "status-ineligible"}`}><span />{children}</span>;
}

function RowActions({ onEdit, onDelete }) {
  return <div className="row-actions"><button className="icon-button" title="Edit record" aria-label="Edit record" onClick={onEdit}><Pencil size={15} /></button><button className="icon-button danger-icon" title="Delete record" aria-label="Delete record" onClick={onDelete}><Trash2 size={15} /></button></div>;
}

function EmptyState({ title, text, action, onClick }) {
  return <div className="empty-state"><span className="empty-icon"><ClipboardCheck size={20} /></span><strong>{title}</strong><p>{text}</p>{action && <button className="button button-secondary" onClick={onClick}><Plus size={15} />{action}</button>}</div>;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export default App;
