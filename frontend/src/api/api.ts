import axios from 'axios';
import { User } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_BASE_URL });

// GET all users
export const getUsers = async (): Promise<User[]> => {
  const res = await api.get<User[]>('/users');
  return res.data;
};

// CREATE user
export const addUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  console.log('API addUser payload:', userData);
  const res = await api.post<User>('/users', userData);
  return res.data;
};

// UPDATE user
export const updateUser = async (id: string, data: Omit<User, 'id'>): Promise<User> => {
  console.log('API updateUser payload:', id, data);
  const res = await api.put<User>(`/users/${id}`, data);
  return res.data;
};

// DELETE user
export const deleteUser = async (id: string): Promise<{ success: boolean; id: string }> => {
  console.log('API deleteUser id:', id);
  const res = await api.delete<{ success: boolean; id: string }>(`/users/${id}`);
  return res.data;
};
