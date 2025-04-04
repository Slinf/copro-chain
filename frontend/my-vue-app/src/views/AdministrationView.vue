<template>
  <div class="container flex py-10">
    <div class="container pr-5">
      <DataTable :columns="columns" :data="ownerList" /> 
      <div class="container"></div>
  </div>
  </div>
</template>
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-vue-next'
import { DataTable } from "@/components/owners/table";
import { columns } from "@/components/owners/table/columns";
import type { User } from '@/models/user';
import type { Owner } from "@/models/owner"; 
import { onMounted, ref } from 'vue';

const ownerList = ref<Owner[]>([])
const user = ref<User>();

async function getOwnerList(): Promise<Owner[]> {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      name: 'Jeremy',
      firstname: 'Jeremy',
      address: "",
    },
    {
      id: '728ed52f',
      name: 'Clément',
      firstname: 'Br',
      address: "",
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
  ownerList.value = await getOwnerList()
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
