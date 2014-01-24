var cookie = require('o-cookies'),
    firstName = cookie.getParam('FT_Remember', 'FNAME'),
    lastName = cookie.getParam('FT_Remember', 'LNAME'),
    email = cookie.getParam('FT_Remember', 'EMAIL');
 
module.exports = {
    getName: function () {
        return [firstName, lastName].join(' ');
    },
    getEmail: function () {
        return email;
    }
};