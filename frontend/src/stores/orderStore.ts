import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { Order, CreateOrderPayload, UpdateOrderPayload } from '@/types/Order'

export const useOrderStore = defineStore('orders', () => {
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchOrders() {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/orders')
      orders.value = response.data
      return orders.value
    } catch (error) {
      setError(error as Error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function fetchOrderById(id: number) {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get(`/orders/${id}`)
      currentOrder.value = response.data
      const index = orders.value.findIndex((order) => order.id === id)
      if (index !== -1) {
        orders.value[index] = response.data
      }
      return currentOrder.value
    } catch (error) {
      setError(error as Error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function createOrder(orderData: CreateOrderPayload) {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post('/orders', orderData)
      const newOrder = response.data
      orders.value.push(newOrder)
      return newOrder
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function updateOrder(orderData: UpdateOrderPayload) {
    setLoading(true)
    setError(null)
    try {
      const response = await api.put(`/orders/${orderData.id}`, orderData)
      const updatedOrder = response.data
      const index = orders.value.findIndex((order) => order.id === updatedOrder.id)
      if (index !== -1) {
        orders.value[index] = updatedOrder
      }
      // update currentOrder if necessary
      if (currentOrder.value && currentOrder.value.id === updatedOrder.id) {
        currentOrder.value = updatedOrder
      }
      return updatedOrder
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function deleteOrder(id: number) {
    setLoading(true)
    setError(null)

    try {
      await api.delete(`/orders/${id}`)
      orders.value = orders.value.filter((order) => order.id !== id)
      // delete currentOrder if necessary
      if (currentOrder.value && currentOrder.value.id === id) {
        currentOrder.value = null
      }
      return true
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }
  function clearCurrentOrder() {
    currentOrder.value = null
  }

  function setLoading(status: boolean) {
    loading.value = status
  }
  function setError(newError: Error | null) {
    error.value = newError
  }

  return {
    // State
    orders,
    currentOrder,
    loading,
    error,
    // Actions
    fetchOrders,
    fetchOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    clearCurrentOrder,
  }
})
