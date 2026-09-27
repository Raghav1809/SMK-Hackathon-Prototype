import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authAPI = {
  login: async (role) => {
    try {
      const res = await api.post('/auth/login', { role });
      return res.data;
    } catch (err) {
      console.warn('API Error, using fallback login data:', err.message);
      if (role === 'Engineer') {
        return { success: true, user: { name: 'Amit Patil', email: 'engineer@roadpulse.demo', role: 'Engineer', ward: 'Ward 12 - Central Zone' } };
      } else if (role === 'Admin') {
        return { success: true, user: { name: 'Command Officer', email: 'admin@roadpulse.demo', role: 'Admin', ward: 'City Command Center' } };
      }
      return { success: true, user: { name: 'Raghav Sharma', email: 'citizen@roadpulse.demo', role: 'Citizen', ward: 'Ward 12 - Central Zone', impactScore: 420, reportsSubmitted: 8, repairsVerified: 12 } };
    }
  }
};

export const potholesAPI = {
  getAll: async (params = {}) => {
    try {
      const res = await api.get('/potholes', { params });
      return res.data;
    } catch (err) {
      console.warn('API fetch failed, returning null for fallback');
      return null;
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/potholes/${id}`);
      return res.data;
    } catch (err) {
      return null;
    }
  },

  create: async (data) => {
    try {
      const res = await api.post('/potholes', data);
      return res.data;
    } catch (err) {
      console.error('Create error:', err);
      throw err;
    }
  },

  update: async (id, data) => {
    try {
      const res = await api.put(`/potholes/${id}`, data);
      return res.data;
    } catch (err) {
      console.error('Update error:', err);
      throw err;
    }
  },

  support: async (id, userEmail) => {
    try {
      const res = await api.post(`/potholes/${id}/support`, { userEmail });
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  checkDuplicates: async (lat, lng) => {
    try {
      const res = await api.post('/potholes/check-duplicates', { latitude: lat, longitude: lng });
      return res.data;
    } catch (err) {
      return { success: true, hasDuplicates: false, duplicates: [] };
    }
  },

  escalate: async (id, reason) => {
    try {
      const res = await api.post(`/potholes/${id}/escalate`, { reason });
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  verify: async (potholeId, result, comment) => {
    try {
      const res = await api.post('/verification', { potholeId, result, comment });
      return res.data;
    } catch (err) {
      throw err;
    }
  }
};

export const analyticsAPI = {
  getDashboard: async () => {
    try {
      const res = await api.get('/analytics/dashboard');
      return res.data;
    } catch (err) {
      return null;
    }
  },
  predictRisk: async (roadName) => {
    try {
      const res = await api.post('/analytics/predict-risk', { roadName });
      return res.data;
    } catch (err) {
      return null;
    }
  }
};

export const notificationsAPI = {
  getAll: async (userId, role) => {
    try {
      const res = await api.get('/notifications', { params: { userId, role } });
      return res.data;
    } catch (err) {
      return { success: true, notifications: [] };
    }
  },
  markRead: async (id) => {
    try {
      const res = await api.put(`/notifications/${id}/read`);
      return res.data;
    } catch (err) {
      return null;
    }
  }
};
