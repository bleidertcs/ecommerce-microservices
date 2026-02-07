import React from 'react';

export default function Footer() {
  return (
    <footer style={{ 
      padding: '32px 24px', 
      textAlign: 'center', 
      borderTop: '1px solid var(--border)',
      marginTop: '64px',
      color: 'var(--muted)',
      fontSize: '14px'
    }}>
      <p>&copy; {new Date().getFullYear()} LUMINA. All rights reserved.</p>
    </footer>
  );
}
