<template>
  <div> 
  <header class="sticky-header">
    <div class="flex justify-between">
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
  <footer class="footer">
    <div class="flex">
      <p>© 2025 Mon Application. Tous droits réservés.</p>
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
import { Mail, UnplugIcon } from 'lucide-vue-next';
</script>

<style scoped>
/* Le header devient sticky */
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1000; /* Assure-toi que la barre de navigation soit au-dessus du contenu */
  background-color: #fff; /* Ajoute une couleur de fond pour éviter les effets de transparence */
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.footer {
  position: sticky;
  text-align: center;
  padding: 10px;
  width: 100%;
  bottom: 0;
}
</style>
