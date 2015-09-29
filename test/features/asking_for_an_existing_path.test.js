var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('lodash');
var Auth0Docs = require('../../index')

//FIXME: This test does not run fine on zuul
describe.skip('Asking for an existing path', function() {

	beforeEach(function() {
    this.server = sinon.fakeServer.create();
    this.server.respondImmediately = true;
    this.server.respondWith("GET", "/meta/something/cool",
            [200, { "Content-Type": "application/json" }, '[{ "hash": "unicorn" }]']);


    this.docs = new Auth0Docs({
      baseURL: '/meta'
    });

    var results = this.results = [];

    var promise = this.docs.get("something/cool").then(function(result) {
      results.push(result);
    });

    this.server.respond();

    return promise;
	});

  afterEach(function() {
    this.server.restore();
  });

  it('resolves promise with result', function() {
    expect(this.results[0]).to.eql([{ hash: 'unicorn' }]);
  });

});
