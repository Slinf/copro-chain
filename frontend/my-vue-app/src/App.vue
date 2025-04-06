<template>
  <Toaster />
  <div class="flex flex-col"> 
  <header class="sticky-header">
    <div class="flex">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink :class="navigationMenuTriggerStyle()" :as="RouterLink" to="/" >
              CoproChain
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink :class="navigationMenuTriggerStyle()" :as="RouterLink" to="/proposals" >
              Governance
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink :class="navigationMenuTriggerStyle()" :as="RouterLink" to="/token" >
              Token
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink :class="navigationMenuTriggerStyle()" :as="RouterLink" to="/admin" >
              Administration
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <!-- <Button class="ml-auto" @click="openAppKitModal()">
          <UnplugIcon /> Connect
      </Button> -->
      <appkit-button class="ml-auto" />
    </div>
    <Separator class="my-3"/>
  </header>

  <RouterView />

  <footer class="fixed bottom-0 py-4">
      <div class="flex justify-between">
        <a href="https://github.com/Slinf/copro-chain" target="_blank" class="text-gray-400 hover:text-black transition-colors duration-200">
          <GithubIcon class="mr-2 h-4 w-4"/>
        </a>
        <a href="mailto:contact@votre-email.com" class="text-gray-400 hover:text-black transition-colors duration-200 flex items-center">
          <Mail class="mr-2 h-4 w-4" />
        </a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import Toaster from '@/components/ui/toast/Toaster.vue'
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Separator } from '@/components/ui/separator';
import { Mail, GithubIcon } from 'lucide-vue-next';

import { createAppKit } from '@reown/appkit/vue'
import { sepolia, mainnet, polygon, type AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { watch} from 'vue';
import { useAccountStore } from '@/stores/account';
import { useAppKitAccount } from '@reown/appkit/vue'

// 1. Get projectId from https://cloud.reown.com
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID

// 2. Create a metadata object
const metadata = {
  name: 'CoproChain',
  description: 'Join the CoproChain DAO, vote and propose',
  url: 'https://example.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 3. Set the networks
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [sepolia, mainnet, polygon ]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId
})

// 5. Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  defaultNetwork: sepolia,
  metadata,
  themeMode: 'light',
  themeVariables: {
    '--w3m-border-radius-master': '1px',
    '--w3m-accent': 'rgba(234, 88, 12, var(--tw-bg-opacity, 1))',
  },
  features: {
    send: false,
    swaps: false,
    onramp: false,
    analytics: true // Optional - defaults to your Cloud configuration
  },
})

const accountStore = useAccountStore();
const accountData = useAppKitAccount();

// Sauvegarder les données dans localStorage lorsque le compte change
watch(() => accountData.value.address, (newAddress) => {
  if (newAddress) {
    localStorage.setItem('currentWallet', JSON.stringify({
      address: newAddress,
      isConnected: accountData.value.isConnected
    }))
    accountData.value.status
    accountStore.setAccount(newAddress)
  } else {
    accountStore.disconnect();
  }
}, { immediate: true })

</script>
<style scoped>
</style>