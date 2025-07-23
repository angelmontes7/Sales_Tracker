import './Dashboard.css'
function Dashboard() {
  return (
    <div className="layout-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <h1>SalesTracker Pro</h1>
          <div className="navbar-buttons">
            <button>Home</button>
            <button>About</button>
            <button>Profile</button>
          </div>
        </div>
      </nav>

      {/* Main content area with sidebar and content */}
      <div className="main-content-area">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-content">
            <h2>Navigation</h2>
            <ul>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="#">Analytics</a></li>
              <li><a href="#">Reports</a></li>
              <li><a href="#">Settings</a></li>
              <li><a href="#">Users</a></li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <h1>Welcome to the Dashboard</h1>
          
          <div className="cards-grid">
            <div className="card">
              <h3>Card 1</h3>
              <p>sample content for the first card.</p>
            </div>
            <div className="card">
              <h3>Card 2</h3>
              <p>sample content for the second card.</p>
            </div>
            <div className="card">
              <h3>Card 3</h3>
              <p>sample content for the third card.</p>
            </div>
          </div>

          <div className="content-section">
            <h2>Main Content Area</h2>
            <p>
               main content area. 
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
export default Dashboard
