import { useState, useEffect } from 'react';
import axios from 'axios';

const Services = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login state
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123'); // Assuming standard mock credentials

  // Create state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      const { token } = res.data;
      setToken(token);
      localStorage.setItem('token', token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      if (err.response?.status === 401) {
        setToken('');
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u._id !== id && u.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/users', { name: newName, email: newEmail }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers([...users, res.data]);
      setNewName('');
      setNewEmail('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create user');
    }
  };

  if (!token) {
    return (
      <div className="card" style={{ maxWidth: '400px', margin: '4rem auto' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Secure Login</h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '10px', background: '#ffebe6', borderRadius: '4px', fontSize: '0.9rem' }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ marginBottom: 0 }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ marginBottom: 0 }}
            />
          </div>
          <button className="btn" type="submit" style={{ width: '100%', padding: '12px' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <h1 style={{ margin: 0 }}>Customer Management</h1>
          <button 
            className="btn" 
            style={{ background: 'var(--surface-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
            onClick={() => { setToken(''); localStorage.removeItem('token'); }}
          >
            Sign Out
          </button>
        </div>
        
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Register New Customer</h3>
        <form onSubmit={createUser} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <input 
              type="text" 
              placeholder="Full Name" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)} 
              required 
              style={{ marginBottom: 0 }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={newEmail} 
              onChange={(e) => setNewEmail(e.target.value)} 
              required 
              style={{ marginBottom: 0 }}
            />
          </div>
          <button className="btn" type="submit" style={{ whiteSpace: 'nowrap' }}>Create Profile</button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Active Customers</h3>
        
        {loading && <p style={{ color: 'var(--text-muted)' }}>Retrieving records...</p>}
        {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
        
        {!loading && !error && users.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No customer records found.</p>}
        
        {!loading && !error && users.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Full Name</th>
                  <th>Email Address</th>
                  <th>Registration Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id || user.id}>
                    <td><code style={{ background: '#f4f5f7', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>{user._id || user.id}</code></td>
                    <td style={{ fontWeight: 500 }}>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: '6px 12px', fontSize: '0.85rem' }} 
                        onClick={() => deleteUser(user._id || user.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
