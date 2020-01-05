#	ceph-dual
__Parallelly write to two or more CEPH storages.__

>	If links in this document not avaiable, please access [README on GitHub](./README.md) directly.

##  Description

Use __ceph-dual__ to parallelly operate two or more CEPH storages with ease.

##	ToC

*	[Get Started](#get-started)
*	[API](#api)

##	Links

*	[CHANGE LOG](./CHANGELOG.md)
*	[Homepage](https://github.com/YounGoat/nodejs.ceph-dual)

##	Get Started

```javascript
const cephDual = require('ceph-dual');

const connConfig_master =  {
    endPoint   : 'http://storage1.example.com/',
    subuser    : 'userName:subUserName',
    key        : '380289ba59473a368c593c1f1de6efb0380289ba5',
};

const connConfig_slave = {
    endPoint   : 'http://storage2.example.com/',
    subuser    : 'userName:subUserName',
    key        : '380289ba59473a368c593c1f1de6efb0380289ba5',
};

const conn = new cephDual.Connection([ connConfig_master, connConfig_slave ]);

conn.createContainer('demoBucket', (err) => {
    // ...
});
```

##	API

This package is nearly isomorphic with package [ceph](https://www.npmjs.com/package/ceph). Each time a member method of a __ceph-dual.Connection__ instance invoked, same invokations will be applied to the __ceph/\*.Connection__ instances which are owned by it. The methods will be resolved or callback WITHOUT exception only if all the sub invokations succeeds. If any of the sub invokations fails, the methods will be rejected or callback WITH an exception. 

To keep compatible, the input and output of a method are smiliar with those of the homonymous method in __ceph/\*.Connection__. E.g.

```javascript
conn.createObject({ container: 'demoBucket', name: 'hello.txt' }, 'Hello Ching!', (err, data) => {
    // Here `data` is an Object instead of an Array.
});
```