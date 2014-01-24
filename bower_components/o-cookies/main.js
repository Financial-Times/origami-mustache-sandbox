var cookie = require('./cookie'),
    formats = {
        "AYSC": "underscore",
        "FT_U": "underscoreEquals",
        "FT_Remember": "colonEquals",
        "FT_User": "colonEquals",
        "FTQA": "commaEquals"
    };

cookie.defaults = { 
    domain: ".ft.com",
    path: "/",
    expires: 730
};


function getRegExp(name, param) {
    var re;
    switch (formats[name]) {
    case "underscore":
        re = '_' + param + '([^_]*)_';
        break;
    case "underscoreEquals":
        re = '_' + param + '=([^_]*)_';
        break;
    case "colonEquals":
        re = ':' + param + '=([^:]*)';
        break;
    case "commaEquals":
        re = param + '=([^,]*)';
        break;
    default:
        re = /((.|\n)*)/; // match everything
        break;
    }
    return new RegExp(re);
}

/** Get a parameter from a named cookie
 * @param {string} name The cookie's name
 * @param {string} param The parameter's name
 * @return {string|undefined}
 */
function getParam(name, param) {
    var wholeValue = cookie(name) || "", matches;
    if (param) {
        matches = wholeValue.match(getRegExp(name, param));
    }
    return (matches && matches.length) ? matches[1] : undefined;
}

function updateAYSCValue(wholeValue, param, value) {
    if (!wholeValue) {
        wholeValue = "_";
    }
    var paramValue = getParam("AYSC", param);
    if (FT.$.type(paramValue) === "undefined") {
        return wholeValue + param + value + "_";
    } else {
        return wholeValue.replace(getRegExp("AYSC", param), "_" + param + value + "_");
    }
}

/** Set a particular parameter in a cookie, without changing the other parameters
 * @param {string} name The cookie's name
 * @param {string} param The parameter's name
 * @param {string} value The parameter's value
 * */
function setParam(name, param, value) {
    if (name !== "AYSC") {
        throw new Error("cookie.setParam() currently only works for AYSC");
    }

    var wholeValue = cookie(name) || "";
    
    wholeValue = updateAYSCValue(wholeValue, param, value);
    cookie("AYSC", wholeValue, defaultCookieOptions);
}

module.exports = {
    get: cookie,
    set: cookie,
    remove: cookie.remove,
    getParam: getParam,
    setParam: setParam
};  