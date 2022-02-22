module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1645497393462, function(require, module, exports) {


Object.defineProperty(exports, '__esModule', {
  value: true
});
Object.defineProperty(exports, 'FifoQueue', {
  enumerable: true,
  get: function () {
    return _FifoQueue.default;
  }
});
Object.defineProperty(exports, 'PriorityQueue', {
  enumerable: true,
  get: function () {
    return _PriorityQueue.default;
  }
});
exports.Worker = void 0;
Object.defineProperty(exports, 'messageParent', {
  enumerable: true,
  get: function () {
    return _messageParent.default;
  }
});

function _os() {
  const data = require('os');

  _os = function () {
    return data;
  };

  return data;
}

var _Farm = _interopRequireDefault(require('./Farm'));

var _WorkerPool = _interopRequireDefault(require('./WorkerPool'));

var _PriorityQueue = _interopRequireDefault(require('./PriorityQueue'));

var _FifoQueue = _interopRequireDefault(require('./FifoQueue'));

var _messageParent = _interopRequireDefault(require('./workers/messageParent'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function getExposedMethods(workerPath, options) {
  let exposedMethods = options.exposedMethods; // If no methods list is given, try getting it by auto-requiring the module.

  if (!exposedMethods) {
    const module = require(workerPath);

    exposedMethods = Object.keys(module).filter(
      // @ts-expect-error: no index
      name => typeof module[name] === 'function'
    );

    if (typeof module === 'function') {
      exposedMethods = [...exposedMethods, 'default'];
    }
  }

  return exposedMethods;
}
/**
 * The Jest farm (publicly called "Worker") is a class that allows you to queue
 * methods across multiple child processes, in order to parallelize work. This
 * is done by providing an absolute path to a module that will be loaded on each
 * of the child processes, and bridged to the main process.
 *
 * Bridged methods are specified by using the "exposedMethods" property of the
 * "options" object. This is an array of strings, where each of them corresponds
 * to the exported name in the loaded module.
 *
 * You can also control the amount of workers by using the "numWorkers" property
 * of the "options" object, and the settings passed to fork the process through
 * the "forkOptions" property. The amount of workers defaults to the amount of
 * CPUS minus one.
 *
 * Queueing calls can be done in two ways:
 *   - Standard method: calls will be redirected to the first available worker,
 *     so they will get executed as soon as they can.
 *
 *   - Sticky method: if a "computeWorkerKey" method is provided within the
 *     config, the resulting string of this method will be used as a key.
 *     Every time this key is returned, it is guaranteed that your job will be
 *     processed by the same worker. This is specially useful if your workers
 *     are caching results.
 */

class Worker {
  constructor(workerPath, options) {
    var _this$_options$enable,
      _this$_options$forkOp,
      _this$_options$maxRet,
      _this$_options$numWor,
      _this$_options$resour,
      _this$_options$setupA;

    _defineProperty(this, '_ending', void 0);

    _defineProperty(this, '_farm', void 0);

    _defineProperty(this, '_options', void 0);

    _defineProperty(this, '_workerPool', void 0);

    this._options = {...options};
    this._ending = false;
    const workerPoolOptions = {
      enableWorkerThreads:
        (_this$_options$enable = this._options.enableWorkerThreads) !== null &&
        _this$_options$enable !== void 0
          ? _this$_options$enable
          : false,
      forkOptions:
        (_this$_options$forkOp = this._options.forkOptions) !== null &&
        _this$_options$forkOp !== void 0
          ? _this$_options$forkOp
          : {},
      maxRetries:
        (_this$_options$maxRet = this._options.maxRetries) !== null &&
        _this$_options$maxRet !== void 0
          ? _this$_options$maxRet
          : 3,
      numWorkers:
        (_this$_options$numWor = this._options.numWorkers) !== null &&
        _this$_options$numWor !== void 0
          ? _this$_options$numWor
          : Math.max((0, _os().cpus)().length - 1, 1),
      resourceLimits:
        (_this$_options$resour = this._options.resourceLimits) !== null &&
        _this$_options$resour !== void 0
          ? _this$_options$resour
          : {},
      setupArgs:
        (_this$_options$setupA = this._options.setupArgs) !== null &&
        _this$_options$setupA !== void 0
          ? _this$_options$setupA
          : []
    };

    if (this._options.WorkerPool) {
      // @ts-expect-error: constructor target any?
      this._workerPool = new this._options.WorkerPool(
        workerPath,
        workerPoolOptions
      );
    } else {
      this._workerPool = new _WorkerPool.default(workerPath, workerPoolOptions);
    }

    this._farm = new _Farm.default(
      workerPoolOptions.numWorkers,
      this._workerPool.send.bind(this._workerPool),
      {
        computeWorkerKey: this._options.computeWorkerKey,
        taskQueue: this._options.taskQueue,
        workerSchedulingPolicy: this._options.workerSchedulingPolicy
      }
    );

    this._bindExposedWorkerMethods(workerPath, this._options);
  }

  _bindExposedWorkerMethods(workerPath, options) {
    getExposedMethods(workerPath, options).forEach(name => {
      if (name.startsWith('_')) {
        return;
      }

      if (this.constructor.prototype.hasOwnProperty(name)) {
        throw new TypeError('Cannot define a method called ' + name);
      } // @ts-expect-error: dynamic extension of the class instance is expected.

      this[name] = this._callFunctionWithArgs.bind(this, name);
    });
  }

  _callFunctionWithArgs(method, ...args) {
    if (this._ending) {
      throw new Error('Farm is ended, no more calls can be done to it');
    }

    return this._farm.doWork(method, ...args);
  }

  getStderr() {
    return this._workerPool.getStderr();
  }

  getStdout() {
    return this._workerPool.getStdout();
  }

  async end() {
    if (this._ending) {
      throw new Error('Farm is ended, no more calls can be done to it');
    }

    this._ending = true;
    return this._workerPool.end();
  }
}

exports.Worker = Worker;

}, function(modId) {var map = {"./Farm":1645497393463,"./PriorityQueue":1645497393467,"./FifoQueue":1645497393464}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393463, function(require, module, exports) {


Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

var _FifoQueue = _interopRequireDefault(require('./FifoQueue'));

var _types = require('./types');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

class Farm {
  constructor(_numOfWorkers, _callback, options = {}) {
    var _options$workerSchedu, _options$taskQueue;

    _defineProperty(this, '_computeWorkerKey', void 0);

    _defineProperty(this, '_workerSchedulingPolicy', void 0);

    _defineProperty(this, '_cacheKeys', Object.create(null));

    _defineProperty(this, '_locks', []);

    _defineProperty(this, '_offset', 0);

    _defineProperty(this, '_taskQueue', void 0);

    this._numOfWorkers = _numOfWorkers;
    this._callback = _callback;
    this._computeWorkerKey = options.computeWorkerKey;
    this._workerSchedulingPolicy =
      (_options$workerSchedu = options.workerSchedulingPolicy) !== null &&
      _options$workerSchedu !== void 0
        ? _options$workerSchedu
        : 'round-robin';
    this._taskQueue =
      (_options$taskQueue = options.taskQueue) !== null &&
      _options$taskQueue !== void 0
        ? _options$taskQueue
        : new _FifoQueue.default();
  }

  doWork(method, ...args) {
    const customMessageListeners = new Set();

    const addCustomMessageListener = listener => {
      customMessageListeners.add(listener);
      return () => {
        customMessageListeners.delete(listener);
      };
    };

    const onCustomMessage = message => {
      customMessageListeners.forEach(listener => listener(message));
    };

    const promise = new Promise( // Bind args to this function so it won't reference to the parent scope.
      // This prevents a memory leak in v8, because otherwise the function will
      // retaine args for the closure.
      ((args, resolve, reject) => {
        const computeWorkerKey = this._computeWorkerKey;
        const request = [_types.CHILD_MESSAGE_CALL, false, method, args];
        let worker = null;
        let hash = null;

        if (computeWorkerKey) {
          hash = computeWorkerKey.call(this, method, ...args);
          worker = hash == null ? null : this._cacheKeys[hash];
        }

        const onStart = worker => {
          if (hash != null) {
            this._cacheKeys[hash] = worker;
          }
        };

        const onEnd = (error, result) => {
          customMessageListeners.clear();

          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        };

        const task = {
          onCustomMessage,
          onEnd,
          onStart,
          request
        };

        if (worker) {
          this._taskQueue.enqueue(task, worker.getWorkerId());

          this._process(worker.getWorkerId());
        } else {
          this._push(task);
        }
      }).bind(null, args)
    );
    promise.UNSTABLE_onCustomMessage = addCustomMessageListener;
    return promise;
  }

  _process(workerId) {
    if (this._isLocked(workerId)) {
      return this;
    }

    const task = this._taskQueue.dequeue(workerId);

    if (!task) {
      return this;
    }

    if (task.request[1]) {
      throw new Error('Queue implementation returned processed task');
    } // Reference the task object outside so it won't be retained by onEnd,
    // and other properties of the task object, such as task.request can be
    // garbage collected.

    const taskOnEnd = task.onEnd;

    const onEnd = (error, result) => {
      taskOnEnd(error, result);

      this._unlock(workerId);

      this._process(workerId);
    };

    task.request[1] = true;

    this._lock(workerId);

    this._callback(
      workerId,
      task.request,
      task.onStart,
      onEnd,
      task.onCustomMessage
    );

    return this;
  }

  _push(task) {
    this._taskQueue.enqueue(task);

    const offset = this._getNextWorkerOffset();

    for (let i = 0; i < this._numOfWorkers; i++) {
      this._process((offset + i) % this._numOfWorkers);

      if (task.request[1]) {
        break;
      }
    }

    return this;
  }

  _getNextWorkerOffset() {
    switch (this._workerSchedulingPolicy) {
      case 'in-order':
        return 0;

      case 'round-robin':
        return this._offset++;
    }
  }

  _lock(workerId) {
    this._locks[workerId] = true;
  }

  _unlock(workerId) {
    this._locks[workerId] = false;
  }

  _isLocked(workerId) {
    return this._locks[workerId];
  }
}

exports.default = Farm;

}, function(modId) { var map = {"./FifoQueue":1645497393464,"./types":1645497393465}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393464, function(require, module, exports) {


Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * First-in, First-out task queue that manages a dedicated pool
 * for each worker as well as a shared queue. The FIFO ordering is guaranteed
 * across the worker specific and shared queue.
 */
class FifoQueue {
  constructor() {
    _defineProperty(this, '_workerQueues', []);

    _defineProperty(this, '_sharedQueue', new InternalQueue());
  }

  enqueue(task, workerId) {
    if (workerId == null) {
      this._sharedQueue.enqueue(task);

      return;
    }

    let workerQueue = this._workerQueues[workerId];

    if (workerQueue == null) {
      workerQueue = this._workerQueues[workerId] = new InternalQueue();
    }

    const sharedTop = this._sharedQueue.peekLast();

    const item = {
      previousSharedTask: sharedTop,
      task
    };
    workerQueue.enqueue(item);
  }

  dequeue(workerId) {
    var _this$_workerQueues$w, _workerTop$previousSh, _workerTop$previousSh2;

    const workerTop =
      (_this$_workerQueues$w = this._workerQueues[workerId]) === null ||
      _this$_workerQueues$w === void 0
        ? void 0
        : _this$_workerQueues$w.peek();
    const sharedTaskIsProcessed =
      (_workerTop$previousSh =
        workerTop === null || workerTop === void 0
          ? void 0
          : (_workerTop$previousSh2 = workerTop.previousSharedTask) === null ||
            _workerTop$previousSh2 === void 0
          ? void 0
          : _workerTop$previousSh2.request[1]) !== null &&
      _workerTop$previousSh !== void 0
        ? _workerTop$previousSh
        : true; // Process the top task from the shared queue if
    // - there's no task in the worker specific queue or
    // - if the non-worker-specific task after which this worker specifif task
    //   hasn been queued wasn't processed yet

    if (workerTop != null && sharedTaskIsProcessed) {
      var _this$_workerQueues$w2,
        _this$_workerQueues$w3,
        _this$_workerQueues$w4;

      return (_this$_workerQueues$w2 =
        (_this$_workerQueues$w3 = this._workerQueues[workerId]) === null ||
        _this$_workerQueues$w3 === void 0
          ? void 0
          : (_this$_workerQueues$w4 = _this$_workerQueues$w3.dequeue()) ===
              null || _this$_workerQueues$w4 === void 0
          ? void 0
          : _this$_workerQueues$w4.task) !== null &&
        _this$_workerQueues$w2 !== void 0
        ? _this$_workerQueues$w2
        : null;
    }

    return this._sharedQueue.dequeue();
  }
}

exports.default = FifoQueue;

/**
 * FIFO queue for a single worker / shared queue.
 */
class InternalQueue {
  constructor() {
    _defineProperty(this, '_head', null);

    _defineProperty(this, '_last', null);
  }

  enqueue(value) {
    const item = {
      next: null,
      value
    };

    if (this._last == null) {
      this._head = item;
    } else {
      this._last.next = item;
    }

    this._last = item;
  }

  dequeue() {
    if (this._head == null) {
      return null;
    }

    const item = this._head;
    this._head = item.next;

    if (this._head == null) {
      this._last = null;
    }

    return item.value;
  }

  peek() {
    var _this$_head$value, _this$_head;

    return (_this$_head$value =
      (_this$_head = this._head) === null || _this$_head === void 0
        ? void 0
        : _this$_head.value) !== null && _this$_head$value !== void 0
      ? _this$_head$value
      : null;
  }

  peekLast() {
    var _this$_last$value, _this$_last;

    return (_this$_last$value =
      (_this$_last = this._last) === null || _this$_last === void 0
        ? void 0
        : _this$_last.value) !== null && _this$_last$value !== void 0
      ? _this$_last$value
      : null;
  }
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393465, function(require, module, exports) {


Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.PARENT_MESSAGE_SETUP_ERROR =
  exports.PARENT_MESSAGE_OK =
  exports.PARENT_MESSAGE_CUSTOM =
  exports.PARENT_MESSAGE_CLIENT_ERROR =
  exports.CHILD_MESSAGE_INITIALIZE =
  exports.CHILD_MESSAGE_END =
  exports.CHILD_MESSAGE_CALL =
    void 0;

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// import type {ResourceLimits} from 'worker_threads';
// This is not present in the Node 12 typings
// Because of the dynamic nature of a worker communication process, all messages
// coming from any of the other processes cannot be typed. Thus, many types
// include "unknown" as a TS type, which is (unfortunately) correct here.
const CHILD_MESSAGE_INITIALIZE = 0;
exports.CHILD_MESSAGE_INITIALIZE = CHILD_MESSAGE_INITIALIZE;
const CHILD_MESSAGE_CALL = 1;
exports.CHILD_MESSAGE_CALL = CHILD_MESSAGE_CALL;
const CHILD_MESSAGE_END = 2;
exports.CHILD_MESSAGE_END = CHILD_MESSAGE_END;
const PARENT_MESSAGE_OK = 0;
exports.PARENT_MESSAGE_OK = PARENT_MESSAGE_OK;
const PARENT_MESSAGE_CLIENT_ERROR = 1;
exports.PARENT_MESSAGE_CLIENT_ERROR = PARENT_MESSAGE_CLIENT_ERROR;
const PARENT_MESSAGE_SETUP_ERROR = 2;
exports.PARENT_MESSAGE_SETUP_ERROR = PARENT_MESSAGE_SETUP_ERROR;
const PARENT_MESSAGE_CUSTOM = 3;
exports.PARENT_MESSAGE_CUSTOM = PARENT_MESSAGE_CUSTOM;

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1645497393467, function(require, module, exports) {


Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Priority queue that processes tasks in natural ordering (lower priority first)
 * accoridng to the priority computed by the function passed in the constructor.
 *
 * FIFO ordering isn't guaranteed for tasks with the same priority.
 *
 * Worker specific tasks with the same priority as a non-worker specific task
 * are always processed first.
 */
class PriorityQueue {
  constructor(_computePriority) {
    _defineProperty(this, '_queue', []);

    _defineProperty(this, '_sharedQueue', new MinHeap());

    this._computePriority = _computePriority;
  }

  enqueue(task, workerId) {
    if (workerId == null) {
      this._enqueue(task, this._sharedQueue);
    } else {
      const queue = this._getWorkerQueue(workerId);

      this._enqueue(task, queue);
    }
  }

  _enqueue(task, queue) {
    const item = {
      priority: this._computePriority(task.request[2], ...task.request[3]),
      task
    };
    queue.add(item);
  }

  dequeue(workerId) {
    const workerQueue = this._getWorkerQueue(workerId);

    const workerTop = workerQueue.peek();

    const sharedTop = this._sharedQueue.peek(); // use the task from the worker queue if there's no task in the shared queue
    // or if the priority of the worker queue is smaller or equal to the
    // priority of the top task in the shared queue. The tasks of the
    // worker specific queue are preferred because no other worker can pick this
    // specific task up.

    if (
      sharedTop == null ||
      (workerTop != null && workerTop.priority <= sharedTop.priority)
    ) {
      var _workerQueue$poll$tas, _workerQueue$poll;

      return (_workerQueue$poll$tas =
        (_workerQueue$poll = workerQueue.poll()) === null ||
        _workerQueue$poll === void 0
          ? void 0
          : _workerQueue$poll.task) !== null && _workerQueue$poll$tas !== void 0
        ? _workerQueue$poll$tas
        : null;
    }

    return this._sharedQueue.poll().task;
  }

  _getWorkerQueue(workerId) {
    let queue = this._queue[workerId];

    if (queue == null) {
      queue = this._queue[workerId] = new MinHeap();
    }

    return queue;
  }
}

exports.default = PriorityQueue;

class MinHeap {
  constructor() {
    _defineProperty(this, '_heap', []);
  }

  peek() {
    var _this$_heap$;

    return (_this$_heap$ = this._heap[0]) !== null && _this$_heap$ !== void 0
      ? _this$_heap$
      : null;
  }

  add(item) {
    const nodes = this._heap;
    nodes.push(item);

    if (nodes.length === 1) {
      return;
    }

    let currentIndex = nodes.length - 1; // Bubble up the added node as long as the parent is bigger

    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex + 1) / 2) - 1;
      const parent = nodes[parentIndex];

      if (parent.priority <= item.priority) {
        break;
      }

      nodes[currentIndex] = parent;
      nodes[parentIndex] = item;
      currentIndex = parentIndex;
    }
  }

  poll() {
    const nodes = this._heap;
    const result = nodes[0];
    const lastElement = nodes.pop(); // heap was empty or removed the last element

    if (result == null || nodes.length === 0) {
      return result !== null && result !== void 0 ? result : null;
    }

    let index = 0;
    nodes[0] =
      lastElement !== null && lastElement !== void 0 ? lastElement : null;
    const element = nodes[0];

    while (true) {
      let swapIndex = null;
      const rightChildIndex = (index + 1) * 2;
      const leftChildIndex = rightChildIndex - 1;
      const rightChild = nodes[rightChildIndex];
      const leftChild = nodes[leftChildIndex]; // if the left child is smaller, swap with the left

      if (leftChild != null && leftChild.priority < element.priority) {
        swapIndex = leftChildIndex;
      } // If the right child is smaller or the right child is smaller than the left
      // then swap with the right child

      if (
        rightChild != null &&
        rightChild.priority < (swapIndex == null ? element : leftChild).priority
      ) {
        swapIndex = rightChildIndex;
      }

      if (swapIndex == null) {
        break;
      }

      nodes[index] = nodes[swapIndex];
      nodes[swapIndex] = element;
      index = swapIndex;
    }

    return result;
  }
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1645497393462);
})()
//miniprogram-npm-outsideDeps=["os","./WorkerPool","./workers/messageParent"]
//# sourceMappingURL=index.js.map