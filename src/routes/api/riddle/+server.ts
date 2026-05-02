import { deepseek } from '@ai-sdk/deepseek';
import { streamText } from 'ai';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import { buildRiddlePrompt } from '$lib/server/riddle-engine';

const generationRequestSchema = v.object({
	prompt: v.string(),
	round: v.number(),
	profile: v.object({
		name: v.string(),
		vibe: v.string(),
		favoriteTopics: v.string()
	})
});

export const POST = async ({ request }) => {
	let payload: unknown;

	try {
		payload = await request.json();
	} catch {
		console.error('[riddle api] invalid json request body');
		error(400, 'Expected a JSON request body.');
	}

	const parsed = v.safeParse(generationRequestSchema, payload);

	if (!parsed.success) {
		console.error('[riddle api] invalid riddle request', payload);
		error(400, 'Invalid riddle request.');
	}

	const requestPayload = parsed.output;
	const aiPrompt = buildRiddlePrompt(requestPayload);

	console.log('[riddle api] ai request', {
		request: requestPayload,
		model: 'deepseek-chat',
		prompt: aiPrompt
	});

	const result = streamText({
		model: deepseek('deepseek-chat'),
		system:
			'You are a playful riddle writer. Generate family-friendly riddles with a cheeky setup and a harmless answer.',
		prompt: aiPrompt,
		onError({ error: streamError }) {
			console.error('[riddle api] ai stream error', streamError);
		}
	});

	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		async start(controller) {
			let responseText = '';

			try {
				for await (const chunk of result.textStream) {
					responseText += chunk;
					console.log('[riddle api] ai chunk', chunk);
					controller.enqueue(encoder.encode(chunk));
				}

				console.log('[riddle api] ai response', responseText);
				controller.close();
			} catch (streamError) {
				console.error('[riddle api] ai response error', streamError);
				controller.error(streamError);
			}
		}
	});

	return new Response(stream, {
		headers: {
			'content-type': 'text/plain; charset=utf-8',
			'cache-control': 'no-store'
		}
	});
};
