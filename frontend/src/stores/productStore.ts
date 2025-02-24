import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { Product, CreateProductPayload, UpdateProductPayload } from '@/types/Product'

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchProducts() {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/products')
      products.value = response.data
      return products.value
    } catch (error) {
      setError(error as Error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function fetchProductById(id: number) {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get(`/products/${id}`)
      currentProduct.value = response.data
      const index = products.value.findIndex((product) => product.id === id)
      if (index !== -1) {
        products.value[index] = response.data
      }
      return currentProduct.value
    } catch (error) {
      setError(error as Error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function createProduct(productData: CreateProductPayload) {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post('/products', productData)
      const newProduct = response.data
      products.value.push(newProduct)
      return newProduct
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function updateProduct(productData: UpdateProductPayload) {
    setLoading(true)
    setError(null)
    try {
      const response = await api.put(`/products/${productData.id}`, productData)
      const updatedProduct = response.data
      const index = products.value.findIndex((product) => product.id === updatedProduct.id)
      if (index !== -1) {
        products.value[index] = updatedProduct
      }
      // update currentProduct if necessary
      if (currentProduct.value && currentProduct.value.id === updatedProduct.id) {
        currentProduct.value = updatedProduct
      }
      return updatedProduct
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function deleteProduct(id: number) {
    setLoading(true)
    setError(null)

    try {
      await api.delete(`/products/${id}`)
      products.value = products.value.filter((product) => product.id !== id)
      // delete currentProduct if necessary
      if (currentProduct.value && currentProduct.value.id === id) {
        currentProduct.value = null
      }
      return true
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  function getProductById(id: number) {
    return products.value.find((product) => product.id === id)
  }

  function setLoading(status: boolean) {
    loading.value = status
  }
  function setError(newError: Error | null) {
    error.value = newError
  }

  return {
    // State
    products,
    currentProduct,
    loading,
    error,
    // Actions
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
  }
})
