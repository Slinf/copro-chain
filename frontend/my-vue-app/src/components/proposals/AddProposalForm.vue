<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline">
        Add a proposal
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[500px]">
      <div class="space-y-4">
        <div class="space-y-2">
          <h4 class="font-medium leading-none">
            Post your proposition
          </h4>
          <p class="text-sm text-muted-foreground">
            Fill the form and post it !
          </p>
        </div>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <Label for="width">Title</Label>
            <Input
              v-model="title"
              id="width"
              type="text"
              placeholder="Clear and conscise title"
              class="col-span-2 h-8"
            />
          </div>
          <div class="space-y-2">
            <Label for="maxWidth">Description</Label>
            <Input
              v-model="description"
              id="maxWidth"
              type="text"
              placeholder="Describe the proposal"
              class="col-span-2 h-8"
            />
          </div>
          <div class="space-y-2">
            <Label for="height">Content</Label>
            <Textarea
              v-model="content"
              id="content"
              placeholder="Detailed content of the proposal"
              class="w-full"
              rows="4"
            />
          </div>
          <div class="flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { reactive, defineEmits, ref } from 'vue'
import type { ProposalEvent } from '@/events/proposalEvent'

const emit = defineEmits<{
  (event: 'submitProposal', proposal: ProposalEvent): void;
}>();

const title = ref<string>('');
const description = ref<string>('');
const content = ref<string>('');

function handleSubmit() {
  emit('submitProposal', { title: title.value, description: description.value, content: content.value } as ProposalEvent)

  // Réinitialiser le formulaire après soumission
  title.value = ''
  description.value = ''
  content.value = ''
}
</script>
