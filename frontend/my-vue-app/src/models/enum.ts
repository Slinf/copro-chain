export enum ProposalState {
    Pending,
    Active,
    Canceled,
    Defeated,
    Succeeded,
    Queued,
    Expired,
    Executed
}

export enum VoteType {
    Against, // 0
    For,     // 1
    Abstain  // 2
}

export function getDisplayProposalStateValue(state :number): string {
    switch (state) {
        case ProposalState.Pending:
            return "Pending"
        case ProposalState.Active:
            return "Active"
        case ProposalState.Canceled:
            return "Canceled"
        case ProposalState.Defeated:
            return "Defeated"
        case ProposalState.Succeeded:
            return "Succeeded"
        case ProposalState.Queued:
            return "Queued"
        case ProposalState.Expired:
            return "Expired"
        case ProposalState.Executed:
             return "Executed"
        default:
            return "N/A"
    }
}

