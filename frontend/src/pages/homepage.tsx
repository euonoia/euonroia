import { Link } from 'react-router-dom'
import { useGreeting } from '../hooks/usegreetings'
import { useAppContext } from '../context/appcontext'

export default function Homepage() {
  const greeting = useGreeting()
  const { user, setUser } = useAppContext() // ✅ use context here

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem', fontFamily: 'sans-serif' }}>
      <h1>{greeting}, {user}!</h1>
      <p>Welcome to your React + TypeScript app with Context.</p>

      <button onClick={() => setUser('Kobe')}>Change User</button>

      <div style={{ marginTop: '1rem' }}>
        <Link to="/dashboard">Go to Dashboard</Link>
      </div>
    </div>
  )
}
