import { command } from '$app/server';
import * as v from 'valibot';
import { buildRound, buildRiddlePrompt, DEEPSEEK_RIDDLE_MODEL } from '$lib/server/riddle-engine';

const roundRequestSchema = v.object({
	prompt: v.string(),
	round: v.number(),
	profile: v.object({
		name: v.string(),
		vibe: v.string(),
		favoriteTopics: v.string()
	})
});

export const generateRound = command(roundRequestSchema, async (request) => {
	const aiPrompt = buildRiddlePrompt(request);

	console.log('[riddle remote] ai request', {
		request,
		model: DEEPSEEK_RIDDLE_MODEL,
		prompt: aiPrompt
	});

	try {
		const round = await buildRound(request);
		console.log('[riddle remote] ai response', round);
		return round;
	} catch (error) {
		console.error('[riddle remote] ai error', error);
		throw error;
	}
});
