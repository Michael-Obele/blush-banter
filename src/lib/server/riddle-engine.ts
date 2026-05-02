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

const starterPrompts = [
	'Make it about a household object with a flirty wink, playful misdirection, and a harmless reveal.',
	'Make it about a travel item that sounds like trouble but ends in a clean, clever punchline.',
	'Make it about an office tool with cheeky confidence, a teasing setup, and an innocent answer.',
	'Make it about a kitchen gadget that acts suspiciously smooth but resolves into a simple joke.',
	'Make it about a party object with mischievous energy, quick wit, and a family-friendly finish.',
	'Make it about a garden item with sly wording, a little tension, and a harmless payoff.'
];

const resolveGenerationPrompt = (prompt: string, round: number) => {
	const cleanedPrompt = cleanPrompt(prompt);

	if (cleanedPrompt) {
		return cleanedPrompt;
	}

	const index = Math.abs(round) % starterPrompts.length;
	return starterPrompts[index];
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

	return `Create one original, family-friendly riddle as structured JSON.

User prompt: ${cleanedPrompt}
User profile: ${buildProfileNote(profile)}
Round: ${round}

Requirements:
- Make the setup sound flirtatious, mischievous, and a little dramatic, but never explicit.
- Keep the joke-forward energy high; the payoff should feel like a wink, not a reveal.
- The answer must be a harmless, ordinary thing with no sexual, anatomical, or explicit references.
- Personalize the wording for ${displayName} with a ${vibe} tone.
- Use the user's favorite topics when it helps, especially ${favoriteTopics}.
- Keep the riddle concise, punchy, and easy to read on a card.
- Favor playful double meaning, teasing banter, and clever misdirection over crude wording.

Field guidance:
- topic: a short category name.
- promptLabel: a short label for the card header.
- safetyLabel: a short badge that signals the riddle is AI-generated.
- prompt: the riddle setup.
- answer: a short, harmless answer.
- clue: one brief clue.
- explanation: one or two sentences that explain the answer.
- difficulty: easy, medium, or hard.
- statusLine: one friendly status sentence for the UI.`;
};

export async function buildRound(input: GenerationInput): Promise<Riddle> {
	const cleanedPrompt = cleanPrompt(input.prompt);

	if (cleanedPrompt && isUnsafePrompt(cleanedPrompt)) {
		error(400, 'Please keep the prompt family-friendly.');
	}

	try {
		const { output } = await generateText({
			model: deepseek('deepseek-chat'),
			output: Output.object({ schema: riddleOutputSchema }),
			system:
				'You are a playful riddle writer. Generate family-friendly riddles with flirtatious, mischievous, joke-forward energy, but never explicit or sexual. Keep the subtext light, the answer harmless, and the punchline clever.',
			prompt: buildRiddlePrompt(input)
		});

		return output;
	} catch {
		error(502, 'DeepSeek could not generate a riddle right now.');
	}
}
