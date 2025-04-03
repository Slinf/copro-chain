<template>
  <div class="container flex py-10">
    <div class="container pr-5">
      <!-- <DataTable :columns="columns" :data="data" /> -->
      <Card class="flex justify-between p-3 mb-3">
        <h1 class="text-2xl font-semibold tracking-tight">Proposals</h1>
        <AddProposalForm/>
      </Card>
      <Card v-for="proposal in proposalList" class="mb-3">
        <CardHeader>
          <CardTitle>
            {{ proposal.title }}
          </CardTitle>
          <CardDescription>{{ proposal.description }}</CardDescription>
        </CardHeader>
      </Card>
    </div>
    <div class="container">
      <Card>
        <CardHeader>
          <CardTitle>Your Info</CardTitle>
          <CardDescription>
            <p>Account: {{ user?.address }}</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex">
            <label>Voting power {{ user?.power }}</label>
            <label class="ml-4">Proposition power</label>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
  </template>

<script setup lang="ts">
import type { Proposal } from "@/models/proposal";
import type { User } from "@/models/user";
import { onMounted, ref } from 'vue';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AddProposalForm } from '@/components/proposals'

const proposalList = ref<Proposal[]>([])
const user = ref<User>();

async function getProposals(): Promise<Proposal[]> {
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

