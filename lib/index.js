var bindUnit = module.exports;

bindUnit.createUnit = function (emitter, obj, basename) {
  basename = basename || 'bind-unit';

  var keys, props, propObj, unit;

  propObj = {};
  keys = Object.keys(obj);

  props = keys.map(function (key) {
    return [key, obj[key]];
  });

  props.forEach(function (pair) {
    var key = pair[0],
        innerKey = '_' + key;

    propObj[key] = {
      set: function (value) {
        if (value === null || typeof value !== 'object') {
          this[innerKey] = value;
        } else if (Array.isArray(value)) {
          this[innerKey] = bindUnit.createObservableArray(emitter, value, basename + '.' + key);
        } else {
          this[innerKey] = bindUnit.createUnit(emitter, value, basename + '.' + key);
        }

        emitter.emit(basename + '.' + key, value);
      },
      get: function () {
        return this[innerKey];
      }
    };
  });

  unit = Object.create({}, propObj);
  
  props.forEach(function (pair) {
    unit[pair[0]] = pair[1];
  });

  return unit;
};

bindUnit.createObservableArray = function (emitter, value, basename) {
  Object.defineProperties(value, {
    push: {
      value: function (arg) {
        Array.prototype.push.call(value, arg);
        emitter.emit(basename + '#push', arg);
      },
      enumerable: false
    },
    unshift: {
      value: function (arg) {
        Array.prototype.unshift.call(value, arg);
        emitter.emit(basename + '#unshift', arg);
      },
      enumerable: false
    },
    pop: {
      value: function () {
        var ret = Array.prototype.pop.call(value);
        emitter.emit(basename + '#pop', ret);
      },
      enumerable: false
    },
    shift: {
      value: function (arg) {
        var ret = Array.prototype.shift.call(value);
        emitter.emit(basename + '#shift', ret);
      },
      enumerable: false
    },
    reverse: {
      value: function () {
        Array.prototype.reverse.call(value);
        emitter.emit(basename + '#reverse');
      },
      enumerable: false
    },
    sort: {
      value: function (arg) {
        Array.prototype.sort.call(value, arg);
        if (arg === undefined) {
          emitter.emit(basename + '#sort');
        } else {
          emitter.emit(basename, value);
        }
      },
      enumerable: false
    }
  });

  return value;
};

if (!module.parent) {
  var events = require('events'),
      EventEmitter = events.EventEmitter,
      ev = new EventEmitter();

  var unit = bindUnit.createUnit(ev, {
    counter: 0,
    obj: {
      p1: 100,
      p2: 200
    },
    array: [1, 2, 3]
  }, 'unit');

  ev.on('unit.counter', function (value) {
    console.log('counter', value);
  });

  ev.on('unit.obj', function (value) {
    console.log('obj', value);
  });

  ev.on('unit.obj.p1', function (value) {
    console.log('obj.p1', value);
  });

  ev.on('unit.obj.p2', function (value) {
    console.log('obj.p2', value);
  });

  ev.on('unit.obj.p3', function (value) {
    console.log('obj.p3', value);
  });

  ev.on('unit.array', function (value) {
    console.log('array', value);
  });

  ev.on('unit.array#push', function (arg) {
    console.log('array#push', arg);
  });

  ev.on('unit.array#unshift', function (arg) {
    console.log('array#unshift', arg);
  });

  ev.on('unit.array#pop', function (ret) {
    console.log('array#pop', ret);
  });

  ev.on('unit.array#shift', function (ret) {
    console.log('array#shift', ret);
  });

  ev.on('unit.array#sort', function (arg) {
    console.log('array#sort', arg);
  });

  ev.on('unit.array#reverse', function () {
    console.log('array#reverse');
  });

  unit.counter ++;
  unit.counter ++;
  unit.counter = 'ok';

  unit.obj.p1 ++;
  unit.obj.p1 ++;
  unit.obj.p1 ++;

  unit.obj.p2 ++;
  unit.obj.p2 ++;
  unit.obj.p2 ++;

  unit.obj = {
    p1: 1000,
    p2: 2000,
    p3: 3000
  };

  unit.obj.p1 ++;
  unit.obj.p1 ++;
  unit.obj.p1 ++;

  unit.obj.p2 ++;
  unit.obj.p2 ++;
  unit.obj.p2 ++;

  unit.obj.p3 ++;
  unit.obj.p3 ++;
  unit.obj.p3 ++;

  unit.array.push(4);
  unit.array.unshift(0);
  unit.array.pop();
  unit.array.shift();
  unit.array.reverse();
  unit.array.sort();
  unit.array.sort(function (a, b) {
    return b - a;
  });
}
