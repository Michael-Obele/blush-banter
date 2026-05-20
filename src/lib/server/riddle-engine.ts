import { createDeepSeek } from '@ai-sdk/deepseek';
import { generateText, jsonSchema, Output } from 'ai';
import { error } from '@sveltejs/kit';
import { DEEPSEEK_API_KEY } from '$env/static/private';
import * as v from 'valibot';
import {
	cleanPrompt,
	isUnsafePrompt,
	type PersonalizationProfile,
	type Riddle
} from '$lib/data/riddles';

export const DEEPSEEK_RIDDLE_MODEL = 'deepseek-v4-pro';

export const RIDDLE_SYSTEM_PROMPT =
	'You write original, family-friendly riddles for a playful party game. Keep them concise, cheeky, and harmless. Favor novelty over stock innuendo templates, vary the object choice and sentence rhythm, and avoid repeated openings or repeated clue patterns. Return exactly one JSON object that matches the requested schema with no markdown or extra commentary.';

const deepseek = createDeepSeek({
	apiKey: DEEPSEEK_API_KEY
});

const riddleSchema = v.object({
	topic: v.string(),
	promptLabel: v.string(),
	safetyLabel: v.string(),
	prompt: v.string(),
	answer: v.string(),
	clue: v.string(),
	explanation: v.string(),
	difficulty: v.picklist(['easy', 'medium', 'hard']),
	statusLine: v.string()
});

const riddleOutputSchema = jsonSchema<Riddle>(
	{
		type: 'object',
		additionalProperties: false,
		required: [
			'topic',
			'promptLabel',
			'safetyLabel',
			'prompt',
			'answer',
			'clue',
			'explanation',
			'difficulty',
			'statusLine'
		],
		properties: {
			topic: { type: 'string' },
			promptLabel: { type: 'string' },
			safetyLabel: { type: 'string' },
			prompt: { type: 'string' },
			answer: { type: 'string' },
			clue: { type: 'string' },
			explanation: { type: 'string' },
			difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
			statusLine: { type: 'string' }
		}
	},
	{
		validate(value) {
			const parsed = v.safeParse(riddleSchema, value);

			if (parsed.success) {
				return { success: true, value: parsed.output };
			}

			return {
				success: false,
				error: new Error(v.summarize(parsed.issues))
			};
		}
	}
);

type GenerationInput = {
	prompt: string;
	round: number;
	profile: PersonalizationProfile;
};

const fallbackTopics = [
	'a household object',
	'a travel accessory',
	'an office tool',
	'a kitchen gadget',
	'a party item',
	'a garden tool',
	'a closet staple',
	'a bathroom essential',
	'a desk accessory',
	'a picnic item',
	'a hobby supply',
	'a cleaning tool'
];

const fallbackFrames = [
	'a flirty wink and playful misdirection',
	'cheeky confidence and a clean punchline',
	'sly wording and a harmless reveal',
	'mischievous banter and a tidy payoff',
	'a teasing setup and an innocent answer',
	'quick wit and a family-friendly finish'
];

const fallbackPayoffs = [
	'Keep the answer ordinary and unexpected.',
	'Let the clue sharpen the misdirection instead of explaining it away.',
	'Make the explanation feel clever, not repetitive.',
	'Use a fresh angle instead of a familiar dirty-joke fakeout.',
	'Keep the rhythm punchy enough to fit on a short card.',
	'Land on a harmless object with a wink, not a shock reveal.'
];

const subjectDomains = [
	'home and decor',
	'travel and transit',
	'work and study',
	'kitchen and dining',
	'parties and hosting',
	'gardening and outdoors',
	'closet and laundry',
	'bath and self-care',
	'crafts and hobbies',
	'cleaning and chores'
];

const framingStyles = [
	'confident and self-assured',
	'mock-suspicious and dramatic',
	'smooth and charming',
	'fast and punchy',
	'playfully competitive',
	'deadpan with a wink'
];

const openingStyles = [
	'start with a bold claim',
	'start with a suspicious-sounding action',
	'start with a playful brag',
	'start with a misleading description',
	'start with a mock confession',
	'start with a scene-setting image'
];

const clueStyles = [
	'keep the clue tactile and concrete',
	'keep the clue short and image-driven',
	'keep the clue contrastive',
	'keep the clue sly but clean',
	'keep the clue practical',
	'keep the clue crisp and literal'
];

