import { Link } from 'react-router-dom'
import styles from '../styles/about.module.css'
import { APP_NAME, VERSION } from '../utils/constants'
import { formatDate } from '../utils/formatDate'
import { capitalize } from '../utils/capitalize'

export default function AboutPage() {
  const today = new Date()
  const greeting = capitalize('welcome to the about page')

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About</h1>
      <p className={styles.text}>
        {greeting}! <br />
        You’re viewing <strong>{APP_NAME}</strong> version {VERSION}.
      </p>
      <p className={styles.text}>
        Today’s date: {formatDate(today)}
      </p>
      <Link to="/users" className={styles.link}>
        Go to Users
      </Link>
    </div>
  )
}
