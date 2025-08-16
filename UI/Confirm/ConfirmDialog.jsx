import './ConfirmDialog.css';

function ConfirmDialog({ isOpen, title = 'Confirm Action', message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, type = 'default' }) {
  if (!isOpen) return null;

  const colors = {
    danger: '#e53935',
    success: '#43a047', 
    warning: '#fbc02d',
    default: '#673ab7'
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      zIndex: 1000, padding: 16
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: 8, padding: 24, 
        width: '100%', maxWidth: 450, boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
      }}>
        <h3 style={{margin: '0 0 16px', color: '#333', fontSize: '1.4rem'}}>{title}</h3>
        <p style={{margin: '0 0 24px', color: '#555', lineHeight: 1.5}}>{message}</p>
        <div style={{display: 'flex', justifyContent: 'flex-end', gap: 12}}>
          <button 
            style={{
              padding: '8px 16px', borderRadius: 4, fontWeight: 500, 
              cursor: 'pointer', border: 'none', fontSize: '1rem',
              backgroundColor: '#f5f5f5', color: '#333'
            }}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            style={{
              padding: '8px 16px', borderRadius: 4, fontWeight: 500, 
              cursor: 'pointer', border: 'none', fontSize: '1rem',
              backgroundColor: colors[type], 
              color: type === 'warning' ? '#333' : 'white'
            }}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
