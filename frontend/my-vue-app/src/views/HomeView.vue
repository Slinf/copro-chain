<template>
  <div class="container py-16 px-6 mx-auto relative">
    <!-- Background Web3 -->
    <div class="absolute inset-0 -z-10 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black opacity-90"></div>
      <div class="absolute inset-0">
        <div class="web3-pattern"></div>
      </div>
    </div>

    <div class="text-center relative z-10">
      <div class="flex justify-center"> <!-- Nouveau conteneur pour centrer le span -->
        <span class="inline-flex items-center px-4 py-1 mb-4 text-sm font-medium text-white bg-orange-200/10 rounded-full backdrop-blur-sm">
          <img src="../assets/ethereum.svg" alt="Ethereum logo" class="w-5 h-5 mr-2" />
          Available on Sepolia Testnet
        </span>
      </div>
      <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-orange-500">
        CoproChain Governance
      </h1>
    </div>
    <div class="flex justify-center p-3 mb-3">
      <Card class="flex p-4">
        <CardTitle class="text-1xl font-semibold text-white flex flex-col items-center justify-center">
          <p class="text-center">
            A prototype of DAO for ... 
          </p>
          <p class="text-center">
            Owners, Co-owners, Leasehold, Commonhold, Cooperative, Condominium
          </p>
        </CardTitle>
      </Card>
    </div>
    <div class="flex justify-center">
      <Button @click="openInNewTab()" variant="default" color="orange" class="px-6 py-3 text-base font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-orange-600/30">
              Learn More About Governance
              <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
const openInNewTab = () => {
  window.open('https://ethereum.org/en/dao/', '_blank') // Ouvre dans un nouvel onglet
}
import {
  Button,
} from '@/components/ui/button'
</script>