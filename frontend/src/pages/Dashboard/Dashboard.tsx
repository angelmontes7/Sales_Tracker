import './Dashboard.css'
import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { TrendingUp, TrendingDown, Users, DollarSign, CheckCircle, Clock, Award, Target } from 'lucide-react'
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
  const [activeView, setActiveView] = useState('overview')

  useEffect(() => {
    api.get('/api/sales/')
      .then(res => setSales(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  // Analytics calculations
  const totalSales = sales.reduce((sum, sale) => sum + Number(sale.amount || 0), 0)
  const verifiedSales = sales.filter(sale => sale.is_verified)
  const verificationRate = sales.length > 0 ? (verifiedSales.length / sales.length) * 100 : 0
  const avgSaleAmount = sales.length > 0 ? totalSales / sales.length : 0

  // Trend data for charts
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).reverse()

  const dailyTrends = last7Days.map(date => {
    const daysSales = sales.filter(sale => sale.timestamp.startsWith(date))
    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sales: daysSales.length,
      revenue: daysSales.reduce((sum, sale) => sum + sale.amount, 0),
      verified: daysSales.filter(sale => sale.is_verified).length
    }
  })

  // Leaderboard data
  const userStats = sales.reduce((acc, sale) => {
    if (!acc[sale.user_display_name]) {
      acc[sale.user_display_name] = { sales: 0, revenue: 0, verified: 0 }
    }
    acc[sale.user_display_name].sales++
    acc[sale.user_display_name].revenue += sale.amount
    if (sale.is_verified) acc[sale.user_display_name].verified++
    return acc
  }, {} as Record<string, { sales: number; revenue: number; verified: number }>)

  const leaderboard = Object.entries(userStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)

  // Carrier distribution
  const carrierData = sales.reduce((acc, sale) => {
    const carrier = sale.issued_carrier || 'Unknown'
    acc[carrier] = (acc[carrier] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const carrierChartData = Object.entries(carrierData).map(([name, value]) => ({ name, value }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <div className="card stat-card">
      <div className="stat-card-content">
        <div>
          <p className="stat-card-title">{title}</p>
          <p className="stat-card-value">{value}</p>
          {change && (
            <div className={`stat-card-change ${trend === 'up' ? 'trend-up' : 'trend-down'}`}>
              {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="change-text">{change}</span>
            </div>
          )}
        </div>
        <div className="stat-card-icon">
          <Icon className="icon" />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="layout-container">
        <nav className="navbar">
          <div className="navbar-content">
            <h1>SalesTracker Pro</h1>
          </div>
        </nav>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const renderOverview = () => (
    <div>
      <h1>Dashboard Overview</h1>
      
      {/* KPI Cards */}
      <div className="cards-grid">
        <StatCard
          title="Total Revenue"
          value={`$${totalSales.toLocaleString()}`}
          change="+12.5%"
          trend="up"
          icon={DollarSign}
        />
        <StatCard
          title="Total Sales"
          value={sales.length.toLocaleString()}
          change="+8.2%"
          trend="up"
          icon={Target}
        />
        <StatCard
          title="Verification Rate"
          value={`${verificationRate.toFixed(1)}%`}
          change="-2.1%"
          trend="down"
          icon={CheckCircle}
        />
        <StatCard
          title="Avg Sale Value"
          value={`$${avgSaleAmount.toFixed(0)}`}
          change="+5.3%"
          trend="up"
          icon={TrendingUp}
        />
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Daily Revenue Trend */}
        <div className="content-section">
          <h2>Daily Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#0088FE" fill="#0088FE" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sales Volume */}
        <div className="content-section">
          <h2>Daily Sales Volume</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#00C49F" name="Total Sales" />
              <Bar dataKey="verified" fill="#0088FE" name="Verified Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Carrier Distribution */}
      <div className="content-section">
        <h2>Sales by Carrier</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={carrierChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {carrierChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div>
      <h1>Detailed Analytics</h1>
      
      {/* Performance Metrics */}
      <div className="analytics-grid">
        <div className="content-section">
          <h2>Sales Performance</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#0088FE" strokeWidth={2} name="Total Sales" />
              <Line type="monotone" dataKey="verified" stroke="#00C49F" strokeWidth={2} name="Verified Sales" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="content-section">
          <h2>Revenue Distribution</h2>
          <div className="revenue-distribution">
            {leaderboard.slice(0, 5).map((user, index) => (
              <div key={user.name} className="revenue-item">
                <div className="revenue-item-left">
                  <div className="revenue-rank">
                    {index + 1}
                  </div>
                  <span className="revenue-name">{user.name}</span>
                </div>
                <span className="revenue-amount">${user.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="content-section">
          <h2>Key Insights</h2>
          <div className="insights-container">
            <div className="insight-item insight-success">
              <p>
                <strong>Best Performer:</strong> {leaderboard[0]?.name} with ${leaderboard[0]?.revenue.toLocaleString()}
              </p>
            </div>
            <div className="insight-item insight-info">
              <p>
                <strong>Peak Day:</strong> {dailyTrends.reduce((max, day) => day.revenue > max.revenue ? day : max).date}
              </p>
            </div>
            <div className="insight-item insight-warning">
              <p>
                <strong>Verification Rate:</strong> {verificationRate.toFixed(1)}% of all sales
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Charts */}
      <div className="content-section">
        <h2>Revenue vs Sales Correlation</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dailyTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="sales" fill="#00C49F" name="Number of Sales" />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#FF8042" strokeWidth={3} name="Revenue ($)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  const renderLeaderboard = () => (
    <div>
      <div className="leaderboard-header">
        <h1>Sales Leaderboard</h1>
        <div className="leaderboard-badge">
          <Award className="award-icon" />
          <span className="badge-text">Top Performers</span>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="cards-grid">
        {leaderboard.slice(0, 3).map((user, index) => (
          <div key={user.name} className={`card podium-card podium-${index + 1}`}>
            <div className="podium-content">
              <div className={`podium-rank rank-${index + 1}`}>
                {index + 1}
              </div>
              <h3 className="podium-name">{user.name}</h3>
              <p className="podium-revenue">
                ${user.revenue.toLocaleString()}
              </p>
              <div className="podium-stats">
                <p>{user.sales} total sales</p>
                <p>{user.verified} verified</p>
                <p>{((user.verified / user.sales) * 100).toFixed(1)}% verification rate</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Leaderboard Table */}
      <div className="content-section">
        <h2>Complete Rankings</h2>
        <div className="table-container">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Salesperson</th>
                <th className="text-right">Revenue</th>
                <th className="text-right">Sales</th>
                <th className="text-right">Verified</th>
                <th className="text-right">Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr key={user.name}>
                  <td>
                    <div className="rank-cell">
                      <span className="rank-number">#{index + 1}</span>
                      {index < 3 && (
                        <Award className={`rank-award rank-award-${index + 1}`} />
                      )}
                    </div>
                  </td>
                  <td className="user-name">{user.name}</td>
                  <td className="revenue-cell">
                    ${user.revenue.toLocaleString()}
                  </td>
                  <td className="text-right text-gray">{user.sales}</td>
                  <td className="text-right text-gray">{user.verified}</td>
                  <td className="text-right">
                    <span className={`success-rate ${
                      (user.verified / user.sales) * 100 >= 80 ? 'rate-high' : 
                      (user.verified / user.sales) * 100 >= 60 ? 'rate-medium' : 'rate-low'
                    }`}>
                      {((user.verified / user.sales) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderSalesTable = () => (
    <div>
      <h1>Sales Data</h1>
      <div className="content-section">
        <div className="table-container">
          <table className="sales-table">
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
        </div>
      </div>
    </div>
  )

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
              <li><a href="#" onClick={() => setActiveView('overview')} className={activeView === 'overview' ? 'active' : ''}>Dashboard</a></li>
              <li><a href="#" onClick={() => setActiveView('analytics')} className={activeView === 'analytics' ? 'active' : ''}>Analytics</a></li>
              <li><a href="#" onClick={() => setActiveView('leaderboard')} className={activeView === 'leaderboard' ? 'active' : ''}>Leaderboard</a></li>
              <li><a href="#" onClick={() => setActiveView('sales')} className={activeView === 'sales' ? 'active' : ''}>Sales Data</a></li>
              <li><a href="#">Settings</a></li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {activeView === 'overview' && renderOverview()}
          {activeView === 'analytics' && renderAnalytics()}
          {activeView === 'leaderboard' && renderLeaderboard()}
          {activeView === 'sales' && renderSalesTable()}
        </main>
      </div>
    </div>
  )
}

export default Dashboard