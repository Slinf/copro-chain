<template>
    <Toaster />
    <div class="max-w-3xl mx-auto mt-10 p-6">
        <Button variant="outline" class="mb-4" @click="goBack">
        ← Go Back
        </Button>
        <Card v-if="currentProposal && currentProposalDetails">
        <CardHeader>
            <CardTitle class="text-2xl">{{ currentProposal?.title }}</CardTitle>
            <CardDescription class="text-muted-foreground">
            {{ currentProposalDetails?.description }}
            </CardDescription>
        </CardHeader>

        <CardContent class="space-y-6">
            <div>
            <h4 class="text-lg font-semibold">Content</h4>
            <p class="text-sm text-gray-700">{{ currentProposalDetails?.content }}</p>
            </div>

            <Separator />

            <div>
            <h4 class="text-lg font-semibold mb-2">Votes</h4>
            <div class="grid grid-cols-3 gap-4">
                <Badge variant="secondary">For : {{ currentProposal?.votes.forVotes }}</Badge>
                <Badge variant="destructive">Against : {{ currentProposal?.votes.abstainVotes }}</Badge>
                <Badge variant="outline">Abstention : {{ currentProposal?.votes.abstainVotes }}</Badge>
            </div>
            </div>

            <Separator />

            <div v-if="currentProposal.state === ProposalState.Active && !isVotePending" class="flex justify-end gap-4">
            <Button variant="destructive" @click="vote(0)" :disabled="isVotePending">Contre</Button>
            <Button variant="outline" @click="vote(3)" :disabled="isVotePending">Abstain</Button>
            <Button @click="vote(1)" :disabled="isVotePending">Pour</Button>
            </div>
            <div class="flex justify-between gap-4" v-else>
              <p>Proposal is {{ getDisplayProposalStateValue(currentProposal.state) }}</p>
              <p v-if="currentProposal.state !== ProposalState.Active">Vote not available</p>
              <Button disabled v-if="isVotePending">
              <Loader2 class="w-4 h-4 mr-2 animate-spin" />
                Please wait for voting transaction
            </Button>
            </div>
        </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { config } from "@/config";
import { ref, onMounted } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useProposalStore } from '@/stores/proposal'
import type { Proposal, ProposalDetail } from '@/models/proposal'
import { useAccountStore } from '@/stores/account'
import { governorAbi } from "@/abi/coproGovernor";
import { readContract, writeContract } from "@wagmi/core";
import router from '@/router';
import { useToast } from '@/components/ui/toast/use-toast';
import { Toaster } from '@/components/ui/toast'
import { Loader2 } from 'lucide-vue-next'
import { ProposalState, getDisplayProposalStateValue} from '@/models/enum';


const governorAddress = import.meta.env.VITE_GOVERNOR_ADDRESS;

const accountStore = useAccountStore();
const proposalStore = useProposalStore();

const { toast } = useToast()
const route = useRoute()
const proposalId = route.params.id as string
const currentProposal = ref<Proposal>();
const currentProposalDetails = ref<ProposalDetail>();

const isVotePending = ref<boolean>(false);

currentProposal.value = proposalStore.getProposalById(proposalId);

const getDetailProposalFromContract = async (): Promise<void> => {
  if(!accountStore.isConnected) return;
  const data = await readContract(config, {
    abi: governorAbi,
    address: governorAddress,
    functionName: 'getPropositionDetails',
    args: [BigInt(proposalId)],
    account: accountStore.getAddressForCall()
  });
  const formattedDetails = ({
    content: data.content,
    description: data.description,
  }) as ProposalDetail;
  currentProposalDetails.value = formattedDetails;
  proposalStore.setDetails(proposalId, formattedDetails);
}

const vote = async (choice: number) => {
  if(!accountStore.isConnected) return;
  isVotePending.value = true;

  await writeContract(config, {
      abi: governorAbi,
      address: governorAddress,
      functionName: 'castVote',
      args: [BigInt(proposalId), choice],
      account: accountStore.getAddressForCall()
    })
    .then(async () => {
      toast({
        title: 'Your vote has been submitted successfully',
        variant: 'default'
      });
      isVotePending.value = false;
    })
    .catch(error => {
      console.log(error);
      toast({
        title: 'Error -',
        description: error,
        variant: 'destructive'
      });
      isVotePending.value = false;
    });
}

const goBack = () => router.back()

onMounted(async () => {
  await getDetailProposalFromContract()
})
</script>
