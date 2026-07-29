const Home = () => {
  return (
    <div style={{ marginTop: '2rem' }}>
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', borderTop: '4px solid var(--primary-color)' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
          Banking designed for your life.
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
          Experience secure, reliable, and modern financial services. Manage your accounts, transfer funds, and grow your wealth with confidence.
        </p>
        <button className="btn" style={{ fontSize: '1.1rem', padding: '12px 32px' }}>Open an Account</button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        <div className="card">
          <h3 style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>Checking & Savings</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>High-yield options with zero monthly maintenance fees.</p>
        </div>
        <div className="card">
          <h3 style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>Credit Cards</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Earn cash back and travel rewards on every purchase.</p>
        </div>
        <div className="card">
          <h3 style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>Home Loans</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Competitive rates to help you buy the home of your dreams.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
