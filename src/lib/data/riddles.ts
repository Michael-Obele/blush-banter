export type Riddle = {
	topic: string;
	prompt: string;
	answer: string;
	clue: string;
	explanation: string;
	difficulty: 'easy' | 'medium' | 'hard';
	promptLabel: string;
	safetyLabel: string;
	statusLine: string;
};

export type PersonalizationProfile = {
	name: string;
	vibe: string;
	favoriteTopics: string;
};

export const EMPTY_PROFILE: PersonalizationProfile = {
	name: '',
	vibe: '',
	favoriteTopics: ''
};

const unsafeTerms = [
	'sexual',
	'sex',
	'nude',
	'naked',
	'porn',
	'explicit',
	'erotic',
	'kink',
	'fetish',
	'violence',
	'kill',
	'suicide'
];

export const cleanPrompt = (value: string) => value.trim().replace(/\s+/g, ' ');

export const normalizeProfile = (
	profile?: Partial<PersonalizationProfile> | null
): PersonalizationProfile => ({
	name: cleanPrompt(profile?.name ?? ''),
	vibe: cleanPrompt(profile?.vibe ?? ''),
	favoriteTopics: cleanPrompt(profile?.favoriteTopics ?? '')
});

export const hasProfileDetails = (profile?: Partial<PersonalizationProfile> | null) => {
	const normalized = normalizeProfile(profile);

	return Boolean(normalized.name || normalized.vibe || normalized.favoriteTopics);
};

export const isUnsafePrompt = (value: string) => {
	const normalized = cleanPrompt(value).toLowerCase();

	if (!normalized) {
		return false;
	}

	return unsafeTerms.some((term) => normalized.includes(term));
};
