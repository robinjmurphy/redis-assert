'use strict';

const assert = require('assert');
const async = require('async');
const redis = require('fakeredis').createClient(6379, 'localhost', {
  fast: true
});

const redisAssert = require('..');

describe('redis-assert', () => {
  it('does not return an error when the data is correct', (done) => {
    async.series([
      function setup(cb) {
        redis.set('foo', 'bar', cb);
      },
      function verify(cb) {
        redisAssert(redis)
          .get('foo', 'bar')
          .assert(cb);
      }
    ], done);
  });

  it('returns an error when the data is not correct', (done) => {
    async.series([
      function setup(cb) {
        redis.set('foo', 'baz', cb);
      },
      function verify(cb) {
        redisAssert(redis)
          .get('foo', 'bar')
          .assert((err) => {
            assert.ok(err);
            assert.equal(err.message, '\'baz\' == \'bar\'');
            cb();
          });
      }
    ], done);
  });
});
