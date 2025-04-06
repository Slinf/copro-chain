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
            <p class="font-medium">{{ token.name }}</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Symbol</p>
            <p class="font-medium">{{ token.symbol }}</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Total Supply</p>
            <p class="font-medium">{{ token.totalSupply }} {{ token.symbol }}</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Holders</p>
            <p class="font-medium">{{ token.holders.length }}</p>
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
            v-for="(holder, index) in token.holders"
            :key="index"
            class="py-2 flex justify-between text-sm"
          >
            <span>{{ holder.address }}</span>
            <span>{{ holder.balance }} {{ token.symbol }}</span>
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

// Simulated token data – replace with actual data from your smart contract
const token = {
  name: 'Copro Governance Token',
  symbol: 'CGT',
  totalSupply: '1000000',
  holders: [
    { address: '0x123...abc', balance: '250000' },
    { address: '0x456...def', balance: '150000' },
    { address: '0x789...ghi', balance: '600000' }
  ]
}
</script>
