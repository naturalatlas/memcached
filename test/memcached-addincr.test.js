/**
 * Test dependencies
 */

var assert = require("assert"),
  common = require("./common"),
  Memcached = require("../");

global.testnumbers =
  global.testnumbers || +(Math.random(10) * 1000000).toFixed();

/**
 * Expresso test suite for all `get` related
 * memcached commands
 */
describe("Memcached addincr", function () {
  /**
   * Simple increments.. Just because.. we can :D
   */
  it("simple addincr", function (done) {
    var memcached = new Memcached(common.servers.single),
      testnr = ++global.testnumbers,
      callbacks = 0;

    memcached.addincr("test:" + testnr, 0, function (error, ok) {
      ++callbacks;

      assert.ok(!error);
      ok.should.be.equal(1);

      memcached.end(); // close connections
      assert.equal(callbacks, 1);
      done();
    });
  });

  it("multiple addincr", function (done) {
    var memcached = new Memcached(common.servers.single),
      testnr = ++global.testnumbers,
      callbacks = 0;

    memcached.addincr("test:" + testnr, 0, function (error, ok) {
      ++callbacks;

      assert.ok(!error);
      ok.should.be.equal(1);
      assert.equal(callbacks, 1);
      memcached.addincr("test:" + testnr, 0, function (error, ok) {
        ++callbacks;

        assert.ok(!error);
        ok.should.be.equal(2);

        memcached.end(); // close connections
        assert.equal(callbacks, 2);
        done();
      });
    });
  });

  /**
   * According to the spec, incr should just work fine on keys that
   * have intergers.. So lets test that.
   */
  it("simple addincr on a large number", function (done) {
    var memcached = new Memcached(common.servers.single),
      message = common.numbers(10),
      testnr = ++global.testnumbers,
      callbacks = 0;

    memcached.set("test:" + testnr, message, 1000, function (error, ok) {
      ++callbacks;

      assert.ok(!error);
      ok.should.be.true;

      memcached.incr("test:" + testnr, 1, function (error, answer) {
        ++callbacks;

        assert.ok(!error);
        assert.ok(+answer === message + 1);

        memcached.end(); // close connections
        assert.equal(callbacks, 2);
        done();
      });
    });
  });

  /**
   * We can only increment on a integer, not on a string.
   */
  it("addincr on a non string value throws a client_error", function (done) {
    var memcached = new Memcached(common.servers.single),
      testnr = ++global.testnumbers,
      callbacks = 0;

    memcached.set("test:" + testnr, "zing!", 0, function (error, ok) {
      ++callbacks;

      assert.ok(!error);
      ok.should.be.true;

      memcached.incr("test:" + testnr, 1, function (error, ok) {
        ++callbacks;

        assert.ok(error);
        ok.should.be.false;

        memcached.end(); // close connections;
        assert.equal(callbacks, 2);
        done();
      });
    });
  });
});
