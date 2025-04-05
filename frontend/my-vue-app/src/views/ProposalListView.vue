<template>
  <div class="container flex py-10">
    <div class="container pr-5">
      <!-- <DataTable :columns="columns" :data="data" /> -->
      <Card class="flex justify-between p-3 mb-3">
        <h1 class="text-2xl font-semibold tracking-tight">Proposals</h1>
        <AddProposalForm/>
      </Card>
      <Skeleton class="h-[100px] w-full rounded-xl border bg-card text-card-foreground shadow mb-3" />
      <Card v-for="proposal in proposalList" class="mb-3">
        <CardHeader>
          <CardTitle>
            {{ proposal.title }}
          </CardTitle>
          <CardDescription>{{ proposal.state }}</CardDescription>
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
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton }from '@/components/ui/skeleton'
import { AddProposalForm } from '@/components/proposals'
import { readContract, getAccount } from "@wagmi/core";
import { governorAbi } from "@/abi/coproGovernor";
import { config } from "@/config";
import { useAccountStore } from '@/stores/account';

const governorAddress = import.meta.env.VITE_GOVERNOR_ADDRESS;


const proposalList = ref<Proposal[]>([])
const user = ref<User>();

const accountStore = useAccountStore();

async function getProposalsFromContract(): Promise<Proposal[]> {
  debugger
    if(accountStore.isConnected) {
    const data = await readContract(config, {
      abi: governorAbi,
      address: governorAddress,
      functionName: 'getAllPropositions',
      args: [0n, 10n],
      account: accountStore.getAddressForCall()
    });

    const formattedProposals = data.map(proposal => ({
      id: proposal.id.toString(),
      title: proposal.title,
      state: proposal.state,
      votes: proposal.votes
    }) as Proposal);
    return formattedProposals;
  } else return [];
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
  proposalList.value = [
    {
      id: '728ed52f',
      title: 'Connect with your wallet to see proposals',
      state: 0,
      votes: { abstainVotes: BigInt(0), forVotes: BigInt(0), againstVotes:BigInt(0)}
    },
  ]

  proposalList.value = await getProposalsFromContract();
  user.value = await getConnectedUser()
})
</script>

