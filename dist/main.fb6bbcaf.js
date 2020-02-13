// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/main.js":[function(require,module,exports) {
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    register: {
      name: "",
      email: "",
      password: ""
    },
    login: {
      email: "",
      password: ""
    },
    currentPage: 'registerPage',
    tasks: [],
    user: {},
    currentTask: {},
    newTask: {
      title: "",
      description: ""
    },
    dataTask: {},
    categories: []
  },
  computed: {
    backlogTask: function backlogTask() {
      var output = [];
      this.tasks.forEach(function (task) {
        if (task.CategoryId === 1) {
          output.push(task);
        }
      });
      return output; // return this.doneTask.filter()
    },
    productTask: function productTask() {
      var output = [];
      this.tasks.forEach(function (task) {
        if (task.CategoryId === 2) {
          output.push(task);
        }
      });
      return output;
    },
    developmentTask: function developmentTask() {
      var output = [];
      this.tasks.forEach(function (task) {
        if (task.CategoryId === 3) {
          output.push(task);
        }
      });
      return output;
    },
    doneTask: function doneTask() {
      var output = [];
      this.tasks.forEach(function (task) {
        if (task.CategoryId === 4) {
          output.push(task);
        }
      });
      return output;
    }
  },
  methods: {
    createUser: function createUser() {
      var _this = this;

      axios({
        method: "POST",
        url: "http://localhost:3000/register",
        data: {
          name: this.register.name,
          email: this.register.email,
          password: this.register.password
        }
      }).then(function (user) {
        _this.currentPage = 'loginPage';
      }).catch(function (response) {
        console.log(response.data);
      });
    },
    loginUser: function loginUser() {
      var _this2 = this;

      axios({
        method: "POST",
        url: "http://localhost:3000/login",
        data: {
          email: this.login.email,
          password: this.login.password
        }
      }).then(function (_ref) {
        var data = _ref.data;
        localStorage.setItem('token', data.access_token);

        _this2.fetch();

        _this2.currentPage = "mainHomePage";
      }).catch(function (response) {
        console.log(response.data);
      });
    },
    fetch: function fetch() {
      var _this3 = this;

      axios({
        method: "GET",
        url: "http://localhost:3000/tasks",
        headers: {
          token: localStorage.getItem('token')
        }
      }).then(function (response) {
        _this3.tasks = response.data.data;
        _this3.user = response.data.user;
        console.log(response.data);
      }).catch(function (err) {
        console.log(err);
      });
    },
    checkToken: function checkToken() {
      if (localStorage.getItem('token')) {
        this.currentPage = 'mainHomePage';
        this.fetch();
      } else {
        this.currentPage = 'loginPage';
      }
    },
    showFormAdd: function showFormAdd() {
      this.currentPage = 'addTaskPage';
    },
    addNewTask: function addNewTask() {
      var _this4 = this;

      axios({
        method: "POST",
        url: "http://localhost:3000/tasks",
        data: {
          title: this.newTask.title,
          description: this.newTask.description
        },
        headers: {
          token: localStorage.token
        }
      }).then(function (response) {
        _this4.fetch();

        _this4.currentPage = 'mainHomePage';
      }).catch(function (response) {
        console.log(response.data);
      });
    },
    showFormEdit: function showFormEdit(id) {
      var _this5 = this;

      this.currentPage = 'updateTaskPage';
      axios({
        method: "GET",
        url: "http://localhost:3000/tasks/" + id,
        headers: {
          token: localStorage.token
        }
      }).then(function (response) {
        console.log('MASUK THEN AXIOS FIND BY PK');
        _this5.dataTask = response.data.dataTask;
        _this5.categories = response.data.dataCategories;
      }).catch(function (response) {
        console.log(response.data);
      });
    },
    updateTask: function updateTask(id) {
      var _this6 = this;

      console.log('MASUK UPDATE MAIN.JS');
      axios({
        method: "PUT",
        url: "http://localhost:3000/tasks/" + id,
        data: {
          title: this.dataTask.title,
          description: this.dataTask.description,
          CategoryId: +this.dataTask.CategoryId
        },
        headers: {
          token: localStorage.token
        }
      }).then(function (response) {
        _this6.currentPage = 'mainHomePage';

        _this6.fetch();
      }).catch(function (err) {
        console.log(err);
      });
    },
    deleteTask: function deleteTask(id) {
      var _this7 = this;

      axios({
        method: "DELETE",
        url: "http://localhost:3000/tasks/" + id,
        headers: {
          token: localStorage.token
        }
      }).then(function (response) {
        _this7.currentPage = 'mainHomePage';

        _this7.fetch();
      }).catch(function (err) {
        console.log(err);
      });
    }
  },
  created: function created() {
    this.checkToken();
  }
});
},{}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59583" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/main.js"], null)
//# sourceMappingURL=/main.fb6bbcaf.js.map