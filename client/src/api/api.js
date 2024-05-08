import axios from 'axios';

const baseURL = 'http://localhost:5000/api/problems';

const api = axios.create({
  baseURL,
});

export const getAllTypes = async () => api.get('/alltype');
export const getTypeproblems=async(searchBy)=>api.get(`/typeProblems/${searchBy}?searchBy=type`)
export const getAllProblems=async()=>api.get('/')
export const newProblem=async(problem)=>api.post('/',problem)
export const getStatCount=async()=>api.get('/statcount')
export const toFav=async(id)=>api.post(`/toFav/${id}`)
export const toComplete=async(id)=>{
  console.log(id)
  api.post(`/toComplete/${id}`)
}

     


