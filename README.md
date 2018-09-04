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
const cephDual = require('ceph-dual/swift');

const connConfig_1 =  {
    endPoint   : 'http://storage1.example.com/',
    subuser    : 'userName:subUserName',
    key        : '380289ba59473a368c593c1f1de6efb0380289ba5',
};

const connConfig_2 = {
    endPoint   : 'http://storage2.example.com/',
    subuser    : 'userName:subUserName',
    key        : '380289ba59473a368c593c1f1de6efb0380289ba5',
};

const conn = cephDual.Connection([ connConfig_1, connConfig_2 ]);

conn.createContainer('demoBucket', (err) => {
    // ...
});
```

##	API

This package is isomorphic with package [ceph](https://www.npmjs.com/package/ceph).
