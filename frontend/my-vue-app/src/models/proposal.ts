import type { Vote } from './vote';

export type Proposal = {
    id: string,
    title: string,
    state: number,
    votes: Vote
};