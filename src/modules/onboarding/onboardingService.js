import axiosInstance from '../../shared/http';

/**
 * Kirim data onboarding setelah register.
 * @param {{ country: string, initial_level: 'A1' | 'A2' }} data
 */
export const onboard = (data) =>
  axiosInstance.post('/api/user/onboarding/', data);
