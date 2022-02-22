module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1645497393369, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



const fs = require("graceful-fs");
const CachedInputFileSystem = require("./CachedInputFileSystem");
const ResolverFactory = require("./ResolverFactory");

/** @typedef {import("./PnpPlugin").PnpApiImpl} PnpApi */
/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").FileSystem} FileSystem */
/** @typedef {import("./Resolver").ResolveContext} ResolveContext */
/** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */
/** @typedef {import("./ResolverFactory").Plugin} Plugin */
/** @typedef {import("./ResolverFactory").UserResolveOptions} ResolveOptions */

const nodeFileSystem = new CachedInputFileSystem(fs, 4000);

const nodeContext = {
	environments: ["node+es3+es5+process+native"]
};

const asyncResolver = ResolverFactory.createResolver({
	conditionNames: ["node"],
	extensions: [".js", ".json", ".node"],
	fileSystem: nodeFileSystem
});
function resolve(context, path, request, resolveContext, callback) {
	if (typeof context === "string") {
		callback = resolveContext;
		resolveContext = request;
		request = path;
		path = context;
		context = nodeContext;
	}
	if (typeof callback !== "function") {
		callback = resolveContext;
	}
	asyncResolver.resolve(context, path, request, resolveContext, callback);
}

const syncResolver = ResolverFactory.createResolver({
	conditionNames: ["node"],
	extensions: [".js", ".json", ".node"],
	useSyncFileSystemCalls: true,
	fileSystem: nodeFileSystem
});
function resolveSync(context, path, request) {
	if (typeof context === "string") {
		request = path;
		path = context;
		context = nodeContext;
	}
	return syncResolver.resolveSync(context, path, request);
}

function create(options) {
	options = {
		fileSystem: nodeFileSystem,
		...options
	};
	const resolver = ResolverFactory.createResolver(options);
	return function (context, path, request, resolveContext, callback) {
		if (typeof context === "string") {
			callback = resolveContext;
			resolveContext = request;
			request = path;
			path = context;
			context = nodeContext;
		}
		if (typeof callback !== "function") {
			callback = resolveContext;
		}
		resolver.resolve(context, path, request, resolveContext, callback);
	};
}

function createSync(options) {
	options = {
		useSyncFileSystemCalls: true,
		fileSystem: nodeFileSystem,
		...options
	};
	const resolver = ResolverFactory.createResolver(options);
	return function (context, path, request) {
		if (typeof context === "string") {
			request = path;
			path = context;
			context = nodeContext;
		}
		return resolver.resolveSync(context, path, request);
	};
}

/**
 * @template A
 * @template B
 * @param {A} obj input a
 * @param {B} exports input b
 * @returns {A & B} merged
 */
const mergeExports = (obj, exports) => {
	const descriptors = Object.getOwnPropertyDescriptors(exports);
	Object.defineProperties(obj, descriptors);
	return /** @type {A & B} */ (Object.freeze(obj));
};

