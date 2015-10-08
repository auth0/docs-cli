var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('lodash');
var Auth0Docs = require('../../index')
var superagentFake = require('../fabricator/superagent.fake');

describe('Asking for an existing path', function() {

	beforeEach(function() {
    this.docs = new Auth0Docs({
      baseURL: 'http://locahost:9999'
    });

    this.docs._fetcher.request = superagentFake(null, { body: [{ hash: 'unicorn' }] });

    var results = this.results = [];
    return this.docs.get("something/cool").then(function(result) {
      results.push(result);
    });
	});

  it('resolves promise with result', function() {
    expect(this.results[0]).to.eql([{ hash: 'unicorn' }]);
  });

});
