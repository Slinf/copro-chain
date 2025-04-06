import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAccountStore = defineStore('account', () => {
  const address = ref<string | null>(null)
  const isConnected = ref(false)
  const isAdmin = ref(false)
  const hasVotingPower = ref(false);
  const isCoproHolder = ref(false);

  function setAccount(newAddress: string) {
    address.value = newAddress
    isConnected.value = true
  }

  function disconnect() {
    address.value = null;
    isConnected.value = false;
    hasVotingPower.value = false;
    isCoproHolder.value = false;
    isAdmin.value = false;
  }

  function setIsAdmin(value: boolean) {
    isAdmin.value = value
  }

  function setVotingPower(value: boolean) {
    hasVotingPower.value = value
  }

  function setCoproHolder(value: boolean) {
    isCoproHolder.value = value
  }

  const getAddressForCall = () => {
    if (!address.value) return undefined
    if (!address.value.startsWith('0x')) {
      throw new Error('Adresse invalide : doit commencer par "0x"')
    }
    return address.value as `0x${string}`;
  }

  return { address, isConnected, isAdmin,isCoproHolder, hasVotingPower, setIsAdmin, setAccount, disconnect, getAddressForCall, setVotingPower, setCoproHolder }
})