const bannedPatterns = [
	'avoid stock openings like "I may sound naughty" or "I seem dirty"',
	'avoid reusing a setup based on going in and out of something',
	'avoid reusing a setup based on getting wet, hot, or messy',
	'avoid reusing a setup based on being handled all night long',
	'avoid repeating the same rhythm in the prompt, clue, and explanation',
	'avoid repeating a familiar bait-and-switch from earlier party riddles'
];

type VariationProfile = {
	subjectDomain: string;
	framingStyle: string;
	openingStyle: string;
	clueStyle: string;
	bannedPattern: string;
};

const pickByRound = (values: string[], round: number, multiplier: number, offset = 0) => {
	const index = Math.abs(round * multiplier + offset) % values.length;
	return values[index];
};

const buildVariationProfile = (round: number): VariationProfile => ({
	subjectDomain: pickByRound(subjectDomains, round, 3, 1),
	framingStyle: pickByRound(framingStyles, round, 5, 2),
	openingStyle: pickByRound(openingStyles, round, 7, 3),
	clueStyle: pickByRound(clueStyles, round, 11, 4),
	bannedPattern: pickByRound(bannedPatterns, round, 13, 5)
});

const resolveGenerationPrompt = (prompt: string, round: number) => {
	const cleanedPrompt = cleanPrompt(prompt);

	if (cleanedPrompt) {
		return cleanedPrompt;
	}

	const topic = pickByRound(fallbackTopics, round, 3, 1);
	const frame = pickByRound(fallbackFrames, round, 5, 2);
	const payoff = pickByRound(fallbackPayoffs, round, 7, 3);

	return `Make it about ${topic} with ${frame}. ${payoff}`;
};

const buildProfileNote = (profile: PersonalizationProfile) => {
	const parts = [
		profile.name ? `name: ${profile.name}` : '',
		profile.vibe ? `vibe: ${profile.vibe}` : '',
		profile.favoriteTopics ? `favorite topics: ${profile.favoriteTopics}` : ''
	].filter(Boolean);

	return parts.length ? parts.join(' | ') : 'no personalization provided';
};

export const buildRiddlePrompt = ({ prompt, round, profile }: GenerationInput) => {
	const cleanedPrompt = resolveGenerationPrompt(prompt, round);
	const displayName = cleanPrompt(profile.name) || 'Guest';
	const vibe = cleanPrompt(profile.vibe) || 'playful and clean';
	const favoriteTopics =
		cleanPrompt(profile.favoriteTopics) || 'everyday objects and harmless misdirection';
	const variation = buildVariationProfile(round);

	return `Create one original, family-friendly riddle card as structured JSON.

<context>
User prompt: ${cleanedPrompt}
User profile: ${buildProfileNote(profile)}
Round: ${round}
</context>

<hard_constraints>
- Keep the setup flirtatious, mischievous, and a little dramatic, but never explicit.
- The answer must be a harmless, ordinary thing with no sexual, anatomical, or explicit references.
- Personalize the wording for ${displayName} with a ${vibe} tone.
- Use the user's favorite topics when it helps, especially ${favoriteTopics}.
- Keep the riddle concise, punchy, and easy to read on a card.
</hard_constraints>

<novelty_targets>
- Choose an answer from the ${variation.subjectDomain} space unless the user prompt strongly points elsewhere.
- Use a ${variation.framingStyle} voice and ${variation.openingStyle}.
- ${variation.clueStyle}.
- Favor a fresh misdirection angle instead of a familiar dirty-joke fakeout.
- ${variation.bannedPattern}.
- Do not repeat the same phrase family across prompt, clue, and explanation.
</novelty_targets>

<field_guidance>
- topic: a short category name.
- promptLabel: a short label for the card header.
- safetyLabel: a short badge that signals the riddle is AI-generated.
- prompt: the riddle setup.
- answer: a short, harmless answer.
- clue: one brief clue.
- explanation: one or two sentences that explain the answer.
- difficulty: easy, medium, or hard.
- statusLine: one friendly status sentence for the UI.
</field_guidance>`;
};

export async function buildRound(input: GenerationInput): Promise<Riddle> {
	const cleanedPrompt = cleanPrompt(input.prompt);

	if (cleanedPrompt && isUnsafePrompt(cleanedPrompt)) {
		error(400, 'Please keep the prompt family-friendly.');
	}

	try {
		const { output } = await generateText({
			model: deepseek(DEEPSEEK_RIDDLE_MODEL),
			output: Output.object({ schema: riddleOutputSchema }),
			system: RIDDLE_SYSTEM_PROMPT,
			prompt: buildRiddlePrompt(input)
		});

		return output;
	} catch {
		error(502, 'DeepSeek could not generate a riddle right now.');
	}
}
