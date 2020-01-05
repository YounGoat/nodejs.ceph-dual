/**
 * @author youngoat@163.com
 */

'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, util = require('util')
	, events = require('events')

	/* NPM */
	, ceph = require('ceph')
	, PoC = require('jinang/PoC')

	/* in-file */
	;

/**
 * Create a new connection to multi Ceph services.
 * @class
 * 
 * @param  {Array}   optionsGroup 
 * @param  {object}  settings
 */
const Connection = function(optionsGroup, settings) {
	this.conns = optionsGroup.map(options => ceph.createConnection(options, settings));
};

// Inherit class EventEmitter in order to invoke methods .emit(), .on(), .once() etc.
util.inherits(Connection, events.EventEmitter);

Connection.prototype._action = function(action, callback) {
	return PoC(done => {
		Promise.all(this.conns.map(action))
			.then(data => done(null, data[0]))
			.catch(ex => done(ex))
			;
	}, callback);
};

// Define operation functions.
[	'connect', 
	'copyObject',
	'createContainer',
	'createBucket',
	'createObject', 
	'deleteBucket',
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
[	'findBuckets', 
	'findContainers', 
	'findObjects',
	'readBucket',
	'readContainer',
	'readObject',
	'readObjectMeta',
].forEach(fnName => {
	Connection.prototype[fnName] = function(/* ... [, callback] */) {
		let conn = this.conns[0];
		return conn[fnName].apply(conn, arguments);
	};
});

let setBucket = function(value) {
	this.conns.forEach(conn => {
		conn.container = value;
		conn.bucket = value;
	});
};
Connection.prototype.__defineSetter__('container', setBucket);
Connection.prototype.__defineSetter__('bucket', setBucket);

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

module.exports = Connection;
