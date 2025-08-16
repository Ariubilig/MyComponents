import { useState } from 'react';
import ConfirmDialog from './components/UX/Confirm/ConfirmDialog';
import Notification from './components/UX/notification/notification';

function App() {
  const [dialog, setDialog] = useState(null);
  const [notification, setNotification] = useState(null);

  const showDialog = (config) => {
    setDialog(config);
  };

  const handleConfirm = () => {
    if (dialog?.onConfirm) {
      dialog.onConfirm();
    }
    setDialog(null);
  };

  const showNotification = (message, type = 'default') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Lightweight UX Components</h2>
      
      <button 
        onClick={() => showDialog({
          type: 'danger',
          title: 'Delete Item',
          message: 'Are you sure you want to delete this item?',
          confirmText: 'Delete',
          onConfirm: () => showNotification('Item deleted successfully!', 'error')
        })}
      >
        Delete Item
      </button>{' '}
      
      <button 
        onClick={() => showDialog({
          type: 'warning',
          title: 'Warning',
          message: 'This action is risky, continue?',
          confirmText: 'Proceed',
          onConfirm: () => showNotification('Warning acknowledged.', 'warning')
        })}
      >
        Warning Action
      </button>{' '}
      
      <button 
        onClick={() => showDialog({
          type: 'success',
          title: 'Save Changes',
          message: 'Save changes now?',
          confirmText: 'Save',
          onConfirm: () => showNotification('Changes saved successfully!', 'success')
        })}
      >
        Save Changes
      </button>

      <ConfirmDialog
        isOpen={!!dialog}
        title={dialog?.title}
        message={dialog?.message}
        confirmText={dialog?.confirmText}
        type={dialog?.type}
        onConfirm={handleConfirm}
        onCancel={() => setDialog(null)}
      />

      <Notification
        type={notification?.type}
        message={notification?.message}
        onClose={() => setNotification(null)}
      />
    </div>
  );
}

export default App;