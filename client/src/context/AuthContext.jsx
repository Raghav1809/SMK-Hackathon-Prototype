import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Raghav Sharma',
    email: 'citizen@roadpulse.demo',
    role: 'Citizen',
    ward: 'Ward 12 - Central Zone',
    impactScore: 420,
    reportsSubmitted: 8,
    repairsVerified: 12
  });
  const [demoMode, setDemoMode] = useState(true);

  const switchRole = async (roleName) => {
    try {
      const data = await authAPI.login(roleName);
      if (data && data.user) {
        setUser(data.user);
      }
    } catch (err) {
      if (roleName === 'Engineer') {
        setUser({ name: 'Amit Patil', email: 'engineer@roadpulse.demo', role: 'Engineer', ward: 'Ward 12 - Central Zone' });
      } else if (roleName === 'Admin') {
        setUser({ name: 'Command Officer', email: 'admin@roadpulse.demo', role: 'Admin', ward: 'City Command Center' });
      } else {
        setUser({ name: 'Raghav Sharma', email: 'citizen@roadpulse.demo', role: 'Citizen', ward: 'Ward 12 - Central Zone', impactScore: 420, reportsSubmitted: 8, repairsVerified: 12 });
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, switchRole, demoMode, setDemoMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
