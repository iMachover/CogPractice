const Contact = () => {
  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <h1 style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>Contact Us</h1>
      <div style={{ marginTop: '1.5rem', color: 'var(--text-main)' }}>
        <p style={{ marginBottom: '1rem' }}><strong>Email:</strong> support@nationalbank.com</p>
        <p style={{ marginBottom: '1rem' }}><strong>Phone:</strong> 1-800-555-0199</p>
        <p><strong>Hours:</strong> Mon-Fri, 8:00 AM - 8:00 PM EST</p>
      </div>
    </div>
  );
};

export default Contact;
