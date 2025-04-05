<template>
  <Toaster />
  <div class="container flex py-10" v-if="isMounted">
    <div class="container pr-5">
      <Card class="flex justify-between p-3 mb-3">
        <h1 class="text-2xl font-semibold tracking-tight">List of co-owners</h1>
      </Card>
      <div class="flex w-full items-center gap-10 mb-5" v-if="isAdmin">
        <Input id="adress" type="text" placeholder="Wallet Adress" v-model="address"/>
        <Input id="amount" type="number" placeholder="Copro Token Amount" v-model="amount" />
        <Button type="submit" @click="addNewOwner()">
          Add new particpant
        </Button>
      </div>
      <DataTable :columns="columns" :data="ownerList" /> 
      <div class="container"></div>
  </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref,watch} from 'vue';
import { config } from "@/config";
import { readContract, writeContract, getAccount, getPublicClient } from "@wagmi/core";

import { governorAbi } from "@/abi/coproGovernor";
import { tokenAbi } from "@/abi/coproToken";

import { useAccountStore } from '@/stores/account';

import { DataTable } from "@/components/owners/table";
import { columns } from "@/components/owners/table/columns";
import { useToast } from '@/components/ui/toast/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toast'

import type { User } from '@/models/user';
import type { Owner } from "@/models/owner"; 

const governorAddress = import.meta.env.VITE_GOVERNOR_ADDRESS;
const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS;

const { toast } = useToast()
const accountStore = useAccountStore();

const isMounted = ref<boolean>(false);
const isAdmin = ref<boolean>(false);
const ownerList = ref<Owner[]>([])
const user = ref<User>();
const address = ref<string>('');
const amount = ref<number>(0);


async function getOwnerList(): Promise<Owner[]> {
  var tokenMinted = await fetchTokenMintedLogs();
  tokenMinted.reduce((acc: any, log: any) => {
  const address = log.to; // Changement ici
  if (!acc[address]) {
    acc[address] = 0n;
  }
  acc[address] += log.value;
  return acc;
}, {});

  return []
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

const isValidEthereumAddress = (address: string): boolean => {
  const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethereumAddressRegex.test(address);
}

async function addNewOwner(): Promise<void> {
  debugger
    if(!isValidEthereumAddress(address.value)) {
      toast({
        title: 'Error : Wallet adress invalid or malformated',
        variant: 'destructive'
      })
      return;
    };
    if(amount.value == 0) {
      toast({
        title: 'Error : Token amount too low',
        variant: 'destructive'
      })
      return;
    };
    if(accountStore.isConnected && isAdmin.value) {
    const newOwner = address.value as `0x${string}`;
    const amountToBigInt = BigInt(amount.value);
    const data = await writeContract(config, {
      abi: tokenAbi,
      address: tokenAddress,
      functionName: 'addNewOwner',
      args: [newOwner, amountToBigInt],
      account: accountStore.getAddressForCall()
    })
    .then(() => {
      toast({
        title: 'Sucess to add new owner',
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
  };
}


async function checkIsOwner(): Promise<boolean> {
  if(!accountStore.isConnected) return false;
  const ownerAddress = await readContract(config, {
    abi: tokenAbi,
    address: tokenAddress,
    functionName: "owner",
  });
  var userAddress = accountStore.address ?? '';
  return userAddress.toLowerCase()  === ownerAddress.toLowerCase();
}


 // Récupérer les logs d'événements spécifiques
 async function fetchTokenMintedLogs(): Promise<any> {
    return await getPublicClient(config).getLogs({
    address: tokenAddress,
    fromBlock: 8056089n,
    toBlock: 'latest',
    event:{
      name:'TokensMinted',
      type: 'event',
      inputs: [
      { type: 'address', name:'to', indexed: true },
      { type: 'uint256', name:'amount', indexed: false }
      ]
    }
  })
}


onMounted(async () => {
  isAdmin.value = await checkIsOwner();
  ownerList.value = await getOwnerList()
  user.value = await getConnectedUser()
  isMounted.value = true;
})

</script>
