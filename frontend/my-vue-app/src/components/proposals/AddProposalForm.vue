<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline">
        Add a proposal
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-150">
      <div class="grid gap-4">
        <div class="space-y-2">
          <h4 class="font-medium leading-none">
            Post your proposition
          </h4>
          <p class="text-sm text-muted-foreground">
            Fill the form and post it !
          </p>
        </div>
        <div class="grid gap-2">
          <div class="grid grid-cols-3 items-center gap-4">
            <Label for="width">Title</Label>
            <Input
              id="width"
              type="text"
              placeholder="Clear and conscise title"
              class="col-span-2 h-8"
            />
          </div>
          <div class="grid grid-cols-3 items-center gap-4">
            <Label for="maxWidth">Description</Label>
            <Input
              id="maxWidth"
              type="text"
              placeholder="Describe the proposal"
              class="col-span-2 h-8"
            />
          </div>
          <div class="grid grid-cols-3 items-center gap-4">
            <Label for="height">Content</Label>
            <Input
              id="height"
              type="text"
              placeholder="Any content"
              class="col-span-2 h-8"
            />
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

</script>
