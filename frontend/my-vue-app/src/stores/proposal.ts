import type { Proposal, ProposalDetail } from '@/models/proposal'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProposalStore = defineStore('proposals', () => {
  const proposals = ref<Proposal[]>([])
  const proposalDetails = ref<ProposalDetail[]>([])

  function setProposals(newProposals: Proposal[]) {
    proposals.value = newProposals
  }

  function setDetails(proposalId: string, details: ProposalDetail) {
    var proposalToUpdate = proposalDetails.value.find(p => p.id === proposalId);
    if(!proposalToUpdate){
        proposalDetails.value.push(details);
    };
  }

  function cleanStore() {
    proposals.value = [];
  }

  const getProposalById = (proposalId: string) : Proposal | undefined=> {
    return proposals.value.find(p => p.id === proposalId)
  }

  return { proposals, setProposals, cleanStore, getProposalById, setDetails }
})