module.exports = mergeExports(resolve, {
	get sync() {
		return resolveSync;
	},
	create: mergeExports(create, {
		get sync() {
			return createSync;
		}
	}),
	ResolverFactory,
	CachedInputFileSystem,
	get CloneBasenamePlugin() {
		return require("./CloneBasenamePlugin");
	},
	get LogInfoPlugin() {
		return require("./LogInfoPlugin");
	},
	get forEachBail() {
		return require("./forEachBail");
	}
});

}, function(modId) {var map = {"./CachedInputFileSystem":1645497393370,"./ResolverFactory":1645497393371,"./CloneBasenamePlugin":1645497393407,"./LogInfoPlugin":1645497393408,"./forEachBail":1645497393379}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393370, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



const nextTick = require("process").nextTick;

/** @typedef {import("./Resolver").FileSystem} FileSystem */
/** @typedef {import("./Resolver").SyncFileSystem} SyncFileSystem */

const dirname = path => {
	let idx = path.length - 1;
	while (idx >= 0) {
		const c = path.charCodeAt(idx);
		// slash or backslash
		if (c === 47 || c === 92) break;
		idx--;
	}
	if (idx < 0) return "";
	return path.slice(0, idx);
};

const runCallbacks = (callbacks, err, result) => {
	if (callbacks.length === 1) {
		callbacks[0](err, result);
		callbacks.length = 0;
		return;
	}
	let error;
	for (const callback of callbacks) {
		try {
			callback(err, result);
		} catch (e) {
			if (!error) error = e;
		}
	}
	callbacks.length = 0;
	if (error) throw error;
};

class OperationMergerBackend {
	/**
	 * @param {any} provider async method
	 * @param {any} syncProvider sync method
	 * @param {any} providerContext call context for the provider methods
	 */
	constructor(provider, syncProvider, providerContext) {
		this._provider = provider;
		this._syncProvider = syncProvider;
		this._providerContext = providerContext;
		this._activeAsyncOperations = new Map();

		this.provide = this._provider
			? (path, options, callback) => {
					if (typeof options === "function") {
						callback = options;
						options = undefined;
					}
					if (options) {
						return this._provider.call(
							this._providerContext,
							path,
							options,
							callback
						);
					}
					if (typeof path !== "string") {
						callback(new TypeError("path must be a string"));
						return;
					}
					let callbacks = this._activeAsyncOperations.get(path);
					if (callbacks) {
						callbacks.push(callback);
						return;
					}
					this._activeAsyncOperations.set(path, (callbacks = [callback]));
					provider(path, (err, result) => {
						this._activeAsyncOperations.delete(path);
						runCallbacks(callbacks, err, result);
					});
			  }
			: null;
		this.provideSync = this._syncProvider
			? (path, options) => {
					return this._syncProvider.call(this._providerContext, path, options);
			  }
			: null;
	}

	purge() {}
	purgeParent() {}
}

/*

IDLE:
	insert data: goto SYNC

SYNC:
	before provide: run ticks
	event loop tick: goto ASYNC_ACTIVE

ASYNC:
	timeout: run tick, goto ASYNC_PASSIVE

ASYNC_PASSIVE:
	before provide: run ticks

IDLE --[insert data]--> SYNC --[event loop tick]--> ASYNC_ACTIVE --[interval tick]-> ASYNC_PASSIVE
                                                          ^                             |
                                                          +---------[insert data]-------+
*/

const STORAGE_MODE_IDLE = 0;
const STORAGE_MODE_SYNC = 1;
const STORAGE_MODE_ASYNC = 2;

class CacheBackend {
	/**
	 * @param {number} duration max cache duration of items
	 * @param {any} provider async method
	 * @param {any} syncProvider sync method
	 * @param {any} providerContext call context for the provider methods
	 */
	constructor(duration, provider, syncProvider, providerContext) {
		this._duration = duration;
		this._provider = provider;
		this._syncProvider = syncProvider;
		this._providerContext = providerContext;
		/** @type {Map<string, (function(Error, any): void)[]>} */
		this._activeAsyncOperations = new Map();
		/** @type {Map<string, { err: Error, result: any, level: Set<string> }>} */
		this._data = new Map();
		/** @type {Set<string>[]} */
		this._levels = [];
		for (let i = 0; i < 10; i++) this._levels.push(new Set());
		for (let i = 5000; i < duration; i += 500) this._levels.push(new Set());
		this._currentLevel = 0;
		this._tickInterval = Math.floor(duration / this._levels.length);
		/** @type {STORAGE_MODE_IDLE | STORAGE_MODE_SYNC | STORAGE_MODE_ASYNC} */
		this._mode = STORAGE_MODE_IDLE;

		/** @type {NodeJS.Timeout | undefined} */
		this._timeout = undefined;
		/** @type {number | undefined} */
		this._nextDecay = undefined;

		this.provide = provider ? this.provide.bind(this) : null;
		this.provideSync = syncProvider ? this.provideSync.bind(this) : null;
	}

	provide(path, options, callback) {
		if (typeof options === "function") {
			callback = options;
			options = undefined;
		}
		if (typeof path !== "string") {
			callback(new TypeError("path must be a string"));
			return;
		}
		if (options) {
			return this._provider.call(
				this._providerContext,
				path,
				options,
				callback
			);
		}

		// When in sync mode we can move to async mode
		if (this._mode === STORAGE_MODE_SYNC) {
			this._enterAsyncMode();
		}

		// Check in cache
		let cacheEntry = this._data.get(path);
		if (cacheEntry !== undefined) {
			if (cacheEntry.err) return nextTick(callback, cacheEntry.err);
			return nextTick(callback, null, cacheEntry.result);
		}

		// Check if there is already the same operation running
		let callbacks = this._activeAsyncOperations.get(path);
		if (callbacks !== undefined) {
			callbacks.push(callback);
			return;
		}
		this._activeAsyncOperations.set(path, (callbacks = [callback]));

		// Run the operation
		this._provider.call(this._providerContext, path, (err, result) => {
			this._activeAsyncOperations.delete(path);
			this._storeResult(path, err, result);

			// Enter async mode if not yet done
			this._enterAsyncMode();

			runCallbacks(callbacks, err, result);
		});
	}

	provideSync(path, options) {
		if (typeof path !== "string") {
			throw new TypeError("path must be a string");
		}
		if (options) {
			return this._syncProvider.call(this._providerContext, path, options);
		}

		// In sync mode we may have to decay some cache items
		if (this._mode === STORAGE_MODE_SYNC) {
			this._runDecays();
		}

		// Check in cache
		let cacheEntry = this._data.get(path);
		if (cacheEntry !== undefined) {
			if (cacheEntry.err) throw cacheEntry.err;
			return cacheEntry.result;
		}

		// Get all active async operations
		// This sync operation will also complete them
		const callbacks = this._activeAsyncOperations.get(path);
		this._activeAsyncOperations.delete(path);

		// Run the operation
		// When in idle mode, we will enter sync mode
		let result;
		try {
			result = this._syncProvider.call(this._providerContext, path);
		} catch (err) {
			this._storeResult(path, err, undefined);
			this._enterSyncModeWhenIdle();
			if (callbacks) runCallbacks(callbacks, err, undefined);
			throw err;
		}
		this._storeResult(path, undefined, result);
		this._enterSyncModeWhenIdle();
		if (callbacks) runCallbacks(callbacks, undefined, result);
		return result;
	}

	purge(what) {
		if (!what) {
			if (this._mode !== STORAGE_MODE_IDLE) {
				this._data.clear();
				for (const level of this._levels) {
					level.clear();
				}
				this._enterIdleMode();
			}
		} else if (typeof what === "string") {
			for (let [key, data] of this._data) {
				if (key.startsWith(what)) {
					this._data.delete(key);
					data.level.delete(key);
				}
			}
			if (this._data.size === 0) {
				this._enterIdleMode();
			}
		} else {
			for (let [key, data] of this._data) {
				for (const item of what) {
					if (key.startsWith(item)) {
						this._data.delete(key);
						data.level.delete(key);
						break;
					}
				}
			}
			if (this._data.size === 0) {
				this._enterIdleMode();
			}
		}
	}

	purgeParent(what) {
		if (!what) {
			this.purge();
		} else if (typeof what === "string") {
			this.purge(dirname(what));
		} else {
			const set = new Set();
			for (const item of what) {
				set.add(dirname(item));
			}
			this.purge(set);
		}
	}

	_storeResult(path, err, result) {
		if (this._data.has(path)) return;
		const level = this._levels[this._currentLevel];
		this._data.set(path, { err, result, level });
		level.add(path);
	}

	_decayLevel() {
		const nextLevel = (this._currentLevel + 1) % this._levels.length;
		const decay = this._levels[nextLevel];
		this._currentLevel = nextLevel;
		for (let item of decay) {
			this._data.delete(item);
		}
		decay.clear();
		if (this._data.size === 0) {
			this._enterIdleMode();
		} else {
			// @ts-ignore _nextDecay is always a number in sync mode
			this._nextDecay += this._tickInterval;
		}
	}

	_runDecays() {
		while (
			/** @type {number} */ (this._nextDecay) <= Date.now() &&
			this._mode !== STORAGE_MODE_IDLE
		) {
			this._decayLevel();
		}
	}

	_enterAsyncMode() {
		let timeout = 0;
		switch (this._mode) {
			case STORAGE_MODE_ASYNC:
				return;
			case STORAGE_MODE_IDLE:
				this._nextDecay = Date.now() + this._tickInterval;
				timeout = this._tickInterval;
				break;
			case STORAGE_MODE_SYNC:
				this._runDecays();
				// @ts-ignore _runDecays may change the mode
				if (this._mode === STORAGE_MODE_IDLE) return;
				timeout = Math.max(
					0,
					/** @type {number} */ (this._nextDecay) - Date.now()
				);
				break;
		}
		this._mode = STORAGE_MODE_ASYNC;
		const ref = setTimeout(() => {
			this._mode = STORAGE_MODE_SYNC;
			this._runDecays();
		}, timeout);
		if (ref.unref) ref.unref();
		this._timeout = ref;
	}

	_enterSyncModeWhenIdle() {
		if (this._mode === STORAGE_MODE_IDLE) {
			this._mode = STORAGE_MODE_SYNC;
			this._nextDecay = Date.now() + this._tickInterval;
		}
	}

	_enterIdleMode() {
		this._mode = STORAGE_MODE_IDLE;
		this._nextDecay = undefined;
		if (this._timeout) clearTimeout(this._timeout);
	}
}

const createBackend = (duration, provider, syncProvider, providerContext) => {
	if (duration > 0) {
		return new CacheBackend(duration, provider, syncProvider, providerContext);
	}
	return new OperationMergerBackend(provider, syncProvider, providerContext);
};

module.exports = class CachedInputFileSystem {
	constructor(fileSystem, duration) {
		this.fileSystem = fileSystem;

		this._lstatBackend = createBackend(
			duration,
			this.fileSystem.lstat,
			this.fileSystem.lstatSync,
			this.fileSystem
		);
		const lstat = this._lstatBackend.provide;
		this.lstat = /** @type {FileSystem["lstat"]} */ (lstat);
		const lstatSync = this._lstatBackend.provideSync;
		this.lstatSync = /** @type {SyncFileSystem["lstatSync"]} */ (lstatSync);

		this._statBackend = createBackend(
			duration,
			this.fileSystem.stat,
			this.fileSystem.statSync,
			this.fileSystem
		);
		const stat = this._statBackend.provide;
		this.stat = /** @type {FileSystem["stat"]} */ (stat);
		const statSync = this._statBackend.provideSync;
		this.statSync = /** @type {SyncFileSystem["statSync"]} */ (statSync);

		this._readdirBackend = createBackend(
			duration,
			this.fileSystem.readdir,
			this.fileSystem.readdirSync,
			this.fileSystem
		);
		const readdir = this._readdirBackend.provide;
		this.readdir = /** @type {FileSystem["readdir"]} */ (readdir);
		const readdirSync = this._readdirBackend.provideSync;
		this.readdirSync = /** @type {SyncFileSystem["readdirSync"]} */ (readdirSync);

		this._readFileBackend = createBackend(
			duration,
			this.fileSystem.readFile,
			this.fileSystem.readFileSync,
			this.fileSystem
		);
		const readFile = this._readFileBackend.provide;
		this.readFile = /** @type {FileSystem["readFile"]} */ (readFile);
		const readFileSync = this._readFileBackend.provideSync;
		this.readFileSync = /** @type {SyncFileSystem["readFileSync"]} */ (readFileSync);

		this._readJsonBackend = createBackend(
			duration,
			this.fileSystem.readJson ||
				(this.readFile &&
					((path, callback) => {
						// @ts-ignore
						this.readFile(path, (err, buffer) => {
							if (err) return callback(err);
							if (!buffer || buffer.length === 0)
								return callback(new Error("No file content"));
							let data;
							try {
								data = JSON.parse(buffer.toString("utf-8"));
							} catch (e) {
								return callback(e);
							}
							callback(null, data);
						});
					})),
			this.fileSystem.readJsonSync ||
				(this.readFileSync &&
					(path => {
						const buffer = this.readFileSync(path);
						const data = JSON.parse(buffer.toString("utf-8"));
						return data;
					})),
			this.fileSystem
		);
		const readJson = this._readJsonBackend.provide;
		this.readJson = /** @type {FileSystem["readJson"]} */ (readJson);
		const readJsonSync = this._readJsonBackend.provideSync;
		this.readJsonSync = /** @type {SyncFileSystem["readJsonSync"]} */ (readJsonSync);

		this._readlinkBackend = createBackend(
			duration,
			this.fileSystem.readlink,
			this.fileSystem.readlinkSync,
			this.fileSystem
		);
		const readlink = this._readlinkBackend.provide;
		this.readlink = /** @type {FileSystem["readlink"]} */ (readlink);
		const readlinkSync = this._readlinkBackend.provideSync;
		this.readlinkSync = /** @type {SyncFileSystem["readlinkSync"]} */ (readlinkSync);
	}

	purge(what) {
		this._statBackend.purge(what);
		this._lstatBackend.purge(what);
		this._readdirBackend.purgeParent(what);
		this._readFileBackend.purge(what);
		this._readlinkBackend.purge(what);
		this._readJsonBackend.purge(what);
	}
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393371, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



const versions = require("process").versions;
const Resolver = require("./Resolver");
const { getType, PathType } = require("./util/path");

const SyncAsyncFileSystemDecorator = require("./SyncAsyncFileSystemDecorator");

const AliasFieldPlugin = require("./AliasFieldPlugin");
const AliasPlugin = require("./AliasPlugin");
const AppendPlugin = require("./AppendPlugin");
const ConditionalPlugin = require("./ConditionalPlugin");
const DescriptionFilePlugin = require("./DescriptionFilePlugin");
const DirectoryExistsPlugin = require("./DirectoryExistsPlugin");
const ExportsFieldPlugin = require("./ExportsFieldPlugin");
const FileExistsPlugin = require("./FileExistsPlugin");
const ImportsFieldPlugin = require("./ImportsFieldPlugin");
const JoinRequestPartPlugin = require("./JoinRequestPartPlugin");
const JoinRequestPlugin = require("./JoinRequestPlugin");
const MainFieldPlugin = require("./MainFieldPlugin");
const ModulesInHierarchicalDirectoriesPlugin = require("./ModulesInHierarchicalDirectoriesPlugin");
const ModulesInRootPlugin = require("./ModulesInRootPlugin");
const NextPlugin = require("./NextPlugin");
const ParsePlugin = require("./ParsePlugin");
const PnpPlugin = require("./PnpPlugin");
const RestrictionsPlugin = require("./RestrictionsPlugin");
const ResultPlugin = require("./ResultPlugin");
const RootsPlugin = require("./RootsPlugin");
const SelfReferencePlugin = require("./SelfReferencePlugin");
const SymlinkPlugin = require("./SymlinkPlugin");
const TryNextPlugin = require("./TryNextPlugin");
const UnsafeCachePlugin = require("./UnsafeCachePlugin");
const UseFilePlugin = require("./UseFilePlugin");

/** @typedef {import("./AliasPlugin").AliasOption} AliasOptionEntry */
/** @typedef {import("./PnpPlugin").PnpApiImpl} PnpApi */
/** @typedef {import("./Resolver").FileSystem} FileSystem */
/** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */
/** @typedef {import("./Resolver").SyncFileSystem} SyncFileSystem */

/** @typedef {string|string[]|false} AliasOptionNewRequest */
/** @typedef {{[k: string]: AliasOptionNewRequest}} AliasOptions */
/** @typedef {{apply: function(Resolver): void} | function(this: Resolver, Resolver): void} Plugin */

/**
 * @typedef {Object} UserResolveOptions
 * @property {(AliasOptions | AliasOptionEntry[])=} alias A list of module alias configurations or an object which maps key to value
 * @property {(AliasOptions | AliasOptionEntry[])=} fallback A list of module alias configurations or an object which maps key to value, applied only after modules option
 * @property {(string | string[])[]=} aliasFields A list of alias fields in description files
 * @property {(function(ResolveRequest): boolean)=} cachePredicate A function which decides whether a request should be cached or not. An object is passed with at least `path` and `request` properties.
 * @property {boolean=} cacheWithContext Whether or not the unsafeCache should include request context as part of the cache key.
 * @property {string[]=} descriptionFiles A list of description files to read from
 * @property {string[]=} conditionNames A list of exports field condition names.
 * @property {boolean=} enforceExtension Enforce that a extension from extensions must be used
 * @property {(string | string[])[]=} exportsFields A list of exports fields in description files
 * @property {(string | string[])[]=} importsFields A list of imports fields in description files
 * @property {string[]=} extensions A list of extensions which should be tried for files
 * @property {FileSystem} fileSystem The file system which should be used
 * @property {(object | boolean)=} unsafeCache Use this cache object to unsafely cache the successful requests
 * @property {boolean=} symlinks Resolve symlinks to their symlinked location
 * @property {Resolver=} resolver A prepared Resolver to which the plugins are attached
 * @property {string[] | string=} modules A list of directories to resolve modules from, can be absolute path or folder name
 * @property {(string | string[] | {name: string | string[], forceRelative: boolean})[]=} mainFields A list of main fields in description files
 * @property {string[]=} mainFiles  A list of main files in directories
 * @property {Plugin[]=} plugins A list of additional resolve plugins which should be applied
 * @property {PnpApi | null=} pnpApi A PnP API that should be used - null is "never", undefined is "auto"
 * @property {string[]=} roots A list of root paths
 * @property {boolean=} fullySpecified The request is already fully specified and no extensions or directories are resolved for it
 * @property {boolean=} resolveToContext Resolve to a context instead of a file
 * @property {(string|RegExp)[]=} restrictions A list of resolve restrictions
 * @property {boolean=} useSyncFileSystemCalls Use only the sync constraints of the file system calls
 * @property {boolean=} preferRelative Prefer to resolve module requests as relative requests before falling back to modules
 * @property {boolean=} preferAbsolute Prefer to resolve server-relative urls as absolute paths before falling back to resolve in roots
 */

/**
 * @typedef {Object} ResolveOptions
 * @property {AliasOptionEntry[]} alias
 * @property {AliasOptionEntry[]} fallback
 * @property {Set<string | string[]>} aliasFields
 * @property {(function(ResolveRequest): boolean)} cachePredicate
 * @property {boolean} cacheWithContext
 * @property {Set<string>} conditionNames A list of exports field condition names.
 * @property {string[]} descriptionFiles
 * @property {boolean} enforceExtension
 * @property {Set<string | string[]>} exportsFields
 * @property {Set<string | string[]>} importsFields
 * @property {Set<string>} extensions
 * @property {FileSystem} fileSystem
 * @property {object | false} unsafeCache
 * @property {boolean} symlinks
 * @property {Resolver=} resolver
 * @property {Array<string | string[]>} modules
 * @property {{name: string[], forceRelative: boolean}[]} mainFields
 * @property {Set<string>} mainFiles
 * @property {Plugin[]} plugins
 * @property {PnpApi | null} pnpApi
 * @property {Set<string>} roots
 * @property {boolean} fullySpecified
 * @property {boolean} resolveToContext
 * @property {Set<string|RegExp>} restrictions
 * @property {boolean} preferRelative
 * @property {boolean} preferAbsolute
 */

/**
 * @param {PnpApi | null=} option option
 * @returns {PnpApi | null} processed option
 */
function processPnpApiOption(option) {
	if (
		option === undefined &&
		/** @type {NodeJS.ProcessVersions & {pnp: string}} */ versions.pnp
	) {
		// @ts-ignore
		return require("pnpapi"); // eslint-disable-line node/no-missing-require
	}

	return option || null;
}

/**
 * @param {AliasOptions | AliasOptionEntry[] | undefined} alias alias
 * @returns {AliasOptionEntry[]} normalized aliases
 */
function normalizeAlias(alias) {
	return typeof alias === "object" && !Array.isArray(alias) && alias !== null
		? Object.keys(alias).map(key => {
				/** @type {AliasOptionEntry} */
				const obj = { name: key, onlyModule: false, alias: alias[key] };

				if (/\$$/.test(key)) {
					obj.onlyModule = true;
					obj.name = key.substr(0, key.length - 1);
				}

				return obj;
		  })
		: /** @type {Array<AliasOptionEntry>} */ (alias) || [];
}

/**
 * @param {UserResolveOptions} options input options
 * @returns {ResolveOptions} output options
 */
function createOptions(options) {
	const mainFieldsSet = new Set(options.mainFields || ["main"]);
	const mainFields = [];

	for (const item of mainFieldsSet) {
		if (typeof item === "string") {
			mainFields.push({
				name: [item],
				forceRelative: true
			});
		} else if (Array.isArray(item)) {
			mainFields.push({
				name: item,
				forceRelative: true
			});
		} else {
			mainFields.push({
				name: Array.isArray(item.name) ? item.name : [item.name],
				forceRelative: item.forceRelative
			});
		}
	}

	return {
		alias: normalizeAlias(options.alias),
		fallback: normalizeAlias(options.fallback),
		aliasFields: new Set(options.aliasFields),
		cachePredicate:
			options.cachePredicate ||
			function () {
				return true;
			},
		cacheWithContext:
			typeof options.cacheWithContext !== "undefined"
				? options.cacheWithContext
				: true,
		exportsFields: new Set(options.exportsFields || ["exports"]),
		importsFields: new Set(options.importsFields || ["imports"]),
		conditionNames: new Set(options.conditionNames),
		descriptionFiles: Array.from(
			new Set(options.descriptionFiles || ["package.json"])
		),
		enforceExtension:
			options.enforceExtension === undefined
				? options.extensions && options.extensions.includes("")
					? true
					: false
				: options.enforceExtension,
		extensions: new Set(options.extensions || [".js", ".json", ".node"]),
		fileSystem: options.useSyncFileSystemCalls
			? new SyncAsyncFileSystemDecorator(
					/** @type {SyncFileSystem} */ (
						/** @type {unknown} */ (options.fileSystem)
					)
			  )
			: options.fileSystem,
		unsafeCache:
			options.unsafeCache && typeof options.unsafeCache !== "object"
				? {}
				: options.unsafeCache || false,
		symlinks: typeof options.symlinks !== "undefined" ? options.symlinks : true,
		resolver: options.resolver,
		modules: mergeFilteredToArray(
			Array.isArray(options.modules)
				? options.modules
				: options.modules
				? [options.modules]
				: ["node_modules"],
			item => {
				const type = getType(item);
				return type === PathType.Normal || type === PathType.Relative;
			}
		),
		mainFields,
		mainFiles: new Set(options.mainFiles || ["index"]),
		plugins: options.plugins || [],
		pnpApi: processPnpApiOption(options.pnpApi),
		roots: new Set(options.roots || undefined),
		fullySpecified: options.fullySpecified || false,
		resolveToContext: options.resolveToContext || false,
		preferRelative: options.preferRelative || false,
		preferAbsolute: options.preferAbsolute || false,
		restrictions: new Set(options.restrictions)
	};
}

/**
 * @param {UserResolveOptions} options resolve options
 * @returns {Resolver} created resolver
 */
exports.createResolver = function (options) {
	const normalizedOptions = createOptions(options);

	const {
		alias,
		fallback,
		aliasFields,
		cachePredicate,
		cacheWithContext,
		conditionNames,
		descriptionFiles,
		enforceExtension,
		exportsFields,
		importsFields,
		extensions,
		fileSystem,
		fullySpecified,
		mainFields,
		mainFiles,
		modules,
		plugins: userPlugins,
		pnpApi,
		resolveToContext,
		preferRelative,
		preferAbsolute,
		symlinks,
		unsafeCache,
		resolver: customResolver,
		restrictions,
		roots
	} = normalizedOptions;

	const plugins = userPlugins.slice();

	const resolver = customResolver
		? customResolver
		: new Resolver(fileSystem, normalizedOptions);

	//// pipeline ////

	resolver.ensureHook("resolve");
	resolver.ensureHook("internalResolve");
	resolver.ensureHook("newInternalResolve");
	resolver.ensureHook("parsedResolve");
	resolver.ensureHook("describedResolve");
	resolver.ensureHook("internal");
	resolver.ensureHook("rawModule");
	resolver.ensureHook("module");
	resolver.ensureHook("resolveAsModule");
	resolver.ensureHook("undescribedResolveInPackage");
	resolver.ensureHook("resolveInPackage");
	resolver.ensureHook("resolveInExistingDirectory");
	resolver.ensureHook("relative");
	resolver.ensureHook("describedRelative");
	resolver.ensureHook("directory");
	resolver.ensureHook("undescribedExistingDirectory");
	resolver.ensureHook("existingDirectory");
	resolver.ensureHook("undescribedRawFile");
	resolver.ensureHook("rawFile");
	resolver.ensureHook("file");
	resolver.ensureHook("finalFile");
	resolver.ensureHook("existingFile");
	resolver.ensureHook("resolved");

	// TODO remove in next major
	// cspell:word Interal
	// Backward-compat
	resolver.hooks.newInteralResolve = resolver.hooks.newInternalResolve;

	// resolve
	for (const { source, resolveOptions } of [
		{ source: "resolve", resolveOptions: { fullySpecified } },
		{ source: "internal-resolve", resolveOptions: { fullySpecified: false } }
	]) {
		if (unsafeCache) {
			plugins.push(
				new UnsafeCachePlugin(
					source,
					cachePredicate,
					unsafeCache,
					cacheWithContext,
					`new-${source}`
				)
			);
			plugins.push(
				new ParsePlugin(`new-${source}`, resolveOptions, "parsed-resolve")
			);
		} else {
			plugins.push(new ParsePlugin(source, resolveOptions, "parsed-resolve"));
		}
	}

	// parsed-resolve
	plugins.push(
		new DescriptionFilePlugin(
			"parsed-resolve",
			descriptionFiles,
			false,
			"described-resolve"
		)
	);
	plugins.push(new NextPlugin("after-parsed-resolve", "described-resolve"));

	// described-resolve
	plugins.push(new NextPlugin("described-resolve", "normal-resolve"));
	if (fallback.length > 0) {
		plugins.push(
			new AliasPlugin("described-resolve", fallback, "internal-resolve")
		);
	}

	// normal-resolve
	if (alias.length > 0)
		plugins.push(new AliasPlugin("normal-resolve", alias, "internal-resolve"));
	aliasFields.forEach(item => {
		plugins.push(
			new AliasFieldPlugin("normal-resolve", item, "internal-resolve")
		);
	});
	if (preferRelative) {
		plugins.push(new JoinRequestPlugin("after-normal-resolve", "relative"));
	}
	plugins.push(
		new ConditionalPlugin(
			"after-normal-resolve",
			{ module: true },
			"resolve as module",
			false,
			"raw-module"
		)
	);
	plugins.push(
		new ConditionalPlugin(
			"after-normal-resolve",
			{ internal: true },
			"resolve as internal import",
			false,
			"internal"
		)
	);
	if (preferAbsolute) {
		plugins.push(new JoinRequestPlugin("after-normal-resolve", "relative"));
	}
	if (roots.size > 0) {
		plugins.push(new RootsPlugin("after-normal-resolve", roots, "relative"));
	}
	if (!preferRelative && !preferAbsolute) {
		plugins.push(new JoinRequestPlugin("after-normal-resolve", "relative"));
	}

	// internal
	importsFields.forEach(importsField => {
		plugins.push(
			new ImportsFieldPlugin(
				"internal",
				conditionNames,
				importsField,
				"relative",
				"internal-resolve"
			)
		);
	});

	// raw-module
	exportsFields.forEach(exportsField => {
		plugins.push(
			new SelfReferencePlugin("raw-module", exportsField, "resolve-as-module")
		);
	});
	modules.forEach(item => {
		if (Array.isArray(item)) {
			if (item.includes("node_modules") && pnpApi) {
				plugins.push(
					new ModulesInHierarchicalDirectoriesPlugin(
						"raw-module",
						item.filter(i => i !== "node_modules"),
						"module"
					)
				);
				plugins.push(
					new PnpPlugin("raw-module", pnpApi, "undescribed-resolve-in-package")
				);
			} else {
				plugins.push(
					new ModulesInHierarchicalDirectoriesPlugin(
						"raw-module",
						item,
						"module"
					)
				);
			}
		} else {
			plugins.push(new ModulesInRootPlugin("raw-module", item, "module"));
		}
	});

	// module
	plugins.push(new JoinRequestPartPlugin("module", "resolve-as-module"));

	// resolve-as-module
	if (!resolveToContext) {
		plugins.push(
			new ConditionalPlugin(
				"resolve-as-module",
				{ directory: false, request: "." },
				"single file module",
				true,
				"undescribed-raw-file"
			)
		);
	}
	plugins.push(
		new DirectoryExistsPlugin(
			"resolve-as-module",
			"undescribed-resolve-in-package"
		)
	);

	// undescribed-resolve-in-package
	plugins.push(
		new DescriptionFilePlugin(
			"undescribed-resolve-in-package",
			descriptionFiles,
			false,
			"resolve-in-package"
		)
	);
	plugins.push(
		new NextPlugin("after-undescribed-resolve-in-package", "resolve-in-package")
	);

	// resolve-in-package
	exportsFields.forEach(exportsField => {
		plugins.push(
			new ExportsFieldPlugin(
				"resolve-in-package",
				conditionNames,
				exportsField,
				"relative"
			)
		);
	});
	plugins.push(
		new NextPlugin("resolve-in-package", "resolve-in-existing-directory")
	);

	// resolve-in-existing-directory
	plugins.push(
		new JoinRequestPlugin("resolve-in-existing-directory", "relative")
	);

	// relative
	plugins.push(
		new DescriptionFilePlugin(
			"relative",
			descriptionFiles,
			true,
			"described-relative"
		)
	);
	plugins.push(new NextPlugin("after-relative", "described-relative"));

	// described-relative
	if (resolveToContext) {
		plugins.push(new NextPlugin("described-relative", "directory"));
	} else {
		plugins.push(
			new ConditionalPlugin(
				"described-relative",
				{ directory: false },
				null,
				true,
				"raw-file"
			)
		);
		plugins.push(
			new ConditionalPlugin(
				"described-relative",
				{ fullySpecified: false },
				"as directory",
				true,
				"directory"
			)
		);
	}

	// directory
	plugins.push(
		new DirectoryExistsPlugin("directory", "undescribed-existing-directory")
	);

	if (resolveToContext) {
		// undescribed-existing-directory
		plugins.push(new NextPlugin("undescribed-existing-directory", "resolved"));
	} else {
		// undescribed-existing-directory
		plugins.push(
			new DescriptionFilePlugin(
				"undescribed-existing-directory",
				descriptionFiles,
				false,
				"existing-directory"
			)
		);
		mainFiles.forEach(item => {
			plugins.push(
				new UseFilePlugin(
					"undescribed-existing-directory",
					item,
					"undescribed-raw-file"
				)
			);
		});

		// described-existing-directory
		mainFields.forEach(item => {
			plugins.push(
				new MainFieldPlugin(
					"existing-directory",
					item,
					"resolve-in-existing-directory"
				)
			);
		});
		mainFiles.forEach(item => {
			plugins.push(
				new UseFilePlugin("existing-directory", item, "undescribed-raw-file")
			);
		});

		// undescribed-raw-file
		plugins.push(
			new DescriptionFilePlugin(
				"undescribed-raw-file",
				descriptionFiles,
				true,
				"raw-file"
			)
		);
		plugins.push(new NextPlugin("after-undescribed-raw-file", "raw-file"));

		// raw-file
		plugins.push(
			new ConditionalPlugin(
				"raw-file",
				{ fullySpecified: true },
				null,
				false,
				"file"
			)
		);
		if (!enforceExtension) {
			plugins.push(new TryNextPlugin("raw-file", "no extension", "file"));
		}
		extensions.forEach(item => {
			plugins.push(new AppendPlugin("raw-file", item, "file"));
		});

		// file
		if (alias.length > 0)
			plugins.push(new AliasPlugin("file", alias, "internal-resolve"));
		aliasFields.forEach(item => {
			plugins.push(new AliasFieldPlugin("file", item, "internal-resolve"));
		});
		plugins.push(new NextPlugin("file", "final-file"));

		// final-file
		plugins.push(new FileExistsPlugin("final-file", "existing-file"));

		// existing-file
		if (symlinks)
			plugins.push(new SymlinkPlugin("existing-file", "existing-file"));
		plugins.push(new NextPlugin("existing-file", "resolved"));
	}

	// resolved
	if (restrictions.size > 0) {
		plugins.push(new RestrictionsPlugin(resolver.hooks.resolved, restrictions));
	}
	plugins.push(new ResultPlugin(resolver.hooks.resolved));

	//// RESOLVER ////

	for (const plugin of plugins) {
		if (typeof plugin === "function") {
			plugin.call(resolver, resolver);
		} else {
			plugin.apply(resolver);
		}
	}

	return resolver;
};

/**
 * Merging filtered elements
 * @param {string[]} array source array
 * @param {function(string): boolean} filter predicate
 * @returns {Array<string | string[]>} merge result
 */
function mergeFilteredToArray(array, filter) {
	/** @type {Array<string | string[]>} */
	const result = [];
	const set = new Set(array);

	for (const item of set) {
		if (filter(item)) {
			const lastElement =
				result.length > 0 ? result[result.length - 1] : undefined;
			if (Array.isArray(lastElement)) {
				lastElement.push(item);
			} else {
				result.push([item]);
			}
		} else {
			result.push(item);
		}
	}

	return result;
}

}, function(modId) { var map = {"./Resolver":1645497393372,"./util/path":1645497393375,"./SyncAsyncFileSystemDecorator":1645497393376,"./AliasFieldPlugin":1645497393377,"./AliasPlugin":1645497393381,"./AppendPlugin":1645497393382,"./ConditionalPlugin":1645497393383,"./DescriptionFilePlugin":1645497393384,"./DirectoryExistsPlugin":1645497393385,"./ExportsFieldPlugin":1645497393386,"./FileExistsPlugin":1645497393388,"./ImportsFieldPlugin":1645497393389,"./JoinRequestPartPlugin":1645497393390,"./JoinRequestPlugin":1645497393391,"./MainFieldPlugin":1645497393392,"./ModulesInHierarchicalDirectoriesPlugin":1645497393393,"./ModulesInRootPlugin":1645497393395,"./NextPlugin":1645497393396,"./ParsePlugin":1645497393397,"./PnpPlugin":1645497393398,"./RestrictionsPlugin":1645497393399,"./ResultPlugin":1645497393400,"./RootsPlugin":1645497393401,"./SelfReferencePlugin":1645497393402,"./SymlinkPlugin":1645497393403,"./TryNextPlugin":1645497393404,"./UnsafeCachePlugin":1645497393405,"./UseFilePlugin":1645497393406}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393372, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



const { AsyncSeriesBailHook, AsyncSeriesHook, SyncHook } = require("tapable");
const createInnerContext = require("./createInnerContext");
const { parseIdentifier } = require("./util/identifier");
const {
	normalize,
	cachedJoin: join,
	getType,
	PathType
} = require("./util/path");

/** @typedef {import("./ResolverFactory").ResolveOptions} ResolveOptions */

/**
 * @typedef {Object} FileSystemStats
 * @property {function(): boolean} isDirectory
 * @property {function(): boolean} isFile
 */

/**
 * @typedef {Object} FileSystemDirent
 * @property {Buffer | string} name
 * @property {function(): boolean} isDirectory
 * @property {function(): boolean} isFile
 */

/**
 * @typedef {Object} PossibleFileSystemError
 * @property {string=} code
 * @property {number=} errno
 * @property {string=} path
 * @property {string=} syscall
 */

/**
 * @template T
 * @callback FileSystemCallback
 * @param {PossibleFileSystemError & Error | null | undefined} err
 * @param {T=} result
 */

/**
 * @typedef {Object} FileSystem
 * @property {(function(string, FileSystemCallback<Buffer | string>): void) & function(string, object, FileSystemCallback<Buffer | string>): void} readFile
 * @property {(function(string, FileSystemCallback<(Buffer | string)[] | FileSystemDirent[]>): void) & function(string, object, FileSystemCallback<(Buffer | string)[] | FileSystemDirent[]>): void} readdir
 * @property {((function(string, FileSystemCallback<object>): void) & function(string, object, FileSystemCallback<object>): void)=} readJson
 * @property {(function(string, FileSystemCallback<Buffer | string>): void) & function(string, object, FileSystemCallback<Buffer | string>): void} readlink
 * @property {(function(string, FileSystemCallback<FileSystemStats>): void) & function(string, object, FileSystemCallback<Buffer | string>): void=} lstat
 * @property {(function(string, FileSystemCallback<FileSystemStats>): void) & function(string, object, FileSystemCallback<Buffer | string>): void} stat
 */

/**
 * @typedef {Object} SyncFileSystem
 * @property {function(string, object=): Buffer | string} readFileSync
 * @property {function(string, object=): (Buffer | string)[] | FileSystemDirent[]} readdirSync
 * @property {(function(string, object=): object)=} readJsonSync
 * @property {function(string, object=): Buffer | string} readlinkSync
 * @property {function(string, object=): FileSystemStats=} lstatSync
 * @property {function(string, object=): FileSystemStats} statSync
 */

/**
 * @typedef {Object} ParsedIdentifier
 * @property {string} request
 * @property {string} query
 * @property {string} fragment
 * @property {boolean} directory
 * @property {boolean} module
 * @property {boolean} file
 * @property {boolean} internal
 */

/**
 * @typedef {Object} BaseResolveRequest
 * @property {string | false} path
 * @property {string=} descriptionFilePath
 * @property {string=} descriptionFileRoot
 * @property {object=} descriptionFileData
 * @property {string=} relativePath
 * @property {boolean=} ignoreSymlinks
 * @property {boolean=} fullySpecified
 */

/** @typedef {BaseResolveRequest & Partial<ParsedIdentifier>} ResolveRequest */

/**
 * String with special formatting
 * @typedef {string} StackEntry
 */

/** @template T @typedef {{ add: (T) => void }} WriteOnlySet */

/**
 * Resolve context
 * @typedef {Object} ResolveContext
 * @property {WriteOnlySet<string>=} contextDependencies
 * @property {WriteOnlySet<string>=} fileDependencies files that was found on file system
 * @property {WriteOnlySet<string>=} missingDependencies dependencies that was not found on file system
 * @property {Set<StackEntry>=} stack set of hooks' calls. For instance, `resolve → parsedResolve → describedResolve`,
 * @property {(function(string): void)=} log log function
 * @property {(function (ResolveRequest): void)=} yield yield result, if provided plugins can return several results
 */

/** @typedef {AsyncSeriesBailHook<[ResolveRequest, ResolveContext], ResolveRequest | null>} ResolveStepHook */

/**
 * @param {string} str input string
 * @returns {string} in camel case
 */
function toCamelCase(str) {
	return str.replace(/-([a-z])/g, str => str.substr(1).toUpperCase());
}

class Resolver {
	/**
	 * @param {ResolveStepHook} hook hook
	 * @param {ResolveRequest} request request
	 * @returns {StackEntry} stack entry
	 */
	static createStackEntry(hook, request) {
		return (
			hook.name +
			": (" +
			request.path +
			") " +
			(request.request || "") +
			(request.query || "") +
			(request.fragment || "") +
			(request.directory ? " directory" : "") +
			(request.module ? " module" : "")
		);
	}

	/**
	 * @param {FileSystem} fileSystem a filesystem
	 * @param {ResolveOptions} options options
	 */
	constructor(fileSystem, options) {
		this.fileSystem = fileSystem;
		this.options = options;
		this.hooks = {
			/** @type {SyncHook<[ResolveStepHook, ResolveRequest], void>} */
			resolveStep: new SyncHook(["hook", "request"], "resolveStep"),
			/** @type {SyncHook<[ResolveRequest, Error]>} */
			noResolve: new SyncHook(["request", "error"], "noResolve"),
			/** @type {ResolveStepHook} */
			resolve: new AsyncSeriesBailHook(
				["request", "resolveContext"],
				"resolve"
			),
			/** @type {AsyncSeriesHook<[ResolveRequest, ResolveContext]>} */
			result: new AsyncSeriesHook(["result", "resolveContext"], "result")
		};
	}

	/**
	 * @param {string | ResolveStepHook} name hook name or hook itself
	 * @returns {ResolveStepHook} the hook
	 */
	ensureHook(name) {
		if (typeof name !== "string") {
			return name;
		}
		name = toCamelCase(name);
		if (/^before/.test(name)) {
			return /** @type {ResolveStepHook} */ (this.ensureHook(
				name[6].toLowerCase() + name.substr(7)
			).withOptions({
				stage: -10
			}));
		}
		if (/^after/.test(name)) {
			return /** @type {ResolveStepHook} */ (this.ensureHook(
				name[5].toLowerCase() + name.substr(6)
			).withOptions({
				stage: 10
			}));
		}
		const hook = this.hooks[name];
		if (!hook) {
			return (this.hooks[name] = new AsyncSeriesBailHook(
				["request", "resolveContext"],
				name
			));
		}
		return hook;
	}

	/**
	 * @param {string | ResolveStepHook} name hook name or hook itself
	 * @returns {ResolveStepHook} the hook
	 */
	getHook(name) {
		if (typeof name !== "string") {
			return name;
		}
		name = toCamelCase(name);
		if (/^before/.test(name)) {
			return /** @type {ResolveStepHook} */ (this.getHook(
				name[6].toLowerCase() + name.substr(7)
			).withOptions({
				stage: -10
			}));
		}
		if (/^after/.test(name)) {
			return /** @type {ResolveStepHook} */ (this.getHook(
				name[5].toLowerCase() + name.substr(6)
			).withOptions({
				stage: 10
			}));
		}
		const hook = this.hooks[name];
		if (!hook) {
			throw new Error(`Hook ${name} doesn't exist`);
		}
		return hook;
	}

	/**
	 * @param {object} context context information object
	 * @param {string} path context path
	 * @param {string} request request string
	 * @returns {string | false} result
	 */
	resolveSync(context, path, request) {
		/** @type {Error | null | undefined} */
		let err = undefined;
		/** @type {string | false | undefined} */
		let result = undefined;
		let sync = false;
		this.resolve(context, path, request, {}, (e, r) => {
			err = e;
			result = r;
			sync = true;
		});
		if (!sync) {
			throw new Error(
				"Cannot 'resolveSync' because the fileSystem is not sync. Use 'resolve'!"
			);
		}
		if (err) throw err;
		if (result === undefined) throw new Error("No result");
		return result;
	}

	/**
	 * @param {object} context context information object
	 * @param {string} path context path
	 * @param {string} request request string
	 * @param {ResolveContext} resolveContext resolve context
	 * @param {function(Error | null, (string|false)=, ResolveRequest=): void} callback callback function
	 * @returns {void}
	 */
	resolve(context, path, request, resolveContext, callback) {
		if (!context || typeof context !== "object")
			return callback(new Error("context argument is not an object"));
		if (typeof path !== "string")
			return callback(new Error("path argument is not a string"));
		if (typeof request !== "string")
			return callback(new Error("path argument is not a string"));
		if (!resolveContext)
			return callback(new Error("resolveContext argument is not set"));

		const obj = {
			context: context,
			path: path,
			request: request
		};

		let yield_;
		let yieldCalled = false;
		if (typeof resolveContext.yield === "function") {
			const old = resolveContext.yield;
			yield_ = obj => {
				yieldCalled = true;
				old(obj);
			};
		}

		const message = `resolve '${request}' in '${path}'`;

		const finishResolved = result => {
			return callback(
				null,
				result.path === false
					? false
					: `${result.path.replace(/#/g, "\0#")}${
							result.query ? result.query.replace(/#/g, "\0#") : ""
					  }${result.fragment || ""}`,
				result
			);
		};

		const finishWithoutResolve = log => {
			/**
			 * @type {Error & {details?: string}}
			 */
			const error = new Error("Can't " + message);
			error.details = log.join("\n");
			this.hooks.noResolve.call(obj, error);
			return callback(error);
		};

		if (resolveContext.log) {
			// We need log anyway to capture it in case of an error
			const parentLog = resolveContext.log;
			const log = [];
			return this.doResolve(
				this.hooks.resolve,
				obj,
				message,
				{
					log: msg => {
						parentLog(msg);
						log.push(msg);
					},
					yield: yield_,
					fileDependencies: resolveContext.fileDependencies,
					contextDependencies: resolveContext.contextDependencies,
					missingDependencies: resolveContext.missingDependencies,
					stack: resolveContext.stack
				},
				(err, result) => {
					if (err) return callback(err);

					if (result) return finishResolved(result);
					if (yieldCalled) return callback(null);

					return finishWithoutResolve(log);
				}
			);
		} else {
			// Try to resolve assuming there is no error
			// We don't log stuff in this case
			return this.doResolve(
				this.hooks.resolve,
				obj,
				message,
				{
					log: undefined,
					yield: yield_,
					fileDependencies: resolveContext.fileDependencies,
					contextDependencies: resolveContext.contextDependencies,
					missingDependencies: resolveContext.missingDependencies,
					stack: resolveContext.stack
				},
				(err, result) => {
					if (err) return callback(err);

					if (result) return finishResolved(result);
					if (yieldCalled) return callback(null);

					// log is missing for the error details
					// so we redo the resolving for the log info
					// this is more expensive to the success case
					// is assumed by default

					const log = [];

					return this.doResolve(
						this.hooks.resolve,
						obj,
						message,
						{
							log: msg => log.push(msg),
							yield: yield_,
							stack: resolveContext.stack
						},
						err => {
							if (err) return callback(err);

							// In a case that there is a race condition and yield will be called
							if (yieldCalled) return callback(null);

							return finishWithoutResolve(log);
						}
					);
				}
			);
		}
	}

	doResolve(hook, request, message, resolveContext, callback) {
		const stackEntry = Resolver.createStackEntry(hook, request);

		let newStack;
		if (resolveContext.stack) {
			newStack = new Set(resolveContext.stack);
			if (resolveContext.stack.has(stackEntry)) {
				/**
				 * Prevent recursion
				 * @type {Error & {recursion?: boolean}}
				 */
				const recursionError = new Error(
					"Recursion in resolving\nStack:\n  " +
						Array.from(newStack).join("\n  ")
				);
				recursionError.recursion = true;
				if (resolveContext.log)
					resolveContext.log("abort resolving because of recursion");
				return callback(recursionError);
			}
			newStack.add(stackEntry);
		} else {
			newStack = new Set([stackEntry]);
		}
		this.hooks.resolveStep.call(hook, request);

		if (hook.isUsed()) {
			const innerContext = createInnerContext(
				{
					log: resolveContext.log,
					yield: resolveContext.yield,
					fileDependencies: resolveContext.fileDependencies,
					contextDependencies: resolveContext.contextDependencies,
					missingDependencies: resolveContext.missingDependencies,
					stack: newStack
				},
				message
			);
			return hook.callAsync(request, innerContext, (err, result) => {
				if (err) return callback(err);
				if (result) return callback(null, result);
				callback();
			});
		} else {
			callback();
		}
	}

	/**
	 * @param {string} identifier identifier
	 * @returns {ParsedIdentifier} parsed identifier
	 */
	parse(identifier) {
		const part = {
			request: "",
			query: "",
			fragment: "",
			module: false,
			directory: false,
			file: false,
			internal: false
		};

		const parsedIdentifier = parseIdentifier(identifier);

		if (!parsedIdentifier) return part;

		[part.request, part.query, part.fragment] = parsedIdentifier;

		if (part.request.length > 0) {
			part.internal = this.isPrivate(identifier);
			part.module = this.isModule(part.request);
			part.directory = this.isDirectory(part.request);
			if (part.directory) {
				part.request = part.request.substr(0, part.request.length - 1);
			}
		}

		return part;
	}

	isModule(path) {
		return getType(path) === PathType.Normal;
	}

	isPrivate(path) {
		return getType(path) === PathType.Internal;
	}

	/**
	 * @param {string} path a path
	 * @returns {boolean} true, if the path is a directory path
	 */
	isDirectory(path) {
		return path.endsWith("/");
	}

	join(path, request) {
		return join(path, request);
	}

	normalize(path) {
		return normalize(path);
	}
}

module.exports = Resolver;

}, function(modId) { var map = {"./createInnerContext":1645497393373,"./util/identifier":1645497393374,"./util/path":1645497393375}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393373, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



module.exports = function createInnerContext(
	options,
	message,
	messageOptional
) {
	let messageReported = false;
	let innerLog = undefined;
	if (options.log) {
		if (message) {
			innerLog = msg => {
				if (!messageReported) {
					options.log(message);
					messageReported = true;
				}
				options.log("  " + msg);
			};
		} else {
			innerLog = options.log;
		}
	}
	const childContext = {
		log: innerLog,
		yield: options.yield,
		fileDependencies: options.fileDependencies,
		contextDependencies: options.contextDependencies,
		missingDependencies: options.missingDependencies,
		stack: options.stack
	};
	return childContext;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393374, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Ivan Kopeykin @vankop
*/



const PATH_QUERY_FRAGMENT_REGEXP = /^(#?(?:\0.|[^?#\0])*)(\?(?:\0.|[^#\0])*)?(#.*)?$/;

/**
 * @param {string} identifier identifier
 * @returns {[string, string, string]|null} parsed identifier
 */
function parseIdentifier(identifier) {
	const match = PATH_QUERY_FRAGMENT_REGEXP.exec(identifier);

	if (!match) return null;

	return [
		match[1].replace(/\0(.)/g, "$1"),
		match[2] ? match[2].replace(/\0(.)/g, "$1") : "",
		match[3] || ""
	];
}

module.exports.parseIdentifier = parseIdentifier;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393375, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



const path = require("path");

const CHAR_HASH = "#".charCodeAt(0);
const CHAR_SLASH = "/".charCodeAt(0);
const CHAR_BACKSLASH = "\\".charCodeAt(0);
const CHAR_A = "A".charCodeAt(0);
const CHAR_Z = "Z".charCodeAt(0);
const CHAR_LOWER_A = "a".charCodeAt(0);
const CHAR_LOWER_Z = "z".charCodeAt(0);
const CHAR_DOT = ".".charCodeAt(0);
const CHAR_COLON = ":".charCodeAt(0);

const posixNormalize = path.posix.normalize;
const winNormalize = path.win32.normalize;

/**
 * @enum {number}
 */
const PathType = Object.freeze({
	Empty: 0,
	Normal: 1,
	Relative: 2,
	AbsoluteWin: 3,
	AbsolutePosix: 4,
	Internal: 5
});
exports.PathType = PathType;

/**
 * @param {string} p a path
 * @returns {PathType} type of path
 */
const getType = p => {
	switch (p.length) {
		case 0:
			return PathType.Empty;
		case 1: {
			const c0 = p.charCodeAt(0);
			switch (c0) {
				case CHAR_DOT:
					return PathType.Relative;
				case CHAR_SLASH:
					return PathType.AbsolutePosix;
				case CHAR_HASH:
					return PathType.Internal;
			}
			return PathType.Normal;
		}
		case 2: {
			const c0 = p.charCodeAt(0);
			switch (c0) {
				case CHAR_DOT: {
					const c1 = p.charCodeAt(1);
					switch (c1) {
						case CHAR_DOT:
						case CHAR_SLASH:
							return PathType.Relative;
					}
					return PathType.Normal;
				}
				case CHAR_SLASH:
					return PathType.AbsolutePosix;
				case CHAR_HASH:
					return PathType.Internal;
			}
			const c1 = p.charCodeAt(1);
			if (c1 === CHAR_COLON) {
				if (
					(c0 >= CHAR_A && c0 <= CHAR_Z) ||
					(c0 >= CHAR_LOWER_A && c0 <= CHAR_LOWER_Z)
				) {
					return PathType.AbsoluteWin;
				}
			}
			return PathType.Normal;
		}
	}
	const c0 = p.charCodeAt(0);
	switch (c0) {
		case CHAR_DOT: {
			const c1 = p.charCodeAt(1);
			switch (c1) {
				case CHAR_SLASH:
					return PathType.Relative;
				case CHAR_DOT: {
					const c2 = p.charCodeAt(2);
					if (c2 === CHAR_SLASH) return PathType.Relative;
					return PathType.Normal;
				}
			}
			return PathType.Normal;
		}
		case CHAR_SLASH:
			return PathType.AbsolutePosix;
		case CHAR_HASH:
			return PathType.Internal;
	}
	const c1 = p.charCodeAt(1);
	if (c1 === CHAR_COLON) {
		const c2 = p.charCodeAt(2);
		if (
			(c2 === CHAR_BACKSLASH || c2 === CHAR_SLASH) &&
			((c0 >= CHAR_A && c0 <= CHAR_Z) ||
				(c0 >= CHAR_LOWER_A && c0 <= CHAR_LOWER_Z))
		) {
			return PathType.AbsoluteWin;
		}
	}
	return PathType.Normal;
};
exports.getType = getType;

/**
 * @param {string} p a path
 * @returns {string} the normalized path
 */
const normalize = p => {
	switch (getType(p)) {
		case PathType.Empty:
			return p;
		case PathType.AbsoluteWin:
			return winNormalize(p);
		case PathType.Relative: {
			const r = posixNormalize(p);
			return getType(r) === PathType.Relative ? r : `./${r}`;
		}
	}
	return posixNormalize(p);
};
exports.normalize = normalize;

/**
 * @param {string} rootPath the root path
 * @param {string | undefined} request the request path
 * @returns {string} the joined path
 */
const join = (rootPath, request) => {
	if (!request) return normalize(rootPath);
	const requestType = getType(request);
	switch (requestType) {
		case PathType.AbsolutePosix:
			return posixNormalize(request);
		case PathType.AbsoluteWin:
			return winNormalize(request);
	}
	switch (getType(rootPath)) {
		case PathType.Normal:
		case PathType.Relative:
		case PathType.AbsolutePosix:
			return posixNormalize(`${rootPath}/${request}`);
		case PathType.AbsoluteWin:
			return winNormalize(`${rootPath}\\${request}`);
	}
	switch (requestType) {
		case PathType.Empty:
			return rootPath;
		case PathType.Relative: {
			const r = posixNormalize(rootPath);
			return getType(r) === PathType.Relative ? r : `./${r}`;
		}
	}
	return posixNormalize(rootPath);
};
exports.join = join;

const joinCache = new Map();

/**
 * @param {string} rootPath the root path
 * @param {string | undefined} request the request path
 * @returns {string} the joined path
 */
const cachedJoin = (rootPath, request) => {
	let cacheEntry;
	let cache = joinCache.get(rootPath);
	if (cache === undefined) {
		joinCache.set(rootPath, (cache = new Map()));
	} else {
		cacheEntry = cache.get(request);
		if (cacheEntry !== undefined) return cacheEntry;
	}
	cacheEntry = join(rootPath, request);
	cache.set(request, cacheEntry);
	return cacheEntry;
};
exports.cachedJoin = cachedJoin;

const checkExportsFieldTarget = relativePath => {
	let lastNonSlashIndex = 2;
	let slashIndex = relativePath.indexOf("/", 2);
	let cd = 0;

	while (slashIndex !== -1) {
		const folder = relativePath.slice(lastNonSlashIndex, slashIndex);

		switch (folder) {
			case "..": {
				cd--;
				if (cd < 0)
					return new Error(
						`Trying to access out of package scope. Requesting ${relativePath}`
					);
				break;
			}
			default:
				cd++;
				break;
		}

		lastNonSlashIndex = slashIndex + 1;
		slashIndex = relativePath.indexOf("/", lastNonSlashIndex);
	}
};
exports.checkExportsFieldTarget = checkExportsFieldTarget;

}, function(modId) { var map = {"path":1645497393375}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393376, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



/** @typedef {import("./Resolver").FileSystem} FileSystem */
/** @typedef {import("./Resolver").SyncFileSystem} SyncFileSystem */

/**
 * @param {SyncFileSystem} fs file system implementation
 * @constructor
 */
function SyncAsyncFileSystemDecorator(fs) {
	this.fs = fs;

	this.lstat = undefined;
	this.lstatSync = undefined;
	const lstatSync = fs.lstatSync;
	if (lstatSync) {
		this.lstat = (arg, options, callback) => {
			let result;
			try {
				result = lstatSync.call(fs, arg);
			} catch (e) {
				return (callback || options)(e);
			}
			(callback || options)(null, result);
		};
		this.lstatSync = (arg, options) => lstatSync.call(fs, arg, options);
	}

	this.stat = (arg, options, callback) => {
		let result;
		try {
			result = callback ? fs.statSync(arg, options) : fs.statSync(arg);
		} catch (e) {
			return (callback || options)(e);
		}
		(callback || options)(null, result);
	};
	this.statSync = (arg, options) => fs.statSync(arg, options);

	this.readdir = (arg, options, callback) => {
		let result;
		try {
			result = fs.readdirSync(arg);
		} catch (e) {
			return (callback || options)(e);
		}
		(callback || options)(null, result);
	};
	this.readdirSync = (arg, options) => fs.readdirSync(arg, options);

	this.readFile = (arg, options, callback) => {
		let result;
		try {
			result = fs.readFileSync(arg);
		} catch (e) {
			return (callback || options)(e);
		}
		(callback || options)(null, result);
	};
	this.readFileSync = (arg, options) => fs.readFileSync(arg, options);

	this.readlink = (arg, options, callback) => {
		let result;
		try {
			result = fs.readlinkSync(arg);
		} catch (e) {
			return (callback || options)(e);
		}
		(callback || options)(null, result);
	};
	this.readlinkSync = (arg, options) => fs.readlinkSync(arg, options);

	this.readJson = undefined;
	this.readJsonSync = undefined;
	const readJsonSync = fs.readJsonSync;
	if (readJsonSync) {
		this.readJson = (arg, options, callback) => {
			let result;
			try {
				result = readJsonSync.call(fs, arg);
			} catch (e) {
				return (callback || options)(e);
			}
			(callback || options)(null, result);
		};

		this.readJsonSync = (arg, options) => readJsonSync.call(fs, arg, options);
	}
}
module.exports = SyncAsyncFileSystemDecorator;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393377, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



const DescriptionFileUtils = require("./DescriptionFileUtils");
const getInnerRequest = require("./getInnerRequest");

/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

module.exports = class AliasFieldPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | Array<string>} field field
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, field, target) {
		this.source = source;
		this.field = field;
		this.target = target;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("AliasFieldPlugin", (request, resolveContext, callback) => {
				if (!request.descriptionFileData) return callback();
				const innerRequest = getInnerRequest(resolver, request);
				if (!innerRequest) return callback();
				const fieldData = DescriptionFileUtils.getField(
					request.descriptionFileData,
					this.field
				);
				if (fieldData === null || typeof fieldData !== "object") {
					if (resolveContext.log)
						resolveContext.log(
							"Field '" +
								this.field +
								"' doesn't contain a valid alias configuration"
						);
					return callback();
				}
				const data1 = fieldData[innerRequest];
				const data2 = fieldData[innerRequest.replace(/^\.\//, "")];
				const data = typeof data1 !== "undefined" ? data1 : data2;
				if (data === innerRequest) return callback();
				if (data === undefined) return callback();
				if (data === false) {
					/** @type {ResolveRequest} */
					const ignoreObj = {
						...request,
						path: false
					};
					return callback(null, ignoreObj);
				}
				const obj = {
					...request,
					path: request.descriptionFileRoot,
					request: data,
					fullySpecified: false
				};
				resolver.doResolve(
					target,
					obj,
					"aliased from description file " +
						request.descriptionFilePath +
						" with mapping '" +
						innerRequest +
						"' to '" +
						data +
						"'",
					resolveContext,
					(err, result) => {
						if (err) return callback(err);

						// Don't allow other aliasing or raw request
						if (result === undefined) return callback(null, null);
						callback(null, result);
					}
				);
			});
	}
};

}, function(modId) { var map = {"./DescriptionFileUtils":1645497393378,"./getInnerRequest":1645497393380}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393378, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



const forEachBail = require("./forEachBail");

/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveContext} ResolveContext */

/**
 * @typedef {Object} DescriptionFileInfo
 * @property {any=} content
 * @property {string} path
 * @property {string} directory
 */

/**
 * @callback ErrorFirstCallback
 * @param {Error|null=} error
 * @param {DescriptionFileInfo=} result
 */

/**
 * @param {Resolver} resolver resolver
 * @param {string} directory directory
 * @param {string[]} filenames filenames
 * @param {DescriptionFileInfo|undefined} oldInfo oldInfo
 * @param {ResolveContext} resolveContext resolveContext
 * @param {ErrorFirstCallback} callback callback
 */
function loadDescriptionFile(
	resolver,
	directory,
	filenames,
	oldInfo,
	resolveContext,
	callback
) {
	(function findDescriptionFile() {
		if (oldInfo && oldInfo.directory === directory) {
			// We already have info for this directory and can reuse it
			return callback(null, oldInfo);
		}
		forEachBail(
			filenames,
			(filename, callback) => {
				const descriptionFilePath = resolver.join(directory, filename);
				if (resolver.fileSystem.readJson) {
					resolver.fileSystem.readJson(descriptionFilePath, (err, content) => {
						if (err) {
							if (typeof err.code !== "undefined") {
								if (resolveContext.missingDependencies) {
									resolveContext.missingDependencies.add(descriptionFilePath);
								}
								return callback();
							}
							if (resolveContext.fileDependencies) {
								resolveContext.fileDependencies.add(descriptionFilePath);
							}
							return onJson(err);
						}
						if (resolveContext.fileDependencies) {
							resolveContext.fileDependencies.add(descriptionFilePath);
						}
						onJson(null, content);
					});
				} else {
					resolver.fileSystem.readFile(descriptionFilePath, (err, content) => {
						if (err) {
							if (resolveContext.missingDependencies) {
								resolveContext.missingDependencies.add(descriptionFilePath);
							}
							return callback();
						}
						if (resolveContext.fileDependencies) {
							resolveContext.fileDependencies.add(descriptionFilePath);
						}
						let json;

						if (content) {
							try {
								json = JSON.parse(content.toString());
							} catch (e) {
								return onJson(e);
							}
						} else {
							return onJson(new Error("No content in file"));
						}

						onJson(null, json);
					});
				}

				function onJson(err, content) {
					if (err) {
						if (resolveContext.log)
							resolveContext.log(
								descriptionFilePath + " (directory description file): " + err
							);
						else
							err.message =
								descriptionFilePath + " (directory description file): " + err;
						return callback(err);
					}
					callback(null, {
						content,
						directory,
						path: descriptionFilePath
					});
				}
			},
			(err, result) => {
				if (err) return callback(err);
				if (result) {
					return callback(null, result);
				} else {
					const dir = cdUp(directory);
					if (!dir) {
						return callback();
					} else {
						directory = dir;
						return findDescriptionFile();
					}
				}
			}
		);
	})();
}

/**
 * @param {any} content content
 * @param {string|string[]} field field
 * @returns {object|string|number|boolean|undefined} field data
 */
function getField(content, field) {
	if (!content) return undefined;
	if (Array.isArray(field)) {
		let current = content;
		for (let j = 0; j < field.length; j++) {
			if (current === null || typeof current !== "object") {
				current = null;
				break;
			}
			current = current[field[j]];
		}
		return current;
	} else {
		return content[field];
	}
}

/**
 * @param {string} directory directory
 * @returns {string|null} parent directory or null
 */
function cdUp(directory) {
	if (directory === "/") return null;
	const i = directory.lastIndexOf("/"),
		j = directory.lastIndexOf("\\");
	const p = i < 0 ? j : j < 0 ? i : i < j ? j : i;
	if (p < 0) return null;
	return directory.substr(0, p || 1);
}

exports.loadDescriptionFile = loadDescriptionFile;
exports.getField = getField;
exports.cdUp = cdUp;

}, function(modId) { var map = {"./forEachBail":1645497393379}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393379, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



module.exports = function forEachBail(array, iterator, callback) {
	if (array.length === 0) return callback();

	let i = 0;
	const next = () => {
		let loop = undefined;
		iterator(array[i++], (err, result) => {
			if (err || result !== undefined || i >= array.length) {
				return callback(err, result);
			}
			if (loop === false) while (next());
			loop = true;
		});
		if (!loop) loop = false;
		return loop;
	};
	while (next());
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393380, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



module.exports = function getInnerRequest(resolver, request) {
	if (
		typeof request.__innerRequest === "string" &&
		request.__innerRequest_request === request.request &&
		request.__innerRequest_relativePath === request.relativePath
	)
		return request.__innerRequest;
	let innerRequest;
	if (request.request) {
		innerRequest = request.request;
		if (/^\.\.?(?:\/|$)/.test(innerRequest) && request.relativePath) {
			innerRequest = resolver.join(request.relativePath, innerRequest);
		}
	} else {
		innerRequest = request.relativePath;
	}
	request.__innerRequest_request = request.request;
	request.__innerRequest_relativePath = request.relativePath;
	return (request.__innerRequest = innerRequest);
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393381, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



const forEachBail = require("./forEachBail");

/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */
/** @typedef {{alias: string|Array<string>|false, name: string, onlyModule?: boolean}} AliasOption */

module.exports = class AliasPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {AliasOption | Array<AliasOption>} options options
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, options, target) {
		this.source = source;
		this.options = Array.isArray(options) ? options : [options];
		this.target = target;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("AliasPlugin", (request, resolveContext, callback) => {
				const innerRequest = request.request || request.path;
				if (!innerRequest) return callback();
				forEachBail(
					this.options,
					(item, callback) => {
						let shouldStop = false;
						if (
							innerRequest === item.name ||
							(!item.onlyModule && innerRequest.startsWith(item.name + "/"))
						) {
							const remainingRequest = innerRequest.substr(item.name.length);
							const resolveWithAlias = (alias, callback) => {
								if (alias === false) {
									const ignoreObj = {
										...request,
										path: false
									};
									return callback(null, ignoreObj);
								}
								if (
									innerRequest !== alias &&
									!innerRequest.startsWith(alias + "/")
								) {
									shouldStop = true;
									const newRequestStr = alias + remainingRequest;
									const obj = {
										...request,
										request: newRequestStr,
										fullySpecified: false
									};
									return resolver.doResolve(
										target,
										obj,
										"aliased with mapping '" +
											item.name +
											"': '" +
											alias +
											"' to '" +
											newRequestStr +
											"'",
										resolveContext,
										(err, result) => {
											if (err) return callback(err);
											if (result) return callback(null, result);
											return callback();
										}
									);
								}
								return callback();
							};
							const stoppingCallback = (err, result) => {
								if (err) return callback(err);

								if (result) return callback(null, result);
								// Don't allow other aliasing or raw request
								if (shouldStop) return callback(null, null);
								return callback();
							};
							if (Array.isArray(item.alias)) {
								return forEachBail(
									item.alias,
									resolveWithAlias,
									stoppingCallback
								);
							} else {
								return resolveWithAlias(item.alias, stoppingCallback);
							}
						}
						return callback();
					},
					callback
				);
			});
	}
};

}, function(modId) { var map = {"./forEachBail":1645497393379}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393382, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

module.exports = class AppendPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string} appending appending
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, appending, target) {
		this.source = source;
		this.appending = appending;
		this.target = target;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("AppendPlugin", (request, resolveContext, callback) => {
				const obj = {
					...request,
					path: request.path + this.appending,
					relativePath:
						request.relativePath && request.relativePath + this.appending
				};
				resolver.doResolve(
					target,
					obj,
					this.appending,
					resolveContext,
					callback
				);
			});
	}
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393383, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

