import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(onClose, 10000);
    const interval = setInterval(() => {
      setProgress(prev => Math.max(0, prev - (100 / 100)));
    }, 100);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [onClose]);

  const colors = {
    success: { background: '#d4edda', color: '#155724', border: '#c3e6cb', bar: '#28a745' },
    error: { background: '#f8d7da', color: '#721c24', border: '#f5c6cb', bar: '#dc3545' },
    info: { background: '#d1ecf1', color: '#0c5460', border: '#bee5eb', bar: '#17a2b8' }
  };

  const icons = { success: '✓', error: '✕', info: 'ℹ' };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: colors[type].background,
      color: colors[type].color,
      border: `1px solid ${colors[type].border}`,
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontSize: '0.95rem',
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      animation: 'slideDown 0.3s ease'
    }}>
      <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{icons[type]}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors[type].color, fontSize: '1.1rem', padding: '0' }}
      >
        ✕
      </button>
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '3px',
        width: `${progress}%`,
        background: colors[type].bar,
        transition: 'width 0.1s linear'
      }} />
      <style>{`@keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  );
};

export default Toast;
