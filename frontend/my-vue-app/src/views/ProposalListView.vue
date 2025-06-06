<template>
  <Toaster />
  <div class="container flex py-10">
    <div class="container pr-5">
      <!-- <DataTable :columns="columns" :data="data" /> -->
      <Card class="flex justify-between p-3 mb-3">
        <h1 class="text-2xl font-semibold tracking-tight">Proposals</h1>
        <AddProposalForm v-if="accountStore.isConnected && accountStore.isCoproHolder" @submitProposal="submitNewProposalWithResume"/>
      </Card>
      <Card class="mb-3" v-if="!accountStore.isConnected">
        <CardHeader>
          <CardTitle>
            Connect with your wallet to see proposals
          </CardTitle>
        </CardHeader>
      </Card>
      <RouterLink v-else v-for="proposal in proposalList" :key="proposal.id" :to="`/proposal/${proposal.id}`" class="block">
        <Card class="mb-3 hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle>
              <div class="flex justify-between items-start w-full">
              <span class="text-lg font-semibold">{{ proposal.title }}</span>
              <div class="grid grid-cols-2 gap-x-2 text-sm text-muted-foreground ml-4">
                <span class="text-right">For:</span>
                <span class="text-left font-medium text-green-600">{{ formatUnits(proposal.votes.forVotes, decimals) }}</span>
                <span class="text-right">Against:</span>
                <span class="text-left font-medium text-red-600">{{ formatUnits(proposal.votes.againstVotes, decimals) }}</span>
                <span class="text-right">Abstain:</span>
                <span class="text-left font-medium text-gray-500">{{ formatUnits(proposal.votes.abstainVotes, decimals) }}</span>
              </div>
            </div>
            </CardTitle>
            <CardDescription>
            <Button variant="outline">
              {{ getDisplayProposalStateValue(proposal.state) }}
            </Button>
          </CardDescription>
          </CardHeader>
        </Card>
    </RouterLink>
    </div>
    <div class="container" v-if="!accountStore.isConnected">
      <Card>
        <CardHeader>
          <CardTitle>Your Infos :</CardTitle>
          <CardDescription>
            <p>NOT CONNECTED</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton/>
            <div class="flex justify-between p-3 mb-3">
              <label>Voting power: --</label>
              <label>Balance : -- COPRO</label>
            </div>
        </CardContent>
      </Card>
    </div>
    <div class="container" v-else>
      <Card>
        <CardHeader>
          <CardTitle>Your Infos</CardTitle>
          <CardDescription>
            <p>Account: {{ user?.address }}</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex justify-between p-3 mb-3">
            <label>Voting power: {{ user?.power }}</label>
            <label>Balance : {{ user?.balance }} COPRO</label>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
  </template>

<script setup lang="ts">
import { readContract, writeContract } from "@wagmi/core";

import type { Proposal } from "@/models/proposal";
import type { User } from "@/models/user";
import { onMounted, ref, watch } from 'vue';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AddProposalForm } from '@/components/proposals'
import { encodeFunctionData } from 'viem'
import { governorAbi } from "@/abi/coproGovernor";
import { config } from "@/config";
import { useAccountStore } from '@/stores/account';
import { useProposalStore } from '@/stores/proposal'
import { useToast } from '@/components/ui/toast/use-toast';
import { Toaster } from '@/components/ui/toast'
import { Button } from '@/components/ui/button';
import { getDisplayProposalStateValue } from '@/models/enum'
import type { ProposalEvent } from '@/events/proposalEvent'
import { tokenAbi } from "@/abi/coproToken";
import { formatUnits, keccak256, toBytes } from 'viem';
import Skeleton from "@/components/ui/skeleton/Skeleton.vue";

const governorAddress = import.meta.env.VITE_GOVERNOR_ADDRESS;
const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS;

const decimals = 18;
const { toast } = useToast()
const proposalList = ref<Proposal[]>([])
const user = ref<User>();

const startIndex = ref<number>(0);
const endIndex = ref<number>(20);

const accountStore = useAccountStore();
const proposalStore = useProposalStore();


const initProposals = async () => {
  proposalList.value = await getProposalsFromContract();
}

