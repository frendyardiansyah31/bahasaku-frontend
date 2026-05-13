import axiosInstance from '../../shared/http';

export const getTopics      = ()   => axiosInstance.get('/api/topics/');
export const getTopicDetail = (id) => axiosInstance.get(`/api/topics/${id}/`);