module.exports = class ConditionalPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {Partial<ResolveRequest>} test compare object
	 * @param {string | null} message log message
	 * @param {boolean} allowAlternatives when false, do not continue with the current step when "test" matches
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, test, message, allowAlternatives, target) {
		this.source = source;
		this.test = test;
		this.message = message;
		this.allowAlternatives = allowAlternatives;
		this.target = target;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		const { test, message, allowAlternatives } = this;
		const keys = Object.keys(test);
		resolver
			.getHook(this.source)
			.tapAsync("ConditionalPlugin", (request, resolveContext, callback) => {
				for (const prop of keys) {
					if (request[prop] !== test[prop]) return callback();
				}
				resolver.doResolve(
					target,
					request,
					message,
					resolveContext,
					allowAlternatives
						? callback
						: (err, result) => {
								if (err) return callback(err);

								// Don't allow other alternatives
								if (result === undefined) return callback(null, null);
								callback(null, result);
						  }
				);
			});
	}
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393384, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



const DescriptionFileUtils = require("./DescriptionFileUtils");

/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

module.exports = class DescriptionFilePlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string[]} filenames filenames
	 * @param {boolean} pathIsFile pathIsFile
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, filenames, pathIsFile, target) {
		this.source = source;
		this.filenames = filenames;
		this.pathIsFile = pathIsFile;
		this.target = target;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync(
				"DescriptionFilePlugin",
				(request, resolveContext, callback) => {
					const path = request.path;
					if (!path) return callback();
					const directory = this.pathIsFile
						? DescriptionFileUtils.cdUp(path)
						: path;
					if (!directory) return callback();
					DescriptionFileUtils.loadDescriptionFile(
						resolver,
						directory,
						this.filenames,
						request.descriptionFilePath
							? {
									path: request.descriptionFilePath,
									content: request.descriptionFileData,
									directory: /** @type {string} */ (request.descriptionFileRoot)
							  }
							: undefined,
						resolveContext,
						(err, result) => {
							if (err) return callback(err);
							if (!result) {
								if (resolveContext.log)
									resolveContext.log(
										`No description file found in ${directory} or above`
									);
								return callback();
							}
							const relativePath =
								"." + path.substr(result.directory.length).replace(/\\/g, "/");
							const obj = {
								...request,
								descriptionFilePath: result.path,
								descriptionFileData: result.content,
								descriptionFileRoot: result.directory,
								relativePath: relativePath
							};
							resolver.doResolve(
								target,
								obj,
								"using description file: " +
									result.path +
									" (relative path: " +
									relativePath +
									")",
								resolveContext,
								(err, result) => {
									if (err) return callback(err);

									// Don't allow other processing
									if (result === undefined) return callback(null, null);
									callback(null, result);
								}
							);
						}
					);
				}
			);
	}
};

}, function(modId) { var map = {"./DescriptionFileUtils":1645497393378}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393385, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

module.exports = class DirectoryExistsPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, target) {
		this.source = source;
		this.target = target;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync(
				"DirectoryExistsPlugin",
				(request, resolveContext, callback) => {
					const fs = resolver.fileSystem;
					const directory = request.path;
					if (!directory) return callback();
					fs.stat(directory, (err, stat) => {
						if (err || !stat) {
							if (resolveContext.missingDependencies)
								resolveContext.missingDependencies.add(directory);
							if (resolveContext.log)
								resolveContext.log(directory + " doesn't exist");
							return callback();
						}
						if (!stat.isDirectory()) {
							if (resolveContext.missingDependencies)
								resolveContext.missingDependencies.add(directory);
							if (resolveContext.log)
								resolveContext.log(directory + " is not a directory");
							return callback();
						}
						if (resolveContext.fileDependencies)
							resolveContext.fileDependencies.add(directory);
						resolver.doResolve(
							target,
							request,
							`existing directory ${directory}`,
							resolveContext,
							callback
						);
					});
				}
			);
	}
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393386, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Ivan Kopeykin @vankop
*/



