# redis-assert

[![Build Status](https://travis-ci.org/robinjmurphy/redis-assert.svg?branch=master)](https://travis-ci.org/robinjmurphy/redis-assert)

> Easy assertions for [Redis](http://redis.io/)

## Features

* Assert the state of your Redis database in your tests
* Makes performing multiple assertions easy (no need to inspect the results of `redis.multi()`)
* The assertion interface matches the [node-redis](https://github.com/NodeRedis/node_redis) library

## Installation

```
npm i --save-dev redis-assert
```

## Usage

```js
'use strict';

const assert = require('assert');
const redisAssert = require('redis-assert');
const redis = require('redis').createClient();

const db = {
  saveTemperature: (city, temperature, cb) => {
    redis.set(`${city.toLowerCase()}:temperature`, temperature, cb);
  }
};

describe('db.saveTemperature', () => {
  it('saves the temperature for a city', (done) => {
    db.saveTemperature('London', 23, (err) => {
      assert.ifError(err);
      redisAssert(redis)
        .get('london:temperature', 23)
        .assert(done);
    });
  });
});
```

## API

### `redisAssert(redis)`

Returns an assertion object that includes all of the same functions as the [node-redis](https://github.com/NodeRedis/node_redis) library's `multi` command.

##### Parameters

* `redis` - An instance of [node-redis](https://github.com/NodeRedis/node_redis)

### `.assert(cb)`

Executes a transcation query to Redis (using [`multi`](http://redis.io/commands/multi)) and asserts that the results returned match the values provided.

##### Parameters

* `cb` - A function called with an optional error object when an assertion fails.
