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
import { onMounted, ref, onUnmounted, watch} from 'vue';
import { config } from "@/config";
import { readContract, writeContract, getPublicClient } from "@wagmi/core";
import { decodeEventLog, type Log } from 'viem';
import type { AbiEvent } from 'abitype'
import { tokenAbi } from "@/abi/coproToken";

import { useAccountStore } from '@/stores/account';

import { DataTable } from "@/components/owners/table";
import { columns } from "@/components/owners/table/columns";
import { useToast } from '@/components/ui/toast/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/toast'

import type { Owner } from "@/models/owner"; 

const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS;

const { toast } = useToast()
const accountStore = useAccountStore();

const isMounted = ref<boolean>(false);
const isAdmin = ref<boolean>(false);
const ownerList = ref<Owner[]>([])

const address = ref<string>('');
const amount = ref<number>(0);


type CustomMintLog = Log<bigint, number, false> & {
  args: {
    to: string;
    amount: bigint;
  };
};

async function getOwnerList(): Promise<Owner[]> {
  const owners = Array<Owner>();
  const tokenMinted = await fetchTokenMintedLogs();
  const groupedByAddress = tokenMinted.map((l:CustomMintLog) => l.args).reduce((acc: Record<string, bigint>, log: { to: string; amount: bigint }) => {
  const address = log.to;
  if (!acc[address]) {
    acc[address] = 0n;
  }
  acc[address] += log.amount;
  return acc;
 }, {});

 return Object.entries(groupedByAddress).map(([address, amount], index) => ({
      address,                          
      amount: amount,        
      status: 'N/A',               
      name: `Account ${index}`,                     
      firstname: '',                 
    } as Owner));
}


const isValidEthereumAddress = (address: string): boolean => {
  const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethereumAddressRegex.test(address);
}

async function addNewOwner(): Promise<void> {
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
    await writeContract(config, {
      abi: tokenAbi,
      address: tokenAddress,
      functionName: 'addNewOwner',
      args: [newOwner, amountToBigInt],
      account: accountStore.getAddressForCall()
    })
    .then(async () => {
      address.value = '';
      amount.value = 0;
      toast({
        title: 'Sucess to add new owner',
        variant: 'default'
      });
      ownerList.value = await getOwnerList()
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

async function checkIsOwner(): Promise<void> {
  if(!accountStore.isConnected) isAdmin.value = false;
  const ownerAddress = await readContract(config, {
    abi: tokenAbi,
    address: tokenAddress,
    functionName: "owner",
  });
  const userAddress = accountStore.address ?? '';
  isAdmin.value = userAddress.toLowerCase()  === ownerAddress.toLowerCase();
}

const eventAbi = {
      name:'TokensMinted',
      type: 'event',
      inputs: [
      { type: 'address', name:'to', indexed: true },
      { type: 'uint256', name:'amount', indexed: false }
    ]
} as AbiEvent;

 // Récupérer les logs d'événements spécifiques
 async function fetchTokenMintedLogs(): Promise<any> {
    return await getPublicClient(config).getLogs({
    address: tokenAddress,
    fromBlock: 8056089n,
    toBlock: 'latest',
    event: eventAbi
  })
}

function watchNewEvents() {
  const publicClient = getPublicClient(config);

  const unwatch = publicClient.watchEvent({
    address: tokenAddress,
    event: eventAbi,
    onLogs: (logs) => {
      logs.forEach((log) => {
        // Décoder le nouvel événement
        const decoded = decodeEventLog({
          abi: [eventAbi],
          data: log.data,
          topics: log.topics,
        }) as { eventName: string; args: { to: string; amount: bigint; }
      };
        const { to, amount } = decoded.args;
        updateOwnerList(to, amount);
      });
    },
    onError: (error) => {
      console.error('Erreur lors de l’écoute des événements :', error);
    },
  });

  onUnmounted(unwatch);
}

function updateOwnerList(address: string, value: bigint) {
  const index = ownerList.value.findIndex((owner) => owner.address === address);
  if (index !== -1) {
    const currentAmount = BigInt(ownerList.value[index].amount);
    ownerList.value[index].amount = (currentAmount + value).toString();
  } else {
    ownerList.value.push({
      address,
      amount: value.toString(),
      status: 'unknown',
      name: '',
      firstname: '',
    });
  }
}

onMounted(async () => {
  checkIsOwner();
  ownerList.value = await getOwnerList()
  watchNewEvents();
  isMounted.value = true;
})

watch(() => accountStore.isConnected, (isConnected) => {
    if (isConnected) {
      // Connexion détectée : charger les données et démarrer l'écoute
      checkIsOwner();
      watchNewEvents();
    }
    else isAdmin.value = false;
  }
);

</script>
