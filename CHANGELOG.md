#   ceph-dual Change Log

Notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning 2.0.0](http://semver.org/).

##	[0.1.1] - 2021-04-14

*	Fix bug where leading data blocks may be missed when creating object from stream.  
	修正错误：当从流中读取数据并写入多个存储时，可能存在部分数据块丢失的情况。

##  [0.1.0] - Jan 5th, 2020

*   With dependency `ceph` upgraded to version 1.0.0, servers of mixed type are acceptable now.

##  [0.0.4] - Dec 9th, 2018

*   Change the entrance (property "main" in [package.json](./package.json)) from `swift/index` to `index`.
*   Method `isConnection()` added.
*   Method `get()` added to class `ceph-dual/swift.Connection`.
*   Setter `.container` added to class `ceph-dual/swift.Connection`.

##	[0.0.1] - 2018-9-4

Released.

---
This CHANGELOG.md follows [*Keep a CHANGELOG*](http://keepachangelog.com/).
