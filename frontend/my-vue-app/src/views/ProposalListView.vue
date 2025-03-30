<template>
  <div class="container flex py-10">
    <div class="container pr-5">
      <!-- <DataTable :columns="columns" :data="data" /> -->
      <Card>
        <CardHeader>
          <CardTitle>
            Proposal 1
          </CardTitle>
          <CardDescription>Faire nettoyer la façade</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Proposal 2</CardTitle>
          <CardDescription>Faire nettoyer la façade</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Proposal 3</CardTitle>
          <CardDescription>Faire nettoyer la façade</CardDescription>
        </CardHeader>
      </Card>
    </div>
    <div class="container">
      <Card>
        <CardHeader>
          <CardTitle>Your Info</CardTitle>
          <CardDescription>
            <p>Account: 0xxx</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex">
            <label>Voting power</label>
            <label class="ml-4">Proposition power</label>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
  </template>

<script setup lang="ts">
import type { Proposal } from "@/components/proposals/proposal";
import { onMounted, ref } from 'vue';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const data = ref<Proposal[]>([])

async function getData(): Promise<Proposal[]> {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com',
    },
    // ...
  ]
}

onMounted(async () => {
  data.value = await getData()
})
</script>