const getProposalsFromContract = async (): Promise<Proposal[]> => {
  if(!accountStore.isConnected) return [];
  const data = await readContract(config, {
    abi: governorAbi,
    address: governorAddress,
    functionName: 'getAllPropositions',
    args: [BigInt(startIndex.value), BigInt(endIndex.value)],
    account: accountStore.getAddressForCall()
  });
  const formattedProposals = data.map(proposal => ({
    id: proposal.id.toString(),
    title: proposal.title,
    state: proposal.state,
    votes: proposal.votes
  }) as Proposal);

  proposalStore.setProposals(formattedProposals);
  return formattedProposals;
}

const getMakeResumeProposalCalldata = (proposalId: bigint) => {
  return encodeFunctionData({
    abi: governorAbi,
    functionName: 'makeResumeProposal',
    args: [proposalId],
  });
}


const submitNewProposalWithResume = async (proposalEvent: ProposalEvent): Promise<void>  => { 
  debugger
  let dummyId = 0n; // temporaire pour calcul
  const dummyCalldata = '0x';
  // Description
  const description = "Proposal: auto-resume only";
  const descriptionHash = keccak256(toBytes(description));

    let resumeCalldata = encodeFunctionData({
    abi: governorAbi,
    functionName: 'makeResumeProposal',
    args: [dummyId],
  });

  const targets = [governorAddress, governorAddress];
  const values = [0n, 0n];
  const calldatas = [dummyCalldata, resumeCalldata] as `0x${string}`[]; 

  const proposalId = await readContract(config,{
    address: governorAddress,
    abi: governorAbi,
    functionName: 'hashProposal',
    args: [targets, values, calldatas, descriptionHash],
  });

  resumeCalldata = encodeFunctionData({
    abi: governorAbi,
    functionName: 'makeResumeProposal',
    args: [proposalId],
  });

  const finalCalldatas = [dummyCalldata, resumeCalldata] as `0x${string}`[];

  await writeContract(config, {
    address: governorAddress,
    abi: governorAbi,
    functionName: 'makeProposition',
    args: [proposalEvent, targets, values, finalCalldatas],
    account: accountStore.getAddressForCall()
  }).then(async () => {
      toast({
        title: 'Sucess to post new proposal',
        variant: 'default'
      });
    })
    .catch(error => {
      console.log(error);
      toast({
        title: 'Error : Token amount too low',
        description: error,
        variant: 'destructive'
      });
    });
}

const submitNewProposal = async (values: ProposalEvent): Promise<void>  => { 
  if(!accountStore.isConnected) return;
  if(values.content.length == 0 && values.title.length == 0) return;
  
  // Encode l'appel de `makeResumeProposal` pour l'inclure dans `calldatas`
  const calldata = encodeFunctionData({
    abi: governorAbi,
    functionName: 'makeResumeProposal',
    args:[0n]
  })

  await writeContract(config, {
      abi: governorAbi,
      address: governorAddress,
      functionName: 'makeProposition',
      args: [values, [governorAddress], [0n], [calldata]],
      account: accountStore.getAddressForCall()
    })
    .then(async () => {
      toast({
        title: 'Sucess to post new proposal',
        variant: 'default'
      });
    })
    .catch(error => {
      console.log(error);
      toast({
        title: 'Error : Token amount too low',
        description: error,
        variant: 'destructive'
      });
    });
}

const getInfosConnectedUser = async (): Promise<void>  => {
  if(!accountStore.isConnected || !accountStore.address) return;
  const nowTimestamp = BigInt(Math.floor(new Date().getTime() / 1000) - 100);
  const addressCurrentAccount = accountStore.address as `0x${string}`;
  const votePower = await readContract(config, {
    abi: governorAbi,
    address: governorAddress,
    functionName: 'getVotes',
    args: [addressCurrentAccount, nowTimestamp],
    account: addressCurrentAccount
  });

  const balance = await readContract(config, {
    abi: tokenAbi,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [addressCurrentAccount],
    account: addressCurrentAccount
  });

  user.value = {
    name: '',
    firstname: '',
    power: formatUnits(votePower, 18),
    balance: formatUnits(balance, 18),
    address: accountStore.address,
  }
  
  accountStore.setCoproHolder(balance > 0n);
  accountStore.setVotingPower(votePower > 0n);
}

onMounted(async () => {
  await initProposals();
  await getInfosConnectedUser()
})

watch(() => accountStore.address, (newAddress: string | null) => {
  if (newAddress) {
    getInfosConnectedUser()
    initProposals();
  }
}, { immediate: true })

</script>

