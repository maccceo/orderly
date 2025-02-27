import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// request interceptor (add headers, token etc)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// response interceptor (error handling etc)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // redirect to /login if the error doesn't come from /api/login itself
      if (!error.config.url.includes('/api/login')) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('user_role')
        window.location.href = '/login' // hard redirect because Vue router it's not initialized yet
      }
    }
    return Promise.reject(error)
  },
)

export default api
