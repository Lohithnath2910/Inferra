import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const askAsync = async (question: string) => {
  const response = await api.post('/ask_async', { question });
  return response.data; // { task_id }
};

export const getAskResult = async (taskId: string) => {
  const response = await api.get(`/ask_result/${taskId}`);
  return response.data; // { status, answer }
};

export const stopGeneration = async (taskId: string) => {
  const response = await api.post('/stop', { task_id: taskId });
  return response.data;
};
