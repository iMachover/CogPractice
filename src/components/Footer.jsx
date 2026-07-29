const Footer = () => {
  return (
    <footer style={{ 
      background: 'var(--header-bg)', 
      borderTop: '1px solid var(--border-color)', 
      padding: '2rem', 
      textAlign: 'center', 
      marginTop: 'auto',
      color: 'var(--text-muted)',
      fontSize: '0.9rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p>&copy; {new Date().getFullYear()} National Bank. Member FDIC. Equal Housing Lender.</p>
      </div>
    </footer>
  );
};

export default Footer;
