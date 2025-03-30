<template>
  <div class="about">
    <Button>
      <Mail class="w-4 h-4 mr-2" /> Login with Email
    </Button>
  </div>
</template>
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-vue-next'

</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
