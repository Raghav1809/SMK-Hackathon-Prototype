import React, { createContext, useContext, useState, useEffect } from 'react';
import { notificationsAPI } from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([
    {
      id: "notif-1",
      userId: "citizen@roadpulse.demo",
      recipientRole: "Citizen",
      title: "Pothole PT-1048 Acknowledged",
      message: "Assigned to Ward Engineer Amit Patil. SLA set to 24 Hours.",
      type: "INFO",
      potholeId: "PT-1048",
      read: false,
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      id: "notif-2",
      userId: "citizen@roadpulse.demo",
      recipientRole: "Citizen",
      title: "Action Needed: Repair Verification",
      message: "Ward 12 marked PT-1055 as Resolved. Please confirm if road is smooth.",
      type: "VERIFICATION",
      potholeId: "PT-1055",
      read: false,
      createdAt: new Date(Date.now() - 1800000)
    }
  ]);

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (user) {
      notificationsAPI.getAll(user.email, user.role).then(res => {
        if (res && res.notifications && res.notifications.length > 0) {
          setNotifications(res.notifications);
        }
      });
    }
  }, [user]);

  const addToast = (title, message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    notificationsAPI.markRead(id);
  };

  return (
    <NotificationContext.Provider value={{ notifications, toasts, addToast, markRead }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transform transition-all duration-300 animate-slide-in ${
              toast.type === 'success'
                ? 'bg-emerald-900/90 text-white border-emerald-500/50'
                : toast.type === 'error' || toast.type === 'escalation'
                ? 'bg-rose-900/90 text-white border-rose-500/50'
                : toast.type === 'warning'
                ? 'bg-amber-900/90 text-white border-amber-500/50'
                : 'bg-slate-900/90 text-white border-slate-700/50'
            }`}
          >
            <div className="text-xl">
              {toast.type === 'success' ? '✅' : toast.type === 'warning' ? '⚠️' : toast.type === 'escalation' ? '🚨' : 'ℹ️'}
            </div>
            <div className="flex-1">
              <h5 className="font-semibold text-sm leading-tight">{toast.title}</h5>
              <p className="text-xs mt-0.5 opacity-90">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
