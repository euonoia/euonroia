import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getUsers, addUser, updateUser, deleteUser } from '../api/api'
import { useAppContext } from '../context/appcontext'
import { User } from '../api/types'

export default function UserList() {
  const { user } = useAppContext()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [editingUser, setEditingUser] = useState<User | null>(null)

  // Load users
  const fetchUsers = async () => {
    setLoading(true)
    try {
      console.log('📤 Fetching users...')
      const data = await getUsers()
      console.log('✅ Users fetched:', data)
      setUsers(data)
    } catch (err) {
      console.error('❌ Failed to fetch users:', err)
      alert('Error fetching users — check console.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Add or update user
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please enter both name and email.')
      return
    }

    try {
      if (editingUser) {
        console.log('📤 Updating user...', editingUser.id, formData)
        const updated = await updateUser(editingUser.id, formData)
        console.log('✅ User updated:', updated)
        alert(`User updated: ${updated.name}`)
      } else {
        console.log('📤 Adding new user...', formData)
        const newUser = await addUser(formData)
        console.log('✅ User added:', newUser)
        alert(`User added: ${newUser.name}`)
      }

      setFormData({ name: '', email: '' })
      setEditingUser(null)
      await fetchUsers()
    } catch (err: any) {
      console.error('❌ Error submitting user:', err)
      alert(
        'Error adding/updating user — see console for details. ' +
        (err.response?.data?.error || err.message)
      )
    }
  }

  // Edit user
  const handleEdit = (u: User) => {
    setEditingUser(u)
    setFormData({ name: u.name, email: u.email })
  }

  // Delete user
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      console.log('📤 Deleting user...', id)
      await deleteUser(id)
      console.log('🗑️ User deleted:', id)
      alert('User deleted')
      fetchUsers()
    } catch (err: any) {
      console.error('❌ Failed to delete user:', err)
      alert('Failed to delete user — see console.')
    }
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem', fontFamily: 'sans-serif' }}>
      <h1>User Management</h1>
      <p>Welcome back{user ? `, ${user}` : ''}! Manage users below.</p>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'inline-block',
          textAlign: 'left',
          margin: '1.5rem auto',
          padding: '1.5rem',
          border: '1px solid #ccc',
          borderRadius: '1rem',
          background: '#fafafa',
        }}
      >
        <h2>{editingUser ? 'Edit User' : 'Add User'}</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.3rem' }}>Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '250px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '.3rem' }}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '250px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            type="submit"
            style={{
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 14px',
              cursor: 'pointer',
            }}
          >
            {editingUser ? 'Update User' : 'Add User'}
          </button>
          {editingUser && (
            <button
              type="button"
              onClick={() => {
                setEditingUser(null)
                setFormData({ name: '', email: '' })
              }}
              style={{
                background: '#aaa',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 14px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Users Table */}
      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table
          style={{
            margin: '1rem auto',
            borderCollapse: 'collapse',
            width: '70%',
            fontSize: '14px',
          }}
        >
          <thead>
            <tr style={{ background: '#eaeaea' }}>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Name</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Email</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{u.name}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{u.email}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  <button
                    onClick={() => handleEdit(u)}
                    style={{
                      background: '#ffc107',
                      border: 'none',
                      color: '#000',
                      borderRadius: '4px',
                      padding: '6px 10px',
                      marginRight: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    style={{
                      background: '#dc3545',
                      border: 'none',
                      color: '#fff',
                      borderRadius: '4px',
                      padding: '6px 10px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '1rem' }}>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  )
}
