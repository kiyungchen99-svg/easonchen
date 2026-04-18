import { create } from 'zustand';
import { authAPI } from '../utils/api';

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  fetchMe: async () => {
    try {
      const { data } = await authAPI.getMe();
      set({ user: data, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  login: async (credentials) => {
    const { data } = await authAPI.login(credentials);
    set({ user: data });
    return data;
  },

  register: async (userData) => {
    const { data } = await authAPI.register(userData);
    set({ user: data });
    return data;
  },

  logout: async () => {
    await authAPI.logout();
    set({ user: null });
  },
}));

export default useAuthStore;
