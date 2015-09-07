var segments = ['compulsive', 'collector', 'ordered_once', 'regular', 'returns', 'reviewer']

export default {
	values: segments,
	choices: segments.map(segment => { return { label: segment, value: segment } })
};
