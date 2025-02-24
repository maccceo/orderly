import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// request interceptor (add headers, token etc)
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => Promise.reject(error),
)

// response interceptor (error handling etc)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error)
    return Promise.reject(error)
  },
)

export default api