const path = require("path");
const DescriptionFileUtils = require("./DescriptionFileUtils");
const forEachBail = require("./forEachBail");
const { processExportsField } = require("./util/entrypoints");
const { parseIdentifier } = require("./util/identifier");
const { checkExportsFieldTarget } = require("./util/path");

/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */
/** @typedef {import("./util/entrypoints").ExportsField} ExportsField */
/** @typedef {import("./util/entrypoints").FieldProcessor} FieldProcessor */

module.exports = class ExportsFieldPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {Set<string>} conditionNames condition names
	 * @param {string | string[]} fieldNamePath name path
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, conditionNames, fieldNamePath, target) {
		this.source = source;
		this.target = target;
		this.conditionNames = conditionNames;
		this.fieldName = fieldNamePath;
		/** @type {WeakMap<any, FieldProcessor>} */
		this.fieldProcessorCache = new WeakMap();
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("ExportsFieldPlugin", (request, resolveContext, callback) => {
				// When there is no description file, abort
				if (!request.descriptionFilePath) return callback();
				if (
					// When the description file is inherited from parent, abort
					// (There is no description file inside of this package)
					request.relativePath !== "." ||
					request.request === undefined
				)
					return callback();

				const remainingRequest =
					request.query || request.fragment
						? (request.request === "." ? "./" : request.request) +
						  request.query +
						  request.fragment
						: request.request;
				/** @type {ExportsField|null} */
				const exportsField = DescriptionFileUtils.getField(
					request.descriptionFileData,
					this.fieldName
				);
				if (!exportsField) return callback();

				if (request.directory) {
					return callback(
						new Error(
							`Resolving to directories is not possible with the exports field (request was ${remainingRequest}/)`
						)
					);
				}

				let paths;

				try {
					// We attach the cache to the description file instead of the exportsField value
					// because we use a WeakMap and the exportsField could be a string too.
					// Description file is always an object when exports field can be accessed.
					let fieldProcessor = this.fieldProcessorCache.get(
						request.descriptionFileData
					);
					if (fieldProcessor === undefined) {
						fieldProcessor = processExportsField(exportsField);
						this.fieldProcessorCache.set(
							request.descriptionFileData,
							fieldProcessor
						);
					}
					paths = fieldProcessor(remainingRequest, this.conditionNames);
				} catch (err) {
					if (resolveContext.log) {
						resolveContext.log(
							`Exports field in ${request.descriptionFilePath} can't be processed: ${err}`
						);
					}
					return callback(err);
				}

				if (paths.length === 0) {
					return callback(
						new Error(
							`Package path ${remainingRequest} is not exported from package ${request.descriptionFileRoot} (see exports field in ${request.descriptionFilePath})`
						)
					);
				}

				forEachBail(
					paths,
					(p, callback) => {
						const parsedIdentifier = parseIdentifier(p);

						if (!parsedIdentifier) return callback();

						const [relativePath, query, fragment] = parsedIdentifier;

						const error = checkExportsFieldTarget(relativePath);

						if (error) {
							return callback(error);
						}

						const obj = {
							...request,
							request: undefined,
							path: path.join(
								/** @type {string} */ (request.descriptionFileRoot),
								relativePath
							),
							relativePath,
							query,
							fragment
						};

						resolver.doResolve(
							target,
							obj,
							"using exports field: " + p,
							resolveContext,
							callback
						);
					},
					(err, result) => callback(err, result || null)
				);
			});
	}
};

}, function(modId) { var map = {"./DescriptionFileUtils":1645497393378,"./forEachBail":1645497393379,"./util/entrypoints":1645497393387,"./util/identifier":1645497393374,"./util/path":1645497393375}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393387, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Ivan Kopeykin @vankop
*/



/** @typedef {string|(string|ConditionalMapping)[]} DirectMapping */
/** @typedef {{[k: string]: MappingValue}} ConditionalMapping */
/** @typedef {ConditionalMapping|DirectMapping|null} MappingValue */
/** @typedef {Record<string, MappingValue>|ConditionalMapping|DirectMapping} ExportsField */
/** @typedef {Record<string, MappingValue>} ImportsField */

/**
 * @typedef {Object} PathTreeNode
 * @property {Map<string, PathTreeNode>|null} children
 * @property {MappingValue} folder
 * @property {Map<string, MappingValue>|null} wildcards
 * @property {Map<string, MappingValue>} files
 */

/**
 * Processing exports/imports field
 * @callback FieldProcessor
 * @param {string} request request
 * @param {Set<string>} conditionNames condition names
 * @returns {string[]} resolved paths
 */

/*
Example exports field:
{
  ".": "./main.js",
  "./feature": {
    "browser": "./feature-browser.js",
    "default": "./feature.js"
  }
}
Terminology:

Enhanced-resolve name keys ("." and "./feature") as exports field keys.

If value is string or string[], mapping is called as a direct mapping
and value called as a direct export.

If value is key-value object, mapping is called as a conditional mapping
and value called as a conditional export.

Key in conditional mapping is called condition name.

Conditional mapping nested in another conditional mapping is called nested mapping.

----------

Example imports field:
{
  "#a": "./main.js",
  "#moment": {
    "browser": "./moment/index.js",
    "default": "moment"
  },
  "#moment/": {
    "browser": "./moment/",
    "default": "moment/"
  }
}
Terminology:

Enhanced-resolve name keys ("#a" and "#moment/", "#moment") as imports field keys.

If value is string or string[], mapping is called as a direct mapping
and value called as a direct export.

If value is key-value object, mapping is called as a conditional mapping
and value called as a conditional export.

Key in conditional mapping is called condition name.

Conditional mapping nested in another conditional mapping is called nested mapping.

*/

const slashCode = "/".charCodeAt(0);
const dotCode = ".".charCodeAt(0);
const hashCode = "#".charCodeAt(0);

/**
 * @param {ExportsField} exportsField the exports field
 * @returns {FieldProcessor} process callback
 */
module.exports.processExportsField = function processExportsField(
	exportsField
) {
	return createFieldProcessor(
		buildExportsFieldPathTree(exportsField),
		assertExportsFieldRequest,
		assertExportTarget
	);
};

/**
 * @param {ImportsField} importsField the exports field
 * @returns {FieldProcessor} process callback
 */
module.exports.processImportsField = function processImportsField(
	importsField
) {
	return createFieldProcessor(
		buildImportsFieldPathTree(importsField),
		assertImportsFieldRequest,
		assertImportTarget
	);
};

/**
 * @param {PathTreeNode} treeRoot root
 * @param {(s: string) => string} assertRequest assertRequest
 * @param {(s: string, f: boolean) => void} assertTarget assertTarget
 * @returns {FieldProcessor} field processor
 */
function createFieldProcessor(treeRoot, assertRequest, assertTarget) {
	return function fieldProcessor(request, conditionNames) {
		request = assertRequest(request);

		const match = findMatch(request, treeRoot);

		if (match === null) return [];

		const [mapping, remainRequestIndex] = match;

		/** @type {DirectMapping|null} */
		let direct = null;

		if (isConditionalMapping(mapping)) {
			direct = conditionalMapping(
				/** @type {ConditionalMapping} */ (mapping),
				conditionNames
			);

			// matching not found
			if (direct === null) return [];
		} else {
			direct = /** @type {DirectMapping} */ (mapping);
		}

		const remainingRequest =
			remainRequestIndex === request.length + 1
				? undefined
				: remainRequestIndex < 0
				? request.slice(-remainRequestIndex - 1)
				: request.slice(remainRequestIndex);

		return directMapping(
			remainingRequest,
			remainRequestIndex < 0,
			direct,
			conditionNames,
			assertTarget
		);
	};
}

/**
 * @param {string} request request
 * @returns {string} updated request
 */
function assertExportsFieldRequest(request) {
	if (request.charCodeAt(0) !== dotCode) {
		throw new Error('Request should be relative path and start with "."');
	}
	if (request.length === 1) return "";
	if (request.charCodeAt(1) !== slashCode) {
		throw new Error('Request should be relative path and start with "./"');
	}
	if (request.charCodeAt(request.length - 1) === slashCode) {
		throw new Error("Only requesting file allowed");
	}

	return request.slice(2);
}

/**
 * @param {string} request request
 * @returns {string} updated request
 */
function assertImportsFieldRequest(request) {
	if (request.charCodeAt(0) !== hashCode) {
		throw new Error('Request should start with "#"');
	}
	if (request.length === 1) {
		throw new Error("Request should have at least 2 characters");
	}
	if (request.charCodeAt(1) === slashCode) {
		throw new Error('Request should not start with "#/"');
	}
	if (request.charCodeAt(request.length - 1) === slashCode) {
		throw new Error("Only requesting file allowed");
	}

	return request.slice(1);
}

/**
 * @param {string} exp export target
 * @param {boolean} expectFolder is folder expected
 */
function assertExportTarget(exp, expectFolder) {
	if (
		exp.charCodeAt(0) === slashCode ||
		(exp.charCodeAt(0) === dotCode && exp.charCodeAt(1) !== slashCode)
	) {
		throw new Error(
			`Export should be relative path and start with "./", got ${JSON.stringify(
				exp
			)}.`
		);
	}

	const isFolder = exp.charCodeAt(exp.length - 1) === slashCode;

	if (isFolder !== expectFolder) {
		throw new Error(
			expectFolder
				? `Expecting folder to folder mapping. ${JSON.stringify(
						exp
				  )} should end with "/"`
				: `Expecting file to file mapping. ${JSON.stringify(
						exp
				  )} should not end with "/"`
		);
	}
}

/**
 * @param {string} imp import target
 * @param {boolean} expectFolder is folder expected
 */
function assertImportTarget(imp, expectFolder) {
	const isFolder = imp.charCodeAt(imp.length - 1) === slashCode;

	if (isFolder !== expectFolder) {
		throw new Error(
			expectFolder
				? `Expecting folder to folder mapping. ${JSON.stringify(
						imp
				  )} should end with "/"`
				: `Expecting file to file mapping. ${JSON.stringify(
						imp
				  )} should not end with "/"`
		);
	}
}

/**
 * Trying to match request to field
 * @param {string} request request
 * @param {PathTreeNode} treeRoot path tree root
 * @returns {[MappingValue, number]|null} match or null, number is negative and one less when it's a folder mapping, number is request.length + 1 for direct mappings
 */
function findMatch(request, treeRoot) {
	if (request.length === 0) {
		const value = treeRoot.files.get("");

		return value ? [value, 1] : null;
	}

	if (
		treeRoot.children === null &&
		treeRoot.folder === null &&
		treeRoot.wildcards === null
	) {
		const value = treeRoot.files.get(request);

		return value ? [value, request.length + 1] : null;
	}

	let node = treeRoot;
	let lastNonSlashIndex = 0;
	let slashIndex = request.indexOf("/", 0);

	/** @type {[MappingValue, number]|null} */
	let lastFolderMatch = null;

	const applyFolderMapping = () => {
		const folderMapping = node.folder;
		if (folderMapping) {
			if (lastFolderMatch) {
				lastFolderMatch[0] = folderMapping;
				lastFolderMatch[1] = -lastNonSlashIndex - 1;
			} else {
				lastFolderMatch = [folderMapping, -lastNonSlashIndex - 1];
			}
		}
	};

	const applyWildcardMappings = (wildcardMappings, remainingRequest) => {
		if (wildcardMappings) {
			for (const [key, target] of wildcardMappings) {
				if (remainingRequest.startsWith(key)) {
					if (!lastFolderMatch) {
						lastFolderMatch = [target, lastNonSlashIndex + key.length];
					} else if (lastFolderMatch[1] < lastNonSlashIndex + key.length) {
						lastFolderMatch[0] = target;
						lastFolderMatch[1] = lastNonSlashIndex + key.length;
					}
				}
			}
		}
	};

	while (slashIndex !== -1) {
		applyFolderMapping();

		const wildcardMappings = node.wildcards;

		if (!wildcardMappings && node.children === null) return lastFolderMatch;

		const folder = request.slice(lastNonSlashIndex, slashIndex);

		applyWildcardMappings(wildcardMappings, folder);

		if (node.children === null) return lastFolderMatch;

		const newNode = node.children.get(folder);

		if (!newNode) {
			return lastFolderMatch;
		}

		node = newNode;
		lastNonSlashIndex = slashIndex + 1;
		slashIndex = request.indexOf("/", lastNonSlashIndex);
	}

	const remainingRequest =
		lastNonSlashIndex > 0 ? request.slice(lastNonSlashIndex) : request;

	const value = node.files.get(remainingRequest);

	if (value) {
		return [value, request.length + 1];
	}

	applyFolderMapping();

	applyWildcardMappings(node.wildcards, remainingRequest);

	return lastFolderMatch;
}

/**
 * @param {ConditionalMapping|DirectMapping|null} mapping mapping
 * @returns {boolean} is conditional mapping
 */
function isConditionalMapping(mapping) {
	return (
		mapping !== null && typeof mapping === "object" && !Array.isArray(mapping)
	);
}

/**
 * @param {string|undefined} remainingRequest remaining request when folder mapping, undefined for file mappings
 * @param {boolean} subpathMapping true, for subpath mappings
 * @param {DirectMapping|null} mappingTarget direct export
 * @param {Set<string>} conditionNames condition names
 * @param {(d: string, f: boolean) => void} assert asserting direct value
 * @returns {string[]} mapping result
 */
function directMapping(
	remainingRequest,
	subpathMapping,
	mappingTarget,
	conditionNames,
	assert
) {
	if (mappingTarget === null) return [];

	if (typeof mappingTarget === "string") {
		return [
			targetMapping(remainingRequest, subpathMapping, mappingTarget, assert)
		];
	}

	const targets = [];

	for (const exp of mappingTarget) {
		if (typeof exp === "string") {
			targets.push(
				targetMapping(remainingRequest, subpathMapping, exp, assert)
			);
			continue;
		}

		const mapping = conditionalMapping(exp, conditionNames);
		if (!mapping) continue;
		const innerExports = directMapping(
			remainingRequest,
			subpathMapping,
			mapping,
			conditionNames,
			assert
		);
		for (const innerExport of innerExports) {
			targets.push(innerExport);
		}
	}

	return targets;
}

/**
 * @param {string|undefined} remainingRequest remaining request when folder mapping, undefined for file mappings
 * @param {boolean} subpathMapping true, for subpath mappings
 * @param {string} mappingTarget direct export
 * @param {(d: string, f: boolean) => void} assert asserting direct value
 * @returns {string} mapping result
 */
function targetMapping(
	remainingRequest,
	subpathMapping,
	mappingTarget,
	assert
) {
	if (remainingRequest === undefined) {
		assert(mappingTarget, false);
		return mappingTarget;
	}
	if (subpathMapping) {
		assert(mappingTarget, true);
		return mappingTarget + remainingRequest;
	}
	assert(mappingTarget, false);
	return mappingTarget.replace(/\*/g, remainingRequest.replace(/\$/g, "$$"));
}

/**
 * @param {ConditionalMapping} conditionalMapping_ conditional mapping
 * @param {Set<string>} conditionNames condition names
 * @returns {DirectMapping|null} direct mapping if found
 */
function conditionalMapping(conditionalMapping_, conditionNames) {
	/** @type {[ConditionalMapping, string[], number][]} */
	let lookup = [[conditionalMapping_, Object.keys(conditionalMapping_), 0]];

	loop: while (lookup.length > 0) {
		const [mapping, conditions, j] = lookup[lookup.length - 1];
		const last = conditions.length - 1;

		for (let i = j; i < conditions.length; i++) {
			const condition = conditions[i];

			// assert default. Could be last only
			if (i !== last) {
				if (condition === "default") {
					throw new Error("Default condition should be last one");
				}
			} else if (condition === "default") {
				const innerMapping = mapping[condition];
				// is nested
				if (isConditionalMapping(innerMapping)) {
					const conditionalMapping = /** @type {ConditionalMapping} */ (innerMapping);
					lookup[lookup.length - 1][2] = i + 1;
					lookup.push([conditionalMapping, Object.keys(conditionalMapping), 0]);
					continue loop;
				}

				return /** @type {DirectMapping} */ (innerMapping);
			}

			if (conditionNames.has(condition)) {
				const innerMapping = mapping[condition];
				// is nested
				if (isConditionalMapping(innerMapping)) {
					const conditionalMapping = /** @type {ConditionalMapping} */ (innerMapping);
					lookup[lookup.length - 1][2] = i + 1;
					lookup.push([conditionalMapping, Object.keys(conditionalMapping), 0]);
					continue loop;
				}

				return /** @type {DirectMapping} */ (innerMapping);
			}
		}

		lookup.pop();
	}

	return null;
}

/**
 * Internal helper to create path tree node
 * to ensure that each node gets the same hidden class
 * @returns {PathTreeNode} node
 */
function createNode() {
	return {
		children: null,
		folder: null,
		wildcards: null,
		files: new Map()
	};
}

/**
 * Internal helper for building path tree
 * @param {PathTreeNode} root root
 * @param {string} path path
 * @param {MappingValue} target target
 */
function walkPath(root, path, target) {
	if (path.length === 0) {
		root.folder = target;
		return;
	}

	let node = root;
	// Typical path tree can looks like
	// root
	// - files: ["a.js", "b.js"]
	// - children:
	//    node1:
	//    - files: ["a.js", "b.js"]
	let lastNonSlashIndex = 0;
	let slashIndex = path.indexOf("/", 0);

	while (slashIndex !== -1) {
		const folder = path.slice(lastNonSlashIndex, slashIndex);
		let newNode;

		if (node.children === null) {
			newNode = createNode();
			node.children = new Map();
			node.children.set(folder, newNode);
		} else {
			newNode = node.children.get(folder);

			if (!newNode) {
				newNode = createNode();
				node.children.set(folder, newNode);
			}
		}

		node = newNode;
		lastNonSlashIndex = slashIndex + 1;
		slashIndex = path.indexOf("/", lastNonSlashIndex);
	}

	if (lastNonSlashIndex >= path.length) {
		node.folder = target;
	} else {
		const file = lastNonSlashIndex > 0 ? path.slice(lastNonSlashIndex) : path;
		if (file.endsWith("*")) {
			if (node.wildcards === null) node.wildcards = new Map();
			node.wildcards.set(file.slice(0, -1), target);
		} else {
			node.files.set(file, target);
		}
	}
}

/**
 * @param {ExportsField} field exports field
 * @returns {PathTreeNode} tree root
 */
function buildExportsFieldPathTree(field) {
	const root = createNode();

	// handle syntax sugar, if exports field is direct mapping for "."
	if (typeof field === "string") {
		root.files.set("", field);

		return root;
	} else if (Array.isArray(field)) {
		root.files.set("", field.slice());

		return root;
	}

	const keys = Object.keys(field);

	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];

		if (key.charCodeAt(0) !== dotCode) {
			// handle syntax sugar, if exports field is conditional mapping for "."
			if (i === 0) {
				while (i < keys.length) {
					const charCode = keys[i].charCodeAt(0);
					if (charCode === dotCode || charCode === slashCode) {
						throw new Error(
							`Exports field key should be relative path and start with "." (key: ${JSON.stringify(
								key
							)})`
						);
					}
					i++;
				}

				root.files.set("", field);
				return root;
			}

			throw new Error(
				`Exports field key should be relative path and start with "." (key: ${JSON.stringify(
					key
				)})`
			);
		}

		if (key.length === 1) {
			root.files.set("", field[key]);
			continue;
		}

		if (key.charCodeAt(1) !== slashCode) {
			throw new Error(
				`Exports field key should be relative path and start with "./" (key: ${JSON.stringify(
					key
				)})`
			);
		}

		walkPath(root, key.slice(2), field[key]);
	}

	return root;
}

