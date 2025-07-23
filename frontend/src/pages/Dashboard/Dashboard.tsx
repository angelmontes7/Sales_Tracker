import './Dashboard.css'
import { useEffect, useState } from 'react'
import api from '../../api'

interface Sale {
  id: number
  user_display_name: string
  amount: number
  issued_carrier: string | null
  raw_message: string
  is_verified: boolean
  timestamp: string
  date_of_sale: string | null
}

function Dashboard() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  api.get('/api/sales/')
    .then(res => setSales(res.data))
    .catch(err => console.error(err))
    .finally(() => setLoading(false))
  }, []) 

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
            <h1>Sales Dashboard</h1>
            {loading ? (
              <div>Loading sales...</div>
            ) : (
              <table style={{ width: '100%', background: 'white', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Carrier</th>
                    <th>Verified</th>
                    <th>Date of Sale</th>
                    <th>Timestamp</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map(sale => (
                    <tr key={sale.id}>
                      <td>{sale.user_display_name}</td>
                      <td>${sale.amount}</td>
                      <td>{sale.issued_carrier || '-'}</td>
                      <td>{sale.is_verified ? '✅' : '❌'}</td>
                      <td>{sale.date_of_sale || '-'}</td>
                      <td>{new Date(sale.timestamp).toLocaleString()}</td>
                      <td>{sale.raw_message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
export default Dashboard
