##	History

起初 [ceph](https://www.npmjs.com/package/ceph) 只支持 swift 风格 API，故而 ceph-dual 也继承了这种局限性，早期的程序有 [swift/index.js](../swift/index.js)。

后来 ceph 对于 S3 风格 API 的支持趋于完善，经过封装后可以认为近乎一致，因此在 ceph-dual 中也就由 Connection.js 统一，而 swift/index.js 则被抛弃。但在切换的过程中，也舍弃了个别仅在 swift 风格下可用的方法，比如 generateTempUrl() 。