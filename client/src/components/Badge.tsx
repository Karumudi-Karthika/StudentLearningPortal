import React from 'react';

interface BadgeProps {
  label: string;
  type: 'admin' | 'student' | 'completed' | 'inprogress';
}

const Badge: React.FC<BadgeProps> = ({ label, type }) => {
  const styles = {
    admin: { background: '#4a0e8f', color: 'white' },
    student: { background: '#0055aa', color: 'white' },
    completed: { background: '#155724', color: 'white' },
    inprogress: { background: '#856404', color: 'white' }
  };

  return (
    <span style={{
      ...styles[type],
      padding: '3px 12px',
      borderRadius: '12px',
      fontSize: '0.8rem',
      fontWeight: 'bold',
      textAlign: 'center',
      display: 'inline-block'
    }}>
      {label}
    </span>
  );
};

export default Badge;
