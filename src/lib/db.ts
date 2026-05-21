import { createReactiveDB } from 'svelte-idb/svelte';
import type { PersonalizationProfile, Riddle } from './data/riddles';

export const PROFILE_RECORD_ID = 'current';

export interface RoundHistory {
	id?: number;
	riddle: Riddle;
	userGuess: string;
	createdAt: number;
}

export interface SavedProfile extends PersonalizationProfile {
	id: typeof PROFILE_RECORD_ID;
	updatedAt: number;
}

export const db = createReactiveDB({
	name: 'blush-banter-db',
	version: 2,
	stores: {
		rounds: {
			keyPath: 'id',
			autoIncrement: true
		},
		profile: {
			keyPath: 'id'
		}
	}
});
