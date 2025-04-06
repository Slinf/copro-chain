<template>
    <Toaster />
    <div class="max-w-3xl mx-auto mt-10 p-6">
      <div class="flex justify-between">
        <Button variant="outline" class="mb-4" @click="goBack">
        ← Go Back
        </Button>
        <Button  v-if="accountStore.hasVotingPower || accountStore.isCoproHolder" variant='secondary' class="mb-4" @click="() => {}">
          Execute Proposal
        </Button>
      </div>
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
                <Badge variant="outline" class="bg-green-100 text-green-800 border-green-300">For : {{ formatUnits(currentProposal?.votes.forVotes, decimals)  }}</Badge>
                <Badge variant="outline">Abstention : {{ formatUnits(currentProposal?.votes.abstainVotes, decimals) }}</Badge>
                <Badge variant="destructive">Against : {{ formatUnits(currentProposal?.votes.againstVotes, decimals) }}</Badge>
            </div>
            </div>

            <Separator />

            <div v-if="currentProposal.state === ProposalState.Active && !isVotePending && !userHasVoted && accountStore.hasVotingPower" class="flex justify-between">
            <Button variant="outline" class="bg-zinc-300 text-grey-800 border-grey-300" @click="vote(VoteType.For)" :disabled="isVotePending">Yes, I vote for</Button>
            <Button variant="outline" class="bg-zinc-300 text-grey-800 border-grey-300" @click="vote(VoteType.Abstain)" :disabled="isVotePending">I abstain</Button>
            <Button variant="outline" class="bg-zinc-300 text-grey-800 border-grey-300" @click="vote(VoteType.Against)" :disabled="isVotePending">No, I vote against</Button>
            </div>
            <div class="flex justify-between gap-4" v-else>
              <p>Proposal is {{ getDisplayProposalStateValue(currentProposal.state) }}</p>
              <p v-if="currentProposal.state !== ProposalState.Active">Vote not available</p>
              <p v-if="userHasVoted">You already vote for this !</p>
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
import { VoteType, ProposalState, getDisplayProposalStateValue} from '@/models/enum';
import { formatUnits } from 'viem';

const decimals = 18;
const governorAddress = import.meta.env.VITE_GOVERNOR_ADDRESS;

const accountStore = useAccountStore();
const proposalStore = useProposalStore();

const { toast } = useToast()
const route = useRoute()
const proposalId = route.params.id as string
const currentProposal = ref<Proposal>();
const currentProposalDetails = ref<ProposalDetail>();

const isVotePending = ref<boolean>(false);
const userHasVoted = ref<boolean>(false);

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

const userAlreadyVote = async (): Promise<void> => {
  if(!accountStore.isConnected) return;
  debugger;

  const data = await readContract(config, {
    abi: governorAbi,
    address: governorAddress,
    functionName: 'hasVoted',
    args: [BigInt(proposalId), accountStore.address as `0x${string}`],
    account: accountStore.getAddressForCall()
  }).then(hasVoted => {
    userHasVoted.value= hasVoted;
  });
}

const vote = async (choice: number): Promise<void> => {
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

///
//
// TODO NEXT
//
// const executeProposal = async (): Promise<void> => {
//   if(!accountStore.isConnected) return;
//   isExecutionPending.value = true;

//   await writeContract(config, {
//       abi: governorAbi,
//       address: governorAddress,
//       functionName: 'execute',
//       args: [],
//       account: accountStore.getAddressForCall()
//     })
//     .then(async () => {
//       toast({
//         title: 'Execution submitted successfully',
//         variant: 'default'
//       });
//       isExecutionPending.value = false;
//     })
//     .catch(error => {
//       console.log(error);
//       toast({
//         title: 'Error -',
//         description: error,
//         variant: 'destructive'
//       });
//       isExecutionPending.value = false;
//     });
// }

///Compute ID of proposal
// const getIdProposalFromData = async (proposalValues: ProposalEvent):Promise<bigint> =>{
//   const descriptionHash = keccak256(toBytes(proposalValues.description));
//   const targets =  [governorAddress];
//   const values = [0n];
//   const hashProposal = await readContract(config, {
//     abi: governorAbi,
//     address: governorAddress,
//     functionName: 'hashProposal',
//     args: [targets,values, [defautlCallData], descriptionHash]
//   });

//   return hashProposal;
// }


const goBack = () => router.back()

onMounted(async () => {
  await getDetailProposalFromContract()
  await userAlreadyVote();
})
</script>
