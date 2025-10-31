export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#f1f1f1', padding: '1rem', marginTop: '2rem' }}>
      <p>© {new Date().getFullYear()} My React App. All rights reserved.</p>
    </footer>
  )
}
