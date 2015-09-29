var expect = require('chai').expect;
var _ = require('lodash');
var Auth0Docs = require('../../index')
var sinon = require('sinon');

describe('Asking for a non existing path', function() {

  beforeEach(function() {
    this.server = sinon.fakeServerWithClock.create();

    this.docs = new Auth0Docs({
      baseURL: 'http://localhost:9999/meta'
    });

    var errors = this.errors = [];

    var promise = this.docs.get("invalid").catch(function(error) {
      errors.push(error);
    });

    this.server.respond();

    return promise;

  });

  it('rejects the promise', function() {
    expect(this.errors[0]).not.to.be.undefined;
  });

});
