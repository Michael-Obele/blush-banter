import { createReactiveDB } from 'svelte-idb/svelte';
import { EMPTY_PROFILE, type PersonalizationProfile, type Riddle } from './data/riddles';

export const PROFILE_RECORD_ID = 'current';

export interface RoundHistory {
	id?: number;
	riddle: Riddle;
	userGuess: string;
	createdAt: number;
}

export interface SavedProfile extends PersonalizationProfile, Record<string, unknown> {
	id: typeof PROFILE_RECORD_ID;
	updatedAt: number;
}

export const createEmptySavedProfile = (): SavedProfile => ({
	id: PROFILE_RECORD_ID,
	...EMPTY_PROFILE,
	updatedAt: 0
});

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

export async function ensureProfileRecord() {
	const existingProfile = await db.profile.get(PROFILE_RECORD_ID);

	if (existingProfile) {
		return existingProfile as unknown as SavedProfile;
	}

	const emptyProfile = createEmptySavedProfile();
	await db.profile.put(emptyProfile);

	return emptyProfile;
}
