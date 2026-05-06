import axiosInstance from '../../shared/http';
export const getDashboard = () => axiosInstance.get('/api/dashboard/');
