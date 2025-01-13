import axios from 'axios';


const authApi = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login=(loginFormData)=>authApi.post('/login',loginFormData);
export const signUp=(signUpData)=>authApi.post('/signup',signUpData)
export const logout=()=>authApi.post('/logout')
export const refreshAccessToken = () => {
  return authApi.post('/refresh_token', null, {
    withCredentials: true,  
  });
};