/**
 * @param {ImportsField} field imports field
 * @returns {PathTreeNode} root
 */
function buildImportsFieldPathTree(field) {
	const root = createNode();

	const keys = Object.keys(field);

	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];

		if (key.charCodeAt(0) !== hashCode) {
			throw new Error(
				`Imports field key should start with "#" (key: ${JSON.stringify(key)})`
			);
		}

		if (key.length === 1) {
			throw new Error(
				`Imports field key should have at least 2 characters (key: ${JSON.stringify(
					key
				)})`
			);
		}

		if (key.charCodeAt(1) === slashCode) {
			throw new Error(
				`Imports field key should not start with "#/" (key: ${JSON.stringify(
					key
				)})`
			);
		}

		walkPath(root, key.slice(1), field[key]);
	}

	return root;
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393388, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

module.exports = class FileExistsPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, target) {
		this.source = source;
		this.target = target;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		const fs = resolver.fileSystem;
		resolver
			.getHook(this.source)
			.tapAsync("FileExistsPlugin", (request, resolveContext, callback) => {
				const file = request.path;
				if (!file) return callback();
				fs.stat(file, (err, stat) => {
					if (err || !stat) {
						if (resolveContext.missingDependencies)
							resolveContext.missingDependencies.add(file);
						if (resolveContext.log) resolveContext.log(file + " doesn't exist");
						return callback();
					}
					if (!stat.isFile()) {
						if (resolveContext.missingDependencies)
							resolveContext.missingDependencies.add(file);
						if (resolveContext.log) resolveContext.log(file + " is not a file");
						return callback();
					}
					if (resolveContext.fileDependencies)
						resolveContext.fileDependencies.add(file);
					resolver.doResolve(
						target,
						request,
						"existing file: " + file,
						resolveContext,
						callback
					);
				});
			});
	}
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393389, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Ivan Kopeykin @vankop
*/



