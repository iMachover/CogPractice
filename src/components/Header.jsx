import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={{ 
      background: 'var(--header-bg)', 
      borderBottom: '1px solid var(--border-color)',
      padding: '0 2rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '70px'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-color)', letterSpacing: '-0.5px' }}>
          National Bank
        </div>
        <nav>
          <ul style={{ display: 'flex', gap: '2rem', margin: 0, fontWeight: 500 }}>
            <li><Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Home</Link></li>
            <li><Link to="/about" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>About</Link></li>
            <li><Link to="/services" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Services</Link></li>
            <li><Link to="/contact" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Contact</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
