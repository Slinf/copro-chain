<template>
  <div class="container flex py-10">
    <div class="container pr-5">
      <DataTable :columns="columns" :data="data" /> 

    <div class="container">

    </div>
  </div>
  </template>
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-vue-next'
import { DataTable } from '@/components/owners/table/data-table.vue';
import { onMounted, ref } from 'vue';

const ownerList = ref<Owner[]>([])

async function getOwnerList(): Promise<Owner[]> {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      title: 'Proposition 1',
      amount: 100,
      status: 'pending',
      description: "Devis porte d'entrée",
    },
    {
      id: '728ed52f',
      title: 'Proposition 2',
      amount: 100,
      status: 'pending',
      description: 'Faire rénover la cours intérieur',
    },
  ]
}

async function getConnectedUser(): Promise<User> {
  // Fetch data from your API here.
  return {
    address: "",
    name: "Pierre",
    firstname: "Bretnn",
    power: 10,
    balance: 10,
  } as User;
}

onMounted(async () => {
  proposalList.value = await getProposals()
  user.value = await getConnectedUser()
})
</script>


<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
