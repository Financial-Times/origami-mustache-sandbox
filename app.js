"use strict";

var pkg = require("./package.json"),
    express = require("express"),
	mu = require('mu2'),
	mustacheInit = require("./mustache-init.js"),
	app   = express(),
	port  = process.env.PORT || 3080,
	fs = require('fs');

mustacheInit.init(app, mu);

app.use(express.compress());

app.get('/', function (req, res) {
	res.render("./origami-templates/page", {
		page: {
			version: pkg.version,
			title: "Index page"
		}
	});
});


app.listen(port);
console.log('Listening on port', port);