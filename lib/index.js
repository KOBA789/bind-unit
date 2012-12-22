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

if (!module.parent) {
  var events = require('events'),
      EventEmitter = events.EventEmitter,
      ev = new EventEmitter();

  var unit = bindUnit.createUnit(ev, {
    counter: 0,
    obj: {
      p1: 100,
      p2: 200
    }
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
}
