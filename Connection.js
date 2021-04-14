/**
 * 
 * @author youngoat@163.com
 */

'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, events = require('events')
	, stream = require('stream')
	, util = require('util')
	
	/* NPM */
	, ceph = require('ceph')
	, PoC = require('jinang/PoC')
	, readable2buffer = require('jinang/readable2buffer')

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
	'createBucket',
	'createContainer',
	// 'createObject', 
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

/**
 * This method is different because awesome *stream* may occur.
 * 这个方法之所以需要特殊处理，是因为其中涉及了危险的流。
 */
Connection.prototype.createObject = async function(options, content, callback) {
	return PoC(done => {
		/**
		 * 策略一
		 * 流的多路复用存在较多不可控因素，故而这里采用较为保守的策略， 
		 * 先将流整体读入内存，然后再逐一发送。
		 */
		let run = content => {
			let action = conn => conn.createObject(options, content);
			Promise.all(this.conns.map(action))
				.then(data => done(null, data[0]))
				.catch(ex => done(ex))
				;
		}
		
		if (content instanceof stream.Readable) {
			readable2buffer(content).then(run, done);
		}
		else {
			run(content);
		}

		/**
		 * @TODO
		 * 策略二
		 * 复制多个流，
		 */
	}, callback);
};

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
Connection.prototype.__defineSetter__('bucket', setBucket);
Connection.prototype.__defineSetter__('container', setBucket);

let getBucket = function() {
	let bucket = this.conns[0].get('bucket');
    let same = this.conns.every(subconn => subconn.get('bucket') == bucket);
    return same ? bucket : null;
};
Connection.prototype.__defineGetter__('bucket', getBucket);
Connection.prototype.__defineGetter__('container', getBucket);

let getStyle = function() {
    let style = thhis.conns[0].get('style');
    let same = this.conns.every(subconn => subconn.get('style') == style);
    return same ? style : 'mixed';
};
Connection.prototype.__defineGetter__('style', getStyle);

/**
 * @deprecated
 * For compatibility only.
 * 此方法仅为保持兼容。
 */
Connection.prototype.get = function(name) {
	return this[name];
};

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
