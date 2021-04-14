'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    
    /* NPM */
    , noda = require('noda')
    
    /* in-package */
    , Connection = require('./Connection')
    , dualSwift = noda.inRequire('swift')
    ;

function createConnection(optionGroups) {
    return new Connection(optionGroups);
}

function isConnection(conn) {
    return conn instanceof Connection;
}

function getConnectionStyle(conn) {
    if (isConnection(conn) || conn.conns.length == 0) {
        return null;
    }

    return conn.style;
}

module.exports = {
    Connection,
    createConnection,
    getConnectionStyle,
    isConnection,
};