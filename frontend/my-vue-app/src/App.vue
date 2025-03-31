<template>
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
            <NavigationMenuLink :class="navigationMenuTriggerStyle()" :as="RouterLink" to="/about" >
              Token
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink :class="navigationMenuTriggerStyle()" :as="RouterLink" to="/about" >
              About
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Button class="ml-auto">
          <UnplugIcon /> Connect
      </Button>
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
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Mail, GithubIcon, UnplugIcon } from 'lucide-vue-next';
</script>

<style scoped>
.sticky-header {
  @apply sticky top-0 z-50 bg-white shadow-md;
}

main {
  @apply flex-1; /* Prend tout l'espace disponible entre header et footer */
}
</style>