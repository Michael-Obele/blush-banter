export type Riddle = {
	topic: string;
	labels: string[];
	prompt: string;
	answer: string;
	clue: string;
	explanation: string;
	difficulty: 'easy' | 'medium' | 'hard';
};

export type PromptPreset = {
	label: string;
	prompt: string;
	hint: string;
};

export const promptPresets: PromptPreset[] = [
	{
		label: 'Kitchen Mischief',
		prompt: 'Make it about a kitchen gadget with a cheeky setup.',
		hint: 'Breakfast, appliances, and harmless drama'
	},
	{
		label: 'Travel Drama',
		prompt: 'Make it about a travel object that sounds far more scandalous than it is.',
		hint: 'Suitcases, umbrellas, and airport chaos'
	},
	{
		label: 'Office Tease',
		prompt: 'Make it about an office item with a mischievous twist.',
		hint: 'Desks, drawers, and paperwork'
	},
	{
		label: 'Laundry Chaos',
		prompt: 'Make it about laundry or cleaning with playful misdirection.',
		hint: 'Soap, spinning, and fresh folds'
	},
	{
		label: 'Garden Gossip',
		prompt: 'Make it about a garden object with a sly but clean answer.',
		hint: 'Plants, tools, and outdoor nonsense'
	},
	{
		label: 'Party Trick',
		prompt: 'Make it about a party object that sounds wildly dramatic.',
		hint: 'Lights, gifts, and a little sparkle'
	}
];

export const seedRiddles: Riddle[] = [
	{
		topic: 'Kitchen',
		labels: ['kitchen', 'breakfast', 'toast', 'appliance'],
		prompt:
			'I get turned on for a warm performance, I pop when I am ready, and I leave the room with a little buttered drama. What am I?',
		answer: 'Toaster',
		clue: 'Breakfast gear with a dramatic exit.',
		explanation: 'It sounds like trouble, but it is just the thing that browns your bread.',
		difficulty: 'easy'
	},
	{
		topic: 'Travel',
		labels: ['travel', 'airport', 'luggage', 'trip'],
		prompt:
			'I get packed tight, dragged around in public, and opened whenever someone wants a surprise. What am I?',
		answer: 'Suitcase',
		clue: 'A travel companion that minds its own zipper.',
		explanation: 'The setup is suggestive, but the answer is just luggage.',
		difficulty: 'easy'
	},
	{
		topic: 'Office',
		labels: ['office', 'desk', 'paper', 'drawer'],
		prompt:
			'People slide me open, stuff me with secrets, and close me again like nothing happened. What am I?',
		answer: 'Desk drawer',
		clue: 'A very nosy piece of furniture.',
		explanation: 'It sounds like gossip, but it is only a drawer under a desk.',
		difficulty: 'medium'
	},
	{
		topic: 'Laundry',
		labels: ['laundry', 'wash', 'spin', 'clean'],
		prompt:
			'I am full of wet stuff, I spin until everything feels lighter, and I am happiest when people load me up. What am I?',
		answer: 'Washing machine',
		clue: 'The rounder the load, the busier the job.',
		explanation: 'That sounds far more dramatic than a normal laundry appliance deserves.',
		difficulty: 'medium'
	},
	{
		topic: 'Garden',
		labels: ['garden', 'outdoor', 'plant', 'soil'],
		prompt:
			'I get shoved into the dirt, pulled out when needed, and I always help things stand a little straighter. What am I?',
		answer: 'Garden stake',
		clue: 'A simple tool that keeps things upright.',
		explanation: 'The line sounds cheeky, but the answer is only a garden support.',
		difficulty: 'medium'
	},
	{
		topic: 'Party',
		labels: ['party', 'gift', 'celebration', 'sparkle'],
		prompt:
			'I get wrapped up, set in the middle of the room, and make everyone grin when I finally open. What am I?',
		answer: 'Present',
		clue: 'The best kind of party surprise.',
		explanation: 'It sounds like a setup, but it is just a gift.',
		difficulty: 'easy'
	},
	{
		topic: 'Music',
		labels: ['music', 'guitar', 'strum', 'sound'],
		prompt:
			'I slip between your fingers, get used again and again, and help make a tiny thing sound much louder. What am I?',
		answer: 'Guitar pick',
		clue: 'Small, flat, and always ready for a strum.',
		explanation: 'It looks innocent because it is just the little tool for playing a guitar.',
		difficulty: 'medium'
	},
	{
		topic: 'Tools',
		labels: ['tools', 'garage', 'button', 'remote'],
		prompt:
			'I make big things come up with one click, and I am happiest when someone presses me without thinking. What am I?',
		answer: 'Garage door opener',
		clue: 'A tiny click for a very large reveal.',
		explanation: 'The joke leans suggestive, but it is only the remote for the garage.',
		difficulty: 'hard'
	}
];

export const fallbackRiddle = seedRiddles[0];

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

export const isUnsafePrompt = (value: string) => {
	const normalized = cleanPrompt(value).toLowerCase();

	if (!normalized) {
		return false;
	}

	return unsafeTerms.some((term) => normalized.includes(term));
};

const hashText = (value: string) => {
	let hash = 0;

	for (const character of value) {
		hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
	}

	return hash;
};

const matchesPrompt = (riddle: Riddle, normalizedPrompt: string) =>
	riddle.topic.toLowerCase().includes(normalizedPrompt) ||
	riddle.labels.some((label) => normalizedPrompt.includes(label)) ||
	normalizedPrompt.includes(riddle.answer.toLowerCase()) ||
	normalizedPrompt.includes(riddle.clue.toLowerCase().split(' ')[0]);

export const pickRiddleForPrompt = (prompt: string, round = 0) => {
	const normalizedPrompt = cleanPrompt(prompt).toLowerCase();
	const matchedRiddles = normalizedPrompt
		? seedRiddles.filter((riddle) => matchesPrompt(riddle, normalizedPrompt))
		: seedRiddles;
	const pool = matchedRiddles.length ? matchedRiddles : seedRiddles;
	const index = hashText(`${normalizedPrompt}|${round}`) % pool.length;

	return pool[index];
};

export const getPromptTone = (prompt: string) => {
	const normalizedPrompt = cleanPrompt(prompt).toLowerCase();

	if (!normalizedPrompt) {
		return 'general wordplay';
	}

	if (normalizedPrompt.includes('kitchen') || normalizedPrompt.includes('food')) {
		return 'kitchen mischief';
	}

	if (normalizedPrompt.includes('travel') || normalizedPrompt.includes('airport')) {
		return 'travel drama';
	}

	if (normalizedPrompt.includes('office') || normalizedPrompt.includes('desk')) {
		return 'office tease';
	}

	if (normalizedPrompt.includes('laundry') || normalizedPrompt.includes('wash')) {
		return 'laundry chaos';
	}

	if (normalizedPrompt.includes('garden') || normalizedPrompt.includes('plant')) {
		return 'garden gossip';
	}

	if (normalizedPrompt.includes('party') || normalizedPrompt.includes('gift')) {
		return 'party trick';
	}

	return 'custom prompt';
};
