<template>
  <div class="max-w-4xl mx-auto mt-10 space-y-6 px-4">
    <h1 class="text-3xl font-bold">Governance Token Overview</h1>

    <Card>
      <CardHeader>
        <CardTitle>Token Summary</CardTitle>
        <CardDescription>
          The governance token used in CoproChain is a fungible ERC20 digital asset. It represents a co-owner’s voting power, proportional to their property share ("tantièmes").<br><br>
          This token holds no monetary value—it’s strictly used for governance. As tantièmes evolve, token balances and total supply may be updated accordingly. The token cannot be burned.<br><br>
          Built on the widely adopted ERC20 standard (via OpenZeppelin), this approach allows for future scalability, such as deploying a factory to manage multiple co-ownerships.
        </CardDescription>
      </CardHeader>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Token Metrics</CardTitle>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-muted-foreground">Token Name</p>
            <p class="font-medium">{{ name }}</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Symbol</p>
            <p class="font-medium">{{ symbol }}</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Total Supply</p>
            <p class="font-medium">{{ formatUnits(totalSupply, decimals) }} {{ symbol }}</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Holders</p>
            <p class="font-medium">{{ holders.length }}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Token Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ul class="divide-y divide-muted">
          <li
            v-for="(holder, index) in holders"
            :key="index"
            class="py-2 flex justify-between text-sm"
          >
            <span>{{ holder.address }}</span>
            <span>{{ holder.balance }} {{ symbol }}</span>
          </li>
        </ul>
      </CardContent>
    </Card>

    <RouterLink to="/" class="inline-block">
      <Button variant="outline" class="mt-6">← Back to Home</Button>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RouterLink } from 'vue-router'
import { tokenAbi } from "@/abi/coproToken";
import { readContract, writeContract, getPublicClient } from "@wagmi/core";
import { config } from "@/config";
import { ref, onMounted } from 'vue';
import { formatUnits, type AbiEvent, type Log } from 'viem';

const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS;
const decimals = 18;
const totalSupply = ref<bigint>(0n);
const symbol = ref<string>('');
const name = ref<string>('');
const holders = ref<{address:string, balance:string}[]>([]);


async function getTotalSupply(): Promise<void> {
  const res = await readContract(config, {
    abi: tokenAbi,
    address: tokenAddress,
    functionName: "totalSupply",
  });
  totalSupply.value = res;
}

async function getSymbol(): Promise<void> {
  const res = await readContract(config, {
    abi: tokenAbi,
    address: tokenAddress,
    functionName: "symbol",
  });
  symbol.value = res;
}

async function getTokenName(): Promise<void> {
  const res = await readContract(config, {
    abi: tokenAbi,
    address: tokenAddress,
    functionName: "name",
  });
  name.value = res;
}

const eventAbi = {
      name:'TokensMinted',
      type: 'event',
      inputs: [
      { type: 'address', name:'to', indexed: true },
      { type: 'uint256', name:'amount', indexed: false }
    ]
} as AbiEvent;

type CustomMintLog = Log<bigint, number, false> & {
  args: {
    to: string;
    amount: bigint;
  };
};

async function fetchTokenMintedLogs(): Promise<any> {
    return await getPublicClient(config).getLogs({
    address: tokenAddress,
    fromBlock: 8056089n,
    toBlock: 'latest',
    event: eventAbi
  })
}

async function getHolderList(): Promise<void> {
  const tokenMinted = await fetchTokenMintedLogs();
  const groupedByAddress = tokenMinted.map((l:CustomMintLog) => l.args).reduce((acc: Record<string, bigint>, log: { to: string; amount: bigint }) => {
  const address = log.to;
  if (!acc[address]) {
    acc[address] = 0n;
  }
  acc[address] += log.amount as bigint;
  return acc;
 }, {});

 holders.value = Object.entries(groupedByAddress).map(([address, amount]) => ({
      address,                          
      balance: amount
     } as {address:string, balance:string}));
}

onMounted(async () => {
  getHolderList();
  getTotalSupply();
  getSymbol();
  getTokenName();
})
</script>
