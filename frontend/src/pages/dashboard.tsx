import { Link } from 'react-router-dom'
import Header from '../components/header'
import Footer from '../components/footer'
import DashboardStats from '../components/dashboardstats'

export default function Dashboard() {
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <Header />
      <main style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h1>Dashboard</h1>
        <p>This is your dashboard page!</p>
        <DashboardStats />
        <Link to="/about">Go to About</Link>
      </main>
      <Footer />
    </div>
  )
}
