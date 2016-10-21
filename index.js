'use strict';

const assert = require('assert');

module.exports = (redis) => {
  const expectations = [];
  const obj = {};
  const multi = redis.multi();

  for (const key in multi) {
    obj[key] = function () {
      const args = Array.from(arguments);
      const expected = args.pop();

      expectations.push({
        key,
        args,
        expected
      });

      return obj;
    };
  }

  obj.assert = function (cb) {
    expectations.forEach((expectation) => {
      multi[expectation.key].apply(multi, expectation.args);
    });

    multi.exec((err, results) => {
      if (err) return cb(err);

      const errors = results.map((result, i) => {
        try {
          assert.equal(result, expectations[i].expected);

          return null;
        } catch (err) {
          return err;
        }
      }).filter((err) => {
        return !!err;
      });

      cb(errors.shift());
    });
  };

  return obj;
};
