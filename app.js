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
		'o-wrapper': {
			title: 'Title for wrapper',
			additional: "additional content for wrapper"
		},
		'o-inner1': {
			title: 'Title for inner1',
			additional: "additional content for inner1"
		},
		'o-inner2': {
			title: 'Title for inner2',
			additional: "additional content for inner2"
		}
	});
});


app.listen(port);
console.log('Listening on port', port);