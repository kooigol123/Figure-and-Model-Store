import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default {
  getProducts() {
    return apiClient.get('/products')
  },
  getProductById(id) {
    return apiClient.get(`/products/${id}`)
  },
  login(credentials) {
    return apiClient.post('/auth/login', credentials)
  },
  register(userData) {
    return apiClient.post('/auth/register', userData)
  }
}