const path = require("path");
const DescriptionFileUtils = require("./DescriptionFileUtils");
const forEachBail = require("./forEachBail");
const { processImportsField } = require("./util/entrypoints");
const { parseIdentifier } = require("./util/identifier");

/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */
/** @typedef {import("./util/entrypoints").FieldProcessor} FieldProcessor */
/** @typedef {import("./util/entrypoints").ImportsField} ImportsField */

const dotCode = ".".charCodeAt(0);

module.exports = class ImportsFieldPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {Set<string>} conditionNames condition names
	 * @param {string | string[]} fieldNamePath name path
	 * @param {string | ResolveStepHook} targetFile target file
	 * @param {string | ResolveStepHook} targetPackage target package
	 */
	constructor(
		source,
		conditionNames,
		fieldNamePath,
		targetFile,
		targetPackage
	) {
		this.source = source;
		this.targetFile = targetFile;
		this.targetPackage = targetPackage;
		this.conditionNames = conditionNames;
		this.fieldName = fieldNamePath;
		/** @type {WeakMap<any, FieldProcessor>} */
		this.fieldProcessorCache = new WeakMap();
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const targetFile = resolver.ensureHook(this.targetFile);
		const targetPackage = resolver.ensureHook(this.targetPackage);

		resolver
			.getHook(this.source)
			.tapAsync("ImportsFieldPlugin", (request, resolveContext, callback) => {
				// When there is no description file, abort
				if (!request.descriptionFilePath || request.request === undefined) {
					return callback();
				}

				const remainingRequest =
					request.request + request.query + request.fragment;
				/** @type {ImportsField|null} */
				const importsField = DescriptionFileUtils.getField(
					request.descriptionFileData,
					this.fieldName
				);
				if (!importsField) return callback();

				if (request.directory) {
					return callback(
						new Error(
							`Resolving to directories is not possible with the imports field (request was ${remainingRequest}/)`
						)
					);
				}

				let paths;

				try {
					// We attach the cache to the description file instead of the importsField value
					// because we use a WeakMap and the importsField could be a string too.
					// Description file is always an object when exports field can be accessed.
					let fieldProcessor = this.fieldProcessorCache.get(
						request.descriptionFileData
					);
					if (fieldProcessor === undefined) {
						fieldProcessor = processImportsField(importsField);
						this.fieldProcessorCache.set(
							request.descriptionFileData,
							fieldProcessor
						);
					}
					paths = fieldProcessor(remainingRequest, this.conditionNames);
				} catch (err) {
					if (resolveContext.log) {
						resolveContext.log(
							`Imports field in ${request.descriptionFilePath} can't be processed: ${err}`
						);
					}
					return callback(err);
				}

				if (paths.length === 0) {
					return callback(
						new Error(
							`Package import ${remainingRequest} is not imported from package ${request.descriptionFileRoot} (see imports field in ${request.descriptionFilePath})`
						)
					);
				}

				forEachBail(
					paths,
					(p, callback) => {
						const parsedIdentifier = parseIdentifier(p);

						if (!parsedIdentifier) return callback();

						const [path_, query, fragment] = parsedIdentifier;

						switch (path_.charCodeAt(0)) {
							// should be relative
							case dotCode: {
								const obj = {
									...request,
									request: undefined,
									path: path.join(
										/** @type {string} */ (request.descriptionFileRoot),
										path_
									),
									relativePath: path_,
									query,
									fragment
								};

								resolver.doResolve(
									targetFile,
									obj,
									"using imports field: " + p,
									resolveContext,
									callback
								);
								break;
							}

							// package resolving
							default: {
								const obj = {
									...request,
									request: path_,
									relativePath: path_,
									fullySpecified: true,
									query,
									fragment
								};

								resolver.doResolve(
									targetPackage,
									obj,
									"using imports field: " + p,
									resolveContext,
									callback
								);
							}
						}
					},
					(err, result) => callback(err, result || null)
				);
			});
	}
};

}, function(modId) { var map = {"./DescriptionFileUtils":1645497393378,"./forEachBail":1645497393379,"./util/entrypoints":1645497393387,"./util/identifier":1645497393374}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393390, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

const namespaceStartCharCode = "@".charCodeAt(0);

module.exports = class JoinRequestPartPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, target) {
		this.source = source;
		this.target = target;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync(
				"JoinRequestPartPlugin",
				(request, resolveContext, callback) => {
					const req = request.request || "";
					let i = req.indexOf("/", 3);

					if (i >= 0 && req.charCodeAt(2) === namespaceStartCharCode) {
						i = req.indexOf("/", i + 1);
					}

					let moduleName, remainingRequest, fullySpecified;
					if (i < 0) {
						moduleName = req;
						remainingRequest = ".";
						fullySpecified = false;
					} else {
						moduleName = req.slice(0, i);
						remainingRequest = "." + req.slice(i);
						fullySpecified = request.fullySpecified;
					}
					const obj = {
						...request,
						path: resolver.join(request.path, moduleName),
						relativePath:
							request.relativePath &&
							resolver.join(request.relativePath, moduleName),
						request: remainingRequest,
						fullySpecified
					};
					resolver.doResolve(target, obj, null, resolveContext, callback);
				}
			);
	}
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393391, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

