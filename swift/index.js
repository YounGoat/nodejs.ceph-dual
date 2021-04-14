/**
 * @deprecated
 * @author youngoat@163.com
 */

'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, util = require('util')
	, events = require('events')

	/* NPM */
	, swift = require('ceph/swift')
	, PoC = require('jinang/PoC')

	/* in-file */
	;

/**
 * Create a new connection to multi Ceph services.
 * @class
 * 
 * @param  {Array}   configs 
 * @param  {object}  settings
 */
const Connection = function(configs, settings) {
	this.conns = configs.map(config => new swift.Connection(config, settings));
};

// Inherit class EventEmitter in order to invoke methods .emit(), .on(), .once() etc.
util.inherits(Connection, events.EventEmitter);

Connection.prototype._action = function(action, callback) {
	return PoC(done => {
		Promise.all(this.conns.map(action))
			.then(data => done(null, data[0]))
			.catch(done)
			;	
	}, callback);
};

// Define operation functions.
[	'connect', 
	'createObject', 
	'copyObject',
	'createContainer',
	'createObjectMeta',
	'deleteContainer',
	'deleteObject',
].forEach(fnName => {
	Connection.prototype[fnName] = function(/* ... [, callback] */) {
		let args = Array.from(arguments);
		let callback = null;
		if (typeof args[args.length - 1] == 'function') {
			callback = args.pop();
		}
		return this._action(conn => conn[fnName].apply(conn, args), callback);
	};
});

// Define read-only functions.
[	'findContainers', 
	'findObjects',
	'generateTempUrl',
	'readContainer',
	'readObject',
	'readObjectMeta',
].forEach(fnName => {
	Connection.prototype[fnName] = function(/* ... [, callback] */) {
		let conn = this.conns[0];
		return conn[fnName].apply(conn, arguments);
	};
});

Connection.prototype.get = function(name) {
	let conn = this.conns[0];
	switch (name.toLowerCase()) {
		case 'style'       : return conn.get('style');
		case 'container'   : return conn.get('container');
	}
};

Connection.prototype.__defineSetter__('container', function(value) {
	this.conns.forEach(conn => conn.container = value);
});

/**
 * To learn whether connection created successfully.
 * @return {boolean} true if connected
 */
Connection.prototype.isConnected = function() {
	let connected = true;
	for (let i = 0; connected && i < this.conns.length; i++) {
		connected = this.conns[i].isConnected();
	}
	return connected;
};

module.exports = {
	Connection,
};
