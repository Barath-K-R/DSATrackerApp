import axios from 'axios';
import { refreshAccessToken } from './authApi.js';

const problemApi = axios.create({
  baseURL: 'http://localhost:5000/api/problems',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setupProblemApiInterceptor = (accessToken, dispatch) => {
  console.log(accessToken);
  problemApi.interceptors.request.use(
    (config) => {
      
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );


  problemApi.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const { data } = await refreshAccessToken();

          dispatch({ type: 'SET_TOKEN', payload: data.accessToken });

          originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

          return problemApi(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export const createProblem = (problemData) => problemApi.post('/', problemData);
export const createProblemType = (problemTypeData) => problemApi.post('/type', problemTypeData);

export const getAllProblems = () => problemApi.get('/');
export const getAllProblemsTypes = () => problemApi.get(`/type`);
export const getProblemStats = () => problemApi.get('/stats');

export const updateIsFavourite = (problemId) => problemApi.patch(`/${problemId}/favourite`);
export const updateIsCompleted = (problemId) => problemApi.patch(`/${problemId}/completed`);

export const moveProblem = (problemId, newType) => problemApi.patch('/move', { problemId, newType });
export const deleteProblem = (problemId) => problemApi.delete(`/${problemId}`);

export default problemApi;
