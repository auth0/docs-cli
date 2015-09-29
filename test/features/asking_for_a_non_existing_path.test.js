var expect = require('chai').expect;
var _ = require('lodash');
var Auth0Docs = require('../../index')
var superagentFake = require('../fabricator/superagent.fake');

describe('Asking for a non existing path', function() {

  beforeEach(function() {
    this.docs = new Auth0Docs({
      baseURL: 'http://localhost:9999/meta'
    });

    this.docs._fetcher.request = superagentFake({ error: 'error' });

    var errors = this.errors = [];
    return this.docs.get("invalid").catch(function(error) {
      errors.push(error);
    });
  });

  it('rejects the promise', function() {
    expect(this.errors[0]).not.to.be.undefined;
  });

});
