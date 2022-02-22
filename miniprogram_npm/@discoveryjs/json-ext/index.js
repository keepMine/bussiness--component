module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1645497392633, function(require, module, exports) {
module.exports = {
    version: require('../package.json').version,
    stringifyInfo: require('./stringify-info'),
    stringifyStream: require('./stringify-stream'),
    parseChunked: require('./parse-chunked')
};

}, function(modId) {var map = {"../package.json":1645497392634,"./stringify-info":1645497392635,"./stringify-stream":1645497392637,"./parse-chunked":1645497392638}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497392634, function(require, module, exports) {
module.exports = {
  "_from": "@discoveryjs/json-ext@^0.5.0",
  "_id": "@discoveryjs/json-ext@0.5.6",
  "_inBundle": false,
  "_integrity": "sha512-ws57AidsDvREKrZKYffXddNkyaF14iHNHm8VQnZH6t99E8gczjNN0GpvcGny0imC80yQ0tHz1xVUKk/KFQSUyA==",
  "_location": "/@discoveryjs/json-ext",
  "_phantomChildren": {},
  "_requested": {
    "type": "range",
    "registry": true,
    "raw": "@discoveryjs/json-ext@^0.5.0",
    "name": "@discoveryjs/json-ext",
    "escapedName": "@discoveryjs%2fjson-ext",
    "scope": "@discoveryjs",
    "rawSpec": "^0.5.0",
    "saveSpec": null,
    "fetchSpec": "^0.5.0"
  },
  "_requiredBy": [
    "/webpack-cli"
  ],
  "_resolved": "https://registry.npmjs.org/@discoveryjs/json-ext/-/json-ext-0.5.6.tgz",
  "_shasum": "d5e0706cf8c6acd8c6032f8d54070af261bbbb2f",
  "_spec": "@discoveryjs/json-ext@^0.5.0",
  "_where": "/Users/wuliangjian/Desktop/myWork/mineUI/node_modules/webpack-cli",
  "author": {
    "name": "Roman Dvornov",
    "email": "rdvornov@gmail.com",
    "url": "https://github.com/lahmatiy"
  },
  "browser": {
    "./src/stringify-stream.js": "./src/stringify-stream-browser.js",
    "./src/text-decoder.js": "./src/text-decoder-browser.js"
  },
  "bugs": {
    "url": "https://github.com/discoveryjs/json-ext/issues"
  },
  "bundleDependencies": false,
  "dependencies": {},
  "deprecated": false,
  "description": "A set of utilities that extend the use of JSON",
  "devDependencies": {
    "@rollup/plugin-commonjs": "^15.1.0",
    "@rollup/plugin-json": "^4.1.0",
    "@rollup/plugin-node-resolve": "^9.0.0",
    "chalk": "^4.1.0",
    "coveralls": "^3.1.0",
    "cross-env": "^7.0.3",
    "eslint": "^7.6.0",
    "mocha": "^8.1.1",
    "nyc": "^15.1.0",
    "rollup": "^2.28.2",
    "rollup-plugin-terser": "^7.0.2"
  },
  "engines": {
    "node": ">=10.0.0"
  },
  "files": [
    "dist",
    "src",
    "index.d.ts"
  ],
  "homepage": "https://github.com/discoveryjs/json-ext#readme",
  "keywords": [
    "json",
    "utils",
    "stream",
    "async",
    "promise",
    "stringify",
    "info"
  ],
  "license": "MIT",
  "main": "./src/index",
  "name": "@discoveryjs/json-ext",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/discoveryjs/json-ext.git"
  },
  "scripts": {
    "build": "rollup --config",
    "build-and-test": "npm run build && npm run test:dist",
    "coverage": "nyc npm test",
    "coveralls": "nyc report --reporter=text-lcov | coveralls",
    "lint": "eslint src test",
    "lint-and-test": "npm run lint && npm test",
    "prepublishOnly": "npm run build",
    "test": "mocha --reporter progress",
    "test:all": "npm run test:src && npm run test:dist",
    "test:dist": "cross-env MODE=dist npm test && cross-env MODE=dist-min npm test",
    "test:src": "npm test",
    "travis": "nyc npm run lint-and-test && npm run build-and-test && npm run coveralls"
  },
  "types": "./index.d.ts",
  "version": "0.5.6"
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497392635, function(require, module, exports) {
const {
    normalizeReplacer,
    normalizeSpace,
    replaceValue,
    getTypeNative,
    getTypeAsync,
    isLeadingSurrogate,
    isTrailingSurrogate,
    escapableCharCodeSubstitution,
    type: {
        PRIMITIVE,
        OBJECT,
        ARRAY,
        PROMISE,
        STRING_STREAM,
        OBJECT_STREAM
    }
} = require('./utils');
const charLength2048 = Array.from({ length: 2048 }).map((_, code) => {
    if (escapableCharCodeSubstitution.hasOwnProperty(code)) {
        return 2; // \X
    }

    if (code < 0x20) {
        return 6; // \uXXXX
    }

    return code < 128 ? 1 : 2; // UTF8 bytes
});

function stringLength(str) {
    let len = 0;
    let prevLeadingSurrogate = false;

    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);

        if (code < 2048) {
            len += charLength2048[code];
        } else if (isLeadingSurrogate(code)) {
            len += 6; // \uXXXX since no pair with trailing surrogate yet
            prevLeadingSurrogate = true;
            continue;
        } else if (isTrailingSurrogate(code)) {
            len = prevLeadingSurrogate
                ? len - 2  // surrogate pair (4 bytes), since we calculate prev leading surrogate as 6 bytes, substruct 2 bytes
                : len + 6; // \uXXXX
        } else {
            len += 3; // code >= 2048 is 3 bytes length for UTF8
        }

        prevLeadingSurrogate = false;
    }

    return len + 2; // +2 for quotes
}

function primitiveLength(value) {
    switch (typeof value) {
        case 'string':
            return stringLength(value);

        case 'number':
            return Number.isFinite(value) ? String(value).length : 4 /* null */;

        case 'boolean':
            return value ? 4 /* true */ : 5 /* false */;

        case 'undefined':
        case 'object':
            return 4; /* null */

        default:
            return 0;
    }
}

function spaceLength(space) {
    space = normalizeSpace(space);
    return typeof space === 'string' ? space.length : 0;
}

module.exports = function jsonStringifyInfo(value, replacer, space, options) {
    function walk(holder, key, value) {
        if (stop) {
            return;
        }

        value = replaceValue(holder, key, value, replacer);

        let type = getType(value);

        // check for circular structure
        if (type !== PRIMITIVE && stack.has(value)) {
            circular.add(value);
            length += 4; // treat as null

            if (!options.continueOnCircular) {
                stop = true;
            }

            return;
        }

        switch (type) {
            case PRIMITIVE:
                if (value !== undefined || Array.isArray(holder)) {
                    length += primitiveLength(value);
                } else if (holder === root) {
                    length += 9; // FIXME: that's the length of undefined, should we normalize behaviour to convert it to null?
                }
                break;

            case OBJECT: {
                if (visited.has(value)) {
                    duplicate.add(value);
                    length += visited.get(value);
                    break;
                }

                const valueLength = length;
                let entries = 0;

                length += 2; // {}

                stack.add(value);

                for (const key in value) {
                    if (hasOwnProperty.call(value, key) && (allowlist === null || allowlist.has(key))) {
                        const prevLength = length;
                        walk(value, key, value[key]);

                        if (prevLength !== length) {
                            // value is printed
                            length += stringLength(key) + 1; // "key":
                            entries++;
                        }
                    }
                }

                if (entries > 1) {
                    length += entries - 1; // commas
                }

                stack.delete(value);

                if (space > 0 && entries > 0) {
                    length += (1 + (stack.size + 1) * space + 1) * entries; // for each key-value: \n{space}
                    length += 1 + stack.size * space; // for }
                }

                visited.set(value, length - valueLength);

                break;
            }

            case ARRAY: {
                if (visited.has(value)) {
                    duplicate.add(value);
                    length += visited.get(value);
                    break;
                }

                const valueLength = length;

                length += 2; // []

                stack.add(value);

                for (let i = 0; i < value.length; i++) {
                    walk(value, i, value[i]);
                }

                if (value.length > 1) {
                    length += value.length - 1; // commas
                }

                stack.delete(value);

                if (space > 0 && value.length > 0) {
                    length += (1 + (stack.size + 1) * space) * value.length; // for each element: \n{space}
                    length += 1 + stack.size * space; // for ]
                }

                visited.set(value, length - valueLength);

                break;
            }

            case PROMISE:
            case STRING_STREAM:
                async.add(value);
                break;

            case OBJECT_STREAM:
                length += 2; // []
                async.add(value);
                break;
        }
    }

    let allowlist = null;
    replacer = normalizeReplacer(replacer);

    if (Array.isArray(replacer)) {
        allowlist = new Set(replacer);
        replacer = null;
    }

    space = spaceLength(space);
    options = options || {};

    const visited = new Map();
    const stack = new Set();
    const duplicate = new Set();
    const circular = new Set();
    const async = new Set();
    const getType = options.async ? getTypeAsync : getTypeNative;
    const root = { '': value };
    let stop = false;
    let length = 0;

    walk(root, '', value);

    return {
        minLength: isNaN(length) ? Infinity : length,
        circular: [...circular],
        duplicate: [...duplicate],
        async: [...async]
    };
};

}, function(modId) { var map = {"./utils":1645497392636}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497392636, function(require, module, exports) {
const PrimitiveType = 1;
const ObjectType = 2;
const ArrayType = 3;
const PromiseType = 4;
const ReadableStringType = 5;
const ReadableObjectType = 6;
// https://tc39.es/ecma262/#table-json-single-character-escapes
const escapableCharCodeSubstitution = { // JSON Single Character Escape Sequences
    0x08: '\\b',
    0x09: '\\t',
    0x0a: '\\n',
    0x0c: '\\f',
    0x0d: '\\r',
    0x22: '\\\"',
    0x5c: '\\\\'
};

function isLeadingSurrogate(code) {
    return code >= 0xD800 && code <= 0xDBFF;
}

function isTrailingSurrogate(code) {
    return code >= 0xDC00 && code <= 0xDFFF;
}

function isReadableStream(value) {
    return (
        typeof value.pipe === 'function' &&
        typeof value._read === 'function' &&
        typeof value._readableState === 'object' && value._readableState !== null
    );
}

function replaceValue(holder, key, value, replacer) {
    if (value && typeof value.toJSON === 'function') {
        value = value.toJSON();
    }

    if (replacer !== null) {
        value = replacer.call(holder, String(key), value);
    }

    switch (typeof value) {
        case 'function':
        case 'symbol':
            value = undefined;
            break;

        case 'object':
            if (value !== null) {
                const cls = value.constructor;
                if (cls === String || cls === Number || cls === Boolean) {
                    value = value.valueOf();
                }
            }
            break;
    }

    return value;
}

function getTypeNative(value) {
    if (value === null || typeof value !== 'object') {
        return PrimitiveType;
    }

    if (Array.isArray(value)) {
        return ArrayType;
    }

    return ObjectType;
}

function getTypeAsync(value) {
    if (value === null || typeof value !== 'object') {
        return PrimitiveType;
    }

    if (typeof value.then === 'function') {
        return PromiseType;
    }

    if (isReadableStream(value)) {
        return value._readableState.objectMode ? ReadableObjectType : ReadableStringType;
    }

    if (Array.isArray(value)) {
        return ArrayType;
    }

    return ObjectType;
}

function normalizeReplacer(replacer) {
    if (typeof replacer === 'function') {
        return replacer;
    }

    if (Array.isArray(replacer)) {
        const allowlist = new Set(replacer
            .map(item => {
                const cls = item && item.constructor;
                return cls === String || cls === Number ? String(item) : null;
            })
            .filter(item => typeof item === 'string')
        );

        return [...allowlist];
    }

    return null;
}

function normalizeSpace(space) {
    if (typeof space === 'number') {
        if (!Number.isFinite(space) || space < 1) {
            return false;
        }

        return ' '.repeat(Math.min(space, 10));
    }

    if (typeof space === 'string') {
        return space.slice(0, 10) || false;
    }

    return false;
}

module.exports = {
    escapableCharCodeSubstitution,
    isLeadingSurrogate,
    isTrailingSurrogate,
    type: {
        PRIMITIVE: PrimitiveType,
        PROMISE: PromiseType,
        ARRAY: ArrayType,
        OBJECT: ObjectType,
        STRING_STREAM: ReadableStringType,
        OBJECT_STREAM: ReadableObjectType
    },

    isReadableStream,
    replaceValue,
    getTypeNative,
    getTypeAsync,
    normalizeReplacer,
    normalizeSpace
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497392637, function(require, module, exports) {
const { Readable } = require('stream');
const {
    normalizeReplacer,
    normalizeSpace,
    replaceValue,
    getTypeAsync,
    type: {
        PRIMITIVE,
        OBJECT,
        ARRAY,
        PROMISE,
        STRING_STREAM,
        OBJECT_STREAM
    }
} = require('./utils');
const noop = () => {};
const hasOwnProperty = Object.prototype.hasOwnProperty;

// TODO: Remove when drop support for Node.js 10
// Node.js 10 has no well-formed JSON.stringify()
// https://github.com/tc39/proposal-well-formed-stringify
// Adopted code from https://bugs.chromium.org/p/v8/issues/detail?id=7782#c12
const wellformedStringStringify = JSON.stringify('\ud800') === '"\\ud800"'
    ? JSON.stringify
    : s => JSON.stringify(s).replace(
        /\p{Surrogate}/gu,
        m => `\\u${m.charCodeAt(0).toString(16)}`
    );

function push() {
    this.push(this._stack.value);
    this.popStack();
}

function pushPrimitive(value) {
    switch (typeof value) {
        case 'string':
            this.push(this.encodeString(value));
            break;

        case 'number':
            this.push(Number.isFinite(value) ? this.encodeNumber(value) : 'null');
            break;

        case 'boolean':
            this.push(value ? 'true' : 'false');
            break;

        case 'undefined':
        case 'object': // typeof null === 'object'
            this.push('null');
            break;

        default:
            this.destroy(new TypeError(`Do not know how to serialize a ${value.constructor && value.constructor.name || typeof value}`));
    }
}

function processObjectEntry(key) {
    const current = this._stack;

    if (!current.first) {
        current.first = true;
    } else {
        this.push(',');
    }

    if (this.space) {
        this.push(`\n${this.space.repeat(this._depth)}${this.encodeString(key)}: `);
    } else {
        this.push(this.encodeString(key) + ':');
    }
}

function processObject() {
    const current = this._stack;

    // when no keys left, remove obj from stack
    if (current.index === current.keys.length) {
        if (this.space && current.first) {
            this.push(`\n${this.space.repeat(this._depth - 1)}}`);
        } else {
            this.push('}');
        }

        this.popStack();
        return;
    }

    const key = current.keys[current.index];

    this.processValue(current.value, key, current.value[key], processObjectEntry);
    current.index++;
}

function processArrayItem(index) {
    if (index !== 0) {
        this.push(',');
    }

    if (this.space) {
        this.push(`\n${this.space.repeat(this._depth)}`);
    }
}

function processArray() {
    const current = this._stack;

    if (current.index === current.value.length) {
        if (this.space && current.index > 0) {
            this.push(`\n${this.space.repeat(this._depth - 1)}]`);
        } else {
            this.push(']');
        }

        this.popStack();
        return;
    }

    this.processValue(current.value, current.index, current.value[current.index], processArrayItem);
    current.index++;
}

function createStreamReader(fn) {
    return function() {
        const current = this._stack;
        const data = current.value.read(this._readSize);

        if (data !== null) {
            current.first = false;
            fn.call(this, data, current);
        } else {
            if ((current.first && !current.value._readableState.reading) || current.ended) {
                this.popStack();
            } else {
                current.first = true;
                current.awaiting = true;
            }
        }
    };
}

const processReadableObject = createStreamReader(function(data, current) {
    this.processValue(current.value, current.index, data, processArrayItem);
    current.index++;
});

const processReadableString = createStreamReader(function(data) {
    this.push(data);
});

class JsonStringifyStream extends Readable {
    constructor(value, replacer, space) {
        super({
            autoDestroy: true
        });

        this.getKeys = Object.keys;
        this.replacer = normalizeReplacer(replacer);

        if (Array.isArray(this.replacer)) {
            const allowlist = this.replacer;

            this.getKeys = (value) => allowlist.filter(key => hasOwnProperty.call(value, key));
            this.replacer = null;
        }

        this.space = normalizeSpace(space);
        this._depth = 0;

        this.error = null;
        this._processing = false;
        this._ended = false;

        this._readSize = 0;
        this._buffer = '';

        this._stack = null;
        this._visited = new WeakSet();

        this.pushStack({
            handler: () => {
                this.popStack();
                this.processValue({ '': value }, '', value, noop);
            }
        });
    }

    encodeString(value) {
        if (/[^\x20-\uD799]|[\x22\x5c]/.test(value)) {
            return wellformedStringStringify(value);
        }

        return '"' + value + '"';
    }

    encodeNumber(value) {
        return value;
    }

    processValue(holder, key, value, callback) {
        value = replaceValue(holder, key, value, this.replacer);

        let type = getTypeAsync(value);

        switch (type) {
            case PRIMITIVE:
                if (callback !== processObjectEntry || value !== undefined) {
                    callback.call(this, key);
                    pushPrimitive.call(this, value);
                }
                break;

            case OBJECT:
                callback.call(this, key);

                // check for circular structure
                if (this._visited.has(value)) {
                    return this.destroy(new TypeError('Converting circular structure to JSON'));
                }

                this._visited.add(value);
                this._depth++;
                this.push('{');
                this.pushStack({
                    handler: processObject,
                    value,
                    index: 0,
                    first: false,
                    keys: this.getKeys(value)
                });
                break;

            case ARRAY:
                callback.call(this, key);

                // check for circular structure
                if (this._visited.has(value)) {
                    return this.destroy(new TypeError('Converting circular structure to JSON'));
                }

                this._visited.add(value);

                this.push('[');
                this.pushStack({
                    handler: processArray,
                    value,
                    index: 0
                });
                this._depth++;
                break;

            case PROMISE:
                this.pushStack({
                    handler: noop,
                    awaiting: true
                });

                Promise.resolve(value)
                    .then(resolved => {
                        this.popStack();
                        this.processValue(holder, key, resolved, callback);
                        this.processStack();
                    })
                    .catch(error => {
                        this.destroy(error);
                    });
                break;

            case STRING_STREAM:
            case OBJECT_STREAM:
                callback.call(this, key);

                // TODO: Remove when drop support for Node.js 10
                // Used `_readableState.endEmitted` as fallback, since Node.js 10 has no `readableEnded` getter
                if (value.readableEnded || value._readableState.endEmitted) {
                    return this.destroy(new Error('Readable Stream has ended before it was serialized. All stream data have been lost'));
                }

                if (value.readableFlowing) {
                    return this.destroy(new Error('Readable Stream is in flowing mode, data may have been lost. Trying to pause stream.'));
                }

                if (type === OBJECT_STREAM) {
                    this.push('[');
                    this.pushStack({
                        handler: push,
                        value: this.space ? '\n' + this.space.repeat(this._depth) + ']' : ']'
                    });
                    this._depth++;
                }

                const self = this.pushStack({
                    handler: type === OBJECT_STREAM ? processReadableObject : processReadableString,
                    value,
                    index: 0,
                    first: false,
                    ended: false,
                    awaiting: !value.readable || value.readableLength === 0
                });
                const continueProcessing = () => {
                    if (self.awaiting) {
                        self.awaiting = false;
                        this.processStack();
                    }
                };

                value.once('error', error => this.destroy(error));
                value.once('end', () => {
                    self.ended = true;
                    continueProcessing();
                });
                value.on('readable', continueProcessing);
                break;
        }
    }

    pushStack(node) {
        node.prev = this._stack;
        return this._stack = node;
    }

    popStack() {
        const { handler, value } = this._stack;

        if (handler === processObject || handler === processArray || handler === processReadableObject) {
            this._visited.delete(value);
            this._depth--;
        }

        this._stack = this._stack.prev;
    }

    processStack() {
        if (this._processing || this._ended) {
            return;
        }

        try {
            this._processing = true;

            while (this._stack !== null && !this._stack.awaiting) {
                this._stack.handler.call(this);

                if (!this._processing) {
                    return;
                }
            }

            this._processing = false;
        } catch (error) {
            this.destroy(error);
            return;
        }

        if (this._stack === null && !this._ended) {
            this._finish();
            this.push(null);
        }
    }

    push(data) {
        if (data !== null) {
            this._buffer += data;

            // check buffer overflow
            if (this._buffer.length < this._readSize) {
                return;
            }

            // flush buffer
            data = this._buffer;
            this._buffer = '';
            this._processing = false;
        }

        super.push(data);
    }

    _read(size) {
        // start processing
        this._readSize = size || this.readableHighWaterMark;
        this.processStack();
    }

    _finish() {
        this._ended = true;
        this._processing = false;
        this._stack = null;
        this._visited = null;

        if (this._buffer && this._buffer.length) {
            super.push(this._buffer); // flush buffer
        }

        this._buffer = '';
    }

    _destroy(error, cb) {
        this.error = this.error || error;
        this._finish();
        cb(error);
    }
}

module.exports = function createJsonStringifyStream(value, replacer, space) {
    return new JsonStringifyStream(value, replacer, space);
};

}, function(modId) { var map = {"./utils":1645497392636}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497392638, function(require, module, exports) {
const { isReadableStream } = require('./utils');
const TextDecoder = require('./text-decoder');

const STACK_OBJECT = 1;
const STACK_ARRAY = 2;
const decoder = new TextDecoder();

function isObject(value) {
    return value !== null && typeof value === 'object';
}

function adjustPosition(error, parser) {
    if (error.name === 'SyntaxError' && parser.jsonParseOffset) {
        error.message = error.message.replace(/at position (\d+)/, (_, pos) =>
            'at position ' + (Number(pos) + parser.jsonParseOffset)
        );
    }

    return error;
}

function append(array, elements) {
    // Note: Avoid to use array.push(...elements) since it may lead to
    // "RangeError: Maximum call stack size exceeded" for a long arrays
    const initialLength = array.length;
    array.length += elements.length;

    for (let i = 0; i < elements.length; i++) {
        array[initialLength + i] = elements[i];
    }
}

module.exports = function(chunkEmitter) {
    let parser = new ChunkParser();

    if (isObject(chunkEmitter) && isReadableStream(chunkEmitter)) {
        return new Promise((resolve, reject) => {
            chunkEmitter
                .on('data', chunk => {
                    try {
                        parser.push(chunk);
                    } catch (e) {
                        reject(adjustPosition(e, parser));
                        parser = null;
                    }
                })
                .on('error', (e) => {
                    parser = null;
                    reject(e);
                })
                .on('end', () => {
                    try {
                        resolve(parser.finish());
                    } catch (e) {
                        reject(adjustPosition(e, parser));
                    } finally {
                        parser = null;
                    }
                });
        });
    }

    if (typeof chunkEmitter === 'function') {
        const iterator = chunkEmitter();

        if (isObject(iterator) && (Symbol.iterator in iterator || Symbol.asyncIterator in iterator)) {
            return new Promise(async (resolve, reject) => {
                try {
                    for await (const chunk of iterator) {
                        parser.push(chunk);
                    }

                    resolve(parser.finish());
                } catch (e) {
                    reject(adjustPosition(e, parser));
                } finally {
                    parser = null;
                }
            });
        }
    }

    throw new Error(
        'Chunk emitter should be readable stream, generator, ' +
        'async generator or function returning an iterable object'
    );
};

class ChunkParser {
    constructor() {
        this.value = undefined;
        this.valueStack = null;

        this.stack = new Array(100);
        this.lastFlushDepth = 0;
        this.flushDepth = 0;
        this.stateString = false;
        this.stateStringEscape = false;
        this.pendingByteSeq = null;
        this.pendingChunk = null;
        this.chunkOffset = 0;
        this.jsonParseOffset = 0;
    }

    parseAndAppend(fragment, wrap) {
        // Append new entries or elements
        if (this.stack[this.lastFlushDepth - 1] === STACK_OBJECT) {
            if (wrap) {
                this.jsonParseOffset--;
                fragment = '{' + fragment + '}';
            }

            Object.assign(this.valueStack.value, JSON.parse(fragment));
        } else {
            if (wrap) {
                this.jsonParseOffset--;
                fragment = '[' + fragment + ']';
            }

            append(this.valueStack.value, JSON.parse(fragment));
        }
    }

    prepareAddition(fragment) {
        const { value } = this.valueStack;
        const expectComma = Array.isArray(value)
            ? value.length !== 0
            : Object.keys(value).length !== 0;

        if (expectComma) {
            // Skip a comma at the beginning of fragment, otherwise it would
            // fail to parse
            if (fragment[0] === ',') {
                this.jsonParseOffset++;
                return fragment.slice(1);
            }

            // When value (an object or array) is not empty and a fragment
            // doesn't start with a comma, a single valid fragment starting
            // is a closing bracket. If it's not, a prefix is adding to fail
            // parsing. Otherwise, the sequence of chunks can be successfully
            // parsed, although it should not, e.g. ["[{}", "{}]"]
            if (fragment[0] !== '}' && fragment[0] !== ']') {
                this.jsonParseOffset -= 3;
                return '[[]' + fragment;
            }
        }

        return fragment;
    }

    flush(chunk, start, end) {
        let fragment = chunk.slice(start, end);

        // Save position correction an error in JSON.parse() if any
        this.jsonParseOffset = this.chunkOffset + start;

        // Prepend pending chunk if any
        if (this.pendingChunk !== null) {
            fragment = this.pendingChunk + fragment;
            this.jsonParseOffset -= this.pendingChunk.length;
            this.pendingChunk = null;
        }

        if (this.flushDepth === this.lastFlushDepth) {
            // Depth didn't changed, so it's a root value or entry/element set
            if (this.flushDepth > 0) {
                this.parseAndAppend(this.prepareAddition(fragment), true);
            } else {
                // That's an entire value on a top level
                this.value = JSON.parse(fragment);
                this.valueStack = {
                    value: this.value,
                    prev: null
                };
            }
        } else if (this.flushDepth > this.lastFlushDepth) {
            // Add missed closing brackets/parentheses
            for (let i = this.flushDepth - 1; i >= this.lastFlushDepth; i--) {
                fragment += this.stack[i] === STACK_OBJECT ? '}' : ']';
            }

            if (this.lastFlushDepth === 0) {
                // That's a root value
                this.value = JSON.parse(fragment);
                this.valueStack = {
                    value: this.value,
                    prev: null
                };
            } else {
                this.parseAndAppend(this.prepareAddition(fragment), true);
            }

            // Move down to the depths to the last object/array, which is current now
            for (let i = this.lastFlushDepth || 1; i < this.flushDepth; i++) {
                let value = this.valueStack.value;

                if (this.stack[i - 1] === STACK_OBJECT) {
                    // find last entry
                    let key;
                    // eslint-disable-next-line curly
                    for (key in value);
                    value = value[key];
                } else {
                    // last element
                    value = value[value.length - 1];
                }

                this.valueStack = {
                    value,
                    prev: this.valueStack
                };
            }
        } else /* this.flushDepth < this.lastFlushDepth */ {
            fragment = this.prepareAddition(fragment);

            // Add missed opening brackets/parentheses
            for (let i = this.lastFlushDepth - 1; i >= this.flushDepth; i--) {
                this.jsonParseOffset--;
                fragment = (this.stack[i] === STACK_OBJECT ? '{' : '[') + fragment;
            }

            this.parseAndAppend(fragment, false);

            for (let i = this.lastFlushDepth - 1; i >= this.flushDepth; i--) {
                this.valueStack = this.valueStack.prev;
            }
        }

        this.lastFlushDepth = this.flushDepth;
    }

    push(chunk) {
        if (typeof chunk !== 'string') {
            // Suppose chunk is Buffer or Uint8Array

            // Prepend uncompleted byte sequence if any
            if (this.pendingByteSeq !== null) {
                const origRawChunk = chunk;
                chunk = new Uint8Array(this.pendingByteSeq.length + origRawChunk.length);
                chunk.set(this.pendingByteSeq);
                chunk.set(origRawChunk, this.pendingByteSeq.length);
                this.pendingByteSeq = null;
            }

            // In case Buffer/Uint8Array, an input is encoded in UTF8
            // Seek for parts of uncompleted UTF8 symbol on the ending
            // This makes sense only if we expect more chunks and last char is not multi-bytes
            if (chunk[chunk.length - 1] > 127) {
                for (let seqLength = 0; seqLength < chunk.length; seqLength++) {
                    const byte = chunk[chunk.length - 1 - seqLength];

                    // 10xxxxxx - 2nd, 3rd or 4th byte
                    // 110xxxxx – first byte of 2-byte sequence
                    // 1110xxxx - first byte of 3-byte sequence
                    // 11110xxx - first byte of 4-byte sequence
                    if (byte >> 6 === 3) {
                        seqLength++;

                        // If the sequence is really incomplete, then preserve it
                        // for the future chunk and cut off it from the current chunk
                        if ((seqLength !== 4 && byte >> 3 === 0b11110) ||
                            (seqLength !== 3 && byte >> 4 === 0b1110) ||
                            (seqLength !== 2 && byte >> 5 === 0b110)) {
                            this.pendingByteSeq = chunk.slice(chunk.length - seqLength);
                            chunk = chunk.slice(0, -seqLength);
                        }

                        break;
                    }
                }
            }

            // Convert chunk to a string, since single decode per chunk
            // is much effective than decode multiple small substrings
            chunk = decoder.decode(chunk);
        }

        const chunkLength = chunk.length;
        let lastFlushPoint = 0;
        let flushPoint = 0;

        // Main scan loop
        scan: for (let i = 0; i < chunkLength; i++) {
            if (this.stateString) {
                for (; i < chunkLength; i++) {
                    if (this.stateStringEscape) {
                        this.stateStringEscape = false;
                    } else {
                        switch (chunk.charCodeAt(i)) {
                            case 0x22: /* " */
                                this.stateString = false;
                                continue scan;

                            case 0x5C: /* \ */
                                this.stateStringEscape = true;
                        }
                    }
                }

                break;
            }

            switch (chunk.charCodeAt(i)) {
                case 0x22: /* " */
                    this.stateString = true;
                    this.stateStringEscape = false;
                    break;

                case 0x2C: /* , */
                    flushPoint = i;
                    break;

                case 0x7B: /* { */
                    // Open an object
                    flushPoint = i + 1;
                    this.stack[this.flushDepth++] = STACK_OBJECT;
                    break;

                case 0x5B: /* [ */
                    // Open an array
                    flushPoint = i + 1;
                    this.stack[this.flushDepth++] = STACK_ARRAY;
                    break;

                case 0x5D: /* ] */
                case 0x7D: /* } */
                    // Close an object or array
                    flushPoint = i + 1;
                    this.flushDepth--;

                    if (this.flushDepth < this.lastFlushDepth) {
                        this.flush(chunk, lastFlushPoint, flushPoint);
                        lastFlushPoint = flushPoint;
                    }

                    break;

                case 0x09: /* \t */
                case 0x0A: /* \n */
                case 0x0D: /* \r */
                case 0x20: /* space */
                    // Move points forward when they points on current position and it's a whitespace
                    if (lastFlushPoint === i) {
                        lastFlushPoint++;
                    }

                    if (flushPoint === i) {
                        flushPoint++;
                    }

                    break;
            }
        }

        if (flushPoint > lastFlushPoint) {
            this.flush(chunk, lastFlushPoint, flushPoint);
        }

        // Produce pendingChunk if something left
        if (flushPoint < chunkLength) {
            if (this.pendingChunk !== null) {
                // When there is already a pending chunk then no flush happened,
                // appending entire chunk to pending one
                this.pendingChunk += chunk;
            } else {
                // Create a pending chunk, it will start with non-whitespace since
                // flushPoint was moved forward away from whitespaces on scan
                this.pendingChunk = chunk.slice(flushPoint, chunkLength);
            }
        }

        this.chunkOffset += chunkLength;
    }

    finish() {
        if (this.pendingChunk !== null) {
            this.flush('', 0, 0);
            this.pendingChunk = null;
        }

        return this.value;
    }
};

}, function(modId) { var map = {"./utils":1645497392636,"./text-decoder":1645497392639}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497392639, function(require, module, exports) {
module.exports = require('util').TextDecoder;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1645497392633);
})()
//miniprogram-npm-outsideDeps=["stream","util"]
//# sourceMappingURL=index.js.map