module.exports = class JoinRequestPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, target) {
		this.source = source;
		this.target = target;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("JoinRequestPlugin", (request, resolveContext, callback) => {
				const obj = {
					...request,
					path: resolver.join(request.path, request.request),
					relativePath:
						request.relativePath &&
						resolver.join(request.relativePath, request.request),
					request: undefined
				};
				resolver.doResolve(target, obj, null, resolveContext, callback);
			});
	}
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393392, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



const path = require("path");
const DescriptionFileUtils = require("./DescriptionFileUtils");

/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */
/** @typedef {{name: string|Array<string>, forceRelative: boolean}} MainFieldOptions */

const alreadyTriedMainField = Symbol("alreadyTriedMainField");

module.exports = class MainFieldPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {MainFieldOptions} options options
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, options, target) {
		this.source = source;
		this.options = options;
		this.target = target;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("MainFieldPlugin", (request, resolveContext, callback) => {
				if (
					request.path !== request.descriptionFileRoot ||
					request[alreadyTriedMainField] === request.descriptionFilePath ||
					!request.descriptionFilePath
				)
					return callback();
				const filename = path.basename(request.descriptionFilePath);
				let mainModule = DescriptionFileUtils.getField(
					request.descriptionFileData,
					this.options.name
				);

				if (
					!mainModule ||
					typeof mainModule !== "string" ||
					mainModule === "." ||
					mainModule === "./"
				) {
					return callback();
				}
				if (this.options.forceRelative && !/^\.\.?\//.test(mainModule))
					mainModule = "./" + mainModule;
				const obj = {
					...request,
					request: mainModule,
					module: false,
					directory: mainModule.endsWith("/"),
					[alreadyTriedMainField]: request.descriptionFilePath
				};
				return resolver.doResolve(
					target,
					obj,
					"use " +
						mainModule +
						" from " +
						this.options.name +
						" in " +
						filename,
					resolveContext,
					callback
				);
			});
	}
};

}, function(modId) { var map = {"./DescriptionFileUtils":1645497393378}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393393, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



const forEachBail = require("./forEachBail");
const getPaths = require("./getPaths");

/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

module.exports = class ModulesInHierarchicalDirectoriesPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | Array<string>} directories directories
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, directories, target) {
		this.source = source;
		this.directories = /** @type {Array<string>} */ ([]).concat(directories);
		this.target = target;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync(
				"ModulesInHierarchicalDirectoriesPlugin",
				(request, resolveContext, callback) => {
					const fs = resolver.fileSystem;
					const addrs = getPaths(request.path)
						.paths.map(p => {
							return this.directories.map(d => resolver.join(p, d));
						})
						.reduce((array, p) => {
							array.push.apply(array, p);
							return array;
						}, []);
					forEachBail(
						addrs,
						(addr, callback) => {
							fs.stat(addr, (err, stat) => {
								if (!err && stat && stat.isDirectory()) {
									const obj = {
										...request,
										path: addr,
										request: "./" + request.request,
										module: false
									};
									const message = "looking for modules in " + addr;
									return resolver.doResolve(
										target,
										obj,
										message,
										resolveContext,
										callback
									);
								}
								if (resolveContext.log)
									resolveContext.log(
										addr + " doesn't exist or is not a directory"
									);
								if (resolveContext.missingDependencies)
									resolveContext.missingDependencies.add(addr);
								return callback();
							});
						},
						callback
					);
				}
			);
	}
};

}, function(modId) { var map = {"./forEachBail":1645497393379,"./getPaths":1645497393394}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393394, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



module.exports = function getPaths(path) {
	if (path === "/") return { paths: ["/"], segments: [""] };
	const parts = path.split(/(.*?[\\/]+)/);
	const paths = [path];
	const segments = [parts[parts.length - 1]];
	let part = parts[parts.length - 1];
	path = path.substr(0, path.length - part.length - 1);
	for (let i = parts.length - 2; i > 2; i -= 2) {
		paths.push(path);
		part = parts[i];
		path = path.substr(0, path.length - part.length) || "/";
		segments.push(part.substr(0, part.length - 1));
	}
	part = parts[1];
	segments.push(part);
	paths.push(part);
	return {
		paths: paths,
		segments: segments
	};
};

module.exports.basename = function basename(path) {
	const i = path.lastIndexOf("/"),
		j = path.lastIndexOf("\\");
	const p = i < 0 ? j : j < 0 ? i : i < j ? j : i;
	if (p < 0) return null;
	const s = path.substr(p + 1);
	return s;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393395, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

module.exports = class ModulesInRootPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string} path path
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, path, target) {
		this.source = source;
		this.path = path;
		this.target = target;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("ModulesInRootPlugin", (request, resolveContext, callback) => {
				const obj = {
					...request,
					path: this.path,
					request: "./" + request.request,
					module: false
				};
				resolver.doResolve(
					target,
					obj,
					"looking for modules in " + this.path,
					resolveContext,
					callback
				);
			});
	}
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393396, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

