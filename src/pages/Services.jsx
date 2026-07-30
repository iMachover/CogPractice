import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API = "https://kldrxt5cja.execute-api.us-east-1.amazonaws.com/default/student-ikemachover-rest-api";

const Services = () => {
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login state
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Decoded user state
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("customer");

  // Admin: Create User state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Customer: Account action states
  const [newAccountType, setNewAccountType] = useState("CHECKING");
  const [transactionAmounts, setTransactionAmounts] = useState({});

  // Transaction history state
  const [expandedAccountId, setExpandedAccountId] = useState(null); // customer: which account is expanded
  const [accountTransactions, setAccountTransactions] = useState({}); // customer: accountId -> txs[]
  const [expandedUserId, setExpandedUserId] = useState(null); // admin: which user is expanded
  const [userTransactions, setUserTransactions] = useState({}); // admin: userId -> txs[]

  const authHeaders = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.user.id);
        setRole(decoded.user.role || "customer");
        if (decoded.user.role === "admin") {
          fetchUsers();
        } else {
          fetchAccounts();
        }
      } catch (err) {
        setToken("");
        localStorage.removeItem("token");
      }
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password });
      const { token } = res.data;
      setToken(token);
      localStorage.setItem("token", token);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/users`, { headers: authHeaders });
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
      if (err.response?.status === 401) { setToken(""); localStorage.removeItem("token"); }
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/accounts`, { headers: authHeaders });
      setAccounts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch accounts");
      if (err.response?.status === 401) { setToken(""); localStorage.removeItem("token"); }
    } finally {
      setLoading(false);
    }
  };

  // Customer: fetch transactions for a specific account
  const toggleAccountTransactions = async (accountId) => {
    if (expandedAccountId === accountId) {
      setExpandedAccountId(null);
      return;
    }
    setExpandedAccountId(accountId);
    if (accountTransactions[accountId]) return; // already loaded
    try {
      const res = await axios.get(`${API}/api/accounts/${accountId}/transactions`, { headers: authHeaders });
      setAccountTransactions(prev => ({ ...prev, [accountId]: res.data }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load transactions");
    }
  };

  // Admin: fetch all transactions for a specific user
  const toggleUserTransactions = async (uid) => {
    if (expandedUserId === uid) {
      setExpandedUserId(null);
      return;
    }
    setExpandedUserId(uid);
    if (userTransactions[uid]) return; // already loaded
    try {
      const res = await axios.get(`${API}/api/users/${uid}/transactions`, { headers: authHeaders });
      setUserTransactions(prev => ({ ...prev, [uid]: res.data }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load transactions");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await axios.delete(`${API}/api/users/${id}`, { headers: authHeaders });
      setUsers(users.filter((u) => u._id !== id && u.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      // Route through /api/auth/register so password is properly hashed and validated
      await axios.post(`${API}/api/auth/register`, { name: newName, email: newEmail, password: newPassword });
      // Refresh the user list
      await fetchUsers();
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      alert(`Customer ${newName} registered successfully!`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create user");
    }
  };

  const handleOpenAccount = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/accounts`, { userId, accountType: newAccountType }, { headers: authHeaders });
      setAccounts([...accounts, res.data]);
      alert(`Successfully opened a new ${newAccountType} account!`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to open account");
    }
  };

  const handleDeposit = async (accountId) => {
    const amount = parseFloat(transactionAmounts[accountId]);
    if (!amount || amount <= 0) { alert("Please enter a positive deposit amount."); return; }
    try {
      const res = await axios.post(`${API}/api/accounts/${accountId}/deposit`, { amount }, { headers: authHeaders });
      setAccounts(accounts.map((acc) => acc._id === accountId ? { ...acc, balance: res.data.balance } : acc));
      setTransactionAmounts({ ...transactionAmounts, [accountId]: "" });
      // Invalidate cached transactions so they refresh on next toggle
      setAccountTransactions(prev => { const n = { ...prev }; delete n[accountId]; return n; });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Deposit failed");
    }
  };

  const handleWithdraw = async (accountId) => {
    const amount = parseFloat(transactionAmounts[accountId]);
    if (!amount || amount <= 0) { alert("Please enter a positive withdrawal amount."); return; }
    try {
      const res = await axios.post(`${API}/api/accounts/${accountId}/withdraw`, { amount }, { headers: authHeaders });
      setAccounts(accounts.map((acc) => acc._id === accountId ? { ...acc, balance: res.data.balance } : acc));
      setTransactionAmounts({ ...transactionAmounts, [accountId]: "" });
      setAccountTransactions(prev => { const n = { ...prev }; delete n[accountId]; return n; });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Withdrawal failed");
    }
  };

  const handleAmountChange = (accountId, val) => {
    setTransactionAmounts({ ...transactionAmounts, [accountId]: val });
  };

  const txRowStyle = { background: "#f8f9fb", borderTop: "1px solid var(--border-color)" };
  const txBadge = (type) => ({
    padding: "3px 8px", borderRadius: "4px", fontSize: "0.78rem", fontWeight: "bold",
    background: type === "DEPOSIT" ? "#e6f9ec" : "#ffebe6",
    color: type === "DEPOSIT" ? "#198754" : "#dc3545",
  });

  if (!token) {
    return (
      <div className="card" style={{ maxWidth: "400px", margin: "4rem auto" }}>
        <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Secure Login</h2>
        {error && (
          <div style={{ color: "var(--danger)", marginBottom: "1rem", padding: "10px", background: "#ffebe6", borderRadius: "4px", fontSize: "0.9rem" }}>
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.9rem" }}>Email Address</label>
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ marginBottom: 0 }} />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.9rem" }}>Password</label>
            <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ marginBottom: 0 }} />
          </div>
          <button className="btn" type="submit" style={{ width: "100%", padding: "12px" }} disabled={loading}>
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      {/* Dashboard Header */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid var(--border-color)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
          <div>
            <h1 style={{ margin: 0 }}>Dashboard</h1>
            <span style={{ fontSize: "0.9rem", color: "var(--primary-color)", fontWeight: 600, textTransform: "uppercase" }}>Role: {role}</span>
          </div>
          <button className="btn" style={{ background: "var(--surface-color)", color: "var(--text-main)", border: "1px solid var(--border-color)" }}
            onClick={() => { setToken(""); localStorage.removeItem("token"); }}>
            Sign Out
          </button>
        </div>

        {role === "admin" ? (
          <>
            <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Register New Customer</h3>
            <form onSubmit={createUser} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <input type="text" placeholder="Full Name" value={newName} onChange={(e) => setNewName(e.target.value)} required style={{ marginBottom: 0 }} />
              </div>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <input type="email" placeholder="Email Address" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required style={{ marginBottom: 0 }} />
              </div>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <input type="password" placeholder="Password (8+ chars, 1 uppercase, 1 number)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={{ marginBottom: 0 }} />
              </div>
              <button className="btn" type="submit" style={{ whiteSpace: "nowrap" }}>Create Profile</button>
            </form>
          </>
        ) : (
          <div>
            <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Open a Banking Account</h3>
            <form onSubmit={handleOpenAccount} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <select value={newAccountType} onChange={(e) => setNewAccountType(e.target.value)}
                style={{ padding: "10px", borderRadius: "4px", border: "1px solid var(--border-color)", outline: "none" }}>
                <option value="CHECKING">Checking Account</option>
                <option value="SAVINGS">Savings Account</option>
              </select>
              <button className="btn" type="submit">Open Account</button>
            </form>
          </div>
        )}
      </div>

      {/* Admin: Customer Table */}
      {role === "admin" ? (
        <div className="card">
          <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Active Customers (Admin Only)</h3>
          {loading && <p style={{ color: "var(--text-muted)" }}>Retrieving records...</p>}
          {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
          {!loading && !error && users.length === 0 && <p style={{ color: "var(--text-muted)" }}>No customer records found.</p>}
          {!loading && !error && users.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <>
                      <tr key={user._id || user.id}>
                        <td style={{ fontWeight: 500 }}>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</td>
                        <td>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button className="btn" style={{ padding: "6px 12px", fontSize: "0.85rem", background: "#6366f1" }}
                              onClick={() => toggleUserTransactions(user._id || user.id)}>
                              {expandedUserId === (user._id || user.id) ? "Hide Txns" : "View Txns"}
                            </button>
                            <button className="btn btn-danger" style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                              onClick={() => deleteUser(user._id || user.id)}>
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedUserId === (user._id || user.id) && (
                        <tr key={`txn-${user._id}`} style={txRowStyle}>
                          <td colSpan="4" style={{ padding: "1rem 1.5rem" }}>
                            <strong style={{ fontSize: "0.9rem" }}>Transaction History — {user.name}</strong>
                            {!userTransactions[user._id] ? (
                              <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>Loading...</p>
                            ) : userTransactions[user._id].length === 0 ? (
                              <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>No transactions found for this customer.</p>
                            ) : (
                              <table style={{ marginTop: "0.75rem", width: "100%" }}>
                                <thead>
                                  <tr>
                                    <th>Account Type</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {userTransactions[user._id].map((tx, i) => (
                                    <tr key={i}>
                                      <td>{tx.accountType}</td>
                                      <td><span style={txBadge(tx.type)}>{tx.type}</span></td>
                                      <td style={{ fontWeight: 600 }}>${tx.amount.toFixed(2)}</td>
                                      <td>{new Date(tx.date).toLocaleString()}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Customer: Accounts + Transactions */
        <div className="card">
          <h3 style={{ marginBottom: "1.5rem", fontSize: "1.2rem" }}>Your Accounts</h3>
          {loading && <p style={{ color: "var(--text-muted)" }}>Fetching balances...</p>}
          {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
          {!loading && !error && accounts.length === 0 && (
            <p style={{ color: "var(--text-muted)" }}>You do not have any active accounts. Open one above to get started!</p>
          )}
          {!loading && !error && accounts.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Account Type</th>
                    <th>Current Balance</th>
                    <th>Quick Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((acc) => (
                    <>
                      <tr key={acc._id}>
                        <td>
                          <span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "bold",
                            background: acc.accountType === "CHECKING" ? "#e2f0fd" : "#e6f9ec",
                            color: acc.accountType === "CHECKING" ? "#0d6efd" : "#198754" }}>
                            {acc.accountType}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600, fontSize: "1.1rem", color: "var(--primary-color)" }}>
                          ${acc.balance.toFixed(2)}
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                            <input type="number" placeholder="$0.00" value={transactionAmounts[acc._id] || ""}
                              onChange={(e) => handleAmountChange(acc._id, e.target.value)}
                              style={{ width: "90px", padding: "6px", fontSize: "0.85rem", marginBottom: 0 }} />
                            <button className="btn" style={{ padding: "6px 12px", fontSize: "0.85rem", background: "#198754" }}
                              onClick={() => handleDeposit(acc._id)}>Deposit</button>
                            <button className="btn" style={{ padding: "6px 12px", fontSize: "0.85rem", background: "#0d6efd" }}
                              onClick={() => handleWithdraw(acc._id)}>Withdraw</button>
                            <button className="btn" style={{ padding: "6px 12px", fontSize: "0.85rem", background: "#6366f1" }}
                              onClick={() => toggleAccountTransactions(acc._id)}>
                              {expandedAccountId === acc._id ? "Hide History" : "View History"}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedAccountId === acc._id && (
                        <tr key={`txn-${acc._id}`} style={txRowStyle}>
                          <td colSpan="3" style={{ padding: "1rem 1.5rem" }}>
                            <strong style={{ fontSize: "0.9rem" }}>Transaction History</strong>
                            {!accountTransactions[acc._id] ? (
                              <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>Loading...</p>
                            ) : accountTransactions[acc._id].length === 0 ? (
                              <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>No transactions yet for this account.</p>
                            ) : (
                              <table style={{ marginTop: "0.75rem", width: "100%" }}>
                                <thead>
                                  <tr>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {accountTransactions[acc._id].map((tx, i) => (
                                    <tr key={i}>
                                      <td><span style={txBadge(tx.type)}>{tx.type}</span></td>
                                      <td style={{ fontWeight: 600 }}>${tx.amount.toFixed(2)}</td>
                                      <td>{new Date(tx.date || tx.createdAt).toLocaleString()}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Services;
