var pluses = /\+/g;

function cookie (key, value, options) {

	// Write

	if (value !== undefined) {
		options = $.extend({}, config.defaults, options);

		if (typeof options.expires === 'number') {
			var days = options.expires, t = options.expires = new Date();
			t.setTime(+t + days * 864e+5);
		}

		return (document.cookie = [
			encodeURIComponent(key), '=', encodeURIComponent(String(value)),
			options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
			options.path    ? '; path=' + options.path : '',
			options.domain  ? '; domain=' + options.domain : '',
			options.secure  ? '; secure' : ''
		].join(''));
	}

	// Read

	var result = key ? undefined : {};

	// To prevent the for loop in the first place assign an empty array
	// in case there are no cookies at all. Also prevents odd result when
	// calling $.cookie().
	var cookies = document.cookie ? document.cookie.split('; ') : [];

	for (var i = 0, l = cookies.length; i < l; i++) {
		var parts = cookies[i].split('=');
		var name = decodeURIComponent(parts.shift());
		var cookie = parts.join('=');

		if (key && key === name) {
			// If second argument (value) is a function it's a converter...
			result = cookie;
			break;
		}
	}

	return result;
};

cookie.remove = function (name) {
	cookie(name, null);
};

var config = cookie;

config.defaults = {};

module.exports = cookie;