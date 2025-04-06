import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAccountStore = defineStore('account', () => {
  const address = ref<string | null>(null)
  const isConnected = ref(false)
  const isAdmin = ref(false)

  function setAccount(newAddress: string) {
    address.value = newAddress
    isConnected.value = true
  }

  function disconnect() {
    address.value = null
    isConnected.value = false
  }

  function setIsAdmin(value: boolean) {
    isAdmin.value = value
  }

  const getAddressForCall = () => {
    if (!address.value) return undefined
    if (!address.value.startsWith('0x')) {
      throw new Error('Adresse invalide : doit commencer par "0x"')
    }
    return address.value as `0x${string}`;
  }

  return { address, isConnected, isAdmin, setIsAdmin, setAccount, disconnect, getAddressForCall }
})