module.exports = class NextPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, target) {
		this.source = source;
		this.target = target;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("NextPlugin", (request, resolveContext, callback) => {
				resolver.doResolve(target, request, null, resolveContext, callback);
			});
	}
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393397, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

module.exports = class ParsePlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {Partial<ResolveRequest>} requestOptions request options
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, requestOptions, target) {
		this.source = source;
		this.requestOptions = requestOptions;
		this.target = target;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("ParsePlugin", (request, resolveContext, callback) => {
				const parsed = resolver.parse(/** @type {string} */ (request.request));
				const obj = { ...request, ...parsed, ...this.requestOptions };
				if (request.query && !parsed.query) {
					obj.query = request.query;
				}
				if (request.fragment && !parsed.fragment) {
					obj.fragment = request.fragment;
				}
				if (parsed && resolveContext.log) {
					if (parsed.module) resolveContext.log("Parsed request is a module");
					if (parsed.directory)
						resolveContext.log("Parsed request is a directory");
				}
				// There is an edge-case where a request with # can be a path or a fragment -> try both
				if (obj.request && !obj.query && obj.fragment) {
					const directory = obj.fragment.endsWith("/");
					const alternative = {
						...obj,
						directory,
						request:
							obj.request +
							(obj.directory ? "/" : "") +
							(directory ? obj.fragment.slice(0, -1) : obj.fragment),
						fragment: ""
					};
					resolver.doResolve(
						target,
						alternative,
						null,
						resolveContext,
						(err, result) => {
							if (err) return callback(err);
							if (result) return callback(null, result);
							resolver.doResolve(target, obj, null, resolveContext, callback);
						}
					);
					return;
				}
				resolver.doResolve(target, obj, null, resolveContext, callback);
			});
	}
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393398, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Maël Nison @arcanis
*/



/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */
/**
 * @typedef {Object} PnpApiImpl
 * @property {function(string, string, object): string} resolveToUnqualified
 */

module.exports = class PnpPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {PnpApiImpl} pnpApi pnpApi
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, pnpApi, target) {
		this.source = source;
		this.pnpApi = pnpApi;
		this.target = target;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("PnpPlugin", (request, resolveContext, callback) => {
				const req = request.request;
				if (!req) return callback();

				// The trailing slash indicates to PnP that this value is a folder rather than a file
				const issuer = `${request.path}/`;

				const packageMatch = /^(@[^/]+\/)?[^/]+/.exec(req);
				if (!packageMatch) return callback();

				const packageName = packageMatch[0];
				const innerRequest = `.${req.slice(packageName.length)}`;

				let resolution;
				let apiResolution;
				try {
					resolution = this.pnpApi.resolveToUnqualified(packageName, issuer, {
						considerBuiltins: false
					});
					if (resolveContext.fileDependencies) {
						apiResolution = this.pnpApi.resolveToUnqualified("pnpapi", issuer, {
							considerBuiltins: false
						});
					}
				} catch (error) {
					if (
						error.code === "MODULE_NOT_FOUND" &&
						error.pnpCode === "UNDECLARED_DEPENDENCY"
					) {
						// This is not a PnP managed dependency.
						// Try to continue resolving with our alternatives
						if (resolveContext.log) {
							resolveContext.log(`request is not managed by the pnpapi`);
							for (const line of error.message.split("\n").filter(Boolean))
								resolveContext.log(`  ${line}`);
						}
						return callback();
					}
					return callback(error);
				}

				if (resolution === packageName) return callback();

				if (apiResolution && resolveContext.fileDependencies) {
					resolveContext.fileDependencies.add(apiResolution);
				}

				const obj = {
					...request,
					path: resolution,
					request: innerRequest,
					ignoreSymlinks: true,
					fullySpecified: request.fullySpecified && innerRequest !== "."
				};
				resolver.doResolve(
					target,
					obj,
					`resolved by pnp to ${resolution}`,
					resolveContext,
					(err, result) => {
						if (err) return callback(err);
						if (result) return callback(null, result);
						// Skip alternatives
						return callback(null, null);
					}
				);
			});
	}
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393399, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Ivan Kopeykin @vankop
*/



/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

const slashCode = "/".charCodeAt(0);
const backslashCode = "\\".charCodeAt(0);

const isInside = (path, parent) => {
	if (!path.startsWith(parent)) return false;
	if (path.length === parent.length) return true;
	const charCode = path.charCodeAt(parent.length);
	return charCode === slashCode || charCode === backslashCode;
};

module.exports = class RestrictionsPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {Set<string | RegExp>} restrictions restrictions
	 */
	constructor(source, restrictions) {
		this.source = source;
		this.restrictions = restrictions;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		resolver
			.getHook(this.source)
			.tapAsync("RestrictionsPlugin", (request, resolveContext, callback) => {
				if (typeof request.path === "string") {
					const path = request.path;
					for (const rule of this.restrictions) {
						if (typeof rule === "string") {
							if (!isInside(path, rule)) {
								if (resolveContext.log) {
									resolveContext.log(
										`${path} is not inside of the restriction ${rule}`
									);
								}
								return callback(null, null);
							}
						} else if (!rule.test(path)) {
							if (resolveContext.log) {
								resolveContext.log(
									`${path} doesn't match the restriction ${rule}`
								);
							}
							return callback(null, null);
						}
					}
				}

				callback();
			});
	}
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393400, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

module.exports = class ResultPlugin {
	/**
	 * @param {ResolveStepHook} source source
	 */
	constructor(source) {
		this.source = source;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		this.source.tapAsync(
			"ResultPlugin",
			(request, resolverContext, callback) => {
				const obj = { ...request };
				if (resolverContext.log)
					resolverContext.log("reporting result " + obj.path);
				resolver.hooks.result.callAsync(obj, resolverContext, err => {
					if (err) return callback(err);
					if (typeof resolverContext.yield === "function") {
						resolverContext.yield(obj);
						callback(null, null);
					} else {
						callback(null, obj);
					}
				});
			}
		);
	}
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393401, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Ivan Kopeykin @vankop
*/



const forEachBail = require("./forEachBail");

/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

class RootsPlugin {
	/**
	 * @param {string | ResolveStepHook} source source hook
	 * @param {Set<string>} roots roots
	 * @param {string | ResolveStepHook} target target hook
	 */
	constructor(source, roots, target) {
		this.roots = Array.from(roots);
		this.source = source;
		this.target = target;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);

		resolver
			.getHook(this.source)
			.tapAsync("RootsPlugin", (request, resolveContext, callback) => {
				const req = request.request;
				if (!req) return callback();
				if (!req.startsWith("/")) return callback();

				forEachBail(
					this.roots,
					(root, callback) => {
						const path = resolver.join(root, req.slice(1));
						const obj = {
							...request,
							path,
							relativePath: request.relativePath && path
						};
						resolver.doResolve(
							target,
							obj,
							`root path ${root}`,
							resolveContext,
							callback
						);
					},
					callback
				);
			});
	}
}

module.exports = RootsPlugin;

}, function(modId) { var map = {"./forEachBail":1645497393379}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393402, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



const DescriptionFileUtils = require("./DescriptionFileUtils");

/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

const slashCode = "/".charCodeAt(0);

module.exports = class SelfReferencePlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | string[]} fieldNamePath name path
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, fieldNamePath, target) {
		this.source = source;
		this.target = target;
		this.fieldName = fieldNamePath;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("SelfReferencePlugin", (request, resolveContext, callback) => {
				if (!request.descriptionFilePath) return callback();

				const req = request.request;
				if (!req) return callback();

				// Feature is only enabled when an exports field is present
				const exportsField = DescriptionFileUtils.getField(
					request.descriptionFileData,
					this.fieldName
				);
				if (!exportsField) return callback();

				const name = DescriptionFileUtils.getField(
					request.descriptionFileData,
					"name"
				);
				if (typeof name !== "string") return callback();

				if (
					req.startsWith(name) &&
					(req.length === name.length ||
						req.charCodeAt(name.length) === slashCode)
				) {
					const remainingRequest = `.${req.slice(name.length)}`;

					const obj = {
						...request,
						request: remainingRequest,
						path: /** @type {string} */ (request.descriptionFileRoot),
						relativePath: "."
					};

					resolver.doResolve(
						target,
						obj,
						"self reference",
						resolveContext,
						callback
					);
				} else {
					return callback();
				}
			});
	}
};

}, function(modId) { var map = {"./DescriptionFileUtils":1645497393378}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393403, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



const forEachBail = require("./forEachBail");
const getPaths = require("./getPaths");
const { getType, PathType } = require("./util/path");

/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

module.exports = class SymlinkPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, target) {
		this.source = source;
		this.target = target;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		const fs = resolver.fileSystem;
		resolver
			.getHook(this.source)
			.tapAsync("SymlinkPlugin", (request, resolveContext, callback) => {
				if (request.ignoreSymlinks) return callback();
				const pathsResult = getPaths(request.path);
				const pathSegments = pathsResult.segments;
				const paths = pathsResult.paths;

				let containsSymlink = false;
				let idx = -1;
				forEachBail(
					paths,
					(path, callback) => {
						idx++;
						if (resolveContext.fileDependencies)
							resolveContext.fileDependencies.add(path);
						fs.readlink(path, (err, result) => {
							if (!err && result) {
								pathSegments[idx] = result;
								containsSymlink = true;
								// Shortcut when absolute symlink found
								const resultType = getType(result.toString());
								if (
									resultType === PathType.AbsoluteWin ||
									resultType === PathType.AbsolutePosix
								) {
									return callback(null, idx);
								}
							}
							callback();
						});
					},
					(err, idx) => {
						if (!containsSymlink) return callback();
						const resultSegments =
							typeof idx === "number"
								? pathSegments.slice(0, idx + 1)
								: pathSegments.slice();
						const result = resultSegments.reduceRight((a, b) => {
							return resolver.join(a, b);
						});
						const obj = {
							...request,
							path: result
						};
						resolver.doResolve(
							target,
							obj,
							"resolved symlink to " + result,
							resolveContext,
							callback
						);
					}
				);
			});
	}
};

}, function(modId) { var map = {"./forEachBail":1645497393379,"./getPaths":1645497393394,"./util/path":1645497393375}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393404, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

module.exports = class TryNextPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string} message message
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, message, target) {
		this.source = source;
		this.message = message;
		this.target = target;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("TryNextPlugin", (request, resolveContext, callback) => {
				resolver.doResolve(
					target,
					request,
					this.message,
					resolveContext,
					callback
				);
			});
	}
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393405, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */
/** @typedef {{[k: string]: any}} Cache */

function getCacheId(request, withContext) {
	return JSON.stringify({
		context: withContext ? request.context : "",
		path: request.path,
		query: request.query,
		fragment: request.fragment,
		request: request.request
	});
}

module.exports = class UnsafeCachePlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {function(ResolveRequest): boolean} filterPredicate filterPredicate
	 * @param {Cache} cache cache
	 * @param {boolean} withContext withContext
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, filterPredicate, cache, withContext, target) {
		this.source = source;
		this.filterPredicate = filterPredicate;
		this.withContext = withContext;
		this.cache = cache;
		this.target = target;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("UnsafeCachePlugin", (request, resolveContext, callback) => {
				if (!this.filterPredicate(request)) return callback();
				const cacheId = getCacheId(request, this.withContext);
				const cacheEntry = this.cache[cacheId];
				if (cacheEntry) {
					return callback(null, cacheEntry);
				}
				resolver.doResolve(
					target,
					request,
					null,
					resolveContext,
					(err, result) => {
						if (err) return callback(err);
						if (result) return callback(null, (this.cache[cacheId] = result));
						callback();
					}
				);
			});
	}
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393406, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

module.exports = class UseFilePlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {string} filename filename
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(source, filename, target) {
		this.source = source;
		this.filename = filename;
		this.target = target;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("UseFilePlugin", (request, resolveContext, callback) => {
				const filePath = resolver.join(request.path, this.filename);
				const obj = {
					...request,
					path: filePath,
					relativePath:
						request.relativePath &&
						resolver.join(request.relativePath, this.filename)
				};
				resolver.doResolve(
					target,
					obj,
					"using path: " + filePath,
					resolveContext,
					callback
				);
			});
	}
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393407, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



const basename = require("./getPaths").basename;

/** @typedef {import("./Resolver")} Resolver */

module.exports = class CloneBasenamePlugin {
	constructor(source, target) {
		this.source = source;
		this.target = target;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("CloneBasenamePlugin", (request, resolveContext, callback) => {
				const filename = basename(request.path);
				const filePath = resolver.join(request.path, filename);
				const obj = {
					...request,
					path: filePath,
					relativePath:
						request.relativePath &&
						resolver.join(request.relativePath, filename)
				};
				resolver.doResolve(
					target,
					obj,
					"using path: " + filePath,
					resolveContext,
					callback
				);
			});
	}
};

}, function(modId) { var map = {"./getPaths":1645497393394}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393408, function(require, module, exports) {
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



/** @typedef {import("./Resolver")} Resolver */

module.exports = class LogInfoPlugin {
	constructor(source) {
		this.source = source;
	}

	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver) {
		const source = this.source;
		resolver
			.getHook(this.source)
			.tapAsync("LogInfoPlugin", (request, resolveContext, callback) => {
				if (!resolveContext.log) return callback();
				const log = resolveContext.log;
				const prefix = "[" + source + "] ";
				if (request.path)
					log(prefix + "Resolving in directory: " + request.path);
				if (request.request)
					log(prefix + "Resolving request: " + request.request);
				if (request.module) log(prefix + "Request is an module request.");
				if (request.directory) log(prefix + "Request is a directory request.");
				if (request.query)
					log(prefix + "Resolving request query: " + request.query);
				if (request.fragment)
					log(prefix + "Resolving request fragment: " + request.fragment);
				if (request.descriptionFilePath)
					log(
						prefix + "Has description data from " + request.descriptionFilePath
					);
				if (request.relativePath)
					log(
						prefix +
							"Relative path from description file is: " +
							request.relativePath
					);
				callback();
			});
	}
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1645497393369);
})()
//miniprogram-npm-outsideDeps=["graceful-fs","process","pnpapi","tapable","path"]
//# sourceMappingURL=index.js.map