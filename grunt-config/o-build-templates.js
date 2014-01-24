module.exports = {
	files: ["page.mustache"],
	pathToCompiled: undefined,
	dynamicPartials: {
		'o-wrapper': {
			topbaritems: 'o-inner3/main',
			othertopbaritems: './not-bower/othertemplate'
		},
		'o-inner2': {
			dynamicstuff: './not-bower/nottemplate.html'
		}
	}
};