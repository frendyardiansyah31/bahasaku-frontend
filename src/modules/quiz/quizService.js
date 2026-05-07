import axiosInstance from '../../shared/http';

export const startSession  = (topicId)              => axiosInstance.get(`/api/quiz/${topicId}/start/`);
export const submitAnswer  = (topicId, data)         => axiosInstance.post(`/api/quiz/${topicId}/answer/`, data);
export const finishSession = (topicId, sessionId)    => axiosInstance.post(`/api/quiz/${topicId}/finish/`, { session_id: sessionId });
