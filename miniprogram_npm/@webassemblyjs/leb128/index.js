module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1645497392660, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeInt64 = decodeInt64;
exports.decodeUInt64 = decodeUInt64;
exports.decodeInt32 = decodeInt32;
exports.decodeUInt32 = decodeUInt32;
exports.encodeU32 = encodeU32;
exports.encodeI32 = encodeI32;
exports.encodeI64 = encodeI64;
exports.MAX_NUMBER_OF_BYTE_U64 = exports.MAX_NUMBER_OF_BYTE_U32 = void 0;

var _leb = _interopRequireDefault(require("./leb"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * According to https://webassembly.github.io/spec/core/binary/values.html#binary-int
 * max = ceil(32/7)
 */
var MAX_NUMBER_OF_BYTE_U32 = 5;
/**
 * According to https://webassembly.github.io/spec/core/binary/values.html#binary-int
 * max = ceil(64/7)
 */

exports.MAX_NUMBER_OF_BYTE_U32 = MAX_NUMBER_OF_BYTE_U32;
var MAX_NUMBER_OF_BYTE_U64 = 10;
exports.MAX_NUMBER_OF_BYTE_U64 = MAX_NUMBER_OF_BYTE_U64;

function decodeInt64(encodedBuffer, index) {
  return _leb.default.decodeInt64(encodedBuffer, index);
}

function decodeUInt64(encodedBuffer, index) {
  return _leb.default.decodeUInt64(encodedBuffer, index);
}

function decodeInt32(encodedBuffer, index) {
  return _leb.default.decodeInt32(encodedBuffer, index);
}

function decodeUInt32(encodedBuffer, index) {
  return _leb.default.decodeUInt32(encodedBuffer, index);
}

function encodeU32(v) {
  return _leb.default.encodeUInt32(v);
}

function encodeI32(v) {
  return _leb.default.encodeInt32(v);
}

function encodeI64(v) {
  return _leb.default.encodeInt64(v);
}
}, function(modId) {var map = {"./leb":1645497392661}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497392661, function(require, module, exports) {
// Copyright 2012 The Obvious Corporation.

/*
 * leb: LEB128 utilities.
 */

/*
 * Modules used
 */


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _long = _interopRequireDefault(require("@xtuc/long"));

var bits = _interopRequireWildcard(require("./bits"));

var bufs = _interopRequireWildcard(require("./bufs"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Module variables
 */

/** The minimum possible 32-bit signed int. */
var MIN_INT32 = -0x80000000;
/** The maximum possible 32-bit signed int. */

var MAX_INT32 = 0x7fffffff;
/** The maximum possible 32-bit unsigned int. */

var MAX_UINT32 = 0xffffffff;
/** The minimum possible 64-bit signed int. */
// const MIN_INT64 = -0x8000000000000000;

/**
 * The maximum possible 64-bit signed int that is representable as a
 * JavaScript number.
 */
// const MAX_INT64 = 0x7ffffffffffffc00;

/**
 * The maximum possible 64-bit unsigned int that is representable as a
 * JavaScript number.
 */
// const MAX_UINT64 = 0xfffffffffffff800;

/*
 * Helper functions
 */

/**
 * Determines the number of bits required to encode the number
 * represented in the given buffer as a signed value. The buffer is
 * taken to represent a signed number in little-endian form.
 *
 * The number of bits to encode is the (zero-based) bit number of the
 * highest-order non-sign-matching bit, plus two. For example:
 *
 *   11111011 01110101
 *   high          low
 *
 * The sign bit here is 1 (that is, it's a negative number). The highest
 * bit number that doesn't match the sign is bit #10 (where the lowest-order
 * bit is bit #0). So, we have to encode at least 12 bits total.
 *
 * As a special degenerate case, the numbers 0 and -1 each require just one bit.
 */

function signedBitCount(buffer) {
  return bits.highOrder(bits.getSign(buffer) ^ 1, buffer) + 2;
}
/**
 * Determines the number of bits required to encode the number
 * represented in the given buffer as an unsigned value. The buffer is
 * taken to represent an unsigned number in little-endian form.
 *
 * The number of bits to encode is the (zero-based) bit number of the
 * highest-order 1 bit, plus one. For example:
 *
 *   00011000 01010011
 *   high          low
 *
 * The highest-order 1 bit here is bit #12 (where the lowest-order bit
 * is bit #0). So, we have to encode at least 13 bits total.
 *
 * As a special degenerate case, the number 0 requires 1 bit.
 */


function unsignedBitCount(buffer) {
  var result = bits.highOrder(1, buffer) + 1;
  return result ? result : 1;
}
/**
 * Common encoder for both signed and unsigned ints. This takes a
 * bigint-ish buffer, returning an LEB128-encoded buffer.
 */


function encodeBufferCommon(buffer, signed) {
  var signBit;
  var bitCount;

  if (signed) {
    signBit = bits.getSign(buffer);
    bitCount = signedBitCount(buffer);
  } else {
    signBit = 0;
    bitCount = unsignedBitCount(buffer);
  }

  var byteCount = Math.ceil(bitCount / 7);
  var result = bufs.alloc(byteCount);

  for (var i = 0; i < byteCount; i++) {
    var payload = bits.extract(buffer, i * 7, 7, signBit);
    result[i] = payload | 0x80;
  } // Mask off the top bit of the last byte, to indicate the end of the
  // encoding.


  result[byteCount - 1] &= 0x7f;
  return result;
}
/**
 * Gets the byte-length of the value encoded in the given buffer at
 * the given index.
 */


function encodedLength(encodedBuffer, index) {
  var result = 0;

  while (encodedBuffer[index + result] >= 0x80) {
    result++;
  }

  result++; // to account for the last byte

  if (index + result > encodedBuffer.length) {// FIXME(sven): seems to cause false positives
    // throw new Error("integer representation too long");
  }

  return result;
}
/**
 * Common decoder for both signed and unsigned ints. This takes an
 * LEB128-encoded buffer, returning a bigint-ish buffer.
 */


function decodeBufferCommon(encodedBuffer, index, signed) {
  index = index === undefined ? 0 : index;
  var length = encodedLength(encodedBuffer, index);
  var bitLength = length * 7;
  var byteLength = Math.ceil(bitLength / 8);
  var result = bufs.alloc(byteLength);
  var outIndex = 0;

  while (length > 0) {
    bits.inject(result, outIndex, 7, encodedBuffer[index]);
    outIndex += 7;
    index++;
    length--;
  }

  var signBit;
  var signByte;

  if (signed) {
    // Sign-extend the last byte.
    var lastByte = result[byteLength - 1];
    var endBit = outIndex % 8;

    if (endBit !== 0) {
      var shift = 32 - endBit; // 32 because JS bit ops work on 32-bit ints.

      lastByte = result[byteLength - 1] = lastByte << shift >> shift & 0xff;
    }

    signBit = lastByte >> 7;
    signByte = signBit * 0xff;
  } else {
    signBit = 0;
    signByte = 0;
  } // Slice off any superfluous bytes, that is, ones that add no meaningful
  // bits (because the value would be the same if they were removed).


  while (byteLength > 1 && result[byteLength - 1] === signByte && (!signed || result[byteLength - 2] >> 7 === signBit)) {
    byteLength--;
  }

  result = bufs.resize(result, byteLength);
  return {
    value: result,
    nextIndex: index
  };
}
/*
 * Exported bindings
 */


function encodeIntBuffer(buffer) {
  return encodeBufferCommon(buffer, true);
}

function decodeIntBuffer(encodedBuffer, index) {
  return decodeBufferCommon(encodedBuffer, index, true);
}

function encodeInt32(num) {
  var buf = bufs.alloc(4);
  buf.writeInt32LE(num, 0);
  var result = encodeIntBuffer(buf);
  bufs.free(buf);
  return result;
}

function decodeInt32(encodedBuffer, index) {
  var result = decodeIntBuffer(encodedBuffer, index);
  var parsed = bufs.readInt(result.value);
  var value = parsed.value;
  bufs.free(result.value);

  if (value < MIN_INT32 || value > MAX_INT32) {
    throw new Error("integer too large");
  }

  return {
    value: value,
    nextIndex: result.nextIndex
  };
}

function encodeInt64(num) {
  var buf = bufs.alloc(8);
  bufs.writeInt64(num, buf);
  var result = encodeIntBuffer(buf);
  bufs.free(buf);
  return result;
}

function decodeInt64(encodedBuffer, index) {
  var result = decodeIntBuffer(encodedBuffer, index);

  var value = _long.default.fromBytesLE(result.value, false);

  bufs.free(result.value);
  return {
    value: value,
    nextIndex: result.nextIndex,
    lossy: false
  };
}

function encodeUIntBuffer(buffer) {
  return encodeBufferCommon(buffer, false);
}

function decodeUIntBuffer(encodedBuffer, index) {
  return decodeBufferCommon(encodedBuffer, index, false);
}

function encodeUInt32(num) {
  var buf = bufs.alloc(4);
  buf.writeUInt32LE(num, 0);
  var result = encodeUIntBuffer(buf);
  bufs.free(buf);
  return result;
}

function decodeUInt32(encodedBuffer, index) {
  var result = decodeUIntBuffer(encodedBuffer, index);
  var parsed = bufs.readUInt(result.value);
  var value = parsed.value;
  bufs.free(result.value);

  if (value > MAX_UINT32) {
    throw new Error("integer too large");
  }

  return {
    value: value,
    nextIndex: result.nextIndex
  };
}

function encodeUInt64(num) {
  var buf = bufs.alloc(8);
  bufs.writeUInt64(num, buf);
  var result = encodeUIntBuffer(buf);
  bufs.free(buf);
  return result;
}

function decodeUInt64(encodedBuffer, index) {
  var result = decodeUIntBuffer(encodedBuffer, index);

  var value = _long.default.fromBytesLE(result.value, true);

  bufs.free(result.value);
  return {
    value: value,
    nextIndex: result.nextIndex,
    lossy: false
  };
}

var _default = {
  decodeInt32: decodeInt32,
  decodeInt64: decodeInt64,
  decodeIntBuffer: decodeIntBuffer,
  decodeUInt32: decodeUInt32,
  decodeUInt64: decodeUInt64,
  decodeUIntBuffer: decodeUIntBuffer,
  encodeInt32: encodeInt32,
  encodeInt64: encodeInt64,
  encodeIntBuffer: encodeIntBuffer,
  encodeUInt32: encodeUInt32,
  encodeUInt64: encodeUInt64,
  encodeUIntBuffer: encodeUIntBuffer
};
exports.default = _default;
}, function(modId) { var map = {"./bits":1645497392662,"./bufs":1645497392663}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497392662, function(require, module, exports) {
// Copyright 2012 The Obvious Corporation.

/*
 * bits: Bitwise buffer utilities. The utilities here treat a buffer
 * as a little-endian bigint, so the lowest-order bit is bit #0 of
 * `buffer[0]`, and the highest-order bit is bit #7 of
 * `buffer[buffer.length - 1]`.
 */

/*
 * Modules used
 */

/*
 * Exported bindings
 */

/**
 * Extracts the given number of bits from the buffer at the indicated
 * index, returning a simple number as the result. If bits are requested
 * that aren't covered by the buffer, the `defaultBit` is used as their
 * value.
 *
 * The `bitLength` must be no more than 32. The `defaultBit` if not
 * specified is taken to be `0`.
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extract = extract;
exports.inject = inject;
exports.getSign = getSign;
exports.highOrder = highOrder;

function extract(buffer, bitIndex, bitLength, defaultBit) {
  if (bitLength < 0 || bitLength > 32) {
    throw new Error("Bad value for bitLength.");
  }

  if (defaultBit === undefined) {
    defaultBit = 0;
  } else if (defaultBit !== 0 && defaultBit !== 1) {
    throw new Error("Bad value for defaultBit.");
  }

  var defaultByte = defaultBit * 0xff;
  var result = 0; // All starts are inclusive. The {endByte, endBit} pair is exclusive, but
  // if endBit !== 0, then endByte is inclusive.

  var lastBit = bitIndex + bitLength;
  var startByte = Math.floor(bitIndex / 8);
  var startBit = bitIndex % 8;
  var endByte = Math.floor(lastBit / 8);
  var endBit = lastBit % 8;

  if (endBit !== 0) {
    // `(1 << endBit) - 1` is the mask of all bits up to but not including
    // the endBit.
    result = get(endByte) & (1 << endBit) - 1;
  }

  while (endByte > startByte) {
    endByte--;
    result = result << 8 | get(endByte);
  }

  result >>>= startBit;
  return result;

  function get(index) {
    var result = buffer[index];
    return result === undefined ? defaultByte : result;
  }
}
/**
 * Injects the given bits into the given buffer at the given index. Any
 * bits in the value beyond the length to set are ignored.
 */


function inject(buffer, bitIndex, bitLength, value) {
  if (bitLength < 0 || bitLength > 32) {
    throw new Error("Bad value for bitLength.");
  }

  var lastByte = Math.floor((bitIndex + bitLength - 1) / 8);

  if (bitIndex < 0 || lastByte >= buffer.length) {
    throw new Error("Index out of range.");
  } // Just keeping it simple, until / unless profiling shows that this
  // is a problem.


  var atByte = Math.floor(bitIndex / 8);
  var atBit = bitIndex % 8;

  while (bitLength > 0) {
    if (value & 1) {
      buffer[atByte] |= 1 << atBit;
    } else {
      buffer[atByte] &= ~(1 << atBit);
    }

    value >>= 1;
    bitLength--;
    atBit = (atBit + 1) % 8;

    if (atBit === 0) {
      atByte++;
    }
  }
}
/**
 * Gets the sign bit of the given buffer.
 */


function getSign(buffer) {
  return buffer[buffer.length - 1] >>> 7;
}
/**
 * Gets the zero-based bit number of the highest-order bit with the
 * given value in the given buffer.
 *
 * If the buffer consists entirely of the other bit value, then this returns
 * `-1`.
 */


function highOrder(bit, buffer) {
  var length = buffer.length;
  var fullyWrongByte = (bit ^ 1) * 0xff; // the other-bit extended to a full byte

  while (length > 0 && buffer[length - 1] === fullyWrongByte) {
    length--;
  }

  if (length === 0) {
    // Degenerate case. The buffer consists entirely of ~bit.
    return -1;
  }

  var byteToCheck = buffer[length - 1];
  var result = length * 8 - 1;

  for (var i = 7; i > 0; i--) {
    if ((byteToCheck >> i & 1) === bit) {
      break;
    }

    result--;
  }

  return result;
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497392663, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alloc = alloc;
exports.free = free;
exports.resize = resize;
exports.readInt = readInt;
exports.readUInt = readUInt;
exports.writeInt64 = writeInt64;
exports.writeUInt64 = writeUInt64;
// Copyright 2012 The Obvious Corporation.

/*
 * bufs: Buffer utilities.
 */

/*
 * Module variables
 */

/** Pool of buffers, where `bufPool[x].length === x`. */
var bufPool = [];
/** Maximum length of kept temporary buffers. */

var TEMP_BUF_MAXIMUM_LENGTH = 20;
/** Minimum exactly-representable 64-bit int. */

var MIN_EXACT_INT64 = -0x8000000000000000;
/** Maximum exactly-representable 64-bit int. */

var MAX_EXACT_INT64 = 0x7ffffffffffffc00;
/** Maximum exactly-representable 64-bit uint. */

var MAX_EXACT_UINT64 = 0xfffffffffffff800;
/**
 * The int value consisting just of a 1 in bit #32 (that is, one more
 * than the maximum 32-bit unsigned value).
 */

var BIT_32 = 0x100000000;
/**
 * The int value consisting just of a 1 in bit #64 (that is, one more
 * than the maximum 64-bit unsigned value).
 */

var BIT_64 = 0x10000000000000000;
/*
 * Helper functions
 */

/**
 * Masks off all but the lowest bit set of the given number.
 */

function lowestBit(num) {
  return num & -num;
}
/**
 * Gets whether trying to add the second number to the first is lossy
 * (inexact). The first number is meant to be an accumulated result.
 */


function isLossyToAdd(accum, num) {
  if (num === 0) {
    return false;
  }

  var lowBit = lowestBit(num);
  var added = accum + lowBit;

  if (added === accum) {
    return true;
  }

  if (added - lowBit !== accum) {
    return true;
  }

  return false;
}
/*
 * Exported functions
 */

/**
 * Allocates a buffer of the given length, which is initialized
 * with all zeroes. This returns a buffer from the pool if it is
 * available, or a freshly-allocated buffer if not.
 */


function alloc(length) {
  var result = bufPool[length];

  if (result) {
    bufPool[length] = undefined;
  } else {
    result = new Buffer(length);
  }

  result.fill(0);
  return result;
}
/**
 * Releases a buffer back to the pool.
 */


function free(buffer) {
  var length = buffer.length;

  if (length < TEMP_BUF_MAXIMUM_LENGTH) {
    bufPool[length] = buffer;
  }
}
/**
 * Resizes a buffer, returning a new buffer. Returns the argument if
 * the length wouldn't actually change. This function is only safe to
 * use if the given buffer was allocated within this module (since
 * otherwise the buffer might possibly be shared externally).
 */


function resize(buffer, length) {
  if (length === buffer.length) {
    return buffer;
  }

  var newBuf = alloc(length);
  buffer.copy(newBuf);
  free(buffer);
  return newBuf;
}
/**
 * Reads an arbitrary signed int from a buffer.
 */


function readInt(buffer) {
  var length = buffer.length;
  var positive = buffer[length - 1] < 0x80;
  var result = positive ? 0 : -1;
  var lossy = false; // Note: We can't use bit manipulation here, since that stops
  // working if the result won't fit in a 32-bit int.

  if (length < 7) {
    // Common case which can't possibly be lossy (because the result has
    // no more than 48 bits, and loss only happens with 54 or more).
    for (var i = length - 1; i >= 0; i--) {
      result = result * 0x100 + buffer[i];
    }
  } else {
    for (var _i = length - 1; _i >= 0; _i--) {
      var one = buffer[_i];
      result *= 0x100;

      if (isLossyToAdd(result, one)) {
        lossy = true;
      }

      result += one;
    }
  }

  return {
    value: result,
    lossy: lossy
  };
}
/**
 * Reads an arbitrary unsigned int from a buffer.
 */


function readUInt(buffer) {
  var length = buffer.length;
  var result = 0;
  var lossy = false; // Note: See above in re bit manipulation.

  if (length < 7) {
    // Common case which can't possibly be lossy (see above).
    for (var i = length - 1; i >= 0; i--) {
      result = result * 0x100 + buffer[i];
    }
  } else {
    for (var _i2 = length - 1; _i2 >= 0; _i2--) {
      var one = buffer[_i2];
      result *= 0x100;

      if (isLossyToAdd(result, one)) {
        lossy = true;
      }

      result += one;
    }
  }

  return {
    value: result,
    lossy: lossy
  };
}
/**
 * Writes a little-endian 64-bit signed int into a buffer.
 */


function writeInt64(value, buffer) {
  if (value < MIN_EXACT_INT64 || value > MAX_EXACT_INT64) {
    throw new Error("Value out of range.");
  }

  if (value < 0) {
    value += BIT_64;
  }

  writeUInt64(value, buffer);
}
/**
 * Writes a little-endian 64-bit unsigned int into a buffer.
 */


function writeUInt64(value, buffer) {
  if (value < 0 || value > MAX_EXACT_UINT64) {
    throw new Error("Value out of range.");
  }

  var lowWord = value % BIT_32;
  var highWord = Math.floor(value / BIT_32);
  buffer.writeUInt32LE(lowWord, 0);
  buffer.writeUInt32LE(highWord, 4);
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1645497392660);
})()
//miniprogram-npm-outsideDeps=["@xtuc/long"]
//# sourceMappingURL=index.js.map