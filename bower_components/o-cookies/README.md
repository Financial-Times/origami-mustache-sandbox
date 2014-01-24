# Cookies module <small>o-cookies</small>

Cookies module provides a utility for rgetting or setting the value of a site's cookies. It also contains additional methods for getting and setting parameters of certain FT cookies (which use a variety of different syntaxes)

## Installation

Run the following in your project's root directory
   
    bower install o-grid=http://git.svc.ft.com:9080/git/origami/o-cookies.git
    
(If your project doesn't already contain a bower.json file you will need to create one first with the content `{"name": "your-project-name"}`)


## API

* `get(name)` - retrieves the value of cookie `name`
* `set(name, value, options)` - sets the value of cookie `name` to `value`. The options object, if specified, can have any of the following properties
	* `expires`: Lifetime of the cookie. Value can be a number of days from time of creation or a Date object. *default: 730 days*
	* `path`: The path where the cookie is valid *default: '/'*
	* `domain`: The domain where the cookie is valid *default: '.ft.com'*
	* `secure`: If `true` the cookie will only be sent over https *default: false*
* `remove(name)` - unsets the value of a cookie
* `getParam(name, param)` - gets the value stored in the given parameter within cookie `name` (only works for some FT cookies which use a predefined syntax for separating parameters)
* `setParam(name, param, value)` - sets the value stored in the given parameter within cookie `name` (only works for the AYSC FT cookie)