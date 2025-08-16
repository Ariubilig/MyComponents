import { useEffect, useState } from 'react';
import './notification.css';

function Notification({ type = 'default', message, onClose }) {
  if (!message) return null;

  const themes = {
    success: { bg: '#e8f5e9', color: '#2e7d32', border: '#2e7d32' },
    error: { bg: '#ffebee', color: '#c62828', border: '#c62828' },
    warning: { bg: '#fff8e1', color: '#ff8f00', border: '#ff8f00' },
    default: { bg: '#e3f2fd', color: '#0277bd', border: '#0277bd' }
  };

  const theme = themes[type];

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, minWidth: 300,
      padding: '15px 20px', borderRadius: 4, display: 'flex',
      justifyContent: 'space-between', alignItems: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 9999,
      backgroundColor: theme.bg, color: theme.color,
      borderLeft: `4px solid ${theme.border}`
    }}>
      <div style={{flex: 1, paddingRight: 10}}>{message}</div>
      <button 
        style={{
          background: 'none', border: 'none', color: 'inherit',
          fontSize: 16, cursor: 'pointer', opacity: 0.7, padding: 0
        }}
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}

export default Notification;