import { useEffect, useState } from 'react';

export default function Sidebar() {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="sidebar">
      <div style={{ 
        backgroundColor: '#ffffff', 
        border: '2px solid #e0e0e0', 
        padding: '20px', 
        borderRadius: '4px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px',
        width: '100%'
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          marginBottom: '15px', 
          textAlign: 'center', 
          color: '#424242' 
        }}>
          Advertisement
        </h3>
        <div style={{ 
          width: '100%', 
          maxWidth: '300px', 
          height: '250px', 
          backgroundColor: '#f0f0f0', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #ddd',
          margin: '0 auto'
        }}>
          <p style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
            {loaded ? 'Ad Space (300x250)' : 'Loading...'}
          </p>
        </div>
      </div>
    </div>
  );
}