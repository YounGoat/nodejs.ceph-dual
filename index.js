'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    
    /* NPM */
    , noda = require('noda')
    
    /* in-package */
    , dualSwift = noda.inRequire('swift')
    ;

function isConnection(conn) {
    return conn instanceof dualSwift.Connection;
}

module.exports = {
    isConnection,
};