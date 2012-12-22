# bind-unit

脳汁出る

## Install

```
npm install bind-unit
```

## How to Use

```javascript
var EventEmitter = require('events').EventEmitter,
    bindUnit = require('bind-unit');

var emitter = new EventEmitter(),
    unit = bindUnit.createUnit(emitter, {
      counter: 0,
      message: 'hello world',
      obj: {
        prop1: 10,
        prop2: 20
      }
    }, 'unit');

emitter.on('unit.counter', function (value) {
  console.log('unit.counter', value);
});

emitter.on('unit.message', function (value) {
  console.log('unit.message', value);
});

emitter.on('unit.obj', function (value) {
  console.log('unit.obj', value);
});

emitter.on('unit.obj.prop1', function (value) {
  console.log('unit.obj.prop1', value);
});

emitter.on('unit.obj.prop2', function (value) {
  console.log('unit.obj.prop2', value);
});

emitter.on('unit.obj.prop3', function (value) {
  console.log('unit.obj.prop3', value);
});

unit.counter ++;
unit.counter ++;

unit.message = 'hello work';
unit.message = 'hellish work';

unit.obj.prop1 += 5;
unit.obj.prop2 += 5;

unit.obj = {
  prop1: 100,
	prop2: 200,
	prop3: 300
};

unit.obj.prop1 += 5;
unit.obj.prop2 += 5;
unit.obj.prop3 += 5;

```