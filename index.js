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
    return conn instanceof dualSwift.Connection;
}

function getConnectionStyle(conn) {
    if (isConnection(conn) || conn.conns.length == 0) {
        return null;
    }

    let style = conn.conns[0].get('style');
    let same = conn.conns.every(subconn => subconn.get('style') == style);
    return same ? style : 'mixed';
}

module.exports = {
    Connection,
    createConnection,
    getConnectionStyle,
    isConnection,
};