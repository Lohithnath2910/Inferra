import axios from 'axios';
import { UploadResponse, AskResponse, APIError } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const uploadPDF = async (file: File): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<UploadResponse>('/upload_pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to upload PDF');
    }
    throw new Error('Failed to upload PDF');
  }
};

export const askQuestion = async (question: string): Promise<AskResponse> => {
  try {
    const response = await api.post<AskResponse>('/ask', { question });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to get answer');
    }
    throw new Error('Failed to get answer');
  }
};

export const checkHealth = async (): Promise<boolean> => {
  try {
    await api.get('/');
    return true;
  } catch (error) {
    return false;
  }
};