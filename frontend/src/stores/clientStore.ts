import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { Client, CreateClientPayload, UpdateClientPayload } from '@/types/Client'

export const useClientStore = defineStore('clients', () => {
  const clients = ref<Client[]>([])
  const currentClient = ref<Client | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchClients() {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/clients')
      clients.value = response.data
      return clients.value
    } catch (error) {
      setError(error as Error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function fetchClientById(id: number) {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get(`/clients/${id}`)
      currentClient.value = response.data
      const index = clients.value.findIndex((client) => client.id === id)
      if (index !== -1) {
        clients.value[index] = response.data
      }
      return currentClient.value
    } catch (error) {
      setError(error as Error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function createClient(clientData: CreateClientPayload) {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post('/clients', clientData)
      const newClient = response.data
      clients.value.push(newClient)
      return newClient
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function updateClient(clientData: UpdateClientPayload) {
    setLoading(true)
    setError(null)
    try {
      const response = await api.put(`/clients/${clientData.id}`, clientData)
      const updatedClient = response.data
      const index = clients.value.findIndex((client) => client.id === updatedClient.id)
      if (index !== -1) {
        clients.value[index] = updatedClient
      }
      // update currentClient if necessary
      if (currentClient.value && currentClient.value.id === updatedClient.id) {
        currentClient.value = updatedClient
      }
      return updatedClient
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function deleteClient(id: number) {
    setLoading(true)
    setError(null)

    try {
      await api.delete(`/clients/${id}`)
      clients.value = clients.value.filter((client) => client.id !== id)
      // delete currentClient if necessary
      if (currentClient.value && currentClient.value.id === id) {
        currentClient.value = null
      }
      return true
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  function getClientById(id: number) {
    return clients.value.find((client) => client.id === id)
  }

  function setLoading(status: boolean) {
    loading.value = status
  }
  function setError(newError: Error | null) {
    error.value = newError
  }

  return {
    // State
    clients,
    currentClient,
    loading,
    error,
    // Actions
    fetchClients,
    fetchClientById,
    createClient,
    updateClient,
    deleteClient,
    getClientById,
  }
